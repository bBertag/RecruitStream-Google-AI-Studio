
import React from 'react';
import { LayoutDashboard, GraduationCap, User, MessageSquare, Flame, CheckCircle2, XCircle, Search } from 'lucide-react';
import { RecruitingStage, College, Athlete } from './types';

export const STAGE_CONFIG: Record<RecruitingStage, { color: string; border: string; bg: string }> = {
  [RecruitingStage.IDENTIFIED]: { color: 'text-gray-400', border: 'border-gray-800', bg: 'bg-gray-900/40' },
  [RecruitingStage.CONTACTED]: { color: 'text-blue-400', border: 'border-blue-900/50', bg: 'bg-blue-900/10' },
  [RecruitingStage.TWO_WAY_INTEREST]: { color: 'text-purple-400', border: 'border-purple-900/50', bg: 'bg-purple-900/10' },
  [RecruitingStage.VISIT_SCHEDULED]: { color: 'text-orange-400', border: 'border-orange-900/50', bg: 'bg-orange-900/10' },
  [RecruitingStage.OFFER]: { color: 'text-green-400', border: 'border-green-900/50', bg: 'bg-green-900/10' },
  [RecruitingStage.COMMITTED]: { color: 'text-teal-400', border: 'border-teal-900/50', bg: 'bg-teal-900/10' },
  [RecruitingStage.NOT_MOVING_FORWARD]: { color: 'text-red-400', border: 'border-red-900/50', bg: 'bg-red-900/10' },
};

export const ALL_DIVISIONS = [
  'NCAA D1',
  'NCAA D2',
  'NCAA D3',
  'NAIA',
  'NJCAA D1',
  'NJCAA D2',
  'NJCAA D3',
  'CCCAA (California JUCO)',
  'Other'
];

export const INITIAL_COLLEGES: College[] = [
  {
    id: '1',
    name: 'University of Florida',
    division: 'NCAA D1',
    location: 'Gainesville, FL',
    stage: RecruitingStage.VISIT_SCHEDULED,
    interest: 5,
    coaches: [{ name: 'Billy Napier', title: 'Head Coach' }, { name: 'Rob Sale', title: 'OL Coach' }],
    interactions: [
      { id: 'i1', date: '2026-02-12', type: 'Text', coachName: 'Rob Sale', notes: 'Discussed campus visit details and weight room session.' },
      { id: 'i2', date: '2026-01-15', type: 'Call', coachName: 'Billy Napier', notes: 'Introduction call.' }
    ],
  },
  {
    id: '2',
    name: 'University of Michigan',
    division: 'NCAA D1',
    location: 'Ann Arbor, MI',
    stage: RecruitingStage.CONTACTED,
    interest: 4,
    coaches: [{ name: 'Sherrone Moore', title: 'Head Coach' }],
    interactions: [{ id: 'i3', date: '2026-02-11', type: 'Email', coachName: 'Recruiting Staff', notes: 'Sent transcripts and highlight reel update.' }],
  },
  {
    id: '3',
    name: 'Utah State University',
    division: 'NCAA D1',
    location: 'Logan, UT',
    stage: RecruitingStage.VISIT_SCHEDULED,
    interest: 2,
    coaches: [{ name: 'Nate Dreiling', title: 'Interim HC' }],
    interactions: [{ id: 'i4', date: '2026-02-11', type: 'Email', coachName: 'Recruiting Staff', notes: 'Responded to questionnaire.' }],
  },
  {
    id: '4',
    name: 'Baltimore City Community College',
    division: 'NJCAA D2',
    location: 'Baltimore, MD',
    stage: RecruitingStage.IDENTIFIED,
    interest: 1,
    coaches: [],
    interactions: [{ id: 'i5', date: '2026-02-11', type: 'Email', coachName: 'None', notes: 'Initial outreach sent.' }],
  },
  {
    id: '5',
    name: 'Ohio State University',
    division: 'NCAA D1',
    location: 'Columbus, OH',
    stage: RecruitingStage.IDENTIFIED,
    interest: 4,
    coaches: [{ name: 'Ryan Day', title: 'Head Coach' }],
    interactions: [],
  },
  {
    id: '6',
    name: 'University of Alabama',
    division: 'NCAA D1',
    location: 'Tuscaloosa, AL',
    stage: RecruitingStage.TWO_WAY_INTEREST,
    interest: 4,
    coaches: [{ name: 'Kalen DeBoer', title: 'Head Coach' }],
    interactions: [{ id: 'i6', date: '2026-01-20', type: 'Visit', coachName: 'Kalen DeBoer', notes: 'Game day visit.' }],
  },
  {
    id: '7',
    name: 'Miles Community College',
    division: 'NJCAA D2',
    location: 'Miles City, MT',
    stage: RecruitingStage.COMMITTED,
    interest: 5,
    coaches: [],
    interactions: [{ id: 'i7', date: '2026-02-01', type: 'Call', coachName: 'Coach X', notes: 'Verbally committed!' }],
  }
];

export const INITIAL_ATHLETE: Athlete = {
  name: 'Bertag Machine',
  sport: 'Football',
  position: 'Offensive Line (OT/OG)',
  class: '2027',
  gpa: '3.85',
  height: "6'5\"",
  weight: '295 lbs',
  hometown: 'Atlanta, GA',
  highschool: 'Northside Prep Academy',
  stats: {
    'Bench Press': '355 lbs',
    'Squat': '515 lbs',
    '40-Yard Dash': '5.2s',
    'Wingspan': "81\"",
  },
  bio: 'Dominant offensive lineman with high football IQ and elite mobility. 4-star recruit seeking a program with strong engineering curriculum and championship culture.',
  profileImage: 'https://picsum.photos/seed/athlete1/100/100',
  highlightVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  socialLinks: {
    twitter: 'https://twitter.com/marcusj_ol',
    instagram: 'https://instagram.com/tank_johnson77',
    hudl: 'https://hudl.com/profile/marcusjohnson'
  }
};
