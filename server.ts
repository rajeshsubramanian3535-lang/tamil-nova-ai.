import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable standard CORS headers so external PWA Builders/checkers can parse manifest.json and icons without CORS blocks
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type,Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

// Force immediate serving of public static directory for manifest.json, sw.js, and launcher icons
app.use(express.static(path.join(process.cwd(), "public")));

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
  console.warn("WARNING: GEMINI_API_KEY is not defined in the environment. Falling back to simulated tutor responses.");
}

const ai = new GoogleGenAI({
  apiKey: apiKey || "MOCK_KEY",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// JSON Schema for strict type response
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    translation: {
      type: Type.STRING,
      description: "An elegant, natural English translation of the Tamil text."
    },
    alternatives: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "2 or 3 alternative ways to express the same meaning in English (formal, casual, polite)."
    },
    corrections: {
      type: Type.STRING,
      description: "Constructive feedback on grammar, sentence structure, or pronunciation hints."
    },
    vocabulary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          tamil: { type: Type.STRING },
          transliteration: { type: Type.STRING },
          english: { type: Type.STRING },
          pronunciation: { type: Type.STRING }
        },
        required: ["tamil", "transliteration", "english", "pronunciation"]
      },
      description: "Key words or phrases from the input or relevant to the scenario."
    },
    culturalNotes: {
      type: Type.STRING,
      description: "Etiquette, professional norms, or context notes for the English-speaking scenario."
    },
    tutorResponse: {
      type: Type.STRING,
      description: "A friendly conversational feedback message, asking a natural follow-up question or encouraging them."
    }
  },
  required: ["translation", "alternatives", "corrections", "vocabulary", "culturalNotes", "tutorResponse"]
};

// Helper function to generate mock responses when API key is missing or when API call fails
function generateTutoringFallback(text: string, scenario: string, fromLang: string = "Tamil", toLang: string = "English", accent: string = "American") {
  const trimmedText = text.trim();
  const textLower = trimmedText.toLowerCase();

  // If practicing a custom language direction or English-to-English, return dynamic guide instructions
  if (fromLang !== "Tamil" || toLang !== "English") {
    const isEnglishToEnglish = fromLang === "English" && toLang === "English";
    const languagePairText = isEnglishToEnglish ? `correcting and refining English mistakes using ${accent} English` : `translating from ${fromLang} to ${toLang} with ${accent} English dialect custom vocabulary`;
    
    return {
      translation: isEnglishToEnglish ? trimmedText : `[AI Practice: "${trimmedText}"]`,
      alternatives: [
        isEnglishToEnglish ? `Alternative phrasing in polished ${accent} English` : `How would you say this in ${toLang}?`,
        isEnglishToEnglish ? `More formal/polite version of your phrase` : `Alternative phrasing in ${toLang}`
      ],
      corrections: isEnglishToEnglish 
        ? `To get real-time automatic grammar corrections, spelling adjustments, and phrasing suggestions in polished ${accent} English, please connect your Gemini AI model!`
        : `Practicing translation from ${fromLang} to ${toLang} is fully supported but requires connecting the live Gemini AI model. Please provide your Gemini API key in the 'Settings > Secrets' (top-right of your screen) panel!`,
      vocabulary: [
        { tamil: trimmedText, transliteration: "Interactive Phrase", english: isEnglishToEnglish ? `Polished ${accent} English` : `Translation in ${toLang}`, pronunciation: "In-ter-ac-tiv" }
      ],
      culturalNotes: `To unlock customized vocabulary, alternative phrases, grammar tips, and dialect-specific cultural etiquette for ${accent} English, please save your Gemini API key.`,
      tutorResponse: isEnglishToEnglish
        ? `I received your English phrase: "${trimmedText}". To turn me into a fully interactive English grammar checker and accent coach who corrects your mistakes in ${accent} English (e.g. using ${accent === "British" ? "cinema/lift" : accent === "Indian" ? "theatre/elevator" : "movies/elevator"}), please save your Gemini API key in 'Settings > Secrets' (top-right of your screen)!`
        : `I received your phrase in ${fromLang}: "${trimmedText}". To practice dynamic real-time roleplay and translation from ${fromLang} to ${toLang}, please provide your Gemini API key in 'Settings > Secrets' (top-right of your screen). Once added, I will converse with you fluently as your interactive ${toLang} tutor!`
    };
  }

  // Rich dictionary matching Tamil script and transliterated Tamil (Tanglish)
  const fallbackDictionary = [
    {
      keywords: ["வணக்கம்", "vanakkam", "wanakkam", "hello", "hi"],
      data: {
        translation: "Hello / Greetings!",
        alternatives: ["Hi there!", "Good morning!", "Greetings to you!"],
        corrections: "வணக்கம் (Vanakkam) is the standard respectful Tamil greeting. In English, 'Hello' is universal. You can also use 'Good morning' or 'Good afternoon' depending on the time of day.",
        vocabulary: [
          { tamil: "வணக்கம்", transliteration: "Vanakkam", english: "Hello / Greetings", pronunciation: "Va-nahk-kahm" },
          { tamil: "காலை வணக்கம்", transliteration: "Kaalai Vanakkam", english: "Good morning", pronunciation: "Kaa-lai Va-nahk-kahm" }
        ],
        culturalNotes: "In English-speaking environments, a greeting is usually accompanied by a warm smile and a friendly wave or handshake in professional settings.",
        tutorResponse: "Fantastic start! Let's learn more. How would you ask for help? Try saying 'எனக்கு உதவி வேண்டும்' (I need help)."
      }
    },
    {
      keywords: ["உடம்பு சரியில்லை", "udambu sariyillai", "odambu sariyilla", "udambu sari illa", "sick", "illness"],
      data: {
        translation: "I am not feeling well.",
        alternatives: ["I'm feeling sick.", "I feel unwell.", "I am under the weather."],
        corrections: "'உடம்பு சரியில்லை' literally means 'body is not okay'. In English, instead of saying 'my body is not correct', we say 'I am not feeling well' or 'I feel sick'. 'Under the weather' is a beautiful idiomatic way of saying you feel slightly ill.",
        vocabulary: [
          { tamil: "உடம்பு", transliteration: "Udambu", english: "Body", pronunciation: "Oo-dum-boo" },
          { tamil: "சரியில்லை", transliteration: "Sariyillai", english: "Not well", pronunciation: "Suh-ree-yil-lai" },
          { tamil: "மருத்துவர்", transliteration: "Maruthuvar", english: "Doctor", pronunciation: "Muh-ruh-thuh-vur" }
        ],
        culturalNotes: "When visiting a doctor in English-speaking countries, it's customary to be very specific about symptoms, such as 'I have a fever' or 'My head hurts'.",
        tutorResponse: "Excellent translation request! If you are at a hospital, you might also want to say 'Call the doctor'. Try to translate that next!"
      }
    },
    {
      keywords: ["உதவி வேண்டும்", "udhavi vendum", "udhavi vendum", "enaku udhavi", "help me", "assistance"],
      data: {
        translation: "I need help.",
        alternatives: ["Could you help me?", "I require assistance, please.", "Please assist me."],
        corrections: "'உதவி' (Udhavi) means help, and 'வேண்டும்' (Vendum) means want/need. In English, 'I need help' is direct, while 'Could you help me?' is a polite and friendly way to ask strangers.",
        vocabulary: [
          { tamil: "உதவி", transliteration: "Udhavi", english: "Help", pronunciation: "Oo-dhuh-vee" },
          { tamil: "வேண்டும்", transliteration: "Vendum", english: "Need / Want", pronunciation: "Vayn-doom" }
        ],
        culturalNotes: "Adding 'please' at the end of requests ('Help me, please') is highly valued and considered polite etiquette in English-speaking societies.",
        tutorResponse: "Perfect! You're learning quickly. Let's try another one. How would you report a lost bag? Try saying 'என் பை தொலைந்துவிட்டது' (My bag is lost)."
      }
    },
    {
      keywords: ["பை தொலைந்துவிட்டது", "pai tholainthu", "bag is lost", "tholainthuvittathu", "lost bag"],
      data: {
        translation: "My bag is lost.",
        alternatives: ["I have lost my bag.", "My luggage is missing.", "My bag has gone missing."],
        corrections: "'என்' (En) means my, 'பை' (Pai) means bag, and 'தொலைந்துவிட்டது' (Tholainthuvittathu) means has been lost. In English, 'My bag is lost' is the most direct way to inform security or the police.",
        vocabulary: [
          { tamil: "பை", transliteration: "Pai", english: "Bag / Pocket", pronunciation: "Pie" },
          { tamil: "தொலைந்துவிட்டது", transliteration: "Tholainthuvittathu", english: "Lost", pronunciation: "Tho-line-thu-vit-tuh-thu" }
        ],
        culturalNotes: "When reporting lost property, describe the item's appearance clearly (e.g., 'It's a black backpack' or 'It's a blue suitcase').",
        tutorResponse: "Wonderful! You are doing amazing. Let's practice how to talk to a teacher. How would you say 'I have a doubt' or 'I have a question'?"
      }
    },
    {
      keywords: ["என்ன தேவை", "enna thevai", "unakku enna", "unnkku enna", "vunaku enna", "vunaku ena", "unakku ena", "what do you need", "what do you want"],
      data: {
        translation: "What do you want?",
        alternatives: ["What do you need?", "How can I help you?", "Is there something you require?"],
        corrections: "'உனக்கு' (Unakku) means to you, 'என்ன' (Enna) means what, and 'தேவை' (Thevai) means need. In English, 'What do you want?' can sound a bit direct or blunt. If you want to be extremely polite, you can say 'How can I help you?' or 'What do you need?'.",
        vocabulary: [
          { tamil: "என்ன", transliteration: "Enna", english: "What", pronunciation: "En-nah" },
          { tamil: "தேவை", transliteration: "Thevai", english: "Need", pronunciation: "Thay-vye" },
          { tamil: "உனக்கு", transliteration: "Unakku", english: "To you", pronunciation: "Oo-nahk-koo" }
        ],
        culturalNotes: "In retail or professional service, staff will almost always greet you with 'How can I help you?' or 'What can I do for you today?' rather than 'What do you want?'.",
        tutorResponse: "Incredible! This was exactly what you wanted to learn! If you ask someone this, they will answer you. Let's try another phrase, like 'எப்படி இருக்கிறாய்' (How are you?)."
      }
    },
    {
      keywords: ["எப்படி இருக்கிறாய்", "eppadi irukiraai", "eppadi irukkinga", "eppadi irukeenga", "epdi irukinga", "how are you"],
      data: {
        translation: "How are you?",
        alternatives: ["How are you doing?", "How's it going?", "Are you doing well?"],
        corrections: "'எப்படி' (Eppadi) means how, and 'இருக்கிறாய்' (Irukiraai) is the form of 'to be' for 'you' (singular/informal). 'இருக்கிறீர்கள்' or 'இருக்கீங்க' (Irukeenga) is formal/respectful. In English, 'How are you?' is standard and used for everyone.",
        vocabulary: [
          { tamil: "எப்படி", transliteration: "Eppadi", english: "How", pronunciation: "Ep-puh-dee" },
          { tamil: "இருக்கிறாய்", transliteration: "Irukiraai", english: "Are you", pronunciation: "Ih-roo-kih-rye" }
        ],
        culturalNotes: "In Western culture, 'How are you?' is often used as a greeting where the expected answer is a short, positive one like 'I'm good, thanks! How are you?'.",
        tutorResponse: "Superb! If someone asks you 'How are you?', you should answer 'I am doing well!'. How would you translate 'நல்லா இருக்கேன்' (I am doing well)?"
      }
    },
    {
      keywords: ["பெயர் என்ன", "un peyar", "peyar enna", "unnoda peyar", "what is your name"],
      data: {
        translation: "What is your name?",
        alternatives: ["Could you tell me your name?", "May I know your name?", "Who am I speaking with?"],
        corrections: "'உன்' (Un) means your, 'பெயர்' (Peyar) means name, and 'என்ன' (Enna) means what. In English, the direct question 'What is your name?' is very common, but 'May I know your name?' is a softer, highly polite version.",
        vocabulary: [
          { tamil: "பெயர்", transliteration: "Peyar", english: "Name", pronunciation: "Pay-yur" },
          { tamil: "என்ன", transliteration: "Enna", english: "What", pronunciation: "En-nah" }
        ],
        culturalNotes: "When meeting someone for the first time, it's polite to offer your name first, e.g., 'Hello, I'm Rajesh. What is your name?'.",
        tutorResponse: "Wonderful! You're learning the essentials of natural conversation. Let's try saying thank you: 'நன்றி' (Nandri)!"
      }
    },
    {
      keywords: ["நன்றி", "nandri", "nanri", "thank you", "thanks"],
      data: {
        translation: "Thank you!",
        alternatives: ["Thanks a lot!", "Thank you very much.", "I appreciate it."],
        corrections: "'நன்றி' (Nandri) is the classic respectful Tamil word for thanks. In English, 'Thank you' is suitable for all occasions, while 'Thanks' is perfect for casual situations.",
        vocabulary: [
          { tamil: "நன்றி", transliteration: "Nandri", english: "Thank you", pronunciation: "Nuhn-dree" }
        ],
        culturalNotes: "In English-speaking culture, people say 'Thank you' very frequently—for small favors, service in shops, and when receiving compliments.",
        tutorResponse: "You are doing amazing! You've mastered the core daily greetings. Keep practicing!"
      }
    },
    {
      keywords: ["நீ யார்", "nee yaar", "ne yaar", "who are you"],
      data: {
        translation: "Who are you?",
        alternatives: ["May I know who you are?", "Could you introduce yourself?", "Who am I talking to?"],
        corrections: "'நீ' (Nee) means you, and 'யார்' (Yaar) means who. In English, 'Who are you?' is standard but can sound sharp if said to a stranger. Asking 'May I know who you are?' is gentler.",
        vocabulary: [
          { tamil: "நீ", transliteration: "Nee", english: "You", pronunciation: "Nee" },
          { tamil: "யார்", transliteration: "Yaar", english: "Who", pronunciation: "Yahr" }
        ],
        culturalNotes: "Introductions are highly valued. A good response is 'I am your English tutor!'.",
        tutorResponse: "Splendid! I am Nova, your language coach. Now let's try another phrase!"
      }
    },
    {
      keywords: ["புரியவில்லை", "puriyavillai", "puriyala", "enaku puriyala", "dont understand", "i don't understand"],
      data: {
        translation: "I don't understand.",
        alternatives: ["I'm sorry, I didn't get that.", "Could you explain that again?", "I don't quite follow."],
        corrections: "'புரியவில்லை' (Puriyavillai) means 'not understood'. In English, 'I don't understand' is correct, but native speakers often say 'I didn't catch that' or 'Could you repeat that, please?' if they want someone to say something again.",
        vocabulary: [
          { tamil: "புரியவில்லை", transliteration: "Puriyavillai", english: "Do not understand", pronunciation: "Poo-ri-yuh-vil-lai" }
        ],
        culturalNotes: "If you don't understand something in an English conversation, it is completely normal and polite to ask the other person to slow down or repeat themselves.",
        tutorResponse: "Excellent request! Knowing how to express that you don't understand is one of the most useful skills for a language learner."
      }
    }
  ];

  // Try to find a matched entry in our rich bilingual dictionary
  const matchedEntry = fallbackDictionary.find(entry => 
    entry.keywords.some(keyword => textLower.includes(keyword) || keyword.includes(textLower))
  );

  if (matchedEntry) {
    return matchedEntry.data;
  }

  // Generic backup translator that encourages saving the API key and gives a supportive bilingual message
  return {
    translation: "I am ready to translate this! (Offline Demo Mode)",
    alternatives: [
      "Could you please translate this phrase?",
      "How do we express this in everyday English?"
    ],
    corrections: "To unlock live, 100% real-time translations for ANY phrase, connect your Gemini API Key in 'Settings > Secrets' (top-right of your screen). If you have already added a key, you may have temporarily exceeded your Gemini free-tier daily quota limit (429 Resource Exhausted) - please try again later or add a paid key.",
    vocabulary: [
      { tamil: trimmedText, transliteration: "Tamil term", english: "Pending API connection", pronunciation: "Connect API key" }
    ],
    culturalNotes: "Learning English is an exciting journey! Getting interactive feedback on any custom sentence is most effective when the real-time AI is active and has available quota.",
    tutorResponse: `I received your phrase: "${trimmedText}". To get custom translations and personalized coaching, please ensure your Gemini API key is configured in the Secrets panel. If a key is active, you might have temporarily hit your daily free-tier quota (429 Resource Exhausted). Try speaking demo phrases like "வணக்கம்" or "உடம்பு சரியில்லை" to see how our interactive tutor works offline!`
  };
}

// API Routes
const handleTutorRequest = async (req: any, res: any) => {
  try {
    const { text, scenario, fromLanguage = "Tamil", toLanguage = "English", accent = "American" } = req.body;
    
    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Text input is required." });
    }
    
    const activeScenario = scenario || "General";
    
    // Read the API key dynamically from the environment
    const currentApiKey = process.env.GEMINI_API_KEY;
    const isMockKey = !currentApiKey || currentApiKey === "MY_GEMINI_API_KEY" || currentApiKey.trim() === "";

    if (isMockKey) {
      const mockData = generateTutoringFallback(text, activeScenario, fromLanguage, toLanguage, accent);
      return res.json({ tutoring: mockData });
    }

    // Lazy load the GoogleGenAI instance with the latest active API Key
    const activeAI = new GoogleGenAI({
      apiKey: currentApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const isEnglishToEnglish = fromLanguage === "English" && toLanguage === "English";

    // Call Gemini API with proper system instructions
    const systemInstruction = `You are "Nova", an interactive, professional, and incredibly encouraging AI Language Tutor and Roleplay Partner.
The user is trying to learn and practice how to converse ${isEnglishToEnglish ? "and refine their English grammar, spelling, and phrasing mistakes entirely" : `from "${fromLanguage}" to "${toLanguage}"`} in real-world situations, specifically for a "${activeScenario}" scenario.

CRITICAL ROLEPLAY RULE:
In your "tutorResponse" field, you MUST fully adopt and act in the character/persona of the professional or situational counterpart for this scenario (e.g., if the scenario is "Police", act as a Police Officer; if "Doctor", act as a clinic physician; if a custom scenario, act as that specific character!).
- Speak directly in character to the user in "${toLanguage}", responding dynamically to what they said, asking natural follow-up questions to keep the practice going.
- Keep your language clear, natural, and friendly for a language learner.

DIALECT & VOCABULARY ACCENT RULE:
The user has requested practicing with the **${accent} English** variant dialect style.
You MUST write all "${toLanguage}" outputs (including "translation", "alternatives", and "tutorResponse") using the actual, authentic vocabulary, slang, spelling conventions, and phrasing characteristic of **${accent} English**!
Examples of word/phrase choices you MUST adhere to:
- **British English**: Use words like 'cinema' (not 'movies'), 'lift' (not 'elevator'), 'biscuit' (not 'cookie'), 'pavement' (not 'sidewalk'), 'colour/favour/theatre' (not 'color/favor/theater'), 'flat' (not 'apartment'), 'trousers' (not 'pants'), 'autumn' (not 'fall'), 'chemist' (not 'pharmacy'), 'boot' (not 'trunk').
- **American English**: Use words like 'movies', 'elevator', 'cookie', 'sidewalk', 'color/favor/theater', 'apartment', 'pants', 'fall', 'drugstore/pharmacy', 'trunk'.
- **Indian English**: Use words like 'theatre' or 'cinema', 'lift/elevator', 'biscuit', 'footpath' (not 'sidewalk'), 'curd' (not 'yogurt'), 'postpone/prepone' (to reschedule earlier), 'pass out' (meaning graduate/finish college), 'on the fan' (meaning turn on the fan), 'brinjal' (eggplant), 'capsicum' (bell pepper), 'out of station' (out of town), and standard polite phrasing common in Indian English.
- **Australian English**: Use words like 'cinema', 'lift', 'biscuit', 'footpath', 'colour', 'lollies' (candy), 'arvo' (afternoon), 'barbie' (barbeque), 'chemist' (pharmacy), 'mate', 'macca\\'s'.

In your 'translation', 'alternatives', and 'tutorResponse', make sure to strictly apply these **${accent} English** specific spelling conventions and word choices! If British is selected, do not use 'movies', use 'cinema'.

Your goal:
1. ${isEnglishToEnglish ? `Analyze the user's English input for any spelling, punctuation, grammar, or usage mistakes. In the "translation" field, output a corrected, refined, and highly polished version of their input in correct ${accent} English suitable for the "${activeScenario}" scenario.` : `Translate the user's expression from "${fromLanguage}" into natural, idiomatically correct, and high-quality "${toLanguage}" in ${accent} English suitable for the "${activeScenario}" scenario.`}
2. Offer 2 to 3 practical, context-appropriate alternative phrases in "${toLanguage}" (formal vs. casual, polite, or urgent) they can use, tailored to ${accent} English style.
3. Provide simple, supportive grammatical coaching or corrections in the "corrections" field. ${isEnglishToEnglish ? `Explain exactly what mistakes you corrected in their phrase, what the grammar rules are, and why the polished version is better.` : `Explain any corrections made and point out differences between how "${fromLanguage}" expressions are structured vs. how "${toLanguage}" expressions are structured.`}
4. Extract key vocabulary terms (up to 4 terms) from their input or relevant to this scenario. In the "vocabulary" array:
   - Save the source "${fromLanguage}" word in "tamil".
   - Save its Romanized transliteration or reading aid in "transliteration" (if from Tamil/Telugu/Hindi/Malayalam; if from English, just put the original English word or phonetic helper).
   - Save its corrected, polished "${toLanguage}" equivalent in "english" conforming to the ${accent} dialect.
   - Provide a simple phonetic pronunciation guide for the source word in "pronunciation".
5. Provide a quick cultural or situational etiquette note for the chosen scenario (tailored to ${accent} speaking cultures if applicable).
6. Write your in-character, helpful, and engaging response in "tutorResponse" in "${toLanguage}" using ${accent} English vocabulary, prompting the user to reply in "${fromLanguage}" (or in English if practicing English-to-English) and keep practicing.

You MUST respond strictly in valid JSON matching the response schema.`;

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    let responseText: string | undefined;
    let apiSuccess = false;
    let lastError: any = null;

    // Define the sequence of models to try in case of 503 or other rate limits/temporary errors.
    // We prioritize gemini-3.1-flash-lite and gemini-flash-latest to avoid hitting the strict free-tier quota of gemini-3.5-flash (which is limited to 20 requests per day).
    const modelsToTry = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.5-flash"];

    for (const modelName of modelsToTry) {
      if (apiSuccess) break;

      const maxRetries = 3;
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`Calling Gemini API using model: ${modelName} (Attempt ${attempt}/${maxRetries})...`);
          
          const response = await activeAI.models.generateContent({
            model: modelName,
            contents: [
              { role: "user", parts: [{ text: `Scenario: ${activeScenario}\nInput phrase: ${text}\nTranslate from ${fromLanguage} to ${toLanguage}` }] }
            ],
            config: {
              systemInstruction,
              responseMimeType: "application/json",
              responseSchema: responseSchema,
              temperature: 0.7,
            }
          });

          responseText = response.text;
          if (responseText) {
            apiSuccess = true;
            break; // Success! Break out of retry loop
          } else {
            throw new Error("Empty response text from Gemini API");
          }
        } catch (err: any) {
          lastError = err;
          const errMsg = String(err.message || err);
          console.warn(`Attempt ${attempt} for model ${modelName} failed:`, errMsg);
          
          const isRateLimit = err.status === 429 || 
                              err.statusCode === 429 || 
                              errMsg.includes("429") || 
                              errMsg.includes("RESOURCE_EXHAUSTED") || 
                              errMsg.includes("quota") ||
                              errMsg.includes("Quota");

          if (isRateLimit) {
            console.warn(`Model ${modelName} hit quota limit (429/RESOURCE_EXHAUSTED). Skipping remaining retries for this model to save latency.`);
            break; // Break out of the attempt retry loop for this model
          }
          
          // If it's a 503 (temporary unavailability) or other temporary errors, we can wait and retry.
          if (attempt < maxRetries) {
            const backoffMs = attempt * 1500;
            console.log(`Waiting ${backoffMs}ms before next retry...`);
            await sleep(backoffMs);
          }
        }
      }
    }

    try {
      if (!apiSuccess || !responseText) {
        throw lastError || new Error("Failed to get response from all configured Gemini models");
      }

      const parsed = JSON.parse(responseText);
      res.json({ tutoring: parsed });
    } catch (apiError: any) {
      console.warn("All Gemini API attempts and fallback models exhausted. Automatically using local tutoring fallback:", apiError.message || apiError);
      const mockData = generateTutoringFallback(text, activeScenario, fromLanguage, toLanguage, accent);
      res.json({ tutoring: mockData });
    }

  } catch (error: any) {
    console.error("Critical Tutoring Error:", error);
    res.status(500).json({
      error: "An error occurred while generating tutoring response.",
      details: error.message
    });
  }
};

app.post("/api/tutor", handleTutorRequest);
app.post("/api/translate", handleTutorRequest);

// Start server function to handle Vite middlewares
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TamilNova AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
