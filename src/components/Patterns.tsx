import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dices, Lightbulb, CheckCircle2, ArrowRight, RotateCcw, Trophy } from "lucide-react";
import { PATTERNS } from "../data/curriculum";
import { useStore } from "../lib/store";
import { SpeakBtn, SectionHead, LevelPill, CopyBtn, AudioStatus } from "./ui";

function isFeminine(opt: { ar: string; en: string }) {
  if (opt.ar.includes("ة")) return true;
  if (opt.ar.includes("شَمْس") || opt.ar.includes("شمس")) return true; // sun is feminine with no ة
  if (opt.en.includes("(f)")) return true;
  return false;
}

export default function PatternsPage() {
  const { p, completePattern, addXP, recordQuiz } = useStore();
  const [lvl, setLvl] = useState<0 | 1 | 2 | 3>(0);
  const [open, setOpen] = useState<string>("this-is");
  const [slotIdx, setSlotIdx] = useState<Record<string, number>>({});
  const [quizId, setQuizId] = useState<string | null>(null);

  const list = useMemo(() => PATTERNS.filter((x) => lvl === 0 || x.lvl === lvl), [lvl]);
  const active = PATTERNS.find((x) => x.id === open) ?? list[0];

  const buildSentence = (pid: string) => {
    const pat = PATTERNS.find((x) => x.id === pid)!;
    const i = slotIdx[pid] ?? 0;
    const opt = pat.options[i % pat.options.length];
    if (pid === "this-is") {
      const fem = isFeminine(opt);
      return { ar: `${fem ? "هَذِهِ" : "هَذَا"} ${opt.ar}.`, en: `This is a ${opt.en}.`, tr: `${fem ? "hadhihi" : "hadha"} ${opt.tr}`, opt };
    }
    if (pid === "my-name") return { ar: `اِسْمِي ${opt.ar}.`, en: `My name is ${opt.en}.`, tr: `ismi ${opt.tr}`, opt };
    if (pid === "i-am-from") return { ar: `أَنَا مِن ${opt.ar}.`, en: `I am from ${opt.en}.`, tr: `ana min ${opt.tr}`, opt };
    if (pid === "i-want") return { ar: `أُرِيد ${opt.ar}.`, en: `I want ${opt.en}.`, tr: `urid ${opt.tr}`, opt };
    if (pid === "greetings") return { ar: `${opt.ar}.`, en: `${opt.en}.`, tr: opt.tr, opt };
    if (pid === "i-like") return { ar: `أُحِب ${opt.ar}.`, en: `I like ${opt.en}.`, tr: `uhibb ${opt.tr}`, opt };
    if (pid === "where-is") return { ar: `أَيْنَ ${opt.ar}؟`, en: `Where is ${opt.en}?`, tr: `ayna ${opt.tr}?`, opt };
    if (pid === "how-much") return { ar: `بِكَم ${opt.ar}؟`, en: `How much is ${opt.en}?`, tr: `bikam ${opt.tr}?`, opt };
    if (pid === "i-have") return { ar: `عِنْدِي ${opt.ar}.`, en: `I have ${opt.en}.`, tr: `indi ${opt.tr}`, opt };
    if (pid === "he-she-is") return { ar: `${opt.ar.includes("ة") || opt.ar.includes("/") ? "هِيَ" : "هُوَ"} ${opt.ar.split(" / ")[0]}.`, en: `${opt.en}.`, tr: opt.tr, opt };
    if (pid === "there-is") return { ar: `يُوجَد ${opt.ar} هُنَا.`, en: `There is ${opt.en} here.`, tr: `yujad ${opt.tr} huna`, opt };
    return { ar: `أَذْهَب إِلَى ${opt.ar}.`, en: `I go to ${opt.en}.`, tr: `adhhab ila ${opt.tr}`, opt };
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-28 pt-6">
      <SectionHead
        kicker="Step 2 · Sentence Patterns"
        title="English → Arabic patterns"
        sub="Each pattern is a reusable frame. Tap the dice to swap words into the frame, hear it, copy it — then take the mini-quiz. Finish a pattern to earn XP."
      />

      <div className="mb-5"><AudioStatus /></div>

      <div className="flex flex-wrap gap-2 mb-5">
        {[[0, "All 12"], [1, "Starter · 5"], [2, "Builder · 5"], [3, "Reader · 2"]].map(([v, lab]) => (
          <button key={lab as string} onClick={() => setLvl(v as 0 | 1 | 2 | 3)}
            className={`text-xs font-bold px-4 py-2 rounded-full border transition-all ${lvl === v ? "bg-[#0E3B2E] text-white border-[#0E3B2E]" : "bg-white text-[#4A5250] border-[#EADFC3]"}`}>
            {lab}
          </button>
        ))}
        <div className="ml-auto text-xs font-bold text-[#4A5250] self-center">{p.patternsDone.length} / {PATTERNS.length} complete · {Object.keys(p.quizBest).length} quizzes passed</div>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-4 items-start">
        {/* list */}
        <div className="space-y-2 lg:sticky lg:top-20">
          {list.map((pt) => {
            const done = p.patternsDone.includes(pt.id);
            const best = p.quizBest[pt.id];
            const isOpen = active?.id === pt.id;
            return (
              <button key={pt.id} onClick={() => setOpen(pt.id)}
                className={`w-full text-left rounded-2xl p-3.5 border transition-all flex items-center gap-3 ${isOpen ? "bg-[#0E3B2E] text-white border-[#0E3B2E] shadow-lg" : "paper-card hover:border-[#C9A227]"}`}>
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-arabic text-xl shrink-0 ${isOpen ? "bg-[#C9A227] text-[#0E3B2E]" : done ? "bg-emerald-100 text-emerald-800" : "bg-[#F0E0BE] text-[#0E3B2E]"}`}>
                  {done && !isOpen ? <CheckCircle2 size={18} /> : pt.titleAr.slice(0, 1)}
                </span>
                <span className="flex-1 min-w-0">
                  <span className={`block text-sm font-bold truncate ${isOpen ? "text-white" : "text-[#0E3B2E]"}`}>{pt.titleEn}</span>
                  <span className={`block font-arabic text-sm truncate ${isOpen ? "text-[#F7ECC8]" : "text-[#8A948F]"}`}>{pt.titleAr}</span>
                </span>
                <LevelPill lvl={pt.lvl} small />
              </button>
            );
          })}
        </div>

        {/* detail */}
        <AnimatePresence mode="wait">
          {active && (
            <motion.div key={active.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-4">
              <div className="rounded-3xl overflow-hidden border border-[#EADFC3]">
                <div className="bg-[#0E3B2E] pattern-dark px-5 sm:px-7 py-6 text-white">
                  <div className="flex items-center gap-2 flex-wrap">
                    <LevelPill lvl={active.lvl} />
                    <span className="text-[11px] font-bold text-white/60 tracking-wide uppercase">Pattern {PATTERNS.indexOf(active) + 1} of {PATTERNS.length}</span>
                    {p.patternsDone.includes(active.id) && <span className="text-[11px] font-bold bg-emerald-400/20 text-emerald-200 px-2.5 py-1 rounded-full">✓ Complete</span>}
                    {p.quizBest[active.id] != null && <span className="text-[11px] font-bold bg-[#C9A227]/20 text-[#F7ECC8] px-2.5 py-1 rounded-full">Quiz best: {p.quizBest[active.id]}/5</span>}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold mt-3">{active.titleEn}</h3>
                  <div className="font-arabic text-3xl text-[#F7ECC8] mt-1">{active.titleAr}</div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="text-xs font-bold bg-white/12 px-3 py-1.5 rounded-full">EN: {active.templateEn}</span>
                    <span className="text-xs font-bold bg-[#C9A227] text-[#0E3B2E] px-3 py-1.5 rounded-full font-arabic text-sm">AR: {active.templateAr}</span>
                  </div>
                </div>

                <div className="bg-[#FFFDF7] p-5 sm:p-7">
                  <div className="flex gap-3 rounded-2xl bg-[#0E3B2E]/5 p-4">
                    <Lightbulb size={20} className="text-[#C9A227] shrink-0 mt-0.5" />
                    <p className="text-sm leading-relaxed text-[#1A1E1A]"><b>How it works:</b> {active.how}</p>
                  </div>

                  {/* builder */}
                  <div className="mt-5">
                    <div className="text-[11px] font-bold tracking-widest uppercase text-[#8A948F] mb-2">Pattern builder — tap the dice</div>
                    {(() => {
                      const s = buildSentence(active.id);
                      return (
                        <div className="rounded-2xl border-2 border-dashed border-[#C9A227] bg-[#F7ECC8]/30 p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div className="font-arabic text-3xl sm:text-4xl text-[#0E3B2E] leading-snug" dir="rtl">{s.ar}</div>
                            <div className="flex gap-2 shrink-0">
                              <SpeakBtn text={s.ar} />
                              <CopyBtn text={`${s.ar} (${s.tr}) — ${s.en}`} />
                            </div>
                          </div>
                          <div className="text-sm font-semibold text-[#4A5250] mt-2">{s.en}</div>
                          <div className="text-xs italic text-[#8A948F]">{s.tr}</div>
                          <div className="flex flex-wrap items-center gap-2 mt-4">
                            <span className="text-[11px] font-bold text-[#8A948F] uppercase tracking-wide">Swap in:</span>
                            {active.options.map((o, i) => (
                              <button key={i} onClick={() => setSlotIdx((m) => ({ ...m, [active.id]: i }))}
                                className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${(slotIdx[active.id] ?? 0) % active.options.length === i ? "bg-[#0E3B2E] text-white border-[#0E3B2E]" : "bg-white border-[#EADFC3] text-[#4A5250] hover:border-[#C9A227]"}`}>
                                {o.en}
                              </button>
                            ))}
                            <button
                              onClick={() => {
                                const n = Math.floor(Math.random() * active.options.length);
                                setSlotIdx((m) => ({ ...m, [active.id]: n }));
                              }}
                              className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full bg-[#C9A227] text-[#0E3B2E] hover:bg-[#D9B845]"
                            >
                              <Dices size={14} /> Surprise me — then tap <span className="inline-block w-4 h-4 rounded-full bg-[#0E3B2E] text-white text-[9px] leading-4 text-center align-middle">♪</span> to hear it
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* examples */}
                  <div className="mt-5">
                    <div className="text-[11px] font-bold tracking-widest uppercase text-[#8A948F] mb-2">Study these 6 examples</div>
                    <div className="space-y-2">
                      {active.examples.map((ex, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-xl border border-[#EADFC3] bg-white px-4 py-3 hover:border-[#C9A227] transition-colors">
                          <span className="w-6 h-6 rounded-full bg-[#0E3B2E]/8 text-[#0E3B2E] text-[11px] font-extrabold flex items-center justify-center shrink-0">{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-arabic text-xl text-[#0E3B2E] leading-relaxed" dir="rtl">{ex.ar}</div>
                            <div className="text-xs font-semibold text-[#4A5250]">{ex.en} <span className="text-[#8A948F] italic font-normal">· {ex.tr}</span></div>
                          </div>
                          <div className="flex gap-2 shrink-0 items-center">
                            <SpeakBtn text={ex.ar} size="sm" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-[13px] text-amber-900 leading-relaxed">
                    <b>Culture note:</b> {active.note}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-5">
                    <button
                      onClick={() => setQuizId(active.id)}
                      className="flex-1 min-w-[180px] inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-[#C9A227] text-[#0E3B2E] hover:bg-[#D9B845]"
                    >
                      <Trophy size={16} /> Take the 5-question quiz
                    </button>
                    <button
                      onClick={() => {
                        if (!p.patternsDone.includes(active.id)) { completePattern(active.id); addXP(20); }
                      }}
                      className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm border-2 ${p.patternsDone.includes(active.id) ? "border-emerald-600 text-emerald-700 bg-emerald-50" : "border-[#0E3B2E] text-[#0E3B2E] hover:bg-[#0E3B2E] hover:text-white"}`}
                    >
                      {p.patternsDone.includes(active.id) ? <><CheckCircle2 size={16} /> Done +20 XP</> : <>Mark complete (+20 XP)</>}
                    </button>
                  </div>
                </div>
              </div>

              {/* nav */}
              <div className="flex justify-between">
                {(() => {
                  const idx = PATTERNS.indexOf(active);
                  const prev = PATTERNS[idx - 1]; const next = PATTERNS[idx + 1];
                  return (<>
                    {prev ? <button onClick={() => setOpen(prev.id)} className="text-xs font-bold text-[#0E3B2E] hover:underline">← {prev.titleEn}</button> : <span />}
                    {next ? (
                      <button onClick={() => setOpen(next.id)} className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#0E3B2E] text-white px-4 py-2.5 rounded-full hover:bg-[#1B624C]">
                        Next: {next.titleEn} <ArrowRight size={14} />
                      </button>
                    ) : <span />}
                  </>);
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {quizId && <PatternQuizModal patternId={quizId} onClose={() => setQuizId(null)} />}
    </div>
  );
}

function PatternQuizModal({ patternId, onClose }: { patternId: string; onClose: () => void }) {
  const pat = PATTERNS.find((x) => x.id === patternId)!;
  const { addXP, recordQuiz, completePattern } = useStore();
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const questions = useMemo(() => {
    const pool = [...pat.examples];
    const qs = pool.slice(0, 5).map((ex, i) => {
      const correct = ex.ar;
      const distract = pat.examples.filter((e) => e.ar !== correct).slice(0, 2).map((e) => e.ar);
      const others = PATTERNS.flatMap((p) => p.examples.map((e) => e.ar)).filter((a) => a !== correct && !distract.includes(a));
      const opts = [correct, ...distract, others[i % others.length]].slice(0, 4);
      // shuffle deterministically-ish
      const order = [0, 1, 2, 3].sort((a, b) => ((a * 7 + i * 3) % 4) - ((b * 7 + i * 3) % 4));
      return { en: ex.en, tr: ex.tr, options: order.map((k) => opts[k]), answer: order.indexOf(0) };
    });
    return qs;
  }, [pat]);

  const q = questions[qi];

  const pick = (i: number) => {
    if (picked != null) return;
    setPicked(i);
    if (i === q.answer) setScore((s) => s + 1);
  };
  const next = () => {
    if (qi + 1 >= questions.length) {
      setDone(true);
      recordQuiz(patternId, score + (picked === q.answer ? 1 : 0));
      completePattern(patternId);
      addXP(10 + (score + (picked === q.answer ? 1 : 0)) * 4);
    } else { setQi(qi + 1); setPicked(null); }
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-[#0B2E24]/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ y: 60 }} animate={{ y: 0 }} className="relative w-full max-w-md bg-[#FDF8EF] rounded-t-3xl sm:rounded-3xl p-6">
        {!done ? (
          <>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-[#8A948F]">Question {qi + 1} / {questions.length} · {pat.titleEn}</span>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-black/5 text-lg">×</button>
            </div>
            <div className="flex gap-1.5 mb-4">{questions.map((_, i) => <div key={i} className={`h-1.5 flex-1 rounded-full ${i < qi ? "bg-emerald-500" : i === qi ? "bg-[#C9A227]" : "bg-black/10"}`} />)}</div>
            <div className="text-sm font-bold text-[#0E3B2E]">How do you say:</div>
            <div className="text-xl font-extrabold text-[#0E3B2E] mb-1">“{q.en}”</div>
            <div className="text-xs italic text-[#8A948F] mb-4">{q.tr}</div>
            <div className="space-y-2">
              {q.options.map((o, i) => {
                const isAns = i === q.answer;
                const isPick = i === picked;
                return (
                  <button key={i} onClick={() => pick(i)} disabled={picked != null}
                    className={`w-full text-right font-arabic text-2xl px-4 py-3 rounded-xl border-2 transition-all ${picked == null ? "border-[#EADFC3] bg-white hover:border-[#C9A227]" : isAns ? "border-emerald-500 bg-emerald-50" : isPick ? "border-rose-400 bg-rose-50" : "border-[#EADFC3] bg-white opacity-50"}`}>
                    {o}
                  </button>
                );
              })}
            </div>
            <button onClick={next} disabled={picked == null} className="mt-4 w-full py-3 rounded-xl font-bold text-sm bg-[#0E3B2E] text-white disabled:opacity-30 hover:bg-[#1B624C]">
              {qi + 1 >= questions.length ? "See results" : "Next →"}
            </button>
            {picked != null && (
              <div className={`mt-2 text-xs font-bold text-center ${picked === q.answer ? "text-emerald-700" : "text-rose-600"}`}>
                {picked === q.answer ? "✓ Sahh! Correct!" : "Not quite — the green one is correct."}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-4">
            <Trophy size={44} className="mx-auto text-[#C9A227]" />
            <h3 className="text-2xl font-extrabold text-[#0E3B2E] mt-3">{score + (picked === q.answer ? 1 : 0)} / {questions.length}</h3>
            <p className="text-sm text-[#4A5250] mt-1">{score + (picked === q.answer ? 1 : 0) >= 4 ? "Mumtaz! Excellent — pattern mastered." : score + (picked === q.answer ? 1 : 0) >= 3 ? "Good! Review the examples and retry for 5/5." : "Keep going — re-read the examples, then retry."}</p>
            <div className="flex gap-2 mt-5">
              <button onClick={() => { setQi(0); setPicked(null); setScore(0); setDone(false); }} className="flex-1 py-3 rounded-xl font-bold text-sm border-2 border-[#0E3B2E] text-[#0E3B2E] inline-flex items-center justify-center gap-2"><RotateCcw size={15} /> Retry</button>
              <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-sm bg-[#0E3B2E] text-white">Continue</button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
