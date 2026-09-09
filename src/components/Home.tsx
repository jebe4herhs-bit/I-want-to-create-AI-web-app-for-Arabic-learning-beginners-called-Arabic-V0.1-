import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Flame, Star, Wifi, WifiOff, Download, Trash2, Upload, CheckCircle2,
  BookOpen, Shapes, MessagesSquare, Library, Layers, HeartHandshake, ChevronRight, RotateCcw, Award,
} from "lucide-react";
import { LETTERS, PATTERNS, VOCAB } from "../data/curriculum";
import { STORIES } from "../data/stories";
import { useStore, useOnline, useServiceWorker, levelOf } from "../lib/store";
import { SectionHead, AudioStatus } from "./ui";

export function HomePage() {
  const { p } = useStore();
  const online = useOnline();
  const { lvl, into, pct } = levelOf(p.xp);

  const steps = [
    { to: "/alphabet", icon: <Shapes size={22} />, title: "Alphabet", ar: "الأَبْجَدِيَّة", desc: "28 letters, shapes, sounds", done: p.lettersSeen.length, total: 28, color: "bg-[#0E3B2E]" },
    { to: "/patterns", icon: <MessagesSquare size={22} />, title: "Patterns", ar: "الجُمَل", desc: "12 English → Arabic frames", done: p.patternsDone.length, total: PATTERNS.length, color: "bg-[#7A4A1E]" },
    { to: "/read", icon: <BookOpen size={22} />, title: "Stories", ar: "القِصَص", desc: "6 graded readers + quizzes", done: p.storiesRead.length, total: STORIES.length, color: "bg-[#C74824]" },
    { to: "/words", icon: <Layers size={22} />, title: "Words", ar: "الكَلِمَات", desc: `${VOCAB.length} flashcards with audio`, done: Object.values(p.flashKnown).filter((v) => v >= 2).length, total: VOCAB.length, color: "bg-[#1B5FAA]" },
    { to: "/phrases", icon: <HeartHandshake size={22} />, title: "Phrases", ar: "عِبَارَات", desc: "24 survival lines", done: 24, total: 24, color: "bg-[#5B2333]" },
    { to: "/library", icon: <Library size={22} />, title: "My Library", ar: "مَكْتَبَتِي", desc: "Downloads & backup", done: 1, total: 1, color: "bg-[#0E6E6E]" },
  ];

  return (
    <div className="pb-28">
      {/* HERO */}
      <div className="relative overflow-hidden bg-[#0B2E24] text-white">
        <div className="absolute inset-0 pattern-dark" />
        <div className="absolute -top-10 -right-10 font-arabic text-[220px] leading-none text-white/[0.06] select-none hidden sm:block">كلمة</div>
        <div className="absolute -bottom-16 -left-6 font-arabic text-[170px] leading-none text-[#C9A227]/10 select-none">عربي</div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-12 sm:pt-16 sm:pb-16">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full ${online ? "bg-emerald-400/15 text-emerald-200" : "bg-amber-400/15 text-amber-200"}`}>
              {online ? <Wifi size={13} /> : <WifiOff size={13} />} {online ? "Online — everything synced locally" : "Offline mode — keep learning!"}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full bg-[#C9A227] text-[#0E3B2E]">
              <Download size={13} /> 100% offline-ready
            </span>
          </div>
          <div className="grid lg:grid-cols-[1.2fr_.8fr] gap-8 items-center">
            <div>
              <div className="font-arabic text-5xl sm:text-7xl leading-tight text-[#F7ECC8]">كَلِمَة <span className="text-[#C9A227]">·</span> Kalima</div>
              <h1 className="text-2xl sm:text-4xl font-extrabold mt-3 leading-tight">Arabic for complete beginners,<br className="hidden sm:block" /> built English → Arabic.</h1>
              <p className="text-white/70 text-sm sm:text-base mt-3 max-w-xl leading-relaxed">
                Learn the alphabet, speak from day one with reusable sentence patterns, then read real voweled stories.
                Pronunciation for every word, quizzes with XP, and the whole school fits in your pocket — no internet needed.
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <Link to="/alphabet" className="inline-flex items-center gap-2 bg-[#C9A227] text-[#0E3B2E] font-extrabold text-sm px-6 py-3.5 rounded-full hover:bg-[#D9B845] transition-colors">
                  Start learning <ChevronRight size={17} />
                </Link>
                <Link to="/read" className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-white/10 transition-colors">
                  <BookOpen size={16} /> Jump to stories
                </Link>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 text-[13px] font-semibold text-white/70">
                <span><b className="text-white">28</b> letters with audio</span>
                <span><b className="text-white">12</b> sentence patterns</span>
                <span><b className="text-white">6</b> graded stories</span>
                <span><b className="text-white">{VOCAB.length}+</b> words</span>
              </div>
            </div>
            {/* learner card */}
            <div className="rounded-3xl bg-white/[0.07] border border-white/15 backdrop-blur p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold"><Flame size={18} className="text-[#E8933C]" /> {p.streak}-day streak</div>
                <div className="flex items-center gap-1.5 text-sm font-bold"><Star size={16} className="text-[#C9A227]" /> Level {lvl}</div>
              </div>
              <div className="mt-3 flex items-end justify-between">
                <div className="text-4xl font-extrabold">{p.xp} <span className="text-sm font-bold text-white/50">XP</span></div>
                <div className="text-[11px] font-bold text-white/60">{into}/120 to Level {lvl + 1}</div>
              </div>
              <div className="h-2.5 rounded-full bg-white/10 mt-2 overflow-hidden">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-[#C9A227] to-[#E8933C]" animate={{ width: `${pct}%` }} />
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                {[
                  [`${p.lettersSeen.length}/28`, "letters"],
                  [`${p.patternsDone.length}/${PATTERNS.length}`, "patterns"],
                  [`${p.storiesRead.length}/${STORIES.length}`, "stories"],
                ].map(([v, l]) => (
                  <div key={l as string} className="rounded-xl bg-white/[0.07] py-2.5">
                    <div className="font-extrabold">{v}</div>
                    <div className="text-[11px] text-white/55 font-semibold">{l}</div>
                  </div>
                ))}
              </div>
              <Link to="/library" className="mt-4 block text-center text-xs font-bold bg-white/10 hover:bg-white/15 rounded-xl py-2.5 transition-colors">View progress & library →</Link>
            </div>
          </div>
        </div>
        <svg viewBox="0 0 1440 44" className="relative block w-full text-[#FDF8EF]" fill="currentColor" preserveAspectRatio="none" style={{ height: 34 }}>
          <path d="M0,32 C240,8 480,8 720,22 C960,36 1200,36 1440,14 L1440,44 L0,44 Z" />
        </svg>
      </div>

      {/* Steps */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <SectionHead kicker="Your path" title="Five steps, zero experience needed" sub="Follow the path in order — each step unlocks the next. Or jump anywhere; nothing is locked." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((s, i) => (
            <motion.div key={s.to} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Link to={s.to} className="paper-card rounded-3xl p-5 flex gap-4 hover:-translate-y-1 hover:shadow-xl hover:border-[#C9A227] transition-all group h-full">
                <div className={`w-14 h-14 rounded-2xl ${s.color} text-white flex items-center justify-center shrink-0`}>{s.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold text-[#8A948F]">STEP {i + 1}</span>
                    <span className="font-arabic text-sm text-[#7A4A1E]">{s.ar}</span>
                  </div>
                  <div className="font-extrabold text-[#0E3B2E] text-lg leading-tight">{s.title}</div>
                  <div className="text-xs text-[#4A5250] font-semibold">{s.desc}</div>
                  <div className="mt-2 h-1.5 rounded-full bg-black/[0.07] overflow-hidden">
                    <div className="h-full bg-[#C9A227] rounded-full" style={{ width: `${Math.min(100, (s.done / s.total) * 100)}%` }} />
                  </div>
                </div>
                <ChevronRight size={18} className="text-[#C9A227] self-center group-hover:translate-x-1 transition-transform shrink-0" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* pattern of the day */}
        <DailyPattern />

        {/* speakers status */}
        <div className="mt-8">
          <AudioStatus />
        </div>

        {/* numerals */}
        <div className="mt-8 rounded-3xl overflow-hidden border border-[#EADFC3] grid md:grid-cols-2">
          <div className="bg-[#0E3B2E] pattern-dark text-white p-6 sm:p-8">
            <div className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#C9A227]">Bonus skill · Numbers</div>
            <h3 className="text-2xl font-extrabold mt-2">Read prices, pages & years</h3>
            <p className="text-sm text-white/70 mt-2 leading-relaxed">The Middle East writes digits Eastern-style: ٠١٢٣٤٥٦٧٨٩. So ٢٠٢٦ is 2026 and ٥ is five. Menus, bills and street signs mix both systems — now you can read either.</p>
            <Link to="/words" className="inline-block mt-4 text-xs font-bold bg-[#C9A227] text-[#0E3B2E] px-5 py-2.5 rounded-full hover:bg-[#D9B845]">Learn numbers 1–1000 →</Link>
          </div>
          <div className="bg-[#FFFDF7] p-6 sm:p-8 grid grid-cols-5 gap-2 content-center" dir="rtl">
            {[["٠", "0"], ["١", "1"], ["٢", "2"], ["٣", "3"], ["٤", "4"], ["٥", "5"], ["٦", "6"], ["٧", "7"], ["٨", "8"], ["٩", "9"]].map(([a, e]) => (
              <div key={e} className="rounded-xl border border-[#EADFC3] bg-white p-2 text-center">
                <div className="font-arabic text-3xl text-[#0E3B2E]">{a}</div>
                <div className="text-[11px] font-bold text-[#8A948F]">{e}</div>
              </div>
            ))}
          </div>
        </div>

        {/* letters preview */}
        <div className="mt-8">
          <div className="flex items-end justify-between mb-4">
            <h3 className="text-xl font-extrabold text-[#0E3B2E]">Taste the alphabet <span className="font-arabic font-normal text-[#7A4A1E]">— تَذَوَّق</span></h3>
            <Link to="/alphabet" className="text-xs font-bold text-[#0E3B2E] hover:underline">All 28 →</Link>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {LETTERS.slice(0, 14).map((l) => (
              <Link key={l.a} to="/alphabet" className="paper-card rounded-2xl p-3 text-center hover:border-[#C9A227] hover:-translate-y-0.5 transition-all">
                <div className="font-arabic text-3xl text-[#0E3B2E]">{l.a}</div>
                <div className="text-[10px] font-bold text-[#8A948F]">{l.trans}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DailyPattern() {
  const day = new Date().getDate() + new Date().getMonth() * 31;
  const pat = PATTERNS[day % PATTERNS.length];
  const ex = pat.examples[day % pat.examples.length];
  return (
    <div className="mt-8 rounded-3xl bg-gradient-to-br from-[#C9A227] via-[#E0BE4E] to-[#F0E0BE] p-[2px]">
      <div className="rounded-3xl bg-[#0E3B2E] pattern-dark text-white p-6 sm:p-7 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
        <div className="w-12 h-12 rounded-2xl bg-[#C9A227] text-[#0E3B2E] flex items-center justify-center shrink-0 font-arabic text-2xl floaty">ي</div>
        <div className="flex-1">
          <div className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#C9A227]">Pattern of the day · {pat.titleEn}</div>
          <div className="font-arabic text-3xl mt-1.5" dir="rtl">{ex.ar}</div>
          <div className="text-sm font-semibold text-white/80 mt-1">{ex.en} <span className="italic font-normal text-white/55">· {ex.tr}</span></div>
        </div>
        <Link to="/patterns" className="shrink-0 text-xs font-extrabold bg-white text-[#0E3B2E] px-5 py-3 rounded-full hover:bg-[#F7ECC8]">Practise it →</Link>
      </div>
    </div>
  );
}

export function LibraryPage() {
  const { p, resetAll, exportJSON, importJSON, addXP } = useStore();
  const online = useOnline();
  const sw = useServiceWorker();
  const [msg, setMsg] = useState("");
  const [importText, setImportText] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [cached, setCached] = useState<string[]>([]);
  const { lvl, pct } = levelOf(p.xp);

  const refreshCache = async () => {
    try {
      if (!("caches" in window)) return;
      const keys = await caches.keys();
      const all: string[] = [];
      for (const k of keys) {
        const c = await caches.open(k);
        const reqs = await c.keys();
        reqs.forEach((r) => all.push(new URL(r.url).pathname));
      }
      setCached(Array.from(new Set(all)).slice(0, 40));
    } catch { /* noop */ }
  };
  useMemo(() => { refreshCache(); }, []);

  const downloadAll = async () => {
    setMsg("Caching lessons for offline use…");
    try {
      const urls = ["/", "/index.html", "/manifest.webmanifest", "/favicon.svg", "/alphabet", "/patterns", "/read", "/words", "/phrases", "/library"];
      if ("caches" in window) {
        const c = await caches.open("kalima-v1");
        for (const u of urls) {
          try { await c.add(u); } catch { /* route cached at runtime */ }
        }
      }
      await refreshCache();
      addXP(5);
      setMsg("Done — lessons cached. Airplane mode is welcome now.");
    } catch { setMsg("Caching needs a connection the first time — then you're free forever."); }
  };

  const stats = [
    { label: "Total XP", value: String(p.xp), sub: `Level ${lvl} · ${pct}% to next` },
    { label: "Day streak", value: String(p.streak), sub: p.streak >= 7 ? "A whole week — masha'allah!" : "Come back tomorrow to grow it" },
    { label: "Letters", value: `${p.lettersSeen.length}/28`, sub: `${28 - p.lettersSeen.length} to go` },
    { label: "Patterns", value: `${p.patternsDone.length}/${PATTERNS.length}`, sub: `${Object.keys(p.quizBest).length} quizzes passed` },
    { label: "Stories", value: `${p.storiesRead.length}/${STORIES.length}`, sub: "graded readers finished" },
    { label: "Words mastered", value: String(Object.values(p.flashKnown).filter((v) => v >= 2).length), sub: `of ${VOCAB.length} cards` },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-28 pt-6">
      <SectionHead kicker="My Library" title="Progress, offline & backup" sub="Your progress lives in this browser (localStorage) and all lessons ship with the app — no account, no signal, no problem." />

      {/* status */}
      <AudioStatus />
      <div className="grid sm:grid-cols-3 gap-3 mt-3 mb-5">
        <div className="paper-card rounded-2xl p-4 flex items-center gap-3">
          <span className={`w-11 h-11 rounded-xl flex items-center justify-center ${online ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
            {online ? <Wifi size={20} /> : <WifiOff size={20} />}
          </span>
          <div><div className="text-sm font-extrabold text-[#0E3B2E]">{online ? "Online" : "Offline"}</div><div className="text-[11px] text-[#8A948F] font-semibold">{online ? "Live connection detected" : "Learning continues offline"}</div></div>
        </div>
        <div className="paper-card rounded-2xl p-4 flex items-center gap-3">
          <span className="w-11 h-11 rounded-xl bg-[#0E3B2E] text-[#F7ECC8] flex items-center justify-center"><Download size={20} /></span>
          <div><div className="text-sm font-extrabold text-[#0E3B2E]">{sw === "ready" ? "Offline ready" : sw === "unsupported" ? "SW unsupported" : "Preparing…"}</div><div className="text-[11px] text-[#8A948F] font-semibold">Service worker + app cache</div></div>
        </div>
        <div className="paper-card rounded-2xl p-4 flex items-center gap-3">
          <span className="w-11 h-11 rounded-xl bg-[#C9A227] text-[#0E3B2E] flex items-center justify-center"><Award size={20} /></span>
          <div><div className="text-sm font-extrabold text-[#0E3B2E]">Level {lvl} · {p.xp} XP</div><div className="text-[11px] text-[#8A948F] font-semibold">{p.streak}-day streak</div></div>
        </div>
      </div>

      <button onClick={downloadAll} className="w-full rounded-2xl bg-[#0E3B2E] text-white p-5 flex items-center gap-4 hover:bg-[#144E3C] transition-colors text-left">
        <span className="w-12 h-12 rounded-2xl bg-[#C9A227] text-[#0E3B2E] flex items-center justify-center shrink-0"><Download size={22} /></span>
        <span className="flex-1">
          <span className="block font-extrabold">Download all lessons for offline</span>
          <span className="block text-xs text-white/65 font-semibold mt-0.5">Caches every page, story and word list on this device. Do it once on Wi-Fi.</span>
        </span>
        <ChevronRight size={20} className="text-[#C9A227]" />
      </button>
      {msg && <div className="mt-3 text-[13px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center gap-2"><CheckCircle2 size={16} /> {msg}</div>}

      {/* stats */}
      <h3 className="font-extrabold text-[#0E3B2E] mt-8 mb-3">Your achievements</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="paper-card rounded-2xl p-4">
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#8A948F]">{s.label}</div>
            <div className="text-2xl font-extrabold text-[#0E3B2E]">{s.value}</div>
            <div className="text-[11px] font-semibold text-[#8A948F]">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* cached */}
      <h3 className="font-extrabold text-[#0E3B2E] mt-8 mb-3">What's stored offline ({cached.length} files)</h3>
      <div className="paper-card rounded-2xl p-4">
        {cached.length === 0 ? (
          <p className="text-[13px] text-[#8A948F]">Press “Download all lessons” above, then revisit — cached files will be listed here.</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {cached.map((c) => <span key={c} className="text-[11px] font-mono bg-black/5 px-2 py-1 rounded-md">{c}</span>)}
          </div>
        )}
      </div>

      {/* backup */}
      <h3 className="font-extrabold text-[#0E3B2E] mt-8 mb-3">Backup & restore</h3>
      <div className="paper-card rounded-2xl p-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => {
            const blob = new Blob([exportJSON()], { type: "application/json" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "kalima-progress.json";
            a.click();
            setMsg("Progress file downloaded — keep it safe!");
          }} className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-full bg-[#0E3B2E] text-white hover:bg-[#1B624C]">
            <Download size={14} /> Export progress
          </button>
          <button onClick={() => setShowImport(!showImport)} className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-full border-2 border-[#0E3B2E] text-[#0E3B2E]">
            <Upload size={14} /> Import progress
          </button>
          <button onClick={() => { if (window.confirm("Reset all progress? This cannot be undone.")) { resetAll(); setMsg("Fresh start — ahlan wa sahlan again!"); } }}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-full border-2 border-rose-300 text-rose-700 ml-auto">
            <RotateCcw size={14} /> Reset all
          </button>
        </div>
        {showImport && (
          <div>
            <textarea value={importText} onChange={(e) => setImportText(e.target.value)} rows={4} placeholder='Paste your exported JSON here…'
              className="w-full text-xs font-mono rounded-xl border border-[#EADFC3] p-3 outline-none focus:border-[#C9A227]" />
            <button onClick={() => {
              if (importJSON(importText)) { setMsg("Progress restored — welcome back!"); setShowImport(false); setImportText(""); }
              else setMsg("That file didn't look right — try exporting again.");
            }} className="mt-2 text-xs font-bold px-4 py-2.5 rounded-full bg-[#C9A227] text-[#0E3B2E]">Restore from text</button>
          </div>
        )}
      </div>

      <div className="mt-8 rounded-2xl bg-[#0E3B2E] pattern-dark text-white p-6 text-center">
        <div className="font-arabic text-3xl text-[#F7ECC8]">شُكْرًا لِتَعَلُّمِك مَعَنَا</div>
        <p className="text-sm text-white/65 mt-1">Thank you for learning with us. Kalima works fully offline — take it everywhere.</p>
        <div className="flex justify-center gap-2 mt-4 flex-wrap">
          <Link to="/alphabet" className="text-xs font-bold bg-white/10 hover:bg-white/15 px-4 py-2 rounded-full">Alphabet</Link>
          <Link to="/patterns" className="text-xs font-bold bg-white/10 hover:bg-white/15 px-4 py-2 rounded-full">Patterns</Link>
          <Link to="/read" className="text-xs font-bold bg-white/10 hover:bg-white/15 px-4 py-2 rounded-full">Stories</Link>
          <Link to="/words" className="text-xs font-bold bg-white/10 hover:bg-white/15 px-4 py-2 rounded-full">Words</Link>
          <Link to="/phrases" className="text-xs font-bold bg-white/10 hover:bg-white/15 px-4 py-2 rounded-full">Phrases</Link>
        </div>
      </div>
    </div>
  );
}
