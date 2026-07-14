import React from "react";
import { 
  GripVertical, 
  ArrowUpDown, 
  ArrowLeftRight, 
  Mic, 
  MicOff, 
  Sparkles, 
  Send, 
  Volume2, 
  Globe 
} from "lucide-react";
import { FEMALE_VOICES, MALE_VOICES } from "./TutorInterface";

interface InputPanelProps {
  index: number;
  isOverIndex: number | null;
  handleDragStart: (index: number) => void;
  handleDragOver: (e: React.DragEvent, index: number) => void;
  handleDragLeave: () => void;
  handleDrop: (index: number) => void;
  swapPositions: () => void;
  fromLanguage: "Tamil" | "Telugu" | "Hindi" | "Malayalam" | "English";
  setFromLanguage: (lang: "Tamil" | "Telugu" | "Hindi" | "Malayalam" | "English") => void;
  toLanguage: "Tamil" | "Telugu" | "Hindi" | "Malayalam" | "English";
  setToLanguage: (lang: "Tamil" | "Telugu" | "Hindi" | "Malayalam" | "English") => void;
  isListening: boolean;
  toggleListening: () => void;
  handleAutoStart: () => void;
  inputText: string;
  setInputText: (text: string) => void;
  handleSend: () => void;
  isLoading: boolean;
  accent: "American" | "British" | "Australian" | "Indian";
  setAccent: (acc: "American" | "British" | "Australian" | "Indian") => void;
  voiceGender: "Female" | "Male";
  setVoiceGender: (gender: "Female" | "Male") => void;
  selectedFemaleVoiceId: string;
  setSelectedFemaleVoiceId: (id: string) => void;
  selectedMaleVoiceId: string;
  setSelectedMaleVoiceId: (id: string) => void;
  currentScenarioConfig: any;
  playVoicePreview?: (voiceId: string, gender: "Female" | "Male", selectedAccent: "American" | "British" | "Australian" | "Indian") => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  index,
  isOverIndex,
  handleDragStart,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  swapPositions,
  fromLanguage,
  setFromLanguage,
  toLanguage,
  setToLanguage,
  isListening,
  toggleListening,
  handleAutoStart,
  inputText,
  setInputText,
  handleSend,
  isLoading,
  accent,
  setAccent,
  voiceGender,
  setVoiceGender,
  selectedFemaleVoiceId,
  setSelectedFemaleVoiceId,
  selectedMaleVoiceId,
  setSelectedMaleVoiceId,
  currentScenarioConfig,
  playVoicePreview
}) => {
  const isOver = isOverIndex === index;

  // Memoize voices belonging strictly to the selected accent
  const accentVoices = React.useMemo(() => {
    const females = FEMALE_VOICES.filter(v => v.accent === accent).map(v => ({ ...v, gender: "Female" as const }));
    const males = MALE_VOICES.filter(v => v.accent === accent).map(v => ({ ...v, gender: "Male" as const }));
    return [...females, ...males];
  }, [accent]);

  const activeVoiceId = voiceGender === "Female" ? selectedFemaleVoiceId : selectedMaleVoiceId;

  // Sync selected voice if it doesn't belong to the active accent list (e.g., when accent changes)
  React.useEffect(() => {
    if (accentVoices.length > 0) {
      const exists = accentVoices.some(v => v.id === activeVoiceId);
      if (!exists) {
        const firstVoice = accentVoices[0];
        if (firstVoice.gender === "Female") {
          setVoiceGender("Female");
          setSelectedFemaleVoiceId(firstVoice.id);
        } else {
          setVoiceGender("Male");
          setSelectedMaleVoiceId(firstVoice.id);
        }
      }
    }
  }, [accentVoices, activeVoiceId, setVoiceGender, setSelectedFemaleVoiceId, setSelectedMaleVoiceId]);

  return (
    <div
      draggable
      onDragStart={() => handleDragStart(index)}
      onDragOver={(e) => handleDragOver(e, index)}
      onDragLeave={handleDragLeave}
      onDrop={() => handleDrop(index)}
      className={`bg-white dark:bg-slate-900 rounded-2xl border-2 p-5 shadow-md transition-all duration-300 relative group text-left ${
        isOver
          ? "border-indigo-500 ring-4 ring-indigo-500/10 scale-[1.01] shadow-xl bg-indigo-50/5 dark:bg-indigo-950/5"
          : "border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700/80 hover:shadow-lg"
      }`}
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center gap-2">
          <div 
            className="p-1 text-slate-400 hover:text-indigo-500 rounded cursor-grab active:cursor-grabbing transition-colors" 
            title="Drag and drop to rearrange panels"
          >
            <GripVertical className="w-5 h-5" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            1. Language, Accent & Coach Voice Panel
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={swapPositions}
            className="p-1.5 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
            title="Swap Panel Positions"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Row 1: Translation Directions Dropdowns */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
        <div className="w-full sm:flex-1">
          <div className="flex items-center gap-2 bg-indigo-50/50 dark:bg-indigo-950/20 px-3.5 py-2.5 rounded-2xl border border-indigo-100/30 dark:border-indigo-900/30 w-full">
            <span className="text-[10px] font-black text-indigo-500 select-none uppercase tracking-widest">1. From:</span>
            <select
              value={fromLanguage}
              onChange={(e) => setFromLanguage(e.target.value as any)}
              className="bg-transparent text-xs text-slate-800 dark:text-slate-100 font-black focus:outline-none cursor-pointer w-full"
            >
              <option value="Tamil">Tamil 🇮🇳</option>
              <option value="Telugu">Telugu 🇮🇳</option>
              <option value="Hindi">Hindi 🇮🇳</option>
              <option value="Malayalam">Malayalam 🇮🇳</option>
              <option value="English">English 🇺🇸</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            const prevFrom = fromLanguage;
            setFromLanguage(toLanguage);
            setToLanguage(prevFrom);
          }}
          className={`p-2.5 bg-slate-100 hover:bg-gradient-to-r ${currentScenarioConfig.gradient} hover:text-white dark:bg-slate-800 dark:hover:text-white text-slate-500 rounded-xl border border-slate-200 dark:border-slate-700 transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-sm hover:scale-105 active:scale-95`}
          title="Swap Practice Direction"
        >
          <ArrowLeftRight className="w-4 h-4" />
        </button>

        <div className="w-full sm:flex-1">
          <div className="flex items-center gap-2 bg-emerald-50/50 dark:bg-emerald-950/20 px-3.5 py-2.5 rounded-2xl border border-emerald-100/30 dark:border-emerald-900/30 w-full">
            <span className="text-[10px] font-black text-emerald-500 select-none uppercase tracking-widest">2. To:</span>
            <select
              value={toLanguage}
              onChange={(e) => setToLanguage(e.target.value as any)}
              className="bg-transparent text-xs text-slate-800 dark:text-slate-100 font-black focus:outline-none cursor-pointer w-full"
            >
              <option value="Tamil">Tamil 🇮🇳</option>
              <option value="Telugu">Telugu 🇮🇳</option>
              <option value="Hindi">Hindi 🇮🇳</option>
              <option value="Malayalam">Malayalam 🇮🇳</option>
              <option value="English">English 🇺🇸</option>
            </select>
          </div>
        </div>
      </div>

      {/* Row 2: Accent Selection & Custom Voices option list */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
        {/* Accent Selector (3) */}
        <div className="w-full sm:flex-1">
          <div className="flex items-center gap-2 bg-amber-50/50 dark:bg-amber-950/20 px-3.5 py-2.5 rounded-2xl border border-amber-100/30 dark:border-amber-900/30 w-full">
            <Globe className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-[10px] font-black text-amber-500 select-none uppercase tracking-widest shrink-0">3. Accent:</span>
            <select
              value={accent}
              onChange={(e) => setAccent(e.target.value as any)}
              className="bg-transparent text-xs text-slate-800 dark:text-slate-100 font-black focus:outline-none cursor-pointer w-full"
            >
              <option value="American">US American 🇺🇸</option>
              <option value="British">British 🇬🇧</option>
              <option value="Australian">Australian 🇦🇺</option>
              <option value="Indian">Indian 🇮🇳</option>
            </select>
          </div>
        </div>

        {/* Combined Custom Accent Voices List (4) */}
        <div className="w-full sm:flex-1">
          <div className="flex items-center gap-2 bg-indigo-50/50 dark:bg-indigo-950/20 px-3.5 py-2.5 rounded-2xl border border-indigo-100/30 dark:border-indigo-900/30 w-full">
            <Volume2 className="w-4 h-4 text-indigo-500 shrink-0" />
            <span className="text-[10px] font-black text-indigo-500 select-none uppercase tracking-widest shrink-0">4. Voices:</span>
            <select
              value={activeVoiceId}
              onChange={(e) => {
                const val = e.target.value;
                const found = accentVoices.find(v => v.id === val);
                if (found) {
                  if (found.gender === "Female") {
                    setVoiceGender("Female");
                    setSelectedFemaleVoiceId(val);
                  } else {
                    setVoiceGender("Male");
                    setSelectedMaleVoiceId(val);
                  }
                  if (playVoicePreview) {
                    playVoicePreview(val, found.gender, accent);
                  }
                }
              }}
              className="bg-transparent text-xs text-slate-800 dark:text-slate-100 font-black focus:outline-none cursor-pointer w-full"
            >
              {accentVoices.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.gender === "Female" ? "👩" : "👨"} {v.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Voice Description Indicator (highly descriptive/humanic) */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850/80">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold italic leading-tight">
            Active Voice Persona: {accentVoices.find(v => v.id === activeVoiceId)?.description || "Clear standard coach voice profile"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            const found = accentVoices.find(v => v.id === activeVoiceId);
            if (found && playVoicePreview) {
              playVoicePreview(activeVoiceId, found.gender, accent);
            }
          }}
          className="flex items-center gap-1.5 text-[11px] font-black px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100/80 dark:bg-indigo-950/30 dark:hover:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100/30 dark:border-indigo-900/30 cursor-pointer shadow-sm active:scale-95 transition-all"
          title="Play Voice Sample Preview"
        >
          <Volume2 className="w-3.5 h-3.5 text-indigo-500 animate-pulse shrink-0" />
          <span>Play Sample 🔊</span>
        </button>
      </div>

      {/* Row 3: Coaching inputs (Start Mic, Auto-Start Phrase, text input row - ONE step below!) */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          {/* Start Microphone Toggle Button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`flex-1 md:flex-initial px-4.5 py-3 rounded-2xl border transition-all duration-300 flex items-center gap-2 justify-center cursor-pointer select-none font-bold text-sm ${
              isListening
                ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/20 border-transparent animate-pulse scale-[1.03]"
                : "text-slate-600 hover:text-indigo-600 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-950/80 border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-400"
            }`}
            title={isListening ? "Stop & Send" : `Click to Speak ${fromLanguage}`}
          >
            {isListening ? (
              <>
                <MicOff className="w-4.5 h-4.5 animate-bounce" />
                <span className="text-xs font-black uppercase tracking-widest">Stop Mic</span>
              </>
            ) : (
              <>
                <Mic className="w-4.5 h-4.5 text-indigo-500" />
                <span className="text-xs font-black uppercase tracking-widest">Start Mic</span>
              </>
            )}
          </button>

          {/* Random Auto-Start Tamil Phrase generator */}
          <button
            type="button"
            onClick={handleAutoStart}
            className={`flex-1 md:flex-initial px-4.5 py-3 bg-gradient-to-r ${currentScenarioConfig.gradient} hover:opacity-90 text-white font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${currentScenarioConfig.glow} hover:scale-102 active:scale-98`}
            title={`Roll a random native ${fromLanguage} phrase and auto-translate`}
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span className="uppercase tracking-widest">🎲 Auto-Start Phrase</span>
          </button>
        </div>

        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isListening 
                ? `Listening... Speak ${fromLanguage} now. Tap Stop or Send to translate!` 
                : `Type ${fromLanguage} sentence or click Start Mic to speak...`
            }
            className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 text-slate-800 dark:text-slate-100 text-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-sans font-medium"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          <button
            type="button"
            onClick={() => handleSend()}
            disabled={isLoading || (!inputText.trim() && !isListening)}
            className={`p-3.5 bg-gradient-to-r ${currentScenarioConfig.gradient} text-white disabled:bg-slate-100 disabled:text-slate-300 dark:disabled:bg-slate-800 dark:disabled:text-slate-600 rounded-2xl transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-lg ${currentScenarioConfig.glow} hover:scale-105 active:scale-95`}
            title="Translate & Tutor"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
