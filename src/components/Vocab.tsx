import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Layers, RotateCcw, Check, X, Shuffle, Trophy } from "lucide-react";
import { VOCAB, CATS } from "../data/curriculum";
import { useStore, useSpeech } from "../lib/store";
import { SectionHead, SpeakBtn, AudioStatus } from "./ui";

export default function VocabPage() {
  const { p, markFlash, addXP } = useStore();
  const { speak } = useSpeech();
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [mode, setMode] = useState<"grid" | "flash">("grid");
  const [fi, setFi] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [dir, setDir] = useState<"en-ar" | "ar-en">("en-ar");
  const [sessionGood, setSessionGood] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);

  const list = useMemo(() => VOCAB.filter((v) => {
    if (cat !== "all" && v.cat !== cat) return false;
    if (!q) return true;
    const s = q.toLowerCase();
    return v.en.toLowerCase().includes(s) || v.tr.toLowerCase().includes(s) || v.ar.includes(q);
  }), [cat, q]);

  const flashList = useMemo(() => {
    const arr = [...list];
    // weakest first (lowest known count)
    arr.sort((a, b) => (p.flashKnown[`${a.cat}:${a.ar}`] ?? 0) - (p.flashKnown[`${b.cat}:${b.ar}`] ?? 0));
    return arr;
  }, [list, p.flashKnown]);

  const card = flashList.length ? flashList[fi % flashList.length] : null;
  const knownCount = useMemo(() => Object.values(p.flashKnown).filter((v) => v >= 2).length, [p.flashKnown]);

  const grade = (known: boolean) => {
    if (!card) return;
    markFlash(`${card.cat}:${card.ar}`, known);
    setSessionTotal((t) => t + 1);
    if (known) { setSessionGood((g) => g + 1); addXP(2); } else addXP(1);
    setFlipped(false);
    setTimeout(() => setFi((f) => f + 1), 120);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-28 pt-6">
      <SectionHead
        kicker="Step 4 · Word Bank"
        title="100+ essential words"
        sub="Flip cards, hear every word, and grade yourself. Words you miss come back more often. Everything remembers you — even offline."
      />

      <div className="mb-5"><AudioStatus /></div>

      <div className="paper-card rounded-2xl p-4 mb-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-black/5 rounded-full p-1">
            <button onClick={() => setMode("grid")} className={`text-xs font-bold px-4 py-2 rounded-full ${mode === "grid" ? "bg-[#0E3B2E] text-white" : "text-[#4A5250]"}`}>Browse</button>
            <button onClick={() => setMode("flash")} className={`text-xs font-bold px-4 py-2 rounded-full inline-flex items-center gap-1.5 ${mode === "flash" ? "bg-[#0E3B2E] text-white" : "text-[#4A5250]"}`}><Layers size={13} /> Flashcards</button>
          </div>
          <div className="relative flex-1 min-w-[180px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A948F]" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search: bread, qahwa, خبز…"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#EADFC3] bg-white text-sm outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30" />
          </div>
          <div className="text-xs font-bold text-[#4A5250]">{knownCount} mastered · {sessionTotal > 0 && <span className="text-[#0E3B2E]">session {sessionGood}/{sessionTotal}</span>}</div>
        </div>
        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
          <button onClick={() => setCat("all")} className={`shrink-0 text-xs font-bold px-3.5 py-1.5 rounded-full border ${cat === "all" ? "bg-[#0E3B2E] text-white border-[#0E3B2E]" : "bg-white border-[#EADFC3] text-[#4A5250]"}`}>All</button>
          {CATS.map((c) => (
            <button key={c.id} onClick={() => { setCat(c.id); setFi(0); }}
              className={`shrink-0 text-xs font-bold px-3.5 py-1.5 rounded-full border inline-flex items-center gap-1.5 ${cat === c.id ? "text-white border-transparent" : "bg-white border-[#EADFC3] text-[#4A5250]"}`}
              style={cat === c.id ? { background: c.color } : {}}>
              <span className="w-2 h-2 rounded-full" style={{ background: cat === c.id ? "#fff" : c.color }} />
              {c.en} <span className="font-arabic font-normal opacity-70">{c.ar}</span>
            </button>
          ))}
        </div>
      </div>

      {mode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {list.map((v, i) => {
            const k = p.flashKnown[`${v.cat}:${v.ar}`] ?? 0;
            const c = CATS.find((x) => x.id === v.cat)!;
            return (
              <motion.div
                key={`${v.cat}-${v.ar}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.015, 0.3) }}
                onClick={() => speak(v.ar, "ar")}
                className="paper-card rounded-2xl p-4 text-center hover:border-[#C9A227] hover:-translate-y-0.5 transition-all group relative cursor-pointer"
              >
                <span className="absolute top-2.5 left-2.5 w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                {k >= 2 && <span className="absolute top-2 right-2 text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">✓ {k}x</span>}
                <div className="font-arabic text-3xl text-[#0E3B2E] mt-1" dir="rtl">{v.ar}</div>
                <div className="text-[13px] font-bold text-[#1A1E1A] mt-1">{v.en}</div>
                <div className="text-[11px] italic text-[#8A948F]">{v.tr}</div>
                <div className="mt-2 flex justify-center" onClick={(e) => e.stopPropagation()}>
                  <SpeakBtn text={v.ar} size="sm" />
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          {flashList.length === 0 ? (
            <div className="text-center text-sm text-[#8A948F] py-10">No cards match. Try another category.</div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-bold text-[#8A948F]">Card {(fi % flashList.length) + 1} / {flashList.length}</div>
                <div className="flex gap-2">
                  <button onClick={() => setDir(dir === "en-ar" ? "ar-en" : "en-ar")} className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-black/5 hover:bg-black/10 text-[#0E3B2E] inline-flex items-center gap-1">
                    <RotateCcw size={12} /> {dir === "en-ar" ? "EN → AR" : "AR → EN"}
                  </button>
                  <button onClick={() => { const a = [...flashList]; const n = Math.floor(Math.random() * a.length); setFi(n); setFlipped(false); }} className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-black/5 hover:bg-black/10 text-[#0E3B2E] inline-flex items-center gap-1">
                    <Shuffle size={12} /> Shuffle
                  </button>
                </div>
              </div>
              <div style={{ perspective: 1200 }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${fi % flashList.length}-${dir}`}
                    initial={{ opacity: 0, rotateY: 25 }} animate={{ opacity: 1, rotateY: 0 }} exit={{ opacity: 0, rotateY: -25 }} transition={{ duration: 0.22 }}
                    onClick={() => {
                      setFlipped(!flipped);
                      if (card && !flipped) speak(card.ar, "ar");
                    }}
                    className={`flip-inner relative w-full h-72 cursor-pointer ${flipped ? "flip-flipped" : ""}`}
                  >
                    {/* front */}
                    <div className="flip-face absolute inset-0 rounded-3xl bg-[#0E3B2E] pattern-dark text-white p-8 flex flex-col items-center justify-center text-center">
                      <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#C9A227] mb-3">{dir === "en-ar" ? "What is this in Arabic?" : "What does this mean?"}</div>
                      {dir === "en-ar" ? (
                        <div className="text-3xl font-extrabold">{card!.en}</div>
                      ) : (
                        <div className="font-arabic text-5xl leading-snug" dir="rtl">{card!.ar}</div>
                      )}
                      <div className="mt-4 text-xs text-white/50 font-semibold">Tap to flip</div>
                    </div>
                    {/* back */}
                    <div className="flip-face flip-back absolute inset-0 rounded-3xl bg-[#C9A227] p-8 flex flex-col items-center justify-center text-center text-[#0E3B2E]">
                      {dir === "en-ar" ? (
                        <>
                          <div className="font-arabic text-5xl leading-snug" dir="rtl">{card!.ar}</div>
                          <div className="italic text-sm mt-1 font-semibold">{card!.tr}</div>
                          <div className="text-sm font-bold mt-1 opacity-70">{card!.en}</div>
                        </>
                      ) : (
                        <>
                          <div className="text-3xl font-extrabold">{card!.en}</div>
                          <div className="font-arabic text-2xl mt-2 opacity-80" dir="rtl">{card!.ar}</div>
                          <div className="italic text-sm mt-1 font-semibold">{card!.tr}</div>
                        </>
                      )}
                      <span onClick={(e) => e.stopPropagation()} className="mt-3 inline-block">
                        <SpeakBtn text={card!.ar} size="sm" dark />
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button onClick={() => grade(false)} className="py-3.5 rounded-2xl font-bold text-sm bg-white border-2 border-rose-300 text-rose-700 hover:bg-rose-50 inline-flex items-center justify-center gap-2">
                  <X size={17} /> Still learning
                </button>
                <button onClick={() => grade(true)} className="py-3.5 rounded-2xl font-bold text-sm bg-[#0E3B2E] text-white hover:bg-[#1B624C] inline-flex items-center justify-center gap-2">
                  <Check size={17} /> I knew it (+2)
                </button>
              </div>
              {sessionTotal >= 10 && (
                <div className="mt-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-center text-sm font-bold text-emerald-800">
                  <Trophy size={16} className="inline mr-1.5 -mt-0.5" />
                  Session: {sessionGood}/{sessionTotal} known ({Math.round((sessionGood / sessionTotal) * 100)}%) — keep the streak alive!
                </div>
              )}
            </>
          )}
        </div>
      )}
      {list.length === 0 && mode === "grid" && <div className="text-center text-sm text-[#8A948F] py-10">Nothing found for “{q}”.</div>}
    </div>
  );
}
