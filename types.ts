
export enum RecruitingStage {
  IDENTIFIED = 'Identified',
  CONTACTED = 'Contacted',
  TWO_WAY_INTEREST = 'Two-Way Interest',
  VISIT_SCHEDULED = 'Visit Scheduled',
  OFFER = 'Offer',
  COMMITTED = 'Committed',
  NOT_MOVING_FORWARD = 'Not Moving Forward'
}

export type InteractionType = 'Email' | 'Text' | 'Call' | 'Visit' | 'DM' | 'Camp';

export interface Interaction {
  id: string;
  date: string;
  type: InteractionType;
  coachName: string;
  notes: string;
}

export interface College {
  id: string;
  name: string;
  division: string;
  location: string;
  stage: RecruitingStage;
  interest: number; // 1-5
  interactions: Interaction[];
  logo?: string;
  website?: string;
  coaches: { name: string; title: string; email?: string }[];
}

export interface Athlete {
  name: string;
  sport: string;
  position: string;
  class: string;
  gpa: string;
  height: string;
  weight: string;
  hometown: string;
  highschool: string;
  stats: Record<string, string>;
  bio: string;
  profileImage?: string;
  highlightVideoUrl?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    hudl?: string;
  };
}
