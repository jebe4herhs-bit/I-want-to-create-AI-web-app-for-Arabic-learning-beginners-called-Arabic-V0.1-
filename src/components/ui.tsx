import { useEffect, useRef, useState, type ReactNode } from "react";
import { Volume2, VolumeX, Check, Copy, Wifi } from "lucide-react";
import { useSpeech, useOnline, type SpeakResult } from "../lib/store";

/* Speak button — always functional:
   1. device Arabic voice (offline once installed)
   2. online HD Arabic audio (cached for later offline replay)
   3. local chime so the tap always answers audibly */
export function SpeakBtn({ text, lang = "ar", size = "md", dark = false }: { text: string; lang?: "ar" | "en"; size?: "sm" | "md" | "lg"; dark?: boolean }) {
  const { speak, stop, speaking, speakingKey, engine } = useSpeech();
  const [active, setActive] = useState(false);
  const lastKey = useRef(0);
  const cls = size === "sm" ? "w-8 h-8" : size === "lg" ? "w-12 h-12" : "w-10 h-10";
  const icon = size === "sm" ? 15 : size === "lg" ? 22 : 18;

  // Clear the highlight when THIS button's utterance finishes.
  useEffect(() => {
    if (active && !speaking && speakingKey !== lastKey.current) setActive(false);
  }, [speaking, speakingKey, active]);

  const handle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (active) { stop(); setActive(false); return; }
    const r: SpeakResult = speak(text, lang);
    if (r !== "unsupported") {
      lastKey.current = speakingKey + 1;
      setActive(true);
      // Safety net: never leave the button glowing forever.
      setTimeout(() => setActive(false), 9000);
    }
  };

  return (
    <button
      aria-label={`Listen: ${text}`}
      title={engine === "arabic-voice" ? "Arabic voice ready" : engine === "online-audio" ? "Online audio (will be cached)" : engine === "voice" ? "Device voice ready" : "Audio cue"}
      onClick={handle}
      className={`${cls} relative shrink-0 inline-flex items-center justify-center rounded-full transition-all active:scale-90 ${
        active
          ? "bg-[#C9A227] text-[#0E3B2E] shadow-[0_0_0_5px_rgba(201,162,39,.25)]"
          : dark
            ? "bg-white/12 text-white hover:bg-white/25"
            : "bg-[#0E3B2E] text-[#FDF8EF] hover:bg-[#1B624C] shadow-md"
      }`}
    >
      <Volume2 size={icon} />
      {active && (
        <span className="absolute inset-0 rounded-full border-2 border-[#0E3B2E]/40 animate-ping pointer-events-none" />
      )}
    </button>
  );
}

/* Global audio status strip: shows which speaker engine is active + a test button. */
export function AudioStatus() {
  const { speak, stop, speaking, engine, voicesReady, arVoiceName } = useSpeech();
  const online = useOnline();
  const [active, setActive] = useState(false);

  useEffect(() => { if (active && !speaking) setActive(false); }, [speaking, active]);

  const label =
    engine === "arabic-voice" ? `Arabic voice ready${arVoiceName ? ` · ${arVoiceName.slice(0, 28)}` : ""}` :
    engine === "voice" ? "Device voice ready (add an Arabic voice for best results)" :
    online ? "Online audio — tap any speaker (plays in HD, then caches)" :
    "Offline cue mode — connect once to unlock HD Arabic audio";

  return (
    <div className="paper-card rounded-2xl p-4 flex flex-wrap items-center gap-3">
      <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${engine === "arabic-voice" ? "bg-emerald-100 text-emerald-700" : "bg-[#F7ECC8] text-[#7A4A1E]"}`}>
        {engine === "none" && !online ? <VolumeX size={19} /> : <Volume2 size={19} />}
      </span>
      <div className="flex-1 min-w-[200px]">
        <div className="text-sm font-extrabold text-[#0E3B2E] flex items-center gap-2">
          Speakers: {voicesReady ? "ready" : "warming up…"}
          {!online && <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full"><Wifi size={11} /> offline</span>}
        </div>
        <div className="text-xs text-[#4A5250] font-semibold mt-0.5">{label}</div>
      </div>
      <button
        onClick={() => {
          if (active) { stop(); setActive(false); return; }
          speak("السلام عليكم", "ar");
          setActive(true);
          setTimeout(() => setActive(false), 9000);
        }}
        className={`inline-flex items-center gap-1.5 text-xs font-extrabold px-5 py-2.5 rounded-full transition-colors ${active ? "bg-[#C9A227] text-[#0E3B2E]" : "bg-[#0E3B2E] text-white hover:bg-[#1B624C]"}`}
      >
        <Volume2 size={14} /> {active ? "Playing… (tap to stop)" : "Test speaker"}
      </button>
    </div>
  );
}

export function SectionHead({ kicker, title, sub, light = false }: { kicker: string; title: string; sub?: string; light?: boolean }) {
  return (
    <div className="mb-5">
      <div className={`inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-3 ${light ? "bg-white/12 text-[#F7ECC8]" : "bg-[#0E3B2E] text-[#F7ECC8]"}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
        {kicker}
      </div>
      <h2 className={`text-2xl sm:text-3xl font-extrabold leading-tight ${light ? "text-white" : "text-[#0E3B2E]"}`}>{title}</h2>
      {sub && <p className={`mt-1.5 text-sm leading-relaxed max-w-2xl ${light ? "text-white/70" : "text-[#4A5250]"}`}>{sub}</p>}
    </div>
  );
}

export function LevelPill({ lvl, small = false }: { lvl: 1 | 2 | 3; small?: boolean }) {
  const map = { 1: ["Starter", "bg-emerald-100 text-emerald-900"], 2: ["Builder", "bg-amber-100 text-amber-900"], 3: ["Reader", "bg-rose-100 text-rose-900"] } as const;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-bold ${map[lvl][1]} ${small ? "text-[10px] px-2 py-0.5" : "text-[11px] px-2.5 py-1"}`}>
      <span className="font-arabic">{lvl === 1 ? "١" : lvl === 2 ? "٢" : "٣"}</span> {map[lvl][0]}
    </span>
  );
}

export function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-2 text-xs font-semibold text-[#4A5250]">
      <span className={`w-10 h-6 rounded-full p-1 transition-colors ${on ? "bg-[#0E3B2E]" : "bg-[#E5CC9A]"}`}>
        <span className={`block w-4 h-4 rounded-full bg-white shadow transition-transform ${on ? "translate-x-4" : ""}`} />
      </span>
      {label}
    </button>
  );
}

export function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      aria-label="Copy"
      onClick={async (e) => {
        e.stopPropagation();
        try { await navigator.clipboard.writeText(text); } catch {
          const ta = document.createElement("textarea");
          ta.value = text; document.body.appendChild(ta); ta.select();
          document.execCommand("copy"); ta.remove();
        }
        setOk(true); setTimeout(() => setOk(false), 1400);
      }}
      className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-black/5 text-[#0E3B2E] hover:bg-black/10 transition-colors"
    >
      {ok ? <Check size={15} /> : <Copy size={15} />}
    </button>
  );
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return <div className="text-sm text-[#8A948F] italic py-6 text-center">{children}</div>;
}
