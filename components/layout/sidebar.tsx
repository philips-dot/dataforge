'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, BookOpen, Zap, Terminal, MessageCircle, TrendingUp, Building2 } from 'lucide-react'
import { useUserStore } from '@/store/user-store'
import { useUser } from '@clerk/nextjs'
import { getTotalXP, getLevelInfo } from '@/types'

const NAV_ITEMS = [
  { href: '/home',       icon: Home,          label: 'Accueil',         protected: false },
  { href: '/learn',      icon: BookOpen,       label: 'Fondamentaux',    protected: false },
  { href: '/missions',   icon: Zap,            label: 'Missions',        protected: false },
  { href: '/playground', icon: Terminal,       label: 'SQL Playground',  protected: false },
  { href: '/mentor',     icon: MessageCircle,  label: 'Mentor IA',       protected: false },
  { href: '/progress',   icon: TrendingUp,     label: 'Ma progression',  protected: false },
  { href: '/company',    icon: Building2,      label: 'Mon entreprise',  protected: false },
]

export function Sidebar() {
  const pathname = usePathname()
  const { xp, streak, currentMission } = useUserStore()
  const { user } = useUser()
  const totalXP = getTotalXP(xp)
  const { title: planTitle } = getLevelInfo(totalXP)

  return (
    <aside
      style={{
        width: 240,
        minHeight: '100vh',
        background: '#0a0a12',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 40,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px' }}>
        <Link href="/home" style={{ textDecoration: 'none' }}>
          <span style={{
            fontSize: 20,
            fontWeight: 800,
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px',
          }}>
            DataForge
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 12px' }}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const hasBadge = item.href === '/missions' && currentMission !== null
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none', display: 'block', marginBottom: 2 }}>
              <div style={{ position: 'relative' }}>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(99,102,241,0.12)',
                      borderRadius: 8,
                      borderLeft: '2px solid #6366f1',
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 12px',
                  borderRadius: 8,
                  color: isActive ? '#f8fafc' : '#64748b',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: 14,
                  position: 'relative',
                  transition: 'color 0.2s',
                }}>
                  <item.icon size={16} />
                  <span>{item.label}</span>
                  {hasBadge && (
                    <span style={{
                      marginLeft: 'auto',
                      background: '#ef4444',
                      color: '#fff',
                      borderRadius: 99,
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '2px 6px',
                      lineHeight: 1,
                    }}>!</span>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '16px 16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Streak */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 18 }}>🔥</span>
          <span style={{
            fontSize: 13,
            color: streak > 0 ? '#f97316' : '#64748b',
            fontWeight: streak > 0 ? 600 : 400,
          }}>
            {streak > 0 ? `${streak} jour${streak > 1 ? 's' : ''} de suite` : 'Pas encore de série'}
          </span>
        </div>

        {/* User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>
            {user?.firstName?.[0] ?? user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.firstName ?? 'Utilisateur'}
            </div>
            <div style={{ fontSize: 11, color: '#6366f1', fontWeight: 600 }}>{planTitle}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
