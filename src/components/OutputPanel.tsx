import React from "react";
import { 
  GripVertical, 
  ArrowUpDown, 
  CheckCircle, 
  Volume2, 
  Repeat, 
  Lightbulb, 
  HelpCircle, 
  Sparkles 
} from "lucide-react";
import { ChatMessage } from "../types";
import { adaptDialect } from "./TutorInterface";

interface OutputPanelProps {
  index: number;
  isOverIndex: number | null;
  handleDragStart: (index: number) => void;
  handleDragOver: (e: React.DragEvent, index: number) => void;
  handleDragLeave: () => void;
  handleDrop: (index: number) => void;
  swapPositions: () => void;
  messages: ChatMessage[];
  fromLanguage: "Tamil" | "Telugu" | "Hindi" | "Malayalam" | "English";
  toLanguage: "Tamil" | "Telugu" | "Hindi" | "Malayalam" | "English";
  accent: "American" | "British" | "Australian" | "Indian";
  messageDialects: Record<string, "American" | "British" | "Australian" | "Indian">;
  handleAccentClick: (messageId: string, acc: "American" | "British" | "Australian" | "Indian", originalText: string) => void;
  handlePronounceClick: (messageId: string, text: string, language: string, acc: "American" | "British" | "Australian" | "Indian") => void;
  toggleRepeat: (messageId: string, text: string, language: string, acc: "American" | "British" | "Australian" | "Indian") => void;
  repeatState: {
    messageId: string;
    text: string;
    language: string;
    accent: "American" | "British" | "Australian" | "Indian";
  } | null;
  currentScenarioConfig: any;
  speakText: (text: string, languageName: string) => void;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
  index,
  isOverIndex,
  handleDragStart,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  swapPositions,
  messages,
  fromLanguage,
  toLanguage,
  accent,
  messageDialects,
  handleAccentClick,
  handlePronounceClick,
  toggleRepeat,
  repeatState,
  currentScenarioConfig,
  speakText
}) => {
  const isOver = isOverIndex === index;
  const latestAiMessage = [...messages].reverse().find(msg => msg.sender === "ai" && msg.tutoring);
  const latestTutoring = latestAiMessage?.tutoring;
  const latestMsgId = latestAiMessage?.id;
  const currentDialect = (latestMsgId && messageDialects[latestMsgId]) || accent;
  const adaptedText = latestTutoring ? (toLanguage === "English" ? adaptDialect(latestTutoring.translation, currentDialect) : latestTutoring.translation) : "";

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
          <span className="text-xs font-black uppercase tracking-widest bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
            2. Translation & Tutoring Panel (Final Output Box)
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

      {/* Output Content */}
      {!latestTutoring ? (
        <div className="py-12 px-6 text-center text-slate-400 dark:text-slate-500 space-y-3">
          <Volume2 className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto animate-pulse" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Bilingual Output Dashboard Ready</h3>
          <p className="text-xs max-w-md mx-auto leading-normal">
            Click <strong className="text-indigo-500">"🎲 Auto-Start Phrase"</strong> above to roll a native Tamil sentence instantly, or speak/type in the start box to begin coaching.
          </p>
        </div>
      ) : (
        <div className="space-y-5 animate-fade-in">
          {/* The Translation Card */}
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 bg-gradient-to-r ${currentScenarioConfig.gradient} bg-clip-text text-transparent`}>
                    <CheckCircle className="w-4 h-4 text-emerald-500" /> {toLanguage} Translation
                  </span>
                  {toLanguage === "English" && (
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/40 dark:border-slate-700/40 uppercase tracking-wider">
                      {currentDialect} English
                    </span>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 leading-tight select-all">
                  {adaptedText}
                </h3>
              </div>
              
              {/* Dialect Buttons & Audio Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full lg:w-auto">
                {toLanguage === "English" && (
                  <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-100/40 dark:border-slate-850/80 overflow-x-auto shrink-0 shadow-sm">
                    {(["American", "British", "Australian", "Indian"] as const).map((acc) => {
                      const isSelected = currentDialect === acc;
                      const flag = acc === "American" ? "🇺🇸" : acc === "British" ? "🇬🇧" : acc === "Australian" ? "🇦🇺" : "🇮🇳";
                      return (
                        <button
                          key={acc}
                          onClick={() => latestMsgId && handleAccentClick(latestMsgId, acc, latestTutoring.translation)}
                          className={`text-[11px] font-black px-2 py-1 rounded-lg transition-all duration-250 flex items-center gap-1 cursor-pointer shrink-0 ${
                            isSelected
                              ? `bg-gradient-to-r ${currentScenarioConfig.gradient} text-white shadow-sm scale-102`
                              : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/30"
                          }`}
                          title={`Speak in ${acc} accent`}
                        >
                          <span>{flag}</span>
                          <span>{acc}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="flex items-center gap-2 shrink-0 justify-end">
                  <button
                    onClick={() => latestMsgId && handlePronounceClick(latestMsgId, adaptedText, toLanguage, currentDialect)}
                    className={`p-2.5 bg-gradient-to-r ${currentScenarioConfig.gradient} text-white rounded-xl transition-all hover:scale-105 active:scale-95 shadow-md ${currentScenarioConfig.glow} shrink-0 cursor-pointer flex items-center justify-center`}
                    title="Pronounce Translation"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  {toLanguage === "English" && (
                    <button
                      onClick={() => latestMsgId && toggleRepeat(latestMsgId, adaptedText, toLanguage, currentDialect)}
                      className={`p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-md shrink-0 cursor-pointer flex items-center justify-center border ${
                        repeatState && repeatState.messageId === latestMsgId && repeatState.accent === currentDialect
                          ? "bg-rose-500 text-white border-rose-400 animate-pulse"
                          : "bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200/50 dark:border-slate-700"
                      }`}
                      title={repeatState && repeatState.messageId === latestMsgId && repeatState.accent === currentDialect ? "Stop Repeating" : "Repeat Pronunciation continuously"}
                    >
                      <Repeat className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Alternates */}
          {latestTutoring.alternatives && latestTutoring.alternatives.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                Alternative Natural Ways to Say It
              </span>
              <div className="flex flex-wrap gap-2">
                {latestTutoring.alternatives.map((alt: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => speakText(alt, toLanguage)}
                    className="text-xs text-indigo-700 dark:text-indigo-300 bg-indigo-50/50 hover:bg-indigo-100/70 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/40 px-3 py-1.5 rounded-xl border border-indigo-100/40 dark:border-indigo-900/30 font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
                  >
                    <span>{alt}</span>
                    <Volume2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Grammatical Corrections */}
          {latestTutoring.corrections && (
            <div className="p-4 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-cyan-500/5 dark:from-emerald-500/10 dark:via-teal-500/10 dark:to-cyan-500/10 border border-emerald-500/20 dark:border-emerald-500/10 rounded-2xl space-y-1.5 shadow-sm">
              <div className="flex justify-between items-center gap-2">
                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-emerald-500 animate-bounce" /> Grammatical Coaching & tips
                </span>
                <button
                  onClick={() => speakText(latestTutoring.corrections, "English")}
                  className="p-1 text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 hover:bg-emerald-100/30 dark:hover:bg-emerald-950/30 rounded-lg transition-all cursor-pointer flex items-center justify-center shrink-0"
                  title="Speak grammar corrections"
                >
                  <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
                </button>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {latestTutoring.corrections}
              </p>
            </div>
          )}

          {/* Vocabulary Breakdown */}
          {latestTutoring.vocabulary && latestTutoring.vocabulary.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                Vocabulary Breakdown & Pronunciation
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {latestTutoring.vocabulary.map((vocab: any, vIdx: number) => (
                  <div
                    key={vIdx}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/60 dark:to-slate-900/40 flex items-center justify-between gap-3 text-xs shadow-sm"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="font-extrabold text-slate-800 dark:text-slate-200">
                          {vocab.tamil}
                        </span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono italic truncate">
                          ({vocab.transliteration})
                        </span>
                      </div>
                      <div className="font-black text-indigo-600 dark:text-indigo-400">
                        {vocab.english}
                      </div>
                      <div className="text-[9px] text-slate-400 dark:text-slate-500 font-mono">
                        Pronounce: <span className="font-bold text-slate-500 dark:text-slate-400">{vocab.pronunciation}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => speakText(vocab.tamil, fromLanguage)}
                      className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all shrink-0 cursor-pointer"
                      title={`Pronounce ${fromLanguage} Word`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cultural notes */}
          {latestTutoring.culturalNotes && (
            <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100/80 dark:border-slate-800/80 flex gap-2.5 items-start">
              <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-sans italic">
                <strong className="text-slate-700 dark:text-slate-300 font-extrabold">Etiquette Note:</strong> {latestTutoring.culturalNotes}
              </span>
            </div>
          )}

          {/* In-character Tutor Interactive Dialogue / Prompt */}
          <div className="mt-4 p-4 rounded-xl border border-indigo-100 dark:border-indigo-950/80 bg-indigo-50/20 dark:bg-indigo-950/10 space-y-2">
            <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Nova Tutor's Challenge:
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-bold">
              {latestTutoring.tutorResponse}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => speakText(latestTutoring.tutorResponse, "English")}
                className="px-2.5 py-1.5 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-950/40 dark:hover:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-lg font-black text-[10px] transition-all flex items-center gap-1 cursor-pointer"
                title="Listen to tutor's challenge"
              >
                <Volume2 className="w-3 h-3" />
                <span>Hear Coach Challenge</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
