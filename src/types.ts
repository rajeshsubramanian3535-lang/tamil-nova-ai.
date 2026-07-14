export type Scenario = "General" | "Doctor" | "Police" | "Lawyer" | "Teacher" | "Shopping/Travel" | "Custom";

export interface VocabularyItem {
  tamil: string;
  transliteration: string;
  english: string;
  pronunciation: string;
}

export interface TutorResponse {
  translation: string;
  alternatives: string[];
  corrections: string;
  vocabulary: VocabularyItem[];
  culturalNotes: string;
  tutorResponse: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
  tutoring?: TutorResponse;
  loading?: boolean;
}

export interface Flashcard {
  id: string;
  tamil: string;
  transliteration: string;
  english: string;
  scenario: Scenario;
  explanation: string;
}
