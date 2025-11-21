
export enum Subject {
  Science = 'Science',
  Mathematics = 'Mathematics',
  Chinese = 'Chinese',
  English = 'English',
  Malay = 'Malay'
}

export enum Grade {
  P1 = 'P1',
  P2 = 'P2',
  P3 = 'P3',
  P4 = 'P4',
  P5 = 'P5',
  P6 = 'P6'
}

export type Language = 'en' | 'zh';

export interface Material {
  id: string;
  title: string;
  type: 'Document' | 'PDF' | 'Presentation' | 'Spreadsheet' | 'Folder';
  date: string;
  link?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

export interface DriveStats {
  used: string;
  total: string;
  percent: number;
  userDisplayName?: string;
}

export interface SmartFileAttributes {
  grade: string;
  subject: string;
  topic: string;
  year: string;
}

export interface SmartFileProposal {
  originalName: string;
  suggestedName: string;
  detectedSubject: Subject | string;
  detectedGrade: Grade | string;
  attributes: SmartFileAttributes;
  targetPath: string;
  targetLink?: string;
  confidence: number;
}

export const SUBJECTS_LIST = [
  Subject.Science,
  Subject.Mathematics,
  Subject.Chinese,
  Subject.English,
  Subject.Malay
];

export const GRADES_LIST = [
  Grade.P1,
  Grade.P2,
  Grade.P3,
  Grade.P4,
  Grade.P5,
  Grade.P6
];
