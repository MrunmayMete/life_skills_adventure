// Fix: Import ReactNode to resolve the 'Cannot find namespace React' error.
import type { ReactNode } from 'react';

export interface User {
  name: string;
}

export interface Activity {
  title: string;
  description: string;
  icon: ReactNode;
}

export interface Story {
    title: string;
    content: string;
    skill: string;
}

export interface VolunteerActivity {
  title: string;
  description: string;
  ngo: string;
  registrationLink: string;
  emoji: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface TimeManagementTask {
  name: string;
  category: 'Home' | 'Academic' | 'Personal';
  emoji: string;
}

export interface Peer {
  id: number;
  name: string;
  emoji: string;
  streak: number;
  status: string;
}

export interface CalendarEvent {
  id: number;
  date: string; // YYYY-MM-DD format
  title: string;
  type: 'school' | 'personal';
}

export interface MoodEntry {
  date: string; // ISO string format
  emoji: string | null;
  text: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface DailyGoal {
  text: string;
  completed: boolean;
  date: string;
}