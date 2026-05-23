'use client';

import { Github, Linkedin, Twitter } from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
}

const productLinks: FooterLink[] = [
  { label: 'Fondamentaux', href: '/fondamentaux' },
  { label: 'Missions', href: '/missions' },
  { label: 'SQL Playground', href: '/playground' },
  { label: 'Mentor IA', href: '/mentor' },
  { label: 'Tarifs', href: '/tarifs' },
];

const resourceLinks: FooterLink[] = [
  { label: 'Blog', href: '/blog' },
  { label: 'À propos', href: '/a-propos' },
  { label: 'Carrières', href: '/carrieres' },
  { label: 'Contact', href: '/contact' },
];

const legalLinks: FooterLink[] = [
  { label: 'CGU', href: '/cgu' },
  { label: 'Politique de confidentialité', href: '/confidentialite' },
  { label: 'Mentions légales', href: '/mentions-legales' },
];

const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com/dataforge', label: 'Twitter/X' },
  { icon: Linkedin, href: 'https://linkedin.com/company/dataforge', label: 'LinkedIn' },
  { icon: Github, href: 'https://github.com/dataforge', label: 'GitHub' },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: FooterLink[];
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h4
        style={{
          margin: 0,
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--text-primary)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        {title}
      </h4>
      <ul
        style={{
          margin: 0,
          padding: 0,
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              style={{
                fontSize: 14,
                color: 'var(--text-muted)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  'var(--text-secondary)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  'var(--text-muted)';
              }}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '64px 24px 32px',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* 4 columns grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 40,
            marginBottom: 0,
          }}
        >
          {/* Col 1 — Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Logo */}
            <a
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="1" width="5" height="5" rx="1.5" fill="white" opacity="0.9" />
                  <rect x="8" y="1" width="5" height="5" rx="1.5" fill="white" opacity="0.6" />
                  <rect x="1" y="8" width="5" height="5" rx="1.5" fill="white" opacity="0.6" />
                  <rect x="8" y="8" width="5" height="5" rx="1.5" fill="white" opacity="0.4" />
                </svg>
              </div>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                }}
              >
                DataForge
              </span>
            </a>

            {/* Tagline */}
            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: 'var(--text-muted)',
                lineHeight: 1.6,
                maxWidth: 220,
              }}
            >
              La plateforme qui te prépare au vrai monde data.
            </p>

            {/* Social links */}
            <div style={{ display: 'flex', gap: 12 }}>
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    border: '1px solid var(--border-default)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-muted)',
                    textDecoration: 'none',
                    transition: 'border-color 0.2s, color 0.2s, background 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = 'rgba(99,102,241,0.5)';
                    el.style.color = '#6366f1';
                    el.style.background = 'rgba(99,102,241,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = 'var(--border-default)';
                    el.style.color = 'var(--text-muted)';
                    el.style.background = 'transparent';
                  }}
                >
                  <Icon size={16} strokeWidth={1.8} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Produit */}
          <FooterColumn title="Produit" links={productLinks} />

          {/* Col 3 — Ressources */}
          <FooterColumn title="Ressources" links={resourceLinks} />

          {/* Col 4 — Légal */}
          <FooterColumn title="Légal" links={legalLinks} />
        </div>

        {/* Copyright */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: 24,
            marginTop: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: 'var(--text-muted)',
            }}
          >
            © 2025 DataForge · Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  );
}
