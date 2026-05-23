'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
      setVisible(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const links = [
    { label: 'Fondamentaux', href: '#fondamentaux' },
    { label: 'Missions', href: '#missions' },
    { label: 'Tarifs', href: '#tarifs' },
    { label: 'À propos', href: '#apropos' },
  ]

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>

      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -10 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          backgroundColor: scrolled ? 'rgba(5,5,8,0.95)' : 'rgba(5,5,8,0.8)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          transition: 'background-color 0.3s',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 16 }}>D</div>
            <span style={{ fontSize: 18, fontWeight: 700 }}>
              <span style={{ color: 'rgba(255,255,255,0.95)' }}>Data</span>
              <span style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Forge</span>
            </span>
          </a>

          {/* Liens desktop */}
          <nav style={{ display: 'flex', gap: 32 }} className="hidden-mobile">
            {links.map(link => (
              <a
                key={link.label}
                href={link.href}
                style={{ color: 'rgba(255,255,255,0.60)', fontSize: 15, textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.95)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.60)')}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.60)', fontSize: 15, cursor: 'pointer', padding: '8px 12px' }}
                  className="hidden-mobile"
                >
                  Connexion
                </button>
              </SignInButton>
              <SignInButton mode="modal">
                <button style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: '1px solid rgba(99,102,241,0.4)', color: 'white', borderRadius: 8, padding: '8px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}>
                  Commencer gratuitement
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            {/* Hamburger mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 8 }}
              className="show-mobile"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Menu mobile */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: 64,
              left: 0,
              right: 0,
              zIndex: 49,
              backgroundColor: 'rgba(5,5,8,0.98)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            {links.map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{ color: 'rgba(255,255,255,0.80)', fontSize: 17, textDecoration: 'none', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
