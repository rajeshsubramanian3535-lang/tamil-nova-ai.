import { Flashcard } from "../types";

export const SAMPLE_FLASHCARDS: Flashcard[] = [
  // General Scenario
  {
    id: "g1",
    tamil: "வணக்கம்",
    transliteration: "Vanakkam",
    english: "Hello / Greetings",
    scenario: "General",
    explanation: "The standard and respectful greeting used in Tamil culture. Equivalent to 'Hello' or 'Hi'."
  },
  {
    id: "g2",
    tamil: "நீங்கள் எப்படி இருக்கிறீர்கள்?",
    transliteration: "Neengal eppadi irukkireergall?",
    english: "How are you?",
    scenario: "General",
    explanation: "A polite way to ask about someone's well-being. 'Neengal' is the respectful plural/formal form of 'you'."
  },
  {
    id: "g3",
    tamil: "உங்களை சந்தித்ததில் மகிழ்ச்சி",
    transliteration: "Ungalai santhithathil magizhchi",
    english: "Nice to meet you",
    scenario: "General",
    explanation: "A polite phrase used when meeting someone for the first time."
  },
  {
    id: "g4",
    tamil: "மிக்க நன்றி",
    transliteration: "Mikka nandri",
    english: "Thank you very much",
    scenario: "General",
    explanation: "Expressing deep gratitude. 'Nandri' means thank you, and 'Mikka' means very much."
  },

  // Doctor Scenario
  {
    id: "d1",
    tamil: "எனக்கு உடம்பு சரியில்லை",
    transliteration: "Enakku udambu sariyillai",
    english: "I am not feeling well",
    scenario: "Doctor",
    explanation: "A standard way to tell a healthcare professional or colleague you are sick. Literally translates to 'My body is not correct'."
  },
  {
    id: "d2",
    tamil: "எனக்கு காய்ச்சலாக இருக்கிறது",
    transliteration: "Enakku kaaichalaga irukkirathu",
    english: "I have a fever",
    scenario: "Doctor",
    explanation: "Used to report body temperature symptoms. 'Kaaichal' means fever."
  },
  {
    id: "d3",
    tamil: "இந்த மாத்திரையை எப்போது சாப்பிட வேண்டும்?",
    transliteration: "Intha maathiraiyai eppothu saapida vendum?",
    english: "When should I take this pill?",
    scenario: "Doctor",
    explanation: "Asking for instructions on prescription timing. 'Maathirai' means pill/tablet."
  },
  {
    id: "d4",
    tamil: "எனக்கு நெஞ்சு வலி இருக்கிறது",
    transliteration: "Enakku nenju vali irukkirathu",
    english: "I have chest pain",
    scenario: "Doctor",
    explanation: "Reporting critical symptoms. 'Nenju' means chest and 'vali' means pain."
  },

  // Police Scenario
  {
    id: "p1",
    tamil: "எனக்கு உதவி வேண்டும்",
    transliteration: "Enakku udhavi vendum",
    english: "I need help",
    scenario: "Police",
    explanation: "A direct cry for assistance. Useful in any emergency scenario."
  },
  {
    id: "p2",
    tamil: "என் பை தொலைந்துவிட்டது",
    transliteration: "En bahi tholainthuvittathu",
    english: "My bag is lost",
    scenario: "Police",
    explanation: "Used to report lost items to law enforcement or lost-and-found. 'Bahi' means bag."
  },
  {
    id: "p3",
    tamil: "சாலையில் ஒரு விபத்து நடந்துள்ளது",
    transliteration: "Saalaiyil oru vibathu nadanthullathu",
    english: "There is an accident on the road",
    scenario: "Police",
    explanation: "Reporting a road traffic accident. 'Vibathu' means accident."
  },
  {
    id: "p4",
    tamil: "இங்கே காவல் நிலையம் எங்கே இருக்கிறது?",
    transliteration: "Inge kaaval nilaiyam enge irukkirathu?",
    english: "Where is the police station here?",
    scenario: "Police",
    explanation: "Asking for directions to the nearest police station. 'Kaaval nilaiyam' means police station."
  },

  // Lawyer Scenario
  {
    id: "l1",
    tamil: "எனது சட்டபூர்வமான உரிமைகள் என்ன?",
    transliteration: "Enathu sattapoorvamaana urimaigal enna?",
    english: "What are my legal rights?",
    scenario: "Lawyer",
    explanation: "Asking for legal clarification of rights. 'Sattapoorvamaana' means legal, and 'urimaigal' means rights."
  },
  {
    id: "l2",
    tamil: "நான் ஒரு வழக்கறிஞரை சந்திக்க வேண்டும்",
    transliteration: "Naan oru vazhakkarignarai santhikka vendum",
    english: "I need to consult a lawyer",
    scenario: "Lawyer",
    explanation: "Expressing the need to hire or speak with legal counsel. 'Vazhakkarignar' is a lawyer."
  },
  {
    id: "l3",
    tamil: "இந்த ஒப்பந்தத்தில் நான் கையெழுத்திட வேண்டுமா?",
    transliteration: "Intha oppanthathil naan kaiyezhuthida venduma?",
    english: "Do I need to sign this contract?",
    scenario: "Lawyer",
    explanation: "Asking for legal advice before executing a formal document. 'Oppantham' means agreement/contract."
  },

  // Teacher Scenario
  {
    id: "t1",
    tamil: "எனக்கு ஒரு சந்தேகம் உள்ளது",
    transliteration: "Enakku oru sandhegam ullathu",
    english: "I have a doubt / question",
    scenario: "Teacher",
    explanation: "Commonly used in South Asian classrooms to ask a question or request clarification. 'Sandhegam' literally means doubt."
  },
  {
    id: "t2",
    tamil: "இதை எனக்கு மீண்டும் விளக்க முடியுமா?",
    transliteration: "Ithai enakku meendum vilakka mudiyuma?",
    english: "Can you explain this to me again?",
    scenario: "Teacher",
    explanation: "Politely asking a teacher or tutor to review a concept. 'Vilakka' means to explain."
  },
  {
    id: "t3",
    tamil: "வீட்டுப்பாடம் எப்போது சமர்ப்பிக்க வேண்டும்?",
    transliteration: "Veettuppaadam eppothu samarppikka vendum?",
    english: "When should the homework be submitted?",
    scenario: "Teacher",
    explanation: "Asking about homework submission deadlines. 'Veettuppaadam' is homework."
  },

  // Shopping/Travel Scenario
  {
    id: "s1",
    tamil: "இதன் விலை என்ன?",
    transliteration: "Ithan vilai enna?",
    english: "What is the price of this?",
    scenario: "Shopping/Travel",
    explanation: "The most vital question when shopping. 'Vilai' means price."
  },
  {
    id: "s2",
    tamil: "எனக்கு தள்ளுபடி கிடைக்குமா?",
    transliteration: "Enakku thallupadi kidaikkuma?",
    english: "Can I get a discount?",
    scenario: "Shopping/Travel",
    explanation: "Asking for a lower price or promotional offer. 'Thallupadi' means discount."
  },
  {
    id: "s3",
    tamil: "ரயில் நிலையம் எங்கே உள்ளது?",
    transliteration: "Rayil nilaiyam enge ullathu?",
    english: "Where is the railway station?",
    scenario: "Shopping/Travel",
    explanation: "Asking for essential travel directions. 'Rayil' is train, and 'nilaiyam' is station."
  },
  {
    id: "s4",
    tamil: "இங்கே நல்ல சைவ உணவகம் எங்குள்ளது?",
    transliteration: "Inge nalla saiva unavagam engullathu?",
    english: "Where is a good vegetarian restaurant here?",
    scenario: "Shopping/Travel",
    explanation: "Finding dining spots. 'Saiva' means vegetarian, and 'unavagam' means restaurant."
  }
];
