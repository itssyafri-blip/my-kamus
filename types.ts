export enum AppView {
  HOME = 'HOME',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD'
}

export interface Language {
  code: string;
  name: string;
}

export interface TranslationState {
  sourceText: string;
  targetText: string;
  sourceLang: string;
  targetLang: string;
  isLoading: boolean;
  error: string | null;
}

export interface AdminSettings {
  username: string;
  password: string; // In a real app, this would be hashed on backend
  logoUrl: string | null;
}

export interface TTSConfig {
  speed: number; // 0.5 to 2.0
  voice: 'Kore' | 'Puck' | 'Fenrir' | 'Charon';
}