// Horsera MVP — Complete Mock Data
// All data is sample/placeholder for MVP. Replace with real data layer post-MVP.

// ─────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────

export type MilestoneState = 'untouched' | 'working' | 'mastered';
export type RideType = 'training' | 'lesson' | 'mock-test' | 'hack';
export type DisciplineTrack = 'usdf' | 'pony-club' | 'hunter-jumper';

export interface BiometricsSnapshot {
  lowerLegStability:   number;
  reinSteadiness:      number;
  reinSymmetry:        number;
  coreStability:       number;
  upperBodyAlignment:  number;
  pelvisStability:     number;
}

export interface Milestone {
  id: string;
  name: string;
  state: MilestoneState;
  ridesConsistent: number;
  ridesRequired: number;
  biomechanicsFocus: string[];
  ridingQuality: string;
  performanceTasks: string[];
  exercises: Exercise[];
  description: string;
}

export interface Exercise {
  id: string;
  name: string;
  type: 'on-saddle' | 'off-saddle';
  duration: string;
  description: string;
}

export interface Goal {
  id: string;
  name: string;
  track: DisciplineTrack;
  level: string;
  test: string;
  targetDate: string;
  milestones: Milestone[];
}

export interface Ride {
  id: string;
  date: string;
  horse: string;
  type: RideType;
  duration: number;
  focusMilestone: string;
  reflection: string;
  trainerFeedback?: string;
  cadenceInsight?: string;
  signal: 'improving' | 'consistent' | 'needs-work';
  biometrics?: BiometricsSnapshot;
  videoUploaded: boolean;
  milestoneId: string;
}

export interface Rider {
  id: string;
  name: string;
  firstName: string;
  horse: string;
  trainer: string;
  track: DisciplineTrack;
  currentGoalId: string;
  upcomingCompetition?: {
    name: string;
    date: string;
    level: string;
    tests: string[];
    daysAway: number;
  };
}

export interface WeeklyPattern {
  day: string;
  ridden: boolean;
  duration?: number;
  isToday: boolean;
}

// ─────────────────────────────────────────────────────────
// RIDER
// ─────────────────────────────────────────────────────────

export const mockRider: Rider = {
  id: 'rider-001',
  name: 'Rossella Vitali',
  firstName: 'Rossella',
  horse: 'Allegra',
  trainer: 'Sarah Mitchell',
  track: 'usdf',
  currentGoalId: 'goal-001',
  upcomingCompetition: {
    name: 'USDF Spring Classic',
    date: '2026-03-31',
    level: 'Training Level',
    tests: ['Test 1', 'Test 2'],
    daysAway: 21,
  },
};

// ─────────────────────────────────────────────────────────
// EXERCISES
// ─────────────────────────────────────────────────────────

export const exercises: Record<string, Exercise[]> = {
  'lower-leg-stability': [
    {
      id: 'ex-001',
      name: 'Stirrup-less trot circles',
      type: 'on-saddle',
      duration: '5 min',
      description: 'Remove stirrups and trot on a 20m circle. Focus on letting your leg hang heavy and your ankle absorb the movement. Do not grip with the knee.',
    },
    {
      id: 'ex-002',
      name: 'Two-point position transitions',
      type: 'on-saddle',
      duration: '3 min',
      description: 'Alternate between two-point and full-seat in trot. Helps you feel the difference between a gripping leg and a weighted, following leg.',
    },
    {
      id: 'ex-003',
      name: 'Ankle circles (off-saddle)',
      type: 'off-saddle',
      duration: '2 min',
      description: 'Standing on one foot, rotate your ankle through its full range. Builds flexibility and awareness in the ankle joint.',
    },
  ],
  'rein-steadiness': [
    {
      id: 'ex-004',
      name: 'Tunnel rein exercise',
      type: 'on-saddle',
      duration: '5 min',
      description: 'Imagine your reins are inside a tunnel — they can only move forward and back, never up or sideways. Walk and trot while maintaining this constraint.',
    },
    {
      id: 'ex-005',
      name: 'Shoulder blade pinch',
      type: 'off-saddle',
      duration: '2 min',
      description: 'Stand tall and gently draw shoulder blades together and down. Hold for 5 seconds. Releases tension that causes hand movement.',
    },
  ],
  'core-stability': [
    {
      id: 'ex-006',
      name: 'Posting trot without stirrups',
      type: 'on-saddle',
      duration: '4 min',
      description: 'Post the trot without stirrups. The rise must come purely from core engagement, not the knee. Builds deep seat muscle activation.',
    },
    {
      id: 'ex-007',
      name: 'Plank hold',
      type: 'off-saddle',
      duration: '3 × 30 sec',
      description: 'Hold a forearm plank. Engage your pelvic floor gently. This activates the same deep core muscles you use to stabilize your seat.',
    },
  ],
};

// ─────────────────────────────────────────────────────────
// GOAL + MILESTONES
// ─────────────────────────────────────────────────────────

export const mockGoal: Goal = {
  id: 'goal-001',
  name: 'USDF Training Level',
  track: 'usdf',
  level: 'Training Level',
  test: 'Test 1',
  targetDate: '2026-03-31',
  milestones: [
    {
      id: 'ms-001',
      name: 'Lower Leg Stability',
      state: 'working',
      ridesConsistent: 3,
      ridesRequired: 5,
      biomechanicsFocus: ['Lower Leg Stability', 'Knee Angle Stability', 'Heel Position'],
      ridingQuality: 'Balance & Rhythm',
      performanceTasks: ['20m trot circle', 'Walk–trot transitions'],
      exercises: exercises['lower-leg-stability'],
      description: 'A stable lower leg anchors everything else. When your leg swings, your whole body compensates. This milestone builds the foundation your Training Level work depends on.',
    },
    {
      id: 'ms-002',
      name: 'Rein Steadiness',
      state: 'working',
      ridesConsistent: 4,
      ridesRequired: 5,
      biomechanicsFocus: ['Rein Steadiness', 'Rein Symmetry', 'Elbow Elasticity'],
      ridingQuality: 'Contact',
      performanceTasks: ['Free walk on long rein', 'Consistent contact in trot'],
      exercises: exercises['rein-steadiness'],
      description: 'Steady, elastic hands create consistent contact — the foundation of a horse\'s trust and throughness. This milestone focuses on reducing unnecessary hand movement.',
    },
    {
      id: 'ms-003',
      name: 'Core Stability',
      state: 'mastered',
      ridesConsistent: 5,
      ridesRequired: 5,
      biomechanicsFocus: ['Core Stability', 'Pelvis Vertical Stability', 'Trunk Angle Stability'],
      ridingQuality: 'Rhythm & Relaxation',
      performanceTasks: ['Canter transitions', 'Sitting trot'],
      exercises: exercises['core-stability'],
      description: 'A stable, elastic core allows you to follow the horse\'s movement without bouncing or bracing. Mastering this enables everything from better sitting trot to cleaner canter transitions.',
    },
    {
      id: 'ms-004',
      name: 'Upper Body Alignment',
      state: 'untouched',
      ridesConsistent: 0,
      ridesRequired: 5,
      biomechanicsFocus: ['Upper Body Vertical Alignment', 'Shoulder Levelness', 'Torso Rotation'],
      ridingQuality: 'Straightness',
      performanceTasks: ['Straight lines on centerline', 'Halt and salute'],
      exercises: [],
      description: 'Vertical alignment through the upper body creates straightness and allows aids to be applied cleanly. This milestone addresses leaning, collapsing, and rotation habits.',
    },
    {
      id: 'ms-005',
      name: 'Symmetry & Balance',
      state: 'untouched',
      ridesConsistent: 0,
      ridesRequired: 5,
      biomechanicsFocus: ['Left-Right Symmetry Index', 'Rider Centerline Alignment', 'Pelvis Levelness'],
      ridingQuality: 'Straightness & Balance',
      performanceTasks: ['Equal circles both directions', 'Balanced free walk'],
      exercises: [],
      description: 'True straightness requires the rider to be symmetrical. This milestone addresses the left-right imbalances that cause crookedness in both horse and rider.',
    },
  ],
};

// ─────────────────────────────────────────────────────────
// RIDES
// ─────────────────────────────────────────────────────────

export const mockRides: Ride[] = [
  {
    id: 'ride-001',
    date: '2026-03-09',
    horse: 'Allegra',
    type: 'training',
    duration: 45,
    focusMilestone: 'Lower Leg Stability',
    reflection: 'Felt much more stable on the left rein today. Right rein still feels like my leg wants to creep forward. The stirrup-less work at the end really helped.',
    trainerFeedback: 'Good progress on the lower leg. Watch the right heel — it\'s coming up in the trot-canter transitions. Try the two-point exercise before each canter departure.',
    cadenceInsight: 'Your lower leg stability score improved by 12% compared to your last 3 rides. The drift is now mainly on the right rein — a consistent pattern across 4 sessions.',
    signal: 'improving',
    videoUploaded: true,
    milestoneId: 'ms-001',
    biometrics: {
      lowerLegStability:  0.72,
      reinSteadiness:     0.81,
      reinSymmetry:       0.76,
      coreStability:      0.88,
      upperBodyAlignment: 0.79,
      pelvisStability:    0.84,
    },
  },
  {
    id: 'ride-002',
    date: '2026-03-07',
    horse: 'Allegra',
    type: 'lesson',
    duration: 60,
    focusMilestone: 'Rein Steadiness',
    reflection: 'Hard lesson. My hands kept moving during the trot circles. Sarah had me do the tunnel exercise which helped a lot by the end.',
    trainerFeedback: 'Really good second half once you found the tunnel feeling. Keep that image in your mind for every transition. Homework: shoulder blade pinches daily.',
    cadenceInsight: 'Rein steadiness was notably better in the second 20 minutes of this ride — consistent with your pattern of warming into the work.',
    signal: 'improving',
    videoUploaded: true,
    milestoneId: 'ms-002',
    biometrics: {
      lowerLegStability:  0.68,
      reinSteadiness:     0.74,
      reinSymmetry:       0.71,
      coreStability:      0.86,
      upperBodyAlignment: 0.77,
      pelvisStability:    0.82,
    },
  },
  {
    id: 'ride-003',
    date: '2026-03-05',
    horse: 'Allegra',
    type: 'training',
    duration: 40,
    focusMilestone: 'Lower Leg Stability',
    reflection: 'Shorter ride today — Allegra was a bit spooky. Still managed 20 minutes of focused work. Leg felt OK.',
    signal: 'consistent',
    videoUploaded: false,
    milestoneId: 'ms-001',
    biometrics: {
      lowerLegStability:  0.65,
      reinSteadiness:     0.78,
      reinSymmetry:       0.73,
      coreStability:      0.85,
      upperBodyAlignment: 0.76,
      pelvisStability:    0.80,
    },
  },
  {
    id: 'ride-004',
    date: '2026-03-04',
    horse: 'Allegra',
    type: 'training',
    duration: 50,
    focusMilestone: 'Rein Steadiness',
    reflection: 'Good ride. Really tried to keep my elbows soft. Free walk felt connected.',
    signal: 'improving',
    videoUploaded: false,
    milestoneId: 'ms-002',
  },
  {
    id: 'ride-005',
    date: '2026-03-03',
    horse: 'Allegra',
    type: 'training',
    duration: 45,
    focusMilestone: 'Core Stability',
    reflection: 'Practiced sitting trot without stirrups for the first time in a while. Harder than I remembered but feels right.',
    signal: 'consistent',
    videoUploaded: false,
    milestoneId: 'ms-003',
  },
];

// ─────────────────────────────────────────────────────────
// WEEKLY PATTERN
// ─────────────────────────────────────────────────────────

export const mockWeek: WeeklyPattern[] = [
  { day: 'M', ridden: true,  duration: 45, isToday: false },
  { day: 'T', ridden: true,  duration: 60, isToday: false },
  { day: 'W', ridden: false,              isToday: false },
  { day: 'T', ridden: true,  duration: 50, isToday: false },
  { day: 'F', ridden: true,  duration: 40, isToday: false },
  { day: 'S', ridden: false,              isToday: false },
  { day: 'S', ridden: false,              isToday: true  },
];

// ─────────────────────────────────────────────────────────
// BIOMETRICS TRENDS (for Insights screen)
// ─────────────────────────────────────────────────────────

export const biometricsTrend = [
  { date: 'Feb 10', lowerLeg: 0.55, reins: 0.60, core: 0.75, upperBody: 0.68, pelvis: 0.72 },
  { date: 'Feb 17', lowerLeg: 0.58, reins: 0.65, core: 0.78, upperBody: 0.70, pelvis: 0.75 },
  { date: 'Feb 24', lowerLeg: 0.63, reins: 0.70, core: 0.82, upperBody: 0.74, pelvis: 0.79 },
  { date: 'Mar 03', lowerLeg: 0.65, reins: 0.74, core: 0.85, upperBody: 0.76, pelvis: 0.80 },
  { date: 'Mar 07', lowerLeg: 0.68, reins: 0.74, core: 0.86, upperBody: 0.77, pelvis: 0.82 },
  { date: 'Mar 09', lowerLeg: 0.72, reins: 0.81, core: 0.88, upperBody: 0.79, pelvis: 0.84 },
];

// Cadence pattern insights
export const cadenceInsights = {
  home: 'Your rein steadiness improved across the last 3 rides. Lower leg is now your main unlock for Training Level Test 1.',
  journey: 'Based on your last 6 rides, you\'re on track to consolidate Lower Leg Stability by late March — right before the Spring Classic.',
  insights: 'Core Stability is your strongest area — mastered. The pattern across your last 8 rides shows rein steadiness improving consistently. Lower leg stability is improving but shows right-rein drift that may need targeted focus.',
  rideDetail: 'This ride showed a 12% improvement in lower leg stability. The right-rein drift pattern appeared again — 4 consecutive rides with the same pattern. This is likely worth discussing with Sarah at your next lesson.',
};
