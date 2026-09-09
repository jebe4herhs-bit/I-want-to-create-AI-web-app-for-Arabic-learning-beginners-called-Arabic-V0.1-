import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Briefcase, HeartHandshake, Plane, UtensilsCrossed, Users } from "lucide-react";
import { PHRASES } from "../data/curriculum";
import { SectionHead, CopyBtn, SpeakBtn, AudioStatus } from "./ui";

const TAGS = ["All", "Help", "Shop", "Travel", "Food", "Social"];
const TAG_ICON: Record<string, React.ReactNode> = {
  Help: <HeartHandshake size={15} />, Shop: <Briefcase size={15} />, Travel: <Plane size={15} />, Food: <UtensilsCrossed size={15} />, Social: <Users size={15} />,
};

export default function PhrasesPage() {
  const [tag, setTag] = useState("All");
  const [q, setQ] = useState("");

  const list = useMemo(() => PHRASES.filter((x) => {
    if (tag !== "All" && x.tag !== tag) return false;
    if (!q) return true;
    const s = q.toLowerCase();
    return x.en.toLowerCase().includes(s) || x.tr.toLowerCase().includes(s) || x.ar.includes(q);
  }), [tag, q]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-28 pt-6">
      <SectionHead
        kicker="Step 5 · Survival Phrases"
        title="Say it when it matters"
        sub="24 phrases for emergencies, souqs, taxis and dinner tables. Big text for showing your phone to someone — works with zero signal."
      />
      <div className="mb-5"><AudioStatus /></div>
      <div className="paper-card rounded-2xl p-4 mb-5">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A948F]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search: bathroom, bill, doctor…"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EADFC3] bg-white text-sm outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30" />
        </div>
        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
          {TAGS.map((t) => (
            <button key={t} onClick={() => setTag(t)}
              className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full border ${tag === t ? "bg-[#0E3B2E] text-white border-[#0E3B2E]" : "bg-white border-[#EADFC3] text-[#4A5250]"}`}>
              {t !== "All" && TAG_ICON[t]} {t}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {list.map((ph, i) => (
          <motion.div key={`${ph.tag}-${i}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.03, 0.3) }}
            className="paper-card rounded-2xl p-5 hover:border-[#C9A227] transition-colors">
            <div className="flex items-start justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#7A4A1E] bg-[#F7ECC8] px-2.5 py-1 rounded-full">
                {TAG_ICON[ph.tag]} {ph.tag}
              </span>
              <div className="flex gap-2 items-center">
                <CopyBtn text={`${ph.ar} (${ph.tr}) — ${ph.en}`} />
                <SpeakBtn text={ph.ar} size="sm" />
              </div>
            </div>
            <div className="font-arabic text-3xl sm:text-4xl text-[#0E3B2E] mt-2 leading-snug" dir="rtl">{ph.ar}</div>
            <div className="font-bold text-[#1A1E1A] mt-1.5">{ph.en}</div>
            <div className="text-[13px] italic text-[#8A948F]">{ph.tr}</div>
          </motion.div>
        ))}
      </div>
      {list.length === 0 && <div className="text-center text-sm text-[#8A948F] py-10">No phrases match “{q}”.</div>}

      <div className="mt-8 rounded-2xl bg-[#C74824] text-white p-6 text-center">
        <div className="font-arabic text-4xl">النَّجْدَة!</div>
        <div className="font-extrabold mt-1">Help! — an-najda!</div>
        <p className="text-sm text-white/80 mt-2 max-w-md mx-auto">If you remember one emergency phrase, make it this one. Tap any card's Play button and hold the phone up — sound needs no signal.</p>
      </div>
    </div>
  );
}
