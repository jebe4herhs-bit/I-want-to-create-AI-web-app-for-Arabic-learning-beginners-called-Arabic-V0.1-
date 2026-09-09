import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";

export interface Progress {
  xp: number;
  streak: number;
  lastDay: string;
  lettersSeen: string[];
  patternsDone: string[];
  storiesRead: string[];
  storyBest: Record<string, number>;
  quizBest: Record<string, number>;
  flashKnown: Record<string, number>;
  showTr: boolean;
  showEn: boolean;
  fontScale: number;
}

const DEFAULTS: Progress = {
  xp: 0, streak: 0, lastDay: "",
  lettersSeen: [], patternsDone: [], storiesRead: [],
  storyBest: {}, quizBest: {}, flashKnown: {},
  showTr: true, showEn: true, fontScale: 1,
};

const KEY = "kalima-progress-v1";

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch { return DEFAULTS; }
}

function todayStr() { return new Date().toISOString().slice(0, 10); }

interface Store {
  p: Progress;
  addXP: (n: number) => void;
  toggleLetter: (a: string) => void;
  completePattern: (id: string) => void;
  completeStory: (id: string) => void;
  recordStoryQuiz: (id: string, score: number, total: number) => void;
  recordQuiz: (id: string, score: number) => void;
  markFlash: (key: string, known: boolean) => void;
  setReading: (patch: Partial<Pick<Progress, "showTr" | "showEn" | "fontScale">>) => void;
  resetAll: () => void;
  exportJSON: () => string;
  importJSON: (s: string) => boolean;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [p, setP] = useState<Progress>(load);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* offline-safe */ }
  }, [p]);

  // streak touch on mount
  useEffect(() => {
    const t = todayStr();
    setP((prev) => {
      if (prev.lastDay === t) return prev;
      const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const streak = prev.lastDay === y ? prev.streak + 1 : 1;
      return { ...prev, lastDay: t, streak };
    });
  }, []);

  const addXP = useCallback((n: number) => {
    setP((prev) => ({ ...prev, xp: prev.xp + n }));
  }, []);

  const toggleLetter = useCallback((a: string) => {
    setP((prev) => ({
      ...prev,
      lettersSeen: prev.lettersSeen.includes(a) ? prev.lettersSeen.filter((x) => x !== a) : [...prev.lettersSeen, a],
    }));
  }, []);

  const completePattern = useCallback((id: string) => {
    setP((prev) => prev.patternsDone.includes(id) ? prev : { ...prev, patternsDone: [...prev.patternsDone, id] });
  }, []);

  const completeStory = useCallback((id: string) => {
    setP((prev) => prev.storiesRead.includes(id) ? prev : { ...prev, storiesRead: [...prev.storiesRead, id] });
  }, []);

  const recordStoryQuiz = useCallback((id: string, score: number, _total: number) => {
    setP((prev) => ({ ...prev, storyBest: { ...prev.storyBest, [id]: Math.max(prev.storyBest[id] ?? 0, score) } }));
  }, []);

  const recordQuiz = useCallback((id: string, score: number) => {
    setP((prev) => ({ ...prev, quizBest: { ...prev.quizBest, [id]: Math.max(prev.quizBest[id] ?? 0, score) } }));
  }, []);

  const markFlash = useCallback((key: string, known: boolean) => {
    setP((prev) => ({
      ...prev,
      flashKnown: { ...prev.flashKnown, [key]: known ? (prev.flashKnown[key] ?? 0) + 1 : 0 },
    }));
  }, []);

  const setReading = useCallback((patch: Partial<Pick<Progress, "showTr" | "showEn" | "fontScale">>) => {
    setP((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetAll = useCallback(() => setP({ ...DEFAULTS, lastDay: todayStr(), streak: 1 }), []);

  const exportJSON = useCallback(() => JSON.stringify(p, null, 2), [p]);

  const importJSON = useCallback((s: string) => {
    try {
      const obj = JSON.parse(s);
      setP({ ...DEFAULTS, ...obj });
      return true;
    } catch { return false; }
  }, []);

  const value = useMemo<Store>(() => ({
    p, addXP, toggleLetter, completePattern, completeStory, recordStoryQuiz,
    recordQuiz, markFlash, setReading, resetAll, exportJSON, importJSON,
  }), [p, addXP, toggleLetter, completePattern, completeStory, recordStoryQuiz, recordQuiz, markFlash, setReading, resetAll, exportJSON, importJSON]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore outside provider");
  return s;
}

/* ————— speech: functional speakers everywhere (online + offline) —————
   Tier 1: device Arabic voice via Web Speech API (offline once installed).
   Tier 2: online HD Arabic audio (MP3, cached by the service worker so it
           replays offline afterwards).
   Tier 3: local WebAudio chime so the button ALWAYS makes an audible sound,
           even with no speech engine and no signal. */
export type SpeakResult = "spoken" | "remote" | "tone" | "unsupported";
export type AudioEngine = "arabic-voice" | "voice" | "online-audio" | "none";

interface SpeechState {
  speak: (text: string, lang?: "ar" | "en", rate?: number) => SpeakResult;
  speakTone: (text: string) => void;
  stop: () => void;
  speaking: boolean;
  speakingKey: number;
  hasTTS: boolean;
  voicesReady: boolean;
  voiceCount: number;
  arVoiceName: string | null;
  engine: AudioEngine;
}

let audioEl: HTMLAudioElement | null = null;
let activeCtx: AudioContext | null = null;
let toneNodes: OscillatorNode[] = [];
let audioGen = 0;
let activeTimer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<() => void>();
let snap: { speaking: boolean; key: number } = { speaking: false, key: 0 };

function emit() { listeners.forEach((l) => { try { l(); } catch { /* noop */ } }); }
function setSpeaking(v: boolean) {
  if (v) snap = { speaking: true, key: snap.key + 1 };
  else {
    if (!snap.speaking) return;
    snap = { speaking: false, key: snap.key };
  }
  emit();
}

function stopAllAudio() {
  audioGen += 1;
  if (activeTimer) { clearTimeout(activeTimer); activeTimer = null; }
  try { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); } catch { /* noop */ }
  if (audioEl) {
    try { audioEl.pause(); } catch { /* noop */ }
    try { audioEl.removeAttribute("src"); audioEl.load(); } catch { /* noop */ }
    audioEl = null;
  }
  toneNodes.forEach((o) => { try { o.stop(); } catch { /* noop */ } });
  toneNodes = [];
  if (activeCtx) { const c = activeCtx; activeCtx = null; c.close().catch(() => {}); }
  setSpeaking(false);
}

function ttsUrl(text: string, lang: "ar" | "en") {
  return "https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=" +
    (lang === "ar" ? "ar" : "en") + "&q=" + encodeURIComponent(text);
}

function chunkText(text: string, max = 170): string[] {
  const parts = text.split(/(?<=[.!?؟…])\s+|\n+/).map((s) => s.trim()).filter(Boolean);
  const out: string[] = [];
  for (const part of parts) {
    if (part.length <= max) { out.push(part); continue; }
    const words = part.split(/\s+/);
    let cur = "";
    for (const w of words) {
      if ((cur + " " + w).trim().length > max) { if (cur) out.push(cur.trim()); cur = w; }
      else cur += " " + w;
    }
    if (cur.trim()) out.push(cur.trim());
  }
  return out.length ? out : [text];
}

/* fire-and-forget: let the service worker cache MP3s so they replay offline */
function cacheAudio(url: string) {
  try {
    if (!("caches" in window)) return;
    caches.open("kalima-audio-v1").then((c) => c.add(url).catch(() => {})).catch(() => {});
  } catch { /* noop */ }
}

function playRemote(chunks: string[], lang: "ar" | "en") {
  stopAllAudio();
  const gen = audioGen;
  setSpeaking(true);
  let i = 0;
  const next = () => {
    if (gen !== audioGen) return;
    if (i >= chunks.length) { setSpeaking(false); return; }
    const url = ttsUrl(chunks[i], lang);
    cacheAudio(url);
    const el = new Audio();
    audioEl = el;
    el.preload = "auto";
    el.src = url;
    el.onended = () => { i += 1; next(); };
    el.onerror = () => {
      if (i === 0 && chunks.length <= 1) { playTone(chunks.join(" ")); return; }
      i += 1; next();
    };
    el.play().catch(() => {
      if (gen !== audioGen) return;
      if (i === 0) playTone(chunks.join(" "));
      else { i += 1; next(); }
    });
  };
  next();
}

/* Deterministic pleasant chime derived from the text — always works offline. */
function playTone(text: string) {
  stopAllAudio();
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    activeCtx = ctx;
    if (ctx.state === "suspended") void ctx.resume().catch(() => {});
    const master = ctx.createGain();
    master.gain.value = 0.22;
    master.connect(ctx.destination);
    let h = 0;
    for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
    const scale = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];
    const count = 3 + (h % 3);
    const t0 = ctx.currentTime + 0.03;
    toneNodes = [];
    for (let i = 0; i < count; i++) {
      const f = scale[(h >> (i * 3)) % scale.length];
      const t = t0 + i * 0.16;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(1, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
      osc.connect(g); g.connect(master);
      osc.start(t); osc.stop(t + 0.17);
      toneNodes.push(osc);
    }
    const dur = count * 0.16 + 0.2;
    setSpeaking(true);
    activeTimer = setTimeout(() => { stopAllAudio(); }, Math.min(4000, dur * 1000 + 400));
  } catch { /* audio unavailable */ }
}

function snapshotSpeech() { return snap; }
function subscribeSpeech(cb: () => void) { listeners.add(cb); return () => { listeners.delete(cb); }; }

const isOnlineNow = () => typeof navigator === "undefined" || navigator.onLine !== false;

export function useSpeech(): SpeechState {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voicesReady, setVoicesReady] = useState(false);
  const ext = useSyncExternalStore(subscribeSpeech, snapshotSpeech, snapshotSpeech);

  useEffect(() => {
    if (!("speechSynthesis" in window)) { setVoicesReady(true); return; }
    let cancelled = false;
    const loadV = () => {
      if (cancelled) return;
      try {
        const v = window.speechSynthesis.getVoices();
        if (v.length) { setVoices(v); setVoicesReady(true); }
      } catch { /* noop */ }
    };
    loadV();
    try { window.speechSynthesis.onvoiceschanged = loadV; } catch { /* noop */ }
    // Chrome gates voices behind a user gesture — warm them on first touch.
    const warm = () => { loadV(); };
    window.addEventListener("pointerdown", warm, { once: true });
    const iv = window.setInterval(loadV, 500);
    const to = window.setTimeout(() => { if (!cancelled) setVoicesReady(true); }, 3500);
    return () => {
      cancelled = true;
      window.clearInterval(iv); window.clearTimeout(to);
      try { window.speechSynthesis.onvoiceschanged = null; } catch { /* noop */ }
      window.removeEventListener("pointerdown", warm);
    };
  }, []);

  const arVoice = useMemo(
    () => voices.find((v) => v.lang.toLowerCase().startsWith("ar")) ?? null,
    [voices]
  );
  const anyVoice = useMemo(() => {
    if (!voices.length) return null;
    return voices.find((v) => v.lang.toLowerCase().startsWith("en")) ?? voices[0];
  }, [voices]);

  const speakTone = useCallback((text: string) => { playTone(text); }, []);

  const speak = useCallback((text: string, lang: "ar" | "en" = "ar", rate = 0.82): SpeakResult => {
    const clean = text.trim();
    if (!clean) return "unsupported";
    const chunks = chunkText(clean);
    const online = isOnlineNow();

    const useTTS = (voice: SpeechSynthesisVoice | null | undefined): boolean => {
      if (!("speechSynthesis" in window)) return false;
      try {
        stopAllAudio();
        const u = new SpeechSynthesisUtterance(clean);
        u.lang = lang === "ar" ? "ar-SA" : "en-US";
        if (voice) u.voice = voice;
        u.rate = rate;
        u.pitch = 1;
        let settled = false;
        const finish = (ok: boolean) => {
          if (settled) return; settled = true;
          if (activeTimer) { clearTimeout(activeTimer); activeTimer = null; }
          if (!ok) {
            if (isOnlineNow()) playRemote(chunks, lang);
            else playTone(clean);
            return;
          }
          setSpeaking(false);
        };
        u.onend = () => finish(true);
        u.onerror = () => finish(false);
        setSpeaking(true);
        // Watchdog: if the engine never starts (blocked/voiceless), fall back.
        activeTimer = setTimeout(() => {
          if (!settled) { try { window.speechSynthesis.cancel(); } catch { /* noop */ } finish(false); }
        }, 2200);
        try { window.speechSynthesis.getVoices(); } catch { /* noop */ }
        window.speechSynthesis.speak(u);
        try { if (window.speechSynthesis.paused) window.speechSynthesis.resume(); } catch { /* noop */ }
        return true;
      } catch { return false; }
    };

    // Tier 1: real Arabic device voice (works offline once installed).
    if (arVoice) { useTTS(arVoice); return "spoken"; }
    // Tier 2: online HD Arabic audio — correct pronunciation, cached for offline.
    if (lang === "ar" && online) { playRemote(chunks, lang); return "remote"; }
    // Tier 3: any device voice (an English voice can still read transliteration).
    if (anyVoice && "speechSynthesis" in window) { useTTS(anyVoice); return "spoken"; }
    if ("speechSynthesis" in window) { if (useTTS(undefined)) return "spoken"; }
    // Tier 4: online audio for English too, else the local chime.
    if (online) { playRemote(chunks, lang); return "remote"; }
    playTone(clean);
    return "tone";
  }, [arVoice, anyVoice]);

  const stop = useCallback(() => { stopAllAudio(); }, []);

  const engine: AudioEngine = arVoice ? "arabic-voice" : anyVoice ? "voice" : isOnlineNow() ? "online-audio" : "none";

  return {
    speak, speakTone, stop,
    speaking: ext.speaking, speakingKey: ext.key,
    hasTTS: "speechSynthesis" in window,
    voicesReady, voiceCount: voices.length,
    arVoiceName: arVoice?.name ?? anyVoice?.name ?? null,
    engine,
  };
}

/* ————— online status ————— */
export function useOnline() {
  const [online, setOnline] = useState(typeof navigator === "undefined" ? true : navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);
  return online;
}

/* ————— service worker ————— */
export function useServiceWorker() {
  const [state, setState] = useState<"unknown" | "ready" | "unsupported">("unknown");
  useEffect(() => {
    if (!("serviceWorker" in navigator)) { setState("unsupported"); return; }
    navigator.serviceWorker.register("/sw.js").then(() => setState("ready")).catch(() => setState("unknown"));
  }, []);
  return state;
}

export function levelOf(xp: number) {
  const lvl = Math.floor(xp / 120) + 1;
  const into = xp % 120;
  return { lvl, into, need: 120, pct: Math.round((into / 120) * 100) };
}
