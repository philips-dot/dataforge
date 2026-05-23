import { Navbar } from '@/components/landing/navbar'
import { HeroSection } from '@/components/landing/hero-section'
import { StatsSection } from '@/components/landing/stats-section'
import { DifferentiationSection } from '@/components/landing/differentiation-section'
import { LessonPreviewInteractive } from '@/components/landing/lesson-preview-interactive'
import { TwoPillarsSection } from '@/components/landing/two-pillars-section'
import { LearningPathSection } from '@/components/landing/learning-path-section'
import { TestimonialsSection } from '@/components/landing/testimonials-section'
import { FaqSection } from '@/components/landing/faq-section'
import { PricingSection } from '@/components/landing/pricing-section'
import { CtaFinalSection } from '@/components/landing/cta-final-section'
import { Footer } from '@/components/landing/footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <section id="hero">
          <HeroSection />
        </section>
        <section id="stats" role="region" aria-label="Chiffres clés">
          <StatsSection />
        </section>
        <section id="differents" role="region" aria-label="Notre différence">
          <DifferentiationSection />
        </section>
        <section id="lecon" role="region" aria-label="Aperçu d'une leçon">
          <LessonPreviewInteractive />
        </section>
        <section id="fondamentaux" role="region" aria-label="Les deux piliers">
          <TwoPillarsSection />
        </section>
        <section id="parcours" role="region" aria-label="Parcours d'apprentissage">
          <LearningPathSection />
        </section>
        <section id="temoignages" role="region" aria-label="Témoignages">
          <TestimonialsSection />
        </section>
        <section id="faq" role="region" aria-label="Questions fréquentes">
          <FaqSection />
        </section>
        <section id="tarifs" role="region" aria-label="Tarifs">
          <PricingSection />
        </section>
        <CtaFinalSection />
      </main>
      <Footer />
    </>
  )
}
