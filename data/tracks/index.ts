import type { Track } from '@/types'

export const TRACKS: Track[] = [
  {
    id: 'sql-cost',
    title: { fr: 'SQL & Coûts BigQuery', en: 'SQL & BigQuery Costs' },
    description: {
      fr: 'Écris du SQL qui ne ruine pas ton entreprise. Comprends pourquoi chaque requête a un prix.',
      en: 'Write SQL that does not bankrupt your company.',
    },
    outcomeStatement: {
      fr: "Tu peux écrire des requêtes BigQuery optimisées, expliquer leur coût à ton manager, et diagnostiquer un dépassement de budget en moins d'une heure.",
    },
    icon: 'terminal',
    color: 'indigo',
    difficulty: 'beginner',
    estimatedHours: 6,
    lessonCount: 5,
    isPremium: false,
    skills: ['SQL', 'BigQuery', 'Optimisation'],
  },
  {
    id: 'business-analytics',
    title: { fr: 'Métriques Business', en: 'Business Metrics' },
    description: {
      fr: 'CAC, LTV, churn, funnel de conversion. Les KPIs que chaque data analyst doit maîtriser.',
    },
    outcomeStatement: {
      fr: 'Tu peux construire et interpréter les métriques business clés, et présenter un insight au management de façon convaincante.',
    },
    icon: 'trending-up',
    color: 'emerald',
    difficulty: 'intermediate',
    estimatedHours: 5,
    lessonCount: 4,
    isPremium: false,
    skills: ['Business', 'SQL', 'Dashboard'],
  },
  {
    id: 'data-engineering',
    title: { fr: 'Pipelines & Fiabilité', en: 'Pipelines & Reliability' },
    description: {
      fr: "Construis des pipelines qui ne tombent pas en prod. Comprends ce qu'un incident data coûte vraiment.",
    },
    outcomeStatement: {
      fr: "Tu peux concevoir un pipeline robuste, diagnostiquer une panne en production, et calculer son coût business.",
    },
    icon: 'git-branch',
    color: 'violet',
    difficulty: 'advanced',
    estimatedHours: 8,
    lessonCount: 5,
    isPremium: true,
    skills: ['Python', 'Pipeline', 'Optimisation'],
  },
]
