// ─── Localised text ──────────────────────────────────────────────────
export interface LocaleText {
  fr: string
  en?: string
}

// ─── XP ──────────────────────────────────────────────────────────────
export interface SkillXP {
  sql: number
  business: number
  optimization: number
  python: number
  dashboard: number
}

// ─── Level ───────────────────────────────────────────────────────────
export interface Level {
  level: number
  title: string
  minXP: number
  maxXP: number
}

export const LEVELS: Level[] = [
  { level: 1, title: 'Débutant',         minXP: 0,    maxXP: 200  },
  { level: 2, title: 'Junior',           minXP: 200,  maxXP: 500  },
  { level: 3, title: 'Analyst',          minXP: 500,  maxXP: 1000 },
  { level: 4, title: 'Data Analyst',     minXP: 1000, maxXP: 1600 },
  { level: 5, title: 'Senior Analyst',   minXP: 1600, maxXP: 3000 },
  { level: 6, title: 'Lead Data Analyst',minXP: 3000, maxXP: 99999},
]

export function getLevelInfo(totalXP: number): Level & { progress: number } {
  const lvl = LEVELS.findLast(l => totalXP >= l.minXP) ?? LEVELS[0]
  const progress = Math.min(100, ((totalXP - lvl.minXP) / (lvl.maxXP - lvl.minXP)) * 100)
  return { ...lvl, progress }
}

export function getTotalXP(xp: SkillXP): number {
  return Object.values(xp).reduce((a, b) => a + b, 0)
}

// ─── Badge ───────────────────────────────────────────────────────────
export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  condition: string
}

export const ALL_BADGES: Badge[] = [
  { id: 'first-lesson',  name: 'Premier pas',     description: 'Complète ta première leçon',       icon: '🎯', condition: 'lessons >= 1'  },
  { id: 'cost-fighter',  name: 'Cost Fighter',     description: 'Optimise une requête en -90%',     icon: '💰', condition: 'optimization >= 100' },
  { id: 'streak-3',      name: 'En feu',           description: 'Maintiens une série de 3 jours',   icon: '🔥', condition: 'streak >= 3'   },
  { id: 'first-mission', name: 'Opérationnel',     description: 'Complète ta première mission',     icon: '⚡', condition: 'missions >= 1' },
  { id: 'diagnostician', name: 'Diagnostician',    description: 'Résous une panne en production',   icon: '🔬', condition: 'missions >= 2' },
  { id: 'sql-master',    name: 'SQL Master',        description: 'Atteins 500 XP en SQL',            icon: '🏆', condition: 'sql >= 500'    },
  { id: 'week-7',        name: '7 jours',           description: 'Série de 7 jours consécutifs',     icon: '📅', condition: 'streak >= 7'   },
  { id: 'finisher',      name: 'Finisher',          description: 'Complète un parcours entier',      icon: '🎓', condition: 'track_complete'},
]

// ─── Track ────────────────────────────────────────────────────────────
export type Difficulty = 'beginner' | 'intermediate' | 'advanced'
export type TrackColor = 'indigo' | 'emerald' | 'violet'

export interface Track {
  id: string
  title: LocaleText
  description: LocaleText
  outcomeStatement: LocaleText
  icon: string
  color: TrackColor
  difficulty: Difficulty
  estimatedHours: number
  lessonCount: number
  isPremium: boolean
  skills: string[]
}

// ─── Lesson ───────────────────────────────────────────────────────────
export interface SlackMessage {
  author: string
  role: string
  avatar: string
  time: string
  content: LocaleText
}

export interface CodeExample {
  language: string
  code: string
  explanation: LocaleText
}

export interface Lesson {
  id: string
  trackId: string
  order: number
  title: LocaleText
  type: string
  estimatedMinutes: number
  xpReward: Partial<SkillXP>
  isPremium: boolean
  businessAlert: {
    urgency: 'low' | 'medium' | 'high' | 'critical'
    trigger: LocaleText
    financialImpact: LocaleText
    costOfIgnorance: LocaleText
    slackMessage: SlackMessage
  }
  whyItMatters: {
    businessLogic: LocaleText
    realWorldExample: LocaleText
    proVsJunior: { junior: LocaleText; pro: LocaleText }
  }
  concept: {
    headline: LocaleText
    explanation: LocaleText
    beforeExample: CodeExample
    afterExample: CodeExample
    costBefore: number
    costAfter: number
  }
  practice: {
    instructions: LocaleText
    businessContext: LocaleText
    starterCode: string
    hints: LocaleText[]
    mentorContext: LocaleText
    validationRules: Array<{ type: string; value: string | number; errorMessage: LocaleText }>
  }
  roiDebrief: {
    savingsPercent: number
    monthlySavingsUSD: number
    annualSavingsUSD: number
    careerImpactStatement: LocaleText
    interviewTalkingPoint: LocaleText
    nextLessonTeaser: LocaleText
  }
}

// ─── Mission ─────────────────────────────────────────────────────────
export interface MissionSlackMessage extends SlackMessage {
  isUrgent: boolean
}

export interface MissionStep {
  id: string
  type: 'read_context' | 'write_sql' | 'analyze_cost' | 'explain_business'
  xpReward: number
  instructions: LocaleText
  businessRationale: LocaleText
  validation?: {
    type: string
    minScore?: number
    maxCostUSD?: number
    requiredColumns?: string[]
    requiredKeywords?: string[]
    value?: number
  }
}

export interface Mission {
  id: string
  title: LocaleText
  description: LocaleText
  difficulty: Difficulty
  domain: string
  estimatedMinutes: number
  xpReward: Partial<SkillXP>
  recommendedLessons: string[]
  isPremium: boolean
  company: { name: string; type: string; sector: string }
  situation: LocaleText
  expectedDeliverable: LocaleText
  businessConstraint: LocaleText
  slackMessages: MissionSlackMessage[]
  jiraTicket: { id: string; priority: string; title: LocaleText }
  kpiAlerts?: Array<{ metric: string; value: number; previousValue: number; changePercent: number }>
  steps: MissionStep[]
  solution: { sql: string; seniorInsight: LocaleText }
}
