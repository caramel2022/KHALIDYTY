export interface LessonSection {
  id: number;
  title: string;
  subtitle?: string;
  duration: string; // e.g., "20 min"
  content: string[];
  type: 'speaking' | 'writing' | 'reading';
}

export interface LessonPlan {
  level: string; // e.g., "Niveau 4"
  period: string; // e.g., "Période 3"
  week: string; // e.g., "Semaine 2"
  session: string; // e.g., "Séance 3"
  sections: LessonSection[];
}

export enum ActivityType {
  SPEAKING = 'speaking',
  WRITING = 'writing',
  READING = 'reading'
}