import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronRight, Grid3X3, Rows3, Check, Sparkles, Ear } from "lucide-react";
import { LETTERS } from "../data/curriculum";
import { useStore, useSpeech } from "../lib/store";
import { SpeakBtn, SectionHead, AudioStatus } from "./ui";

const GROUPS = [
  { id: "all", label: "All 28", ar: "الكُل" },
  { id: "boat", label: "Boat family ب ت ث ن ي", ar: "عائلة" },
  { id: "hook", label: "Hooks ج ح خ", ar: "خطّاف" },
  { id: "non", label: "Non-connectors ا د ذ ر ز و", ar: "منفصلة" },
  { id: "deep", label: "Deep sounds ص ض ط ظ ع غ ق", ar: "مفخّمة" },
];
function groupOf(a: string, connector: boolean) {
  if (["ا", "د", "ذ", "ر", "ز", "و"].includes(a)) return "non";
  if (["ب", "ت", "ث", "ن", "ي"].includes(a)) return "boat";
  if (["ج", "ح", "خ"].includes(a)) return "hook";
  if (["ص", "ض", "ط", "ظ", "ع", "غ", "ق"].includes(a)) return "deep";
  return "all";
}

export default function AlphabetPage() {
  const { p, toggleLetter, addXP } = useStore();
  const { speak, engine } = useSpeech();
  const [q, setQ] = useState("");
  const [group, setGroup] = useState("all");
  const [compact, setCompact] = useState(false);
  const [sel, setSel] = useState<string | null>(null);

  const list = useMemo(() => LETTERS.filter((l) => {
    if (group !== "all" && groupOf(l.a, l.connector) !== group) return false;
    if (!q) return true;
    const s = q.toLowerCase();
    return l.name.includes(q) || l.trans.includes(s) || l.sound.includes(s) || l.example.en.includes(s);
  }), [q, group]);

  const selected = LETTERS.find((l) => l.a === sel) ?? null;
  const seenCount = p.lettersSeen.length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-28 pt-6">
      <SectionHead
        kicker="Step 1 · The Alphabet"
        title="Meet the 28 letters"
        sub="Tap any letter to hear it, see its four shapes, and learn its story. Letters are read right-to-left. Mark each as learned — your progress saves offline."
      />

      <div className="mb-5"><AudioStatus /></div>

      {/* progress + controls */}
      <div className="paper-card rounded-2xl p-4 sm:p-5 mb-5">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#0E3B2E] text-[#F7ECC8] font-arabic text-2xl flex items-center justify-center">ب</div>
            <div>
              <div className="text-sm font-bold text-[#0E3B2E]">{seenCount} of 28 letters learned</div>
              <div className="w-44 sm:w-56 h-2 rounded-full bg-[#F0E0BE] mt-1.5 overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-[#0E3B2E] to-[#C9A227]" animate={{ width: `${(seenCount / 28) * 100}%` }} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCompact(!compact)} className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-full bg-black/5 hover:bg-black/10 text-[#0E3B2E]">
              {compact ? <Grid3X3 size={14} /> : <Rows3 size={14} />} {compact ? "Cards" : "Compact"}
            </button>
            <button
              onClick={() => { speak("أ ب ت ث", "ar"); }}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-full bg-[#0E3B2E] text-white hover:bg-[#1B624C]"
              title={engine === "arabic-voice" ? "Arabic voice ready" : "Online audio, then cached"}
            >
              <Ear size={14} /> Hear A–B–C
            </button>
          </div>
        </div>
        <div className="relative mt-4">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A948F]" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search: lion, baa, throat… or paste ا ب ت"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EADFC3] bg-white text-sm outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30"
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {GROUPS.map((g) => (
            <button key={g.id} onClick={() => setGroup(g.id)}
              className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${group === g.id ? "bg-[#0E3B2E] text-white border-[#0E3B2E]" : "bg-white text-[#4A5250] border-[#EADFC3] hover:border-[#C9A227]"}`}>
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* grid */}
      <div className={compact ? "grid grid-cols-4 sm:grid-cols-7 gap-2" : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"}>
        {list.map((l, i) => {
          const seen = p.lettersSeen.includes(l.a);
          return (
            <motion.button
              key={l.a} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.02, 0.4) }}
              onClick={() => setSel(l.a)}
              className={`relative text-left rounded-2xl border transition-all hover:-translate-y-0.5 hover:shadow-lg ${seen ? "bg-[#0E3B2E] text-white border-[#0E3B2E]" : "paper-card hover:border-[#C9A227]"} ${compact ? "p-2.5 flex flex-col items-center" : "p-4"}`}
            >
              {seen && <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#C9A227] text-[#0E3B2E] flex items-center justify-center"><Check size={12} strokeWidth={3} /></span>}
              <div className={`font-arabic leading-none ${compact ? "text-3xl" : "text-5xl mb-1"}`}>{l.a}</div>
              {!compact && (
                <>
                  <div className={`font-arabic text-lg ${seen ? "text-[#F7ECC8]" : "text-[#0E3B2E]"}`}>{l.name}</div>
                  <div className={`text-[11px] font-semibold ${seen ? "text-white/60" : "text-[#8A948F]"}`}>{l.trans} · {l.sound.split(" ").slice(0, 4).join(" ")}</div>
                </>
              )}
              {compact && <div className={`text-[10px] font-bold ${seen ? "text-white/60" : "text-[#8A948F]"}`}>{l.trans}</div>}
            </motion.button>
          );
        })}
      </div>
      {list.length === 0 && <div className="text-center text-sm text-[#8A948F] py-10">No letters match “{q}”. Try “sun” or “sh”.</div>}

      {/* connecting demo */}
      <div className="mt-8 paper-card rounded-2xl p-5 sm:p-6">
        <h3 className="font-extrabold text-[#0E3B2E] flex items-center gap-2"><Sparkles size={17} className="text-[#C9A227]" /> Why do letters change shape?</h3>
        <p className="text-sm text-[#4A5250] mt-2 leading-relaxed">
          Arabic joins letters inside a word, like cursive handwriting. Each letter has up to four shapes — alone, at the start, in the middle, at the end.
          Six rebels (<span className="font-arabic text-base">ا د ذ ر ز و</span>) never hold the next letter's hand, which is why you see gaps inside words like <span className="font-arabic text-base">دَار</span> (house).
        </p>
        <div className="mt-4 flex items-center justify-center gap-1 sm:gap-2 flex-wrap" dir="rtl">
          {["م", "د", "ر", "س", "ة"].map((c, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#0E3B2E] text-white font-arabic text-3xl flex items-center justify-center">{c}</div>
              <div className="text-[10px] font-bold text-[#8A948F] mt-1">{["m", "d", "r", "s", "a"][i]}</div>
            </div>
          ))}
          <ChevronRight size={18} className="rotate-180 text-[#C9A227] mx-1" />
          <div className="px-5 py-3 rounded-xl bg-[#C9A227]/15 border-2 border-dashed border-[#C9A227]">
            <div className="font-arabic text-4xl text-[#0E3B2E]">مَدْرَسَة</div>
            <div className="text-[11px] font-bold text-[#7A4A1E] text-center">ma-dra-sa = school</div>
          </div>
        </div>
      </div>

      {/* detail sheet */}
      <AnimatePresence>
        {selected && (
          <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-[#0B2E24]/70 backdrop-blur-sm" onClick={() => setSel(null)} />
            <motion.div
              initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#FDF8EF] rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[92vh] overflow-y-auto"
            >
              <div className="bg-[#0E3B2E] pattern-dark px-6 pt-6 pb-5 text-white relative">
                <button onClick={() => setSel(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-lg">×</button>
                <div className="flex items-start gap-5">
                  <div className="w-24 h-24 rounded-2xl bg-[#C9A227] text-[#0E3B2E] font-arabic text-6xl flex items-center justify-center shrink-0 shadow-lg">{selected.a}</div>
                  <div className="flex-1">
                    <div className="font-arabic text-3xl leading-tight">{selected.name}</div>
                    <div className="text-white/70 text-sm font-semibold">{selected.trans} · “{selected.sound}”</div>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <span onClick={() => speak(selected.a === "ا" ? "ألف" : selected.example.ar, "ar")} className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold bg-white text-[#0E3B2E] px-3.5 py-2 rounded-full hover:bg-[#F7ECC8]">
                        <SpeakBtn text={selected.a === "ا" ? "ألف" : selected.a} size="sm" /> Hear letter
                      </span>
                      <span onClick={() => speak(selected.example.ar, "ar")} className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold bg-white/15 text-white px-3.5 py-2 rounded-full hover:bg-white/25">
                        <SpeakBtn text={selected.example.ar} size="sm" dark /> Hear word
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <div className="text-[11px] font-bold tracking-widest uppercase text-[#8A948F] mb-2">Four shapes (right → left)</div>
                  <div className="grid grid-cols-4 gap-2" dir="rtl">
                    {[["Alone", selected.forms.iso], ["Start", selected.forms.ini], ["Middle", selected.forms.med], ["End", selected.forms.fin]].map(([lab, f]) => (
                      <div key={lab} className="rounded-xl border border-[#EADFC3] bg-white p-2 text-center">
                        <div className="font-arabic text-3xl text-[#0E3B2E]">{f}</div>
                        <div className="text-[10px] font-bold text-[#8A948F]">{lab}</div>
                      </div>
                    ))}
                  </div>
                  {!selected.connector && <div className="mt-2 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">Non-connector — it never joins the letter after it. Expect a gap!</div>}
                </div>
                <div className="rounded-xl bg-[#0E3B2E]/5 p-4">
                  <div className="text-[11px] font-bold tracking-widest uppercase text-[#8A948F]">How to say it</div>
                  <p className="text-sm text-[#1A1E1A] mt-1 leading-relaxed">{selected.tip}</p>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-[#EADFC3] bg-white p-4">
                  <div>
                    <div className="text-[11px] font-bold tracking-widest uppercase text-[#8A948F]">Example word</div>
                    <div className="font-arabic text-3xl text-[#0E3B2E] mt-1">{selected.example.ar}</div>
                    <div className="text-sm font-semibold text-[#4A5250]">{selected.example.en} · <span className="italic">{selected.example.tr}</span></div>
                  </div>
                  <SpeakBtn text={selected.example.ar} />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const was = p.lettersSeen.includes(selected.a);
                      toggleLetter(selected.a);
                      if (!was) addXP(5);
                      const idx = LETTERS.findIndex((l) => l.a === selected.a);
                      const next = LETTERS[(idx + 1) % LETTERS.length];
                      setSel(next.a);
                    }}
                    className="flex-1 py-3 rounded-xl font-bold text-sm bg-[#0E3B2E] text-white hover:bg-[#1B624C]"
                  >
                    {p.lettersSeen.includes(selected.a) ? "Learned ✓ — next letter →" : "Mark learned (+5 XP) →"}
                  </button>
                  <Link to="/patterns" className="px-4 py-3 rounded-xl font-bold text-sm border-2 border-[#0E3B2E] text-[#0E3B2E]">Patterns</Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
