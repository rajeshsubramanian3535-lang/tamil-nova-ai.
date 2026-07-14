import React from "react";
import { 
  Sparkles, 
  Stethoscope, 
  ShieldAlert, 
  Scale, 
  GraduationCap, 
  ShoppingBag,
  Sliders
} from "lucide-react";
import { Scenario } from "../types";

interface ScenarioChipsProps {
  selected: Scenario;
  onSelect: (scenario: Scenario) => void;
  customText?: string;
  onCustomTextChange?: (text: string) => void;
}

export const SCENARIO_CONFIGS: Record<
  Scenario, 
  { 
    label: string; 
    icon: React.ComponentType<any>; 
    color: string; 
    bg: string; 
    border: string; 
    accent: string; 
    gradient: string;
    glow: string;
    desc: string; 
  }
> = {
  General: {
    label: "General / Daily",
    icon: Sparkles,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50/70 dark:bg-indigo-950/30",
    border: "border-indigo-200 dark:border-indigo-800",
    accent: "bg-indigo-600 hover:bg-indigo-700 text-white",
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
    glow: "shadow-indigo-500/25 dark:shadow-indigo-500/10",
    desc: "Greetings, introductions, and everyday conversation skills."
  },
  Doctor: {
    label: "Healthcare Clinic",
    icon: Stethoscope,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50/70 dark:bg-rose-950/30",
    border: "border-rose-200 dark:border-rose-800",
    accent: "bg-rose-600 hover:bg-rose-700 text-white",
    gradient: "from-rose-500 via-pink-500 to-orange-500",
    glow: "shadow-rose-500/25 dark:shadow-rose-500/10",
    desc: "Talking to physicians, describing symptoms, and getting prescriptions."
  },
  Police: {
    label: "Emergency / Police",
    icon: ShieldAlert,
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-50/70 dark:bg-sky-950/30",
    border: "border-sky-200 dark:border-sky-800",
    accent: "bg-sky-600 hover:bg-sky-700 text-white",
    gradient: "from-sky-500 via-blue-500 to-indigo-500",
    glow: "shadow-sky-500/25 dark:shadow-sky-500/10",
    desc: "Reporting accidents, requesting help, or engaging in a police interrogation/complaint simulation."
  },
  Lawyer: {
    label: "Legal Counsel",
    icon: Scale,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50/70 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
    accent: "bg-amber-600 hover:bg-amber-700 text-white",
    gradient: "from-amber-500 via-orange-500 to-yellow-500",
    glow: "shadow-amber-500/25 dark:shadow-amber-500/10",
    desc: "Asking about your legal rights, contracts, and consultation dialogues."
  },
  Teacher: {
    label: "Academic Classroom",
    icon: GraduationCap,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50/70 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-800",
    accent: "bg-emerald-600 hover:bg-emerald-700 text-white",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    glow: "shadow-emerald-500/25 dark:shadow-emerald-500/10",
    desc: "Classroom queries, doubts, assignments, and learning terms."
  },
  "Shopping/Travel": {
    label: "Shopping & Travel",
    icon: ShoppingBag,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50/70 dark:bg-purple-950/30",
    border: "border-purple-200 dark:border-purple-800",
    accent: "bg-purple-600 hover:bg-purple-700 text-white",
    gradient: "from-purple-500 via-fuchsia-500 to-rose-500",
    glow: "shadow-purple-500/25 dark:shadow-purple-500/10",
    desc: "Asking prices, requesting discounts, finding locations, and ordering food."
  },
  Custom: {
    label: "Custom Scenario",
    icon: Sliders,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50/70 dark:bg-violet-950/30",
    border: "border-violet-200 dark:border-violet-800",
    accent: "bg-violet-600 hover:bg-violet-700 text-white",
    gradient: "from-violet-500 via-fuchsia-500 to-indigo-500",
    glow: "shadow-violet-500/25 dark:shadow-violet-500/10",
    desc: "Design your own custom roleplay context (e.g. Bank Teller, Job Interview, Barista)."
  }
};

export default function ScenarioChips({ selected, onSelect, customText = "", onCustomTextChange }: ScenarioChipsProps) {
  return (
    <div id="scenario-selector" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse" />
          Practice Context Scenario
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Choose a scenario to dynamically calibrate Nova AI's vocabulary & guidance
        </span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {(Object.keys(SCENARIO_CONFIGS) as Scenario[]).map((key) => {
          const cfg = SCENARIO_CONFIGS[key];
          const Icon = cfg.icon;
          const isActive = selected === key;
          
          return (
            <button
              key={key}
              id={`scenario-chip-${key.toLowerCase().replace('/', '-')}`}
              onClick={() => onSelect(key)}
              className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all duration-300 group overflow-hidden cursor-pointer ${
                isActive
                  ? `border-transparent text-white bg-gradient-to-br ${cfg.gradient} ${cfg.glow} scale-[1.02] -translate-y-1 shadow-lg`
                  : "border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 shadow-sm hover:shadow"
              }`}
            >
              {/* Soft background glow for inactive hover */}
              {!isActive && (
                <div className={`absolute inset-0 bg-gradient-to-br ${cfg.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300`} />
              )}
              
              <div className={`p-2.5 rounded-xl mb-2.5 transition-all duration-300 group-hover:scale-110 ${
                isActive 
                  ? "bg-white/20 text-white backdrop-blur-md" 
                  : `text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 group-hover:${cfg.color}`
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold tracking-tight transition-colors duration-200 ${
                isActive ? "text-white" : "text-slate-800 dark:text-slate-200"
              }`}>
                {cfg.label}
              </span>

              {/* Decorative bottom line for active item */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30" />
              )}
            </button>
          );
        })}
      </div>
      
      <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-slate-100/50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200/50 dark:border-slate-800/50 flex items-center gap-3 shadow-inner">
        <span className="flex h-2.5 w-2.5 relative shrink-0">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-gradient-to-r ${SCENARIO_CONFIGS[selected].gradient} opacity-75`}></span>
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r ${SCENARIO_CONFIGS[selected].gradient}`}></span>
        </span>
        <span className="leading-relaxed">
          <strong className="font-extrabold uppercase text-[10px] tracking-wider px-2 py-0.5 rounded mr-1 bg-white dark:bg-slate-800 shadow-sm border border-slate-200/60 dark:border-slate-700/60">
            {selected} Mode Active:
          </strong>{" "}
          <span className="text-slate-600 dark:text-slate-400 font-medium">
            {selected === "Custom" && customText ? `Roleplaying custom situation: "${customText}"` : SCENARIO_CONFIGS[selected].desc}
          </span>
        </span>
      </div>

      {selected === "Custom" && onCustomTextChange && (
        <div className="mt-3 p-4 bg-gradient-to-r from-violet-50/50 to-indigo-50/50 dark:from-violet-950/20 dark:to-indigo-950/20 border border-violet-100/60 dark:border-violet-900/40 rounded-2xl space-y-2.5">
          <label htmlFor="custom-scenario-input" className="block text-xs font-extrabold text-violet-700 dark:text-violet-400 uppercase tracking-widest text-left">
            Define your custom AI Persona & Roleplay Situation:
          </label>
          <input
            id="custom-scenario-input"
            type="text"
            value={customText}
            onChange={(e) => onCustomTextChange(e.target.value)}
            placeholder="e.g. Bank Teller at counter, Technical Job Interviewer, Coffee shop barista, Immigration officer..."
            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-slate-800 dark:text-slate-100 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all shadow-sm text-left"
          />
          <p className="text-[10px] text-slate-500 dark:text-slate-400 text-left font-medium">
            Nova will act fully in the character/role you define here during your bilingual conversation.
          </p>
        </div>
      )}
    </div>
  );
}
