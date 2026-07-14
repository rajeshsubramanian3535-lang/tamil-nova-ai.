import { useState } from "react";
import { History } from "lucide-react";
import { ChatMessage } from "../types";

interface HistoryLogProps {
  messages: ChatMessage[];
  fromLanguage: "Tamil" | "Telugu" | "Hindi" | "Malayalam" | "English";
  accent: "American" | "British" | "Australian" | "Indian";
  messageDialects: Record<string, "American" | "British" | "Australian" | "Indian">;
}

export function HistoryLog({
  messages,
  fromLanguage,
  accent,
  messageDialects
}: HistoryLogProps) {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-2">
      <button
        type="button"
        onClick={() => setShowHistory(!showHistory)}
        className="w-full py-2.5 px-4 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-600 dark:text-slate-400 font-extrabold text-xs flex items-center justify-between transition-all cursor-pointer shadow-sm hover:shadow"
      >
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-500 animate-pulse" />
          <span>Bilingual Practice History Log ({messages.length} exchanges)</span>
        </div>
        <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-black uppercase">
          {showHistory ? "Hide Logs ▲" : "Show Logs ▼"}
        </span>
      </button>

      {showHistory && (
        <div className="mt-4 max-h-[300px] overflow-y-auto p-4 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 space-y-5 shadow-inner">
          {messages.map((msg) => {
            const isAi = msg.sender === "ai";
            return (
              <div key={msg.id} className={`flex flex-col ${isAi ? "items-start" : "items-end"} space-y-1`}>
                <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">
                  {isAi ? "Nova AI Tutor" : `You (${fromLanguage})`} • {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
                <div className={`p-3.5 rounded-xl text-xs max-w-[85%] ${
                  isAi
                    ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200/50 dark:border-slate-800 text-left"
                    : "bg-indigo-600 text-white font-bold text-left shadow-sm"
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
