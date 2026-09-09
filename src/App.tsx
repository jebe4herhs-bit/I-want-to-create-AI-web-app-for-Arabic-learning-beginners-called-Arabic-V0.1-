import { useEffect } from "react";
import { HashRouter, Routes, Route, NavLink, Link, useLocation } from "react-router-dom";
import {
  Shapes, MessagesSquare, BookOpen, Layers, HeartHandshake, Library,
  Flame, Star, WifiOff, Home as HomeIcon, Sparkles,
} from "lucide-react";
import { StoreProvider, useStore, useOnline, useServiceWorker, levelOf } from "./lib/store";
import { HomePage, LibraryPage } from "./components/Home";
import AlphabetPage from "./components/Alphabet";
import PatternsPage from "./components/Patterns";
import ReaderPage from "./components/Reader";
import VocabPage from "./components/Vocab";
import PhrasesPage from "./components/Phrases";

const TABS = [
  { to: "/", label: "Home", icon: HomeIcon, end: true },
  { to: "/alphabet", label: "Letters", ar: "حروف", icon: Shapes, end: false },
  { to: "/patterns", label: "Patterns", ar: "جمل", icon: MessagesSquare, end: false },
  { to: "/read", label: "Stories", ar: "قصص", icon: BookOpen, end: false },
  { to: "/words", label: "Words", ar: "كلمات", icon: Layers, end: false },
  { to: "/phrases", label: "Phrases", ar: "عبارات", icon: HeartHandshake, end: false },
];

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0 }); }, [pathname]);
  return null;
}

function Shell() {
  const { p } = useStore();
  const online = useOnline();
  useServiceWorker();
  const { lvl } = levelOf(p.xp);

  return (
    <div className="min-h-screen bg-[#FDF8EF]">
      {/* top bar */}
      <header className="sticky top-0 z-40 bg-[#0B2E24]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-xl bg-[#C9A227] text-[#0E3B2E] font-arabic text-2xl flex items-center justify-center font-bold shadow">ك</span>
            <span className="leading-tight">
              <span className="block font-extrabold text-white tracking-tight">Kalima <span className="font-arabic font-normal text-[#F7ECC8]">كَلِمَة</span></span>
              <span className="block text-[10px] font-bold tracking-[0.2em] uppercase text-white/50">Arabic for beginners</span>
            </span>
          </Link>
          <nav className="hidden lg:flex items-center gap-1 ml-6">
            {TABS.slice(1).concat([{ to: "/library", label: "Library", ar: "مكتبة", icon: Library, end: false }]).map((t) => (
              <NavLink key={t.to} to={t.to}
                className={({ isActive }) => `text-[13px] font-bold px-3.5 py-2 rounded-full transition-colors ${isActive ? "bg-[#C9A227] text-[#0E3B2E]" : "text-white/70 hover:text-white hover:bg-white/10"}`}>
                {t.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            {!online && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-amber-400/15 text-amber-200 px-3 py-1.5 rounded-full">
                <WifiOff size={13} /> Offline
              </span>
            )}
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold bg-white/10 text-white px-3 py-1.5 rounded-full">
              <Flame size={13} className="text-[#E8933C]" /> {p.streak}d
            </span>
            <Link to="/library" className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-[#C9A227] text-[#0E3B2E] px-3 py-1.5 rounded-full hover:bg-[#D9B845]">
              <Star size={13} /> Lv{lvl} · {p.xp} XP
            </Link>
          </div>
        </div>
        {!online && (
          <div className="bg-[#C9A227] text-[#0E3B2E] text-center text-[11px] font-bold py-1 px-4">
            You're offline — great news: every lesson, story and word below still works.
          </div>
        )}
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/alphabet" element={<AlphabetPage />} />
          <Route path="/patterns" element={<PatternsPage />} />
          <Route path="/read" element={<ReaderPage />} />
          <Route path="/words" element={<VocabPage />} />
          <Route path="/phrases" element={<PhrasesPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {/* footer (desktop) */}
      <footer className="hidden md:block border-t border-[#EADFC3] bg-[#FFFDF7] pb-24 lg:pb-8">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-wrap gap-6 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-[#0E3B2E] text-[#F7ECC8] font-arabic text-xl flex items-center justify-center">ك</span>
            <div className="text-xs text-[#4A5250] font-semibold">Kalima — offline-first Arabic for beginners.<br />All lessons bundled · progress stays on your device.</div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-[#4A5250]">
            <Sparkles size={14} className="text-[#C9A227]" /> Made for curious beginners · works in airplane mode
          </div>
        </div>
      </footer>

      {/* bottom nav (mobile + tablet) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0B2E24]/97 backdrop-blur border-t border-white/10" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="grid grid-cols-7 px-1">
          {TABS.concat([{ to: "/library", label: "Library", ar: "مكتبة", icon: Library, end: false }]).map((t) => {
            const Icon = t.icon;
            return (
              <NavLink key={t.to} to={t.to} end={t.end}
                className={({ isActive }) => `flex flex-col items-center gap-0.5 py-2 rounded-lg transition-colors ${isActive ? "text-[#C9A227]" : "text-white/55"}`}>
                <Icon size={20} />
                <span className="text-[9px] font-bold leading-none">{t.label}</span>
                <span className="font-arabic text-[9px] leading-none opacity-70">{t.ar}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <ScrollTop />
        <Shell />
      </HashRouter>
    </StoreProvider>
  );
}
