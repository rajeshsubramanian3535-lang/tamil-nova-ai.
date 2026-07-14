import { useState, useEffect } from "react";
import { 
  Sparkles, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  ExternalLink
} from "lucide-react";
import { Scenario } from "./types";
import ScenarioChips from "./components/ScenarioChips";
import TutorInterface from "./components/TutorInterface";

export default function App() {
  const [activeScenario, setActiveScenario] = useState<Scenario>("General");
  const [customScenarioText, setCustomScenarioText] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Sync dark mode class on document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleSound = () => {
    if (isMuted) {
      setIsMuted(false);
    } else {
      setIsMuted(true);
      // Cancel speech synthesis
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  return (
    <div id="main-layout" className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-16 overflow-hidden">
      
      {/* Ultra-modern Glowing Ambient Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-rose-400/10 dark:bg-rose-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Visual Accent Top Bar */}
      <div className="h-2 w-full bg-gradient-to-r from-indigo-500 via-purple-500 via-pink-500 via-rose-500 to-amber-500" />

      {/* Navigation & Branding Header */}
      <header className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
          <div className="flex items-center gap-4">
            {/* Custom Logo/Icon with Glowing Multi-color Gradient */}
            <div className="p-3.5 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 rounded-2xl text-white shadow-lg shadow-indigo-500/20 dark:shadow-none animate-pulse">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-900 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent font-sans">
                  TamilNova <span className="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">AI</span>
                </h1>
                <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
                  PRO
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold mt-0.5 tracking-tight">
                Vibrant Bilingual AI English Coach & Real-Time Speaking Tutor
              </p>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-2.5">
            {/* Iframe Breakout Button (Microphone feature helper) */}
            <a
              href={window.location.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black border border-slate-200 dark:border-slate-800 transition-all cursor-pointer shadow-sm hover:shadow backdrop-blur-md"
              title="Open app in a new tab to ensure microphone & speech permissions work flawlessly"
            >
              <span>New Tab (Full Voice)</span>
              <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
            </a>

            {/* Mute toggle */}
            <button
              onClick={toggleSound}
              className="p-2.5 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-500 dark:text-slate-400 rounded-xl transition-all cursor-pointer backdrop-blur-md shadow-sm"
              title={isMuted ? "Unmute Pronunciation TTS" : "Mute Pronunciation TTS"}
            >
              {isMuted ? <VolumeX className="w-4.5 h-4.5 text-rose-500" /> : <Volume2 className="w-4.5 h-4.5 text-indigo-500" />}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-500 dark:text-slate-400 rounded-xl transition-all cursor-pointer backdrop-blur-md shadow-sm"
              title="Toggle Dark/Light Mode"
            >
              {isDarkMode ? <Sun className="w-4.5 h-4.5 text-amber-500" /> : <Moon className="w-4.5 h-4.5 text-purple-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-8 z-10">
        {/* Step 1: Scenario Selector */}
        <section id="scenarios-board" className="bg-white/80 dark:bg-slate-900/40 p-5 rounded-3xl border border-slate-200/60 dark:border-slate-800/40 shadow-xl backdrop-blur-md">
          <ScenarioChips 
            selected={activeScenario} 
            onSelect={setActiveScenario} 
            customText={customScenarioText}
            onCustomTextChange={setCustomScenarioText}
          />
        </section>

        {/* Step 2: Main Immersive Workspace */}
        <section id="workspace-container" className="max-w-4xl mx-auto w-full">
          <TutorInterface 
            scenario={activeScenario} 
            isMuted={isMuted}
            customScenarioText={customScenarioText}
          />
        </section>
      </main>

      {/* Decorative Footer */}
      <footer className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-200/60 dark:border-slate-800/60 text-center z-10">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-extrabold tracking-widest uppercase">
          TamilNova AI • Powered by Gemini & Web Speech API
        </p>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium leading-relaxed">
          Designed as a gorgeous, high-fidelity language coaching environment. Speak, translate, and master English.
        </p>
      </footer>
    </div>
  );
}
