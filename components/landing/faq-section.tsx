'use client';

import { AnimatePresence, motion, useInView } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useRef, useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: 'Je suis débutant complet. Est-ce que c\'est pour moi ?',
    answer:
      "Oui. Le parcours 'SQL Fondamentaux' commence à zéro. La différence avec une formation classique : on t'explique pourquoi chaque chose existe en entreprise, avant de te montrer comment la faire. Tu ne mémoriseras pas — tu comprendras.",
  },
  {
    question: "En quoi c'est différent d'un cours Udemy ou d'un bootcamp ?",
    answer:
      "Un cours Udemy t'apprend la syntaxe. Un bootcamp t'apprend la théorie. DataForge te met en situation : brief Slack urgent, dataset réel, deadline, livrable business attendu. C'est la différence entre lire un livre sur la natation et sauter dans la piscine avec quelqu'un à côté.",
  },
  {
    question: 'Est-ce que le Mentor IA remplace un vrai mentor humain ?',
    answer:
      "Pour la pratique quotidienne, il est souvent plus efficace : disponible à 3h du matin, jamais impatient, adapté à ton niveau. Il ne donne jamais la réponse directement — il te guide, comme le ferait un bon senior.",
  },
  {
    question: "Combien de temps faut-il pour être opérationnel ?",
    answer:
      "La majorité de nos étudiants décrochent un poste en 3-4 mois avec 1-2 heures de pratique par jour. La clé : la régularité, pas l'intensité.",
  },
  {
    question: "Que se passe-t-il si ça ne m'aide pas ?",
    answer:
      "Essai gratuit 7 jours sur le plan Pro. Si ce n'est pas fait pour toi, on te rembourse sans question. Aucun risque.",
  },
];

function FaqAccordion({
  item,
  index,
  isOpen,
  onToggle,
  isInView,
}: {
  item: FaqItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: 0.2 + index * 0.08, ease: 'easeOut' }}
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <button
        aria-expanded={isOpen}
        onClick={onToggle}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '24px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          textAlign: 'left',
        }}
      >
        <span
          style={{
            fontSize: 17,
            fontWeight: 500,
            color: 'var(--text-primary)',
            lineHeight: 1.4,
            flex: 1,
          }}
        >
          {item.question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          style={{
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
            color: 'var(--text-muted)',
          }}
        >
          <ChevronDown size={20} strokeWidth={2} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <p
              style={{
                margin: 0,
                paddingTop: 4,
                paddingBottom: 24,
                fontSize: 16,
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
              }}
            >
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FaqSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      ref={sectionRef}
      style={{
        backgroundColor: 'var(--bg-base)',
        padding: '120px 24px',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(6,182,212,0.05) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative' }}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <h2
            style={{
              fontSize: 'clamp(26px, 4.5vw, 38px)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: '0 0 12px',
              lineHeight: 1.2,
            }}
          >
            Les questions qu&apos;on nous pose souvent.
          </h2>
        </motion.div>

        {/* Accordion list */}
        <div>
          {faqs.map((item, i) => (
            <FaqAccordion
              key={i}
              item={item}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => handleToggle(i)}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
