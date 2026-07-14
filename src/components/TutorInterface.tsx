import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  Clock, 
  Volume2, 
  Repeat, 
  Trash2, 
  AlertCircle, 
  Smartphone,
  X,
  Copy,
  Check,
  Globe,
  ArrowLeftRight
} from "lucide-react";
import { ChatMessage, Scenario, TutorResponse } from "../types";
import { SCENARIO_CONFIGS } from "./ScenarioChips";
import { InputPanel } from "./InputPanel";
import { OutputPanel } from "./OutputPanel";
import { HistoryLog } from "./HistoryLog";

// Dialect mapping dictionary to translate words based on selected dialect/accent
const DIALECT_MAPS: Record<string, Record<"American" | "British" | "Australian" | "Indian", string>> = {
  movies: { American: "movies", British: "cinema", Australian: "flicks", Indian: "talkies" },
  movie: { American: "movie", British: "film", Australian: "flick", Indian: "cinema" },
  apartment: { American: "apartment", British: "flat", Australian: "unit", Indian: "flat" },
  cookies: { American: "cookies", British: "biscuits", Australian: "biscuits", Indian: "biscuits" },
  cookie: { American: "cookie", British: "biscuit", Australian: "biscuit", Indian: "biscuit" },
  elevator: { American: "elevator", British: "lift", Australian: "lift", Indian: "lift" },
  fries: { American: "french fries", British: "chips", Australian: "hot chips", Indian: "finger chips" },
  garbage: { American: "garbage", British: "rubbish", Australian: "rubbish", Indian: "garbage" },
  gas: { American: "gas", British: "petrol", Australian: "petrol", Indian: "petrol" },
  gasoline: { American: "gasoline", British: "petrol", Australian: "petrol", Indian: "petrol" },
  subway: { American: "subway", British: "underground", Australian: "railway", Indian: "metro" },
  vacation: { American: "vacation", British: "holiday", Australian: "holiday", Indian: "holidays" },
  sweater: { American: "sweater", British: "jumper", Australian: "jumper", Indian: "cardigan" },
  sneakers: { American: "sneakers", British: "trainers", Australian: "runners", Indian: "sports shoes" },
  restroom: { American: "restroom", British: "loo", Australian: "dunny", Indian: "washroom" },
  bathroom: { American: "bathroom", British: "toilet", Australian: "toilet", Indian: "washroom" },
  truck: { American: "truck", British: "lorry", Australian: "ute", Indian: "lorry" },
  diaper: { American: "diaper", British: "nappy", Australian: "nappy", Indian: "diaper" },
  flashlight: { American: "flashlight", British: "torch", Australian: "torch", Indian: "torch" },
  highway: { American: "highway", British: "motorway", Australian: "freeway", Indian: "highway" },
  cellphone: { American: "cell phone", British: "mobile phone", Australian: "mobile", Indian: "mobile" },
  phone: { American: "phone", British: "mobile", Australian: "mobile", Indian: "mobile" },
  schedule: { American: "schedule", British: "timetable", Australian: "timetable", Indian: "timetable" },
  store: { American: "store", British: "shop", Australian: "shop", Indian: "shop" }
};

// Helper function to adapt dialect English translation words
export function getApiBaseUrl(): string {
  const hostname = typeof window !== "undefined" ? window.location.hostname : "";
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.includes("run.app")
  ) {
    return "";
  }
  return "https://ais-pre-zulqijk5qvsoycwul4rhkx-557594679061.asia-southeast1.run.app";
}

export function adaptDialect(text: string, dialect: "American" | "British" | "Australian" | "Indian"): string {
  let modifiedText = text;
  Object.keys(DIALECT_MAPS).forEach((word) => {
    const rx = new RegExp(`\\b${word}\\b`, "gi");
    modifiedText = modifiedText.replace(rx, (matched) => {
      const replacement = DIALECT_MAPS[word][dialect];
      const isCapitalized = matched[0] === matched[0].toUpperCase();
      return isCapitalized ? replacement.charAt(0).toUpperCase() + replacement.slice(1) : replacement;
    });
  });
  return modifiedText;
}

// 10 Female natural voice options plus Gemini Live profiles
export const FEMALE_VOICES = [
  { id: "gemini_vega", name: "Vega (✨ Gemini Live)", accent: "American", description: "Expressive, friendly, bright female voice profile" },
  { id: "gemini_ursa", name: "Ursa (✨ Gemini Live)", accent: "American", description: "Calm, articulate, pleasant female voice profile" },
  { id: "gemini_capella", name: "Capella (✨ Gemini Live)", accent: "American", description: "Bright, upbeat, energetic female voice profile" },
  { id: "gemini_eclipse", name: "Eclipse (✨ Gemini Live)", accent: "American", description: "Warm, energetic, expressive female voice profile" },
  { id: "gemini_lyra", name: "Lyra (✨ Gemini Live)", accent: "American", description: "Articulate, balanced, pleasant female voice profile" },
  { id: "microsoft_zira", name: "Zira (US)", accent: "American", description: "Smooth and clear American female" },
  { id: "google_us_female", name: "Samantha (US)", accent: "American", description: "Standard clear American voice" },
  { id: "safari_female", name: "Siri (US)", accent: "American", description: "Responsive native voice profile" },
  { id: "apple_samantha", name: "Hazel (UK)", accent: "British", description: "Refined, articulate British English" },
  { id: "google_uk_female_std", name: "Elizabeth (UK Standard)", accent: "British", description: "Warm, traditional British narrator" },
  { id: "gemini_victoria_uk", name: "Victoria (✨ Gemini UK)", accent: "British", description: "Expressive, polite, classical British voice profile" },
  { id: "gemini_charlotte_uk", name: "Charlotte (✨ Gemini UK)", accent: "British", description: "Clear, friendly, modern British voice profile" },
  { id: "google_uk_female", name: "Karen (AU)", accent: "Australian", description: "Warm, natural Australian tone" },
  { id: "gemini_kylie_au", name: "Kylie (✨ Gemini AU)", accent: "Australian", description: "Bright, relaxed, expressive Australian female" },
  { id: "google_au_female_std", name: "Chloe (AU Standard)", accent: "Australian", description: "Clear, professional Australian narrator" },
  { id: "apple_au_female", name: "Olivia (AU)", accent: "Australian", description: "Articulate, polite native Australian female" },
  { id: "veena_india", name: "Veena (IN)", accent: "Indian", description: "Clear and highly precise Indian female" },
  { id: "heera_india", name: "Heera (IN)", accent: "Indian", description: "Standard accent Indian female" },
  { id: "gemini_priya_in", name: "Priya (✨ Gemini IN)", accent: "Indian", description: "Warm, professional, balanced Indian female voice" },
  { id: "google_in_female_std", name: "Aanya (IN Standard)", accent: "Indian", description: "Clear, authentic Indian English female" }
];

// 10 Male natural voice options plus Gemini Live profiles
export const MALE_VOICES = [
  { id: "gemini_orbit", name: "Orbit (✨ Gemini Live)", accent: "American", description: "Energetic, modern, professional male voice profile" },
  { id: "gemini_orion", name: "Orion (✨ Gemini Live)", accent: "American", description: "Warm, calm, pleasant male voice profile" },
  { id: "gemini_dipper", name: "Dipper (✨ Gemini Live)", accent: "American", description: "Calm, mature, deep male voice profile" },
  { id: "gemini_nova", name: "Nova (✨ Gemini Live)", accent: "American", description: "Deep, professional, authoritative male voice profile" },
  { id: "gemini_pegasus", name: "Pegasus (✨ Gemini Live)", accent: "American", description: "Expressive, clear, modern male voice profile" },
  { id: "microsoft_david", name: "David (US)", accent: "American", description: "Robust and professional American male" },
  { id: "google_us_male", name: "James (US)", accent: "American", description: "Clear and professional American voice" },
  { id: "safari_male", name: "Siri (US Male)", accent: "American", description: "Professional native helper voice" },
  { id: "apple_george", name: "George (UK)", accent: "British", description: "Polished classical British male" },
  { id: "google_uk_male", name: "George (UK)", accent: "British", description: "Natural British narrator" },
  { id: "gemini_harry_uk", name: "Harry (✨ Gemini UK)", accent: "British", description: "Polished, warm, expressive British male voice" },
  { id: "gemini_oliver_uk", name: "Oliver (✨ Gemini UK)", accent: "British", description: "Calm, highly articulate British male voice" },
  { id: "apple_moira", name: "Richard (AU)", accent: "Australian", description: "Friendly Australian male accent" },
  { id: "gemini_liam_au", name: "Liam (✨ Gemini AU)", accent: "Australian", description: "Warm, relaxed, friendly Australian male" },
  { id: "google_au_male_std", name: "Oliver (AU Standard)", accent: "Australian", description: "Clear, professional native Australian narrator" },
  { id: "ravi_india", name: "Ravi (IN)", accent: "Indian", description: "Clear and authentic Indian male voice" },
  { id: "gemini_arjun_in", name: "Arjun (✨ Gemini IN)", accent: "Indian", description: "Calm, professional, warm Indian male voice" },
  { id: "google_in_male_std", name: "Rahul (IN Standard)", accent: "Indian", description: "Clear, friendly Indian English male narrator" }
];

// Scenario bilingual phrases database for the Auto-Start feature
const AUTO_PHRASES: Record<Scenario, Array<{ phrase: string; lang: "Tamil" | "Telugu" | "Hindi" | "Malayalam" | "English" }>> = {
  General: [
    { phrase: "வணக்கம், நீங்கள் எப்படி இருக்கிறீர்கள்?", lang: "Tamil" },
    { phrase: "இன்று வானிலை மிகவும் நன்றாக இருக்கிறது.", lang: "Tamil" },
    { phrase: "உங்கள் பெயர் என்ன என்று சொல்ல முடியுமா?", lang: "Tamil" },
    { phrase: "எனக்கு புதிய மொழிகள் கற்க மிகவும் பிடிக்கும்.", lang: "Tamil" },
    { phrase: "நான் உங்களை சந்தித்ததில் மிகவும் மகிழ்ச்சியடைகிறேன்.", lang: "Tamil" },
    { phrase: "உங்களுக்கு பிடித்த உணவு எது என்று சொல்லுங்கள்?", lang: "Tamil" },
    { phrase: "நாளை நாம் எப்போது சந்திக்கலாம்?", lang: "Tamil" },
    { phrase: "தயவுசெய்து இதை மீண்டும் சொல்ல முடியுமா?", lang: "Tamil" }
  ],
  Doctor: [
    { phrase: "எனக்குத் தலைவலி அதிகமாக இருக்கிறது.", lang: "Tamil" },
    { phrase: "மருந்தகம் எங்கே இருக்கிறது?", lang: "Tamil" },
    { phrase: "எனக்கு மருத்துவர் உதவி தேவை.", lang: "Tamil" },
    { phrase: "தயவுசெய்து மாத்திரை தாருங்கள்.", lang: "Tamil" },
    { phrase: "எனக்கு மூன்று நாட்களாக காய்ச்சல் இருக்கிறது.", lang: "Tamil" },
    { phrase: "மருத்துவர் எப்போது வருவார்?", lang: "Tamil" },
    { phrase: "என் நெஞ்சு மற்றும் முதுகு மிகவும் வலிக்கிறது.", lang: "Tamil" },
    { phrase: "இந்த மருந்தை உணவுக்கு முன் சாப்பிட வேண்டுமா?", lang: "Tamil" }
  ],
  Police: [
    { phrase: "தயவுசெய்து எனக்கு உதவி செய்யுங்கள், என் பை காணவில்லை.", lang: "Tamil" },
    { phrase: "இங்கே ஒரு விபத்து நடந்துவிட்டது.", lang: "Tamil" },
    { phrase: "காவல் நிலையம் எங்கே இருக்கிறது?", lang: "Tamil" },
    { phrase: "என் கைபேசி திருடப்பட்டுவிட்டது.", lang: "Tamil" },
    { phrase: "யாரோ என்னை பின்தொடர்வது போல் இருக்கிறது.", lang: "Tamil" },
    { phrase: "தயவுசெய்து அவசர உதவிக்கு யாரையாவது அனுப்புங்கள்.", lang: "Tamil" }
  ],
  Lawyer: [
    { phrase: "எனது சட்ட உரிமைகள் என்ன என்று சொல்ல முடியுமா?", lang: "Tamil" },
    { phrase: "எனக்கு ஒரு வழக்கறிஞர் உதவி தேவை.", lang: "Tamil" },
    { phrase: "இந்த ஒப்பந்தத்தை நான் கையெழுத்திடலாமா?", lang: "Tamil" },
    { phrase: "எனக்கு சட்டப்பூர்வ ஆலோசனை தேவைப்படுகிறது.", lang: "Tamil" },
    { phrase: "நாங்கள் நீதிமன்றத்திற்கு செல்ல வேண்டுமா?", lang: "Tamil" }
  ],
  Teacher: [
    { phrase: "ஐயா, எனக்கு இந்த பாடம் புரியவில்லை.", lang: "Tamil" },
    { phrase: "நாளை வீட்டுப்பாடம் சமர்ப்பிக்க வேண்டுமா?", lang: "Tamil" },
    { phrase: "இந்த தேர்வின் மதிப்பெண் எப்போது கிடைக்கும்?", lang: "Tamil" },
    { phrase: "தயவுசெய்து இந்த கணக்கை எனக்கு விளக்குங்கள்.", lang: "Tamil" },
    { phrase: "வகுப்பறை எங்கே இருக்கிறது?", lang: "Tamil" }
  ],
  "Shopping/Travel": [
    { phrase: "இதன் விலை எவ்வளவு?", lang: "Tamil" },
    { phrase: "பேருந்து நிலையம் எங்கே இருக்கிறது?", lang: "Tamil" },
    { phrase: "இங்கிருந்து விமான நிலையம் எவ்வளவு தூரம்?", lang: "Tamil" },
    { phrase: "இங்கே கடன் அட்டை ஏற்றுக்கொள்ளப்படுமா?", lang: "Tamil" },
    { phrase: "தயவுசெய்து எனக்கு தள்ளுபடி தர முடியுமா?", lang: "Tamil" },
    { phrase: "வழியில் நல்ல உணவகம் ஏதேனும் உள்ளதா?", lang: "Tamil" },
    { phrase: "இந்த முகவரிக்கு எப்படி செல்வது?", lang: "Tamil" }
  ],
  Custom: [
    { phrase: "நான் ஒரு புதிய கணக்கு தொடங்க வேண்டும்.", lang: "Tamil" },
    { phrase: "தயவுசெய்து எனக்கு ஒரு சூடான காபி தாருங்கள்.", lang: "Tamil" },
    { phrase: "இன்று மாலை நாங்கள் ஒரு விருந்துக்குச் செல்கிறோம்.", lang: "Tamil" },
    { phrase: "உங்கள் உதவிக்கு எனது மனமார்ந்த நன்றிகள்.", lang: "Tamil" },
    { phrase: "நாம் வார இறுதியில் பூங்காவிற்குச் செல்லலாமா?", lang: "Tamil" }
  ]
};

const globalActiveUtterances: SpeechSynthesisUtterance[] = [];

interface TutorInterfaceProps {
  scenario: Scenario;
  isMuted?: boolean;
  customScenarioText?: string;
}

export default function TutorInterface({ scenario, isMuted = false, customScenarioText = "" }: TutorInterfaceProps) {
  // Practice core states
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Default Accents and Voice customizations
  const [accent, setAccent] = useState<"American" | "British" | "Australian" | "Indian">("American");
  const [voiceGender, setVoiceGender] = useState<"Female" | "Male">("Female");

  // Track selected voice per accent dynamically to avoid resetting choice on accent switch
  const [voicePrefs, setVoicePrefs] = useState<Record<string, { female: string; male: string }>>({
    American: { female: "gemini_vega", male: "gemini_orbit" },
    British: { female: "gemini_victoria_uk", male: "gemini_harry_uk" },
    Australian: { female: "gemini_kylie_au", male: "gemini_liam_au" },
    Indian: { female: "gemini_priya_in", male: "gemini_arjun_in" }
  });

  const selectedFemaleVoiceId = voicePrefs[accent]?.female || "gemini_vega";
  const selectedMaleVoiceId = voicePrefs[accent]?.male || "gemini_orbit";

  const setSelectedFemaleVoiceId = (id: string) => {
    setVoicePrefs(prev => ({
      ...prev,
      [accent]: {
        ...prev[accent],
        female: id
      }
    }));
  };

  const setSelectedMaleVoiceId = (id: string) => {
    setVoicePrefs(prev => ({
      ...prev,
      [accent]: {
        ...prev[accent],
        male: id
      }
    }));
  };

  const playVoicePreview = (voiceId: string, gender: "Female" | "Male", selectedAccent: "American" | "British" | "Australian" | "Indian") => {
    if (!window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
    } catch (err) {}

    const text = "Hello! This is a preview of my voice.";
    const utterance = new SpeechSynthesisUtterance(text);

    const voiceConfigs: Record<string, { pitch: number; rate: number }> = {
      gemini_vega: { pitch: 1.15, rate: 1.05 },
      gemini_ursa: { pitch: 1.0, rate: 0.95 },
      gemini_capella: { pitch: 1.2, rate: 1.1 },
      gemini_eclipse: { pitch: 1.05, rate: 1.05 },
      gemini_lyra: { pitch: 1.0, rate: 1.0 },
      gemini_orbit: { pitch: 0.88, rate: 1.05 },
      gemini_orion: { pitch: 0.95, rate: 0.92 },
      gemini_dipper: { pitch: 0.8, rate: 0.9 },
      gemini_nova: { pitch: 0.85, rate: 0.95 },
      gemini_pegasus: { pitch: 1.05, rate: 1.02 },
      gemini_victoria_uk: { pitch: 1.05, rate: 0.98 },
      gemini_charlotte_uk: { pitch: 1.12, rate: 1.02 },
      gemini_harry_uk: { pitch: 0.92, rate: 1.02 },
      gemini_oliver_uk: { pitch: 0.88, rate: 0.95 },
      gemini_kylie_au: { pitch: 1.1, rate: 1.0 },
      gemini_liam_au: { pitch: 0.9, rate: 0.98 },
      gemini_priya_in: { pitch: 1.05, rate: 1.0 },
      gemini_arjun_in: { pitch: 0.88, rate: 0.98 },
    };

    const config = voiceConfigs[voiceId];
    if (config) {
      utterance.pitch = config.pitch;
      utterance.rate = config.rate;
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      let candidates: SpeechSynthesisVoice[] = [];
      const matchedProfile = (gender === "Female" ? FEMALE_VOICES : MALE_VOICES).find(v => v.id === voiceId);
      
      if (matchedProfile) {
        const profileKeyword = matchedProfile.id.split("_")[1] || matchedProfile.name.toLowerCase().split(" ")[0];
        candidates = voices.filter(v => v.name.toLowerCase().includes(profileKeyword));
      }

      if (candidates.length === 0) {
        const accentKeywords: Record<string, string[]> = {
          American: ["en-us", "zira", "samantha", "david", "siri", "us"],
          British: ["en-gb", "hazel", "george", "daniel", "uk"],
          Australian: ["en-au", "karen", "richard", "au"],
          Indian: ["en-in", "veena", "heera", "ravi", "in"]
        };
        const kw = accentKeywords[selectedAccent] || accentKeywords["American"];
        candidates = voices.filter((v) => 
          v.lang.toLowerCase().replace("_", "-").startsWith("en-") &&
          kw.some(keyword => v.name.toLowerCase().includes(keyword))
        );
      }

      if (candidates.length === 0) {
        candidates = voices.filter(v => v.lang.toLowerCase().startsWith("en-"));
      }

      const isIframe = window.self !== window.top;
      if (isIframe) {
        const nonGoogle = candidates.filter(v => !v.name.toLowerCase().includes("google"));
        if (nonGoogle.length > 0) {
          candidates = nonGoogle;
        }
      }

      if (candidates.length > 0) {
        const localVoices = candidates.filter(v => v.localService === true);
        const preferredVoices = localVoices.length > 0 ? localVoices : candidates;
        
        const femaleKeywords = ["female", "zira", "hazel", "samantha", "veena", "karen", "susan", "tessa", "moira", "heera", "en-us-x-sfg", "en-in-x-ene", "luna"];
        const maleKeywords = ["male", "david", "ravi", "george", "richard", "james", "en-us-x-iol", "en-in-x-ahi"];
        const targetKeywords = gender === "Female" ? femaleKeywords : maleKeywords;
        
        const genderMatched = preferredVoices.find(v => 
          targetKeywords.some(kw => v.name.toLowerCase().includes(kw))
        );
        
        utterance.voice = genderMatched || preferredVoices[0];
        utterance.lang = utterance.voice.lang;
      }
    }

    window.speechSynthesis.speak(utterance);
  };

  // Phone installer helper states
  const [copied, setCopied] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  // Dynamic rearrangeable grid state
  const [layoutOrder, setLayoutOrder] = useState<string[]>(["input", "output"]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isOverIndex, setIsOverIndex] = useState<number | null>(null);

  // Dialect adapters & Continuous repetition states
  const [messageDialects, setMessageDialects] = useState<Record<string, "American" | "British" | "Australian" | "Indian">>({});
  const [repeatState, setRepeatState] = useState<{
    messageId: string;
    text: string;
    language: string;
    accent: "American" | "British" | "Australian" | "Indian";
  } | null>(null);

  // Bilingual translation directions
  const [fromLanguage, setFromLanguage] = useState<"Tamil" | "Telugu" | "Hindi" | "Malayalam" | "English">("Tamil");
  const [toLanguage, setToLanguage] = useState<"Tamil" | "Telugu" | "Hindi" | "Malayalam" | "English">("English");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const repeatStateRef = useRef<any>(null);
  const activeUtterances = globalActiveUtterances;

  const inputTextRef = useRef(inputText);
  useEffect(() => {
    inputTextRef.current = inputText;
  }, [inputText]);

  // Unlock SpeechSynthesis on first user interaction (critical for iOS & Android PWAs)
  useEffect(() => {
    const handleInteraction = () => {
      if (window.speechSynthesis) {
        try {
          const u = new SpeechSynthesisUtterance("");
          u.volume = 0;
          window.speechSynthesis.speak(u);
        } catch (e) {}
      }
      // Remove listeners after first interaction
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };

    window.addEventListener("click", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  // Speech Recognition Initialization
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMessage("Bilingual Speech Recognition is not supported in this browser. Please use Google Chrome or Safari for full live coaching.");
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;

    // Dynamically set recognition language based on active practice
    const getLangCode = (lang: string) => {
      if (lang === "English") {
        return accent === "American" ? "en-US" : accent === "British" ? "en-GB" : accent === "Indian" ? "en-IN" : "en-AU";
      }
      const mapper: Record<string, string> = { Tamil: "ta-IN", Telugu: "te-IN", Hindi: "hi-IN", Malayalam: "ml-IN" };
      return mapper[lang] || "ta-IN";
    };

    rec.lang = getLangCode(fromLanguage);

    rec.onstart = () => {
      setIsListening(true);
      setErrorMessage(null);
    };

    rec.onresult = (event: any) => {
      let final = "";
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      if (final) {
        setInputText((prev) => (prev ? prev + " " + final.trim() : final.trim()));
      }
      setInterimTranscript(interim);
    };

    rec.onerror = (e: any) => {
      console.warn("Speech Recognition notice:", e.error);
      if (e.error === "not-allowed") {
        setErrorMessage("Microphone access is blocked. Please grant microphone permissions in your browser or iframe header controls.");
      }
    };

    rec.onend = () => {
      setIsListening(false);
      setInterimTranscript("");
    };

    recognitionRef.current = rec;
  }, [fromLanguage, accent]);

  // Clean speech synthesis cues on unmount
  useEffect(() => {
    return () => {
      try {
        window.speechSynthesis.cancel();
      } catch (err) {}
    };
  }, []);

  // Drag and drop handler functions
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setIsOverIndex(index);
  };

  const handleDragLeave = () => {
    setIsOverIndex(null);
  };

  const handleDrop = (index: number) => {
    if (draggedIndex !== null && draggedIndex !== index) {
      const updated = [...layoutOrder];
      const draggedItem = updated[draggedIndex];
      updated.splice(draggedIndex, 1);
      updated.splice(index, 0, draggedItem);
      setLayoutOrder(updated);
    }
    setDraggedIndex(null);
    setIsOverIndex(null);
  };

  const swapPositions = () => {
    setLayoutOrder((prev) => [...prev].reverse());
  };

  // Roll a random scenario-specific native phrase, speak it, and send to translate
  const handleAutoStart = () => {
    if (isLoading) return;
    stopRepeat();
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}

    const pool = AUTO_PHRASES[scenario];
    if (!pool || pool.length === 0) return;

    // Daily persistent no-repeat logic
    const todayStr = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD local timezone format
    let dailyData: { date: string; used: Record<string, string[]> } = { date: todayStr, used: {} };
    
    try {
      const stored = localStorage.getItem("tamil_tutor_used_phrases_daily");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.date === todayStr) {
          dailyData = parsed;
        }
      }
    } catch (e) {
      console.warn("Could not load daily phrase history from localStorage", e);
    }

    if (!dailyData.used) {
      dailyData.used = {};
    }
    
    const usedPhrasesForScenario = dailyData.used[scenario] || [];
    
    // Filter the pool to get phrases not yet used today
    const unusedEntries = pool.filter(entry => !usedPhrasesForScenario.includes(entry.phrase));
    
    let selectedEntry;
    if (unusedEntries.length > 0) {
      // Pick randomly from the remaining unused phrases
      selectedEntry = unusedEntries[Math.floor(Math.random() * unusedEntries.length)];
      dailyData.used[scenario] = [...usedPhrasesForScenario, selectedEntry.phrase];
    } else {
      // All phrases for this scenario have been used today!
      // Reset the used phrases list for this scenario to cycle again
      selectedEntry = pool[Math.floor(Math.random() * pool.length)];
      dailyData.used[scenario] = [selectedEntry.phrase];
    }

    try {
      localStorage.setItem("tamil_tutor_used_phrases_daily", JSON.stringify(dailyData));
    } catch (e) {
      console.warn("Could not save daily phrase history to localStorage", e);
    }
    
    // Auto-align languages
    setFromLanguage(selectedEntry.lang);
    setToLanguage("English");
    setInputText(selectedEntry.phrase);

    // Speak the native phrase
    speakText(selectedEntry.phrase, selectedEntry.lang);

    // Auto-trigger translation API call
    setTimeout(() => {
      triggerTranslationWithText(selectedEntry.phrase, selectedEntry.lang, "English");
    }, 400);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      // Auto-trigger send & analysis of whatever text was spoken and gathered in the box after a tiny delay
      setTimeout(() => {
        const currentText = inputTextRef.current.trim();
        if (currentText) {
          triggerTranslationWithText(currentText, fromLanguage, toLanguage);
          setInputText("");
        }
      }, 500);
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        setErrorMessage("Speech recognition session could not start. Please ensure permissions are active.");
      }
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    if (isListening) {
      recognitionRef.current.stop();
    }
    triggerTranslationWithText(inputText.trim(), fromLanguage, toLanguage);
    setInputText("");
  };

  const triggerTranslationWithText = async (
    textToTranslate: string,
    fromLang: string,
    toLang: string
  ) => {
    setIsLoading(true);
    setErrorMessage(null);

    const userMsg: ChatMessage = {
      id: "usr_" + Date.now(),
      sender: "user",
      text: textToTranslate,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToTranslate,
          fromLanguage: fromLang,
          toLanguage: toLang,
          scenario,
          messages: messages.map((m) => ({ role: m.sender === "ai" ? "model" : "user", text: m.text }))
        })
      });

      if (!response.ok) {
        throw new Error("Nova translation gateway is currently congested. Please retry.");
      }

      const data = await response.json();
      if (!data.tutoring) {
        throw new Error("Invalid response format received from coaching assistant.");
      }

      const aiMsgId = "ai_" + Date.now();
      const aiMsg: ChatMessage = {
        id: aiMsgId,
        sender: "ai",
        text: data.translationText || data.tutoring.translation,
        timestamp: new Date(),
        tutoring: data.tutoring
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Adapt to current default accent and pronounce
      const finalText = toLang === "English" ? adaptDialect(data.tutoring.translation, accent) : data.tutoring.translation;
      speakText(finalText, toLang);

    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An unexpected error occurred. Please retry your speech practice.");
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (
    text: string, 
    languageName: string, 
    isFallbackAttempt = false, 
    customAccent?: "American" | "British" | "Australian" | "Indian"
  ) => {
    if (!window.speechSynthesis) return;

    // Filter out active utterances
    try {
      window.speechSynthesis.cancel();
    } catch (err) {}
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = 1.0;
    activeUtterances.push(utterance);
    
    // Convert language names to proper BCP 47 codes
    const getBCP47Code = (lang: string) => {
      const mapper: Record<string, string> = { 
        Tamil: "ta-IN", 
        Telugu: "te-IN", 
        Hindi: "hi-IN", 
        Malayalam: "ml-IN",
        English: "en-US"
      };
      return mapper[lang] || lang;
    };

    const activeAccent = customAccent || accent;
    const accentCodes: Record<string, string> = {
      American: "en-US",
      British: "en-GB",
      Indian: "en-IN",
      Australian: "en-AU"
    };

    // Determine target BCP 47 code
    const targetLangCode = languageName === "English" 
      ? (accentCodes[activeAccent] || "en-US") 
      : getBCP47Code(languageName);

    // Initialize utterance language
    utterance.lang = targetLangCode;
    
    // Customize voice pitch & rate for Gemini Live premium profiles
    if (languageName === "English") {
      const targetId = voiceGender === "Female" 
        ? (voicePrefs[activeAccent]?.female || selectedFemaleVoiceId) 
        : (voicePrefs[activeAccent]?.male || selectedMaleVoiceId);
      if (targetId && targetId.startsWith("gemini_")) {
        const voiceConfigs: Record<string, { pitch: number; rate: number }> = {
          gemini_vega: { pitch: 1.15, rate: 1.05 },
          gemini_ursa: { pitch: 1.0, rate: 0.95 },
          gemini_capella: { pitch: 1.2, rate: 1.1 },
          gemini_eclipse: { pitch: 1.05, rate: 1.05 },
          gemini_lyra: { pitch: 1.0, rate: 1.0 },
          gemini_orbit: { pitch: 0.88, rate: 1.05 },
          gemini_orion: { pitch: 0.95, rate: 0.92 },
          gemini_dipper: { pitch: 0.8, rate: 0.9 },
          gemini_nova: { pitch: 0.85, rate: 0.95 },
          gemini_pegasus: { pitch: 1.05, rate: 1.02 },
          gemini_victoria_uk: { pitch: 1.05, rate: 0.98 },
          gemini_charlotte_uk: { pitch: 1.12, rate: 1.02 },
          gemini_harry_uk: { pitch: 0.92, rate: 1.02 },
          gemini_oliver_uk: { pitch: 0.88, rate: 0.95 },
          gemini_kylie_au: { pitch: 1.1, rate: 1.0 },
          gemini_liam_au: { pitch: 0.9, rate: 0.98 },
          gemini_priya_in: { pitch: 1.05, rate: 1.0 },
          gemini_arjun_in: { pitch: 0.88, rate: 0.98 },
        };
        const config = voiceConfigs[targetId];
        if (config) {
          utterance.pitch = config.pitch;
          utterance.rate = config.rate;
        }
      }
    }
    
    let speechStarted = false;
    let watchdogTimer: any = null;
    
    utterance.onstart = () => {
      speechStarted = true;
      if (watchdogTimer) {
        clearTimeout(watchdogTimer);
      }
    };
    
    utterance.onend = () => {
      if (watchdogTimer) {
        clearTimeout(watchdogTimer);
      }
      const idx = activeUtterances.indexOf(utterance);
      if (idx > -1) {
        activeUtterances.splice(idx, 1);
      }

      // Schedule next play if repeat is active for this text and accent
      if (
        repeatStateRef.current && 
        repeatStateRef.current.text === text && 
        (languageName === "English" ? repeatStateRef.current.accent === activeAccent : true)
      ) {
        setTimeout(() => {
          if (
            repeatStateRef.current && 
            repeatStateRef.current.text === text
          ) {
            speakText(text, languageName, false, customAccent);
          }
        }, 1000); // 1-second gap between repetitions for natural rhythm
      }
    };
    
    utterance.onerror = (e) => {
      if (watchdogTimer) {
        clearTimeout(watchdogTimer);
      }
      const idx = activeUtterances.indexOf(utterance);
      if (idx > -1) {
        activeUtterances.splice(idx, 1);
      }
      console.warn("Speech synthesis notice:", e.error);
    };

    // Keepalive watchdog for longer speeches
    watchdogTimer = setTimeout(() => {
      if (!speechStarted && !isFallbackAttempt) {
        console.warn("Speech Synthesis watchdog triggered. Forcing fallback audio...");
        try {
          window.speechSynthesis.cancel();
        } catch (err) {}
          speakText(text, languageName, true, customAccent);
      }
    }, 6000);

    const isIframe = window.self !== window.top;
    const voices = window.speechSynthesis.getVoices();

    if (voices.length > 0) {
      if (languageName === "English") {
        const getEnglishVoice = (
          selectedAccent: string, 
          selectedGender: "Female" | "Male", 
          voiceList: SpeechSynthesisVoice[]
        ) => {
          // Find custom-aligned voice character based on matching voice profile name
          const targetId = selectedGender === "Female" 
            ? (voicePrefs[selectedAccent]?.female || selectedFemaleVoiceId) 
            : (voicePrefs[selectedAccent]?.male || selectedMaleVoiceId);
          const matchedProfile = (selectedGender === "Female" ? FEMALE_VOICES : MALE_VOICES).find(v => v.id === targetId);
          
          let candidates: SpeechSynthesisVoice[] = [];
          
          if (matchedProfile) {
            const profileKeyword = matchedProfile.id.split("_")[1] || matchedProfile.name.toLowerCase().split(" ")[0];
            candidates = voiceList.filter(v => v.name.toLowerCase().includes(profileKeyword));
          }

          if (candidates.length === 0) {
            const accentKeywords: Record<string, string[]> = {
              American: ["en-us", "zira", "samantha", "david", "siri", "us"],
              British: ["en-gb", "hazel", "george", "daniel", "uk"],
              Australian: ["en-au", "karen", "richard", "au"],
              Indian: ["en-in", "veena", "heera", "ravi", "in"]
            };
            const kw = accentKeywords[selectedAccent] || accentKeywords["American"];
            candidates = voiceList.filter((v) => 
              v.lang.toLowerCase().replace("_", "-").startsWith("en-") &&
              kw.some(keyword => v.name.toLowerCase().includes(keyword))
            );
          }

          if (candidates.length === 0) {
            candidates = voiceList.filter(v => v.lang.toLowerCase().startsWith("en-"));
          }

          if (isIframe) {
            const nonGoogle = candidates.filter(v => !v.name.toLowerCase().includes("google"));
            if (nonGoogle.length > 0) {
              candidates = nonGoogle;
            }
          }

          if (candidates.length === 0) return null;
          
          const localVoices = candidates.filter(v => v.localService === true);
          const preferredVoices = localVoices.length > 0 ? localVoices : candidates;
          
          const femaleKeywords = ["female", "zira", "hazel", "samantha", "veena", "karen", "susan", "tessa", "moira", "heera", "en-us-x-sfg", "en-in-x-ene", "luna"];
          const maleKeywords = ["male", "david", "ravi", "george", "richard", "james", "en-us-x-iol", "en-in-x-ahi"];
          const targetKeywords = selectedGender === "Female" ? femaleKeywords : maleKeywords;
          
          const genderMatched = preferredVoices.find(v => 
            targetKeywords.some(kw => v.name.toLowerCase().includes(kw))
          );
          
          if (genderMatched) {
            return genderMatched;
          }
          
          return preferredVoices[0];
        };
        
        const matchedVoice = getEnglishVoice(activeAccent, voiceGender, voices);
        if (matchedVoice) {
          utterance.voice = matchedVoice;
          utterance.lang = matchedVoice.lang;
        }
      } else {
        const langPrefix = targetLangCode.toLowerCase().split("-")[0];
        let candidateVoices = voices.filter((v) => v.lang.toLowerCase().replace("_", "-").startsWith(langPrefix));
        if (candidateVoices.length === 0) {
          candidateVoices = voices.filter((v) => v.lang.toLowerCase().includes(langPrefix));
        }
        
        let finalCandidates = candidateVoices;
        if (isIframe) {
          finalCandidates = candidateVoices.filter(v => !v.name.toLowerCase().includes("google"));
          if (finalCandidates.length === 0) {
            finalCandidates = candidateVoices;
          }
        }
        
        const localCandidates = finalCandidates.filter((v) => v.localService === true);
        const bestCandidates = localCandidates.length > 0 ? localCandidates : finalCandidates;
        
        if (bestCandidates.length > 0) {
          utterance.voice = bestCandidates[0];
          utterance.lang = bestCandidates[0].lang;
        }
      }
    }
    
    try {
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("SpeechSynthesis.speak failed:", err);
    }
  };

  const handleCopyLink = () => {
    const appUrl = window.location.origin;
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAccentClick = (messageId: string, acc: "American" | "British" | "Australian" | "Indian", originalText: string) => {
    setMessageDialects(prev => ({
      ...prev,
      [messageId]: acc
    }));

    // Update global accent state so that the top controls sync automatically!
    setAccent(acc);

    const adapted = adaptDialect(originalText, acc);

    if (repeatState) {
      stopRepeat();
    }

    speakText(adapted, "English", false, acc);
  };

  const handlePronounceClick = (messageId: string, text: string, language: string, acc: "American" | "British" | "Australian" | "Indian") => {
    speakText(text, language, false, language === "English" ? acc : undefined);
  };

  const toggleRepeat = (messageId: string, text: string, language: string, acc: "American" | "British" | "Australian" | "Indian") => {
    if (repeatState && repeatState.messageId === messageId && repeatState.accent === acc) {
      stopRepeat();
    } else {
      const newState = { messageId, text, language, accent: acc };
      setRepeatState(newState);
      repeatStateRef.current = newState;
      speakText(text, language, false, language === "English" ? acc : undefined);
    }
  };

  const stopRepeat = () => {
    setRepeatState(null);
    repeatStateRef.current = null;
    try {
      window.speechSynthesis.cancel();
    } catch (err) {}
  };

  const clearChat = () => {
    setMessages([]);
    setInputText("");
    setErrorMessage(null);
    setRepeatState(null);
    repeatStateRef.current = null;
    try {
      window.speechSynthesis.cancel();
    } catch (err) {}
  };

  const currentScenarioConfig = SCENARIO_CONFIGS[scenario];

  return (
    <div 
      id="tutor-interface" 
      className={`flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 min-h-[700px] h-auto overflow-hidden shadow-2xl relative transition-all duration-500 hover:${currentScenarioConfig.glow}`}
    >
      {/* Dynamic Glowing Accent Top Line */}
      <div className={`h-2 w-full bg-gradient-to-r ${currentScenarioConfig.gradient}`} />
      
      {/* Header Panel */}
      <div className="flex items-center justify-between px-6 py-5 bg-slate-50/70 dark:bg-slate-950/40 border-b border-slate-200/60 dark:border-slate-800/60 shrink-0 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl bg-gradient-to-br ${currentScenarioConfig.gradient} text-white shadow-lg ${currentScenarioConfig.glow} transition-all duration-300`}>
            <currentScenarioConfig.icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Nova AI Tutor
              </h2>
              <span className={`animate-pulse bg-gradient-to-r ${currentScenarioConfig.gradient} text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider`}>
                Live Coach
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
              Practicing Scenario: <span className={`bg-gradient-to-r ${currentScenarioConfig.gradient} bg-clip-text text-transparent`}>{currentScenarioConfig.label}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowInstallGuide(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-50/80 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:hover:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-black rounded-xl transition-all cursor-pointer shadow-sm hover:scale-105"
            title="Use on Phone / Save App"
          >
            <Smartphone className="w-4 h-4 text-indigo-500" />
            <span className="hidden sm:inline">Use on Phone</span>
          </button>
          
          <button
            onClick={clearChat}
            className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all duration-200 cursor-pointer border border-transparent hover:border-red-100"
            title="Reset Conversation"
          >
            <Trash2 className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Error / Frame Notice */}
      {errorMessage && (
        <div className="mx-6 mt-4 p-4 bg-rose-50/80 dark:bg-rose-950/10 border border-rose-200/50 dark:border-rose-900/30 rounded-2xl flex gap-3 items-start shrink-0 z-10 backdrop-blur-md shadow-sm">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5 animate-bounce" />
          <div className="text-xs text-rose-800 dark:text-rose-300 font-bold leading-relaxed text-left">
            {errorMessage}
          </div>
        </div>
      )}

      {/* Main Interactive Draggable Panels Body Workspace */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-[radial-gradient(#f1f5f9_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:20px_20px] bg-slate-50/50 dark:bg-slate-950/20">
        
        {/* Dynamic Draggable Panel Order mapper */}
        <div className="space-y-6">
          {layoutOrder.map((panelId, idx) => {
            if (panelId === "input") {
              return (
                <InputPanel
                  key="input-panel"
                  index={idx}
                  isOverIndex={isOverIndex}
                  handleDragStart={handleDragStart}
                  handleDragOver={handleDragOver}
                  handleDragLeave={handleDragLeave}
                  handleDrop={handleDrop}
                  swapPositions={swapPositions}
                  fromLanguage={fromLanguage}
                  setFromLanguage={setFromLanguage}
                  toLanguage={toLanguage}
                  setToLanguage={setToLanguage}
                  isListening={isListening}
                  toggleListening={toggleListening}
                  handleAutoStart={handleAutoStart}
                  inputText={inputText}
                  setInputText={setInputText}
                  handleSend={handleSend}
                  isLoading={isLoading}
                  accent={accent}
                  setAccent={setAccent}
                  voiceGender={voiceGender}
                  setVoiceGender={setVoiceGender}
                  selectedFemaleVoiceId={selectedFemaleVoiceId}
                  setSelectedFemaleVoiceId={setSelectedFemaleVoiceId}
                  selectedMaleVoiceId={selectedMaleVoiceId}
                  setSelectedMaleVoiceId={setSelectedMaleVoiceId}
                  currentScenarioConfig={currentScenarioConfig}
                  playVoicePreview={playVoicePreview}
                />
              );
            } else {
              return (
                <OutputPanel
                  key="output-panel"
                  index={idx}
                  isOverIndex={isOverIndex}
                  handleDragStart={handleDragStart}
                  handleDragOver={handleDragOver}
                  handleDragLeave={handleDragLeave}
                  handleDrop={handleDrop}
                  swapPositions={swapPositions}
                  messages={messages}
                  fromLanguage={fromLanguage}
                  toLanguage={toLanguage}
                  accent={accent}
                  messageDialects={messageDialects}
                  handleAccentClick={handleAccentClick}
                  handlePronounceClick={handlePronounceClick}
                  toggleRepeat={toggleRepeat}
                  repeatState={repeatState}
                  currentScenarioConfig={currentScenarioConfig}
                  speakText={speakText}
                />
              );
            }
          })}
        </div>

        {/* Interim Speech Transcription Indicator */}
        {isListening && interimTranscript && (
          <div className="p-3.5 bg-rose-50/70 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900 rounded-xl text-xs flex gap-2.5 items-center justify-center shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
            <span className="text-rose-700 dark:text-rose-300 font-mono font-bold italic">
              Speaking {fromLanguage}: "{interimTranscript}"
            </span>
          </div>
        )}

        {/* Thinking Loading State */}
        {isLoading && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl text-xs shadow-md space-y-3 text-left">
            <div className="flex items-center gap-1.5 font-extrabold text-slate-400 uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-indigo-500 animate-spin" />
              <span>Nova AI Coach is translating and structuring suggestions...</span>
            </div>
            <div className="flex gap-2 items-center">
              <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${currentScenarioConfig.gradient} animate-bounce`} style={{ animationDelay: "0ms" }} />
              <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${currentScenarioConfig.gradient} animate-bounce`} style={{ animationDelay: "150ms" }} />
              <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${currentScenarioConfig.gradient} animate-bounce`} style={{ animationDelay: "300ms" }} />
              <span className="text-xs text-slate-400 dark:text-slate-500 font-mono ml-1">Running NLP dialect translation...</span>
            </div>
          </div>
        )}

        {/* Collapsible Bilingual Conversation History Log */}
        <HistoryLog
          messages={messages}
          fromLanguage={fromLanguage}
          accent={accent}
          messageDialects={messageDialects}
        />

        <div className="text-[10px] text-slate-400 dark:text-slate-500 text-center flex justify-center gap-4 pt-2">
          <span>Active Practice Mode: <strong className="text-slate-600 dark:text-slate-400">{fromLanguage} ➔ {toLanguage}</strong></span>
          <span>•</span>
          <span>Drag Grid: Arrange cards in any layout</span>
        </div>

        <div ref={messagesEndRef} />
      </div>

      {/* Mobile Install Guide Modal Overlay */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100">
                  Save App to Phone
                </h3>
              </div>
              <button
                onClick={() => setShowInstallGuide(false)}
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5 text-sm leading-relaxed text-left">
              <p className="text-slate-600 dark:text-slate-400 text-xs">
                You can save and install <strong>TamilNova AI</strong> on your mobile phone to use it like a native app anytime!
              </p>

              {/* Link Copier Box */}
              <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-xl space-y-3">
                <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">
                  1. Get App Link on Your Mobile
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  Copy this link and open it in your phone's browser (Safari or Chrome):
                </p>
                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-lg">
                  <span className="text-xs font-mono text-slate-500 select-all truncate flex-1 text-left">
                    {window.location.origin}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-md transition-all shrink-0 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* iOS Safari Steps */}
              <div className="space-y-2 border-l-2 border-amber-400 pl-3">
                <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-widest block">
                  For Apple iPhone (Safari)
                </span>
                <ol className="list-decimal list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <li>Open the copied link in <strong className="text-slate-800 dark:text-slate-200">Safari</strong> browser</li>
                  <li>Tap the <strong className="text-slate-800 dark:text-slate-200">Share</strong> button (box with an up arrow at the bottom)</li>
                  <li>Scroll down and tap <strong className="text-slate-800 dark:text-slate-200">"Add to Home Screen"</strong></li>
                </ol>
              </div>

              {/* Android Chrome Steps */}
              <div className="space-y-2 border-l-2 border-blue-500 pl-3">
                <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest block">
                  For Android Phone (Chrome)
                </span>
                <ol className="list-decimal list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <li>Open the copied link in <strong className="text-slate-800 dark:text-slate-200">Chrome</strong> browser</li>
                  <li>Tap the <strong className="text-slate-800 dark:text-slate-200">Menu</strong> icon (3 dots in top-right)</li>
                  <li>Tap <strong className="text-slate-800 dark:text-slate-200">"Install app"</strong> or <strong className="text-slate-800 dark:text-slate-200">"Add to Home screen"</strong></li>
                </ol>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end">
              <button
                type="button"
                onClick={() => setShowInstallGuide(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
