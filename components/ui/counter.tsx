'use client'
import { useEffect, useRef, useState } from 'react'
import { useInView, useMotionValue, animate } from 'framer-motion'

interface CounterProps {
  from?: number
  to: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
}

export function Counter({ from = 0, to, duration = 2, prefix = '', suffix = '', className = '' }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const motionValue = useMotionValue(from)
  const [display, setDisplay] = useState(from)

  useEffect(() => {
    if (!inView) return
    const controls = animate(motionValue, to, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return controls.stop
  }, [inView, motionValue, to, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}{display.toLocaleString('fr-FR')}{suffix}
    </span>
  )
}
