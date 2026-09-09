import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Clock, ChevronLeft, Trophy, CheckCircle2, Type, Languages, ArrowRight, Sparkles } from "lucide-react";
import { STORIES } from "../data/stories";
import { useStore } from "../lib/store";
import { SectionHead, LevelPill, Toggle, AudioStatus, SpeakBtn } from "./ui";

export default function ReaderPage() {
  const { p, completeStory, recordStoryQuiz, addXP, setReading } = useStore();
  const [lvl, setLvl] = useState<0 | 1 | 2 | 3>(0);
  const [openId, setOpenId] = useState<string | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [paraIdx, setParaIdx] = useState(0);

  const list = useMemo(() => STORIES.filter((s) => lvl === 0 || s.lvl === lvl), [lvl]);
  const story = STORIES.find((s) => s.id === openId) ?? null;
  const fontSize = `${(1.9 * p.fontScale).toFixed(2)}rem`;

  if (!story) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-28 pt-6">
        <SectionHead
          kicker="Step 3 · Graded Readers"
          title="Read real Arabic stories"
          sub="Every story is fully voweled (with tashkeel), with transliteration and English you can toggle. Read offline anywhere — on a plane, in the desert, underground."
        />
        <div className="flex flex-wrap gap-2 mb-5">
          {[[0, "All 6 stories"], [1, "Level 1 · Starter"], [2, "Level 2 · Builder"], [3, "Level 3 · Reader"]].map(([v, lab]) => (
            <button key={lab as string} onClick={() => setLvl(v as 0 | 1 | 2 | 3)}
              className={`text-xs font-bold px-4 py-2 rounded-full border ${lvl === v ? "bg-[#0E3B2E] text-white border-[#0E3B2E]" : "bg-white text-[#4A5250] border-[#EADFC3]"}`}>
              {lab}
            </button>
          ))}
          <div className="ml-auto text-xs font-bold text-[#4A5250] self-center">{p.storiesRead.length} / {STORIES.length} finished</div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((s, i) => {
            const done = p.storiesRead.includes(s.id);
            const best = p.storyBest[s.id];
            return (
              <motion.button
                key={s.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                onClick={() => { setOpenId(s.id); setQuizOpen(false); setParaIdx(0); }}
                className="text-left rounded-3xl overflow-hidden border border-[#EADFC3] bg-white hover:shadow-xl hover:-translate-y-1 transition-all group"
              >
                <div className={`relative bg-gradient-to-br ${s.gradient} p-6 min-h-[150px] flex items-end overflow-hidden`}>
                  <span className="absolute -right-2 -top-6 font-arabic text-[110px] leading-none text-white/15 select-none">{s.glyph}</span>
                  <div className="absolute inset-0 pattern-dark" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <LevelPill lvl={s.lvl} small />
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white/80"><Clock size={12} /> {s.minutes} min</span>
                    </div>
                    <div className="font-arabic text-3xl text-white leading-tight">{s.titleAr}</div>
                    <div className="text-white font-bold">{s.titleEn}</div>
                  </div>
                  {done && <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#C9A227] text-[#0E3B2E] flex items-center justify-center"><CheckCircle2 size={18} /></span>}
                </div>
                <div className="p-4">
                  <p className="text-[13px] text-[#4A5250] leading-relaxed">{s.tagline}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs font-bold text-[#8A948F]">{s.paras.length} passages · {s.vocab.length} words{best != null ? ` · Quiz ${best}/${s.quiz.length}` : ""}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#0E3B2E] group-hover:gap-2 transition-all">Read <ArrowRight size={14} /></span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* how to read offline */}
        <div className="mt-8 rounded-2xl bg-[#0E3B2E] pattern-dark text-white p-6 sm:p-8 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
          <div className="w-12 h-12 rounded-2xl bg-[#C9A227] text-[#0E3B2E] flex items-center justify-center shrink-0"><BookOpen size={22} /></div>
          <div className="flex-1">
            <h3 className="font-extrabold text-lg">Offline reading, three layers</h3>
            <p className="text-sm text-white/70 mt-1 leading-relaxed">Every story carries <b className="text-white">Arabic with full vowels</b>, <b className="text-white">transliteration</b> for sounding out, and <b className="text-white">plain English</b>. Hide layers as you improve — like training wheels you remove yourself.</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs font-bold bg-white/12 px-3 py-2 rounded-full font-arabic text-sm">عَرَبِيَّة بِالتَّشْكِيل</span>
            <span className="text-xs font-bold bg-white/12 px-3 py-2 rounded-full italic">transliteration</span>
            <span className="text-xs font-bold bg-white/12 px-3 py-2 rounded-full">English</span>
          </div>
        </div>
      </div>
    );
  }

  const total = story.quiz.length;
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-28 pt-6">
      <button onClick={() => setOpenId(null)} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E3B2E] mb-4 hover:underline">
        <ChevronLeft size={15} /> All stories
      </button>

      <div className={`rounded-3xl overflow-hidden bg-gradient-to-br ${story.gradient} text-white p-6 sm:p-8 relative`}>
        <span className="absolute right-4 top-0 font-arabic text-[130px] leading-none text-white/15 select-none">{story.glyph}</span>
        <div className="absolute inset-0 pattern-dark" />
        <div className="relative">
          <div className="flex items-center gap-2 flex-wrap"><LevelPill lvl={story.lvl} small /><span className="text-[11px] font-bold text-white/75">{story.minutes} min read · {story.paras.length} passages</span></div>
          <h1 className="font-arabic text-4xl sm:text-5xl mt-3 leading-tight">{story.titleAr}</h1>
          <div className="text-xl font-extrabold">{story.titleEn}</div>
          <p className="text-white/75 text-sm mt-1">{story.tagline}</p>
          <div className="flex gap-2 mt-4 flex-wrap items-center">
            <span className="inline-flex items-center gap-2 text-xs font-bold bg-white text-[#0E3B2E] pl-1.5 pr-4 py-1.5 rounded-full hover:bg-[#F7ECC8]">
              <SpeakBtn text={story.paras.map((x) => x.ar).join(" ")} size="sm" /> Listen to whole story
            </span>
            {!p.storiesRead.includes(story.id) && <span className="inline-flex items-center text-[11px] font-bold bg-white/15 px-3 py-2 rounded-full">Finish + quiz = +30 XP</span>}
          </div>
        </div>
      </div>

      {/* reading controls */}
      <div className="mt-4"><AudioStatus /></div>
      <div className="paper-card rounded-2xl p-4 mt-3 flex flex-wrap items-center gap-x-5 gap-y-3">
        <Toggle on={p.showTr} onClick={() => setReading({ showTr: !p.showTr })} label="Transliteration" />
        <Toggle on={p.showEn} onClick={() => setReading({ showEn: !p.showEn })} label="English" />
        <div className="inline-flex items-center gap-2 text-xs font-bold text-[#4A5250]">
          <Type size={15} />
          <input type="range" min={0.85} max={1.35} step={0.05} value={p.fontScale} onChange={(e) => setReading({ fontScale: parseFloat(e.target.value) })} className="w-28 accent-[#0E3B2E]" />
          <span>Aa</span>
        </div>
        <span className="ml-auto text-[11px] font-bold text-[#8A948F] inline-flex items-center gap-1"><Languages size={13} /> Tap any passage to hear it</span>
      </div>

      {/* focus / full toggle */}
      <div className="flex gap-2 mt-4">
        <button onClick={() => setParaIdx(-1)} className={`text-xs font-bold px-4 py-2 rounded-full border ${paraIdx === -1 ? "bg-[#0E3B2E] text-white border-[#0E3B2E]" : "bg-white border-[#EADFC3] text-[#4A5250]"}`}>Full story</button>
        <button onClick={() => setParaIdx(0)} className={`text-xs font-bold px-4 py-2 rounded-full border ${paraIdx >= 0 ? "bg-[#0E3B2E] text-white border-[#0E3B2E]" : "bg-white border-[#EADFC3] text-[#4A5250]"}`}>Focus mode (one passage)</button>
      </div>

      <div className="mt-4 space-y-3">
        {(paraIdx === -1 ? story.paras.map((x, i) => ({ ...x, i })) : [{ ...story.paras[Math.max(0, paraIdx)], i: Math.max(0, paraIdx) }]).map((pg) => (
          <motion.article key={pg.i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="paper-card rounded-2xl p-5 sm:p-6 hover:border-[#C9A227] transition-colors group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold text-[#C9A227] tracking-widest">PASSAGE {pg.i + 1} / {story.paras.length}</span>
              <span className="inline-flex" onClick={(e) => e.stopPropagation()}>
                <SpeakBtn text={pg.ar} size="sm" />
              </span>
            </div>
            <p className="arabic-text text-[#0E3B2E] font-bold" dir="rtl" style={{ fontSize }}>{pg.ar}</p>
            {p.showTr && <p className="text-sm italic text-[#7A4A1E] mt-2">{pg.tr}</p>}
            {p.showEn && <p className="text-sm text-[#4A5250] mt-1 leading-relaxed">{pg.en}</p>}
          </motion.article>
        ))}
      </div>

      {paraIdx >= 0 && (
        <div className="flex items-center justify-between mt-4">
          <button disabled={paraIdx <= 0} onClick={() => setParaIdx(paraIdx - 1)} className="text-xs font-bold px-4 py-2.5 rounded-full border border-[#EADFC3] bg-white disabled:opacity-30">← Previous</button>
          <div className="flex gap-1.5">{story.paras.map((_, i) => <button key={i} onClick={() => setParaIdx(i)} className={`h-2 rounded-full transition-all ${i === paraIdx ? "w-8 bg-[#C9A227]" : "w-2 bg-black/15"}`} />)}</div>
          <button disabled={paraIdx >= story.paras.length - 1} onClick={() => setParaIdx(paraIdx + 1)} className="text-xs font-bold px-4 py-2.5 rounded-full bg-[#0E3B2E] text-white disabled:opacity-30">Next →</button>
        </div>
      )}

      {/* vocab */}
      <div className="mt-8">
        <h3 className="font-extrabold text-[#0E3B2E] flex items-center gap-2 mb-3"><Sparkles size={17} className="text-[#C9A227]" /> Key words from this story</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {story.vocab.map((v) => (
            <div key={v.ar} className="rounded-xl border border-[#EADFC3] bg-white p-3 text-center hover:border-[#C9A227] transition-colors">
              <div className="font-arabic text-2xl text-[#0E3B2E]">{v.ar}</div>
              <div className="text-xs font-bold text-[#4A5250]">{v.en}</div>
              <div className="text-[11px] italic text-[#8A948F]">{v.tr}</div>
              <div className="mt-2 flex justify-center"><SpeakBtn text={v.ar} size="sm" /></div>
            </div>
          ))}
        </div>
      </div>

      {/* quiz */}
      <div className="mt-8 rounded-3xl border border-[#EADFC3] overflow-hidden">
        <div className="bg-[#0E3B2E] pattern-dark px-5 py-4 text-white flex items-center justify-between">
          <h3 className="font-extrabold flex items-center gap-2"><Trophy size={17} className="text-[#C9A227]" /> Story quiz</h3>
          {p.storyBest[story.id] != null && <span className="text-xs font-bold bg-[#C9A227] text-[#0E3B2E] px-2.5 py-1 rounded-full">Best {p.storyBest[story.id]}/{total}</span>}
        </div>
        <div className="bg-[#FFFDF7] p-5">
          {!quizOpen ? (
            <button onClick={() => setQuizOpen(true)} className="w-full py-3.5 rounded-xl font-bold text-sm bg-[#C9A227] text-[#0E3B2E] hover:bg-[#D9B845]">Start {total}-question quiz (+30 XP)</button>
          ) : (
            <StoryQuiz storyId={story.id} onDone={(score) => {
              recordStoryQuiz(story.id, score, total);
              if (score >= 2 && !p.storiesRead.includes(story.id)) { completeStory(story.id); addXP(30); }
              else addXP(score * 5);
            }} />
          )}
        </div>
      </div>
    </div>
  );
}

function StoryQuiz({ storyId, onDone }: { storyId: string; onDone: (s: number) => void }) {
  const story = STORIES.find((s) => s.id === storyId)!;
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = story.quiz[qi];
  const finalScore = score + (picked === q?.answer ? 1 : 0);

  if (done) {
    return (
      <div className="text-center py-3">
        <div className="text-4xl font-extrabold text-[#0E3B2E]">{finalScore} / {story.quiz.length}</div>
        <p className="text-sm text-[#4A5250] mt-1">{finalScore === story.quiz.length ? "Perfect! You truly understood the story." : finalScore >= 2 ? "Well read! Story marked complete." : "Good try — re-read the passages and try again."}</p>
        <button onClick={() => { setQi(0); setPicked(null); setScore(0); setDone(false); }} className="mt-4 text-xs font-bold px-5 py-2.5 rounded-full border-2 border-[#0E3B2E] text-[#0E3B2E]">Retry quiz</button>
      </div>
    );
  }

  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.div key={qi} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <div className="text-xs font-bold text-[#8A948F] mb-1">Question {qi + 1} / {story.quiz.length}</div>
          <div className="font-bold text-[#0E3B2E] mb-3">{q.q}</div>
          <div className="space-y-2">
            {q.options.map((o, i) => (
              <button key={i} disabled={picked != null} onClick={() => { setPicked(i); if (i === q.answer) setScore((s) => s + 1); }}
                className={`w-full text-left text-sm font-semibold px-4 py-3 rounded-xl border-2 transition-all ${picked == null ? "border-[#EADFC3] bg-white hover:border-[#C9A227]" : i === q.answer ? "border-emerald-500 bg-emerald-50 text-emerald-900" : i === picked ? "border-rose-400 bg-rose-50" : "border-[#EADFC3] opacity-50"}`}>
                {o}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
      <button
        disabled={picked == null}
        onClick={() => {
          if (qi + 1 >= story.quiz.length) {
            onDone(score + (picked === q.answer ? 1 : 0));
            setDone(true);
          } else { setQi(qi + 1); setPicked(null); }
        }}
        className="mt-4 w-full py-3 rounded-xl font-bold text-sm bg-[#0E3B2E] text-white disabled:opacity-30"
      >
        {qi + 1 >= story.quiz.length ? "Finish" : "Next →"}
      </button>
    </div>
  );
}
