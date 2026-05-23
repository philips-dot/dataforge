'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SkillXP } from '@/types'
import { ALL_BADGES } from '@/types'

interface ActivityEntry {
  id: string
  type: 'lesson' | 'mission' | 'badge' | 'streak'
  label: string
  xp?: number
  skill?: keyof SkillXP
  timestamp: number
}

interface UserStore {
  // XP
  xp: SkillXP
  addXP: (xp: Partial<SkillXP>, label: string) => void

  // Progress
  completedLessons: string[]
  completedMissions: string[]
  markLessonComplete: (lessonId: string, xp: Partial<SkillXP>, label: string) => void
  markMissionComplete: (missionId: string, xp: Partial<SkillXP>) => void

  // Current session
  currentLesson: { lessonId: string; phase: number } | null
  setCurrentLesson: (lessonId: string, phase: number) => void
  clearCurrentLesson: () => void

  currentMission: { missionId: string; stepIndex: number } | null
  setCurrentMission: (missionId: string, stepIndex: number) => void
  clearCurrentMission: () => void

  // Streak
  streak: number
  lastActiveDate: string | null
  updateStreak: () => void

  // Badges
  unlockedBadges: string[]
  checkAndUnlockBadges: () => string[]

  // Activity
  recentActivity: ActivityEntry[]
  addActivity: (entry: Omit<ActivityEntry, 'id' | 'timestamp'>) => void

  // Level up modal
  showLevelUp: boolean
  levelUpFrom: number
  levelUpTo: number
  triggerLevelUp: (from: number, to: number) => void
  clearLevelUp: () => void
}

function getTodayStr() {
  return new Date().toISOString().slice(0, 10)
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      xp: { sql: 0, business: 0, optimization: 0, python: 0, dashboard: 0 },
      completedLessons: [],
      completedMissions: [],
      currentLesson: null,
      currentMission: null,
      streak: 0,
      lastActiveDate: null,
      unlockedBadges: [],
      recentActivity: [],
      showLevelUp: false,
      levelUpFrom: 0,
      levelUpTo: 0,

      addXP: (xpGain, label) => {
        const prev = get().xp
        const newXP = { ...prev }
        for (const [k, v] of Object.entries(xpGain)) {
          const key = k as keyof SkillXP
          newXP[key] = (newXP[key] ?? 0) + (v ?? 0)
        }
        set({ xp: newXP })
        get().updateStreak()
      },

      markLessonComplete: (lessonId, xp, label) => {
        const { completedLessons, addXP, addActivity, checkAndUnlockBadges } = get()
        if (completedLessons.includes(lessonId)) return
        addXP(xp, label)
        const newCompleted = [...completedLessons, lessonId]
        set({ completedLessons: newCompleted })
        const mainSkill = Object.entries(xp).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))[0]
        addActivity({
          type: 'lesson',
          label,
          xp: mainSkill ? (mainSkill[1] ?? 0) : 0,
          skill: mainSkill ? (mainSkill[0] as keyof SkillXP) : undefined,
        })
        const newBadges = checkAndUnlockBadges()
        for (const b of newBadges) {
          addActivity({ type: 'badge', label: `Badge débloqué : ${ALL_BADGES.find(x => x.id === b)?.name}` })
        }
      },

      markMissionComplete: (missionId, xp) => {
        const { completedMissions, addXP, addActivity, checkAndUnlockBadges } = get()
        if (completedMissions.includes(missionId)) return
        addXP(xp, 'Mission complétée')
        set({ completedMissions: [...completedMissions, missionId], currentMission: null })
        addActivity({ type: 'mission', label: 'Mission complétée' })
        checkAndUnlockBadges()
      },

      setCurrentLesson: (lessonId, phase) => set({ currentLesson: { lessonId, phase } }),
      clearCurrentLesson: () => set({ currentLesson: null }),

      setCurrentMission: (missionId, stepIndex) => set({ currentMission: { missionId, stepIndex } }),
      clearCurrentMission: () => set({ currentMission: null }),

      updateStreak: () => {
        const today = getTodayStr()
        const { lastActiveDate, streak, addActivity } = get()
        if (lastActiveDate === today) return
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
        let newStreak = lastActiveDate === yesterday ? streak + 1 : 1
        if (newStreak === 3 || newStreak === 7) {
          addActivity({ type: 'streak', label: `Série de ${newStreak} jours démarrée 🔥` })
        }
        set({ streak: newStreak, lastActiveDate: today })
      },

      checkAndUnlockBadges: () => {
        const { xp, completedLessons, completedMissions, streak, unlockedBadges } = get()
        const newlyUnlocked: string[] = []
        const checks: Record<string, boolean> = {
          'first-lesson':  completedLessons.length >= 1,
          'cost-fighter':  xp.optimization >= 100,
          'streak-3':      streak >= 3,
          'first-mission': completedMissions.length >= 1,
          'diagnostician': completedMissions.length >= 2,
          'sql-master':    xp.sql >= 500,
          'week-7':        streak >= 7,
        }
        for (const [id, met] of Object.entries(checks)) {
          if (met && !unlockedBadges.includes(id)) newlyUnlocked.push(id)
        }
        if (newlyUnlocked.length > 0) {
          set({ unlockedBadges: [...unlockedBadges, ...newlyUnlocked] })
        }
        return newlyUnlocked
      },

      addActivity: (entry) => {
        const id = Math.random().toString(36).slice(2)
        set(state => ({
          recentActivity: [{ ...entry, id, timestamp: Date.now() }, ...state.recentActivity].slice(0, 20),
        }))
      },

      triggerLevelUp: (from, to) => set({ showLevelUp: true, levelUpFrom: from, levelUpTo: to }),
      clearLevelUp: () => set({ showLevelUp: false }),
    }),
    {
      name: 'dataforge-user',
      partialize: (state) => ({
        xp: state.xp,
        completedLessons: state.completedLessons,
        completedMissions: state.completedMissions,
        currentLesson: state.currentLesson,
        currentMission: state.currentMission,
        streak: state.streak,
        lastActiveDate: state.lastActiveDate,
        unlockedBadges: state.unlockedBadges,
        recentActivity: state.recentActivity,
      }),
    }
  )
)
