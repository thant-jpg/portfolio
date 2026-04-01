import { useEffect, useRef } from 'react'

// Subtle decorative marks — printer's registration and faint guide lines
const ELEMENTS = [
  { type: 'line', x1: 5, y1: 25, x2: 35, y2: 25, depth: 0.02 },
  { type: 'line', x1: 70, y1: 18, x2: 95, y2: 18, depth: 0.04 },
  { type: 'line', x1: 20, y1: 60, x2: 20, y2: 90, depth: 0.03 },
  { type: 'line', x1: 80, y1: 40, x2: 80, y2: 75, depth: 0.05 },
  { type: 'cross', x: 50, y: 45, size: 8, depth: 0.06 },
  { type: 'cross', x: 15, y: 40, size: 5, depth: 0.04 },
  { type: 'cross', x: 88, y: 30, size: 6, depth: 0.03 },
]

export default function ParallaxHero({ name = 'Portfolio' }) {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const targetRef = useRef({ x: 0.5, y: 0.5 })
  const animRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    function resize() {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }

    resize()
    window.addEventListener('resize', resize)

    function handleMove(e) {
      const rect = canvas.getBoundingClientRect()
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const clientY = e.touches ? e.touches[0].clientY : e.clientY
      targetRef.current = {
        x: (clientX - rect.left) / rect.width,
        y: (clientY - rect.top) / rect.height,
      }
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('touchmove', handleMove, { passive: true })

    function draw() {
      mouseRef.current.x += (targetRef.current.x - mouseRef.current.x) * 0.06
      mouseRef.current.y += (targetRef.current.y - mouseRef.current.y) * 0.06

      const rect = canvas.getBoundingClientRect()
      const w = rect.width
      const h = rect.height
      ctx.clearRect(0, 0, w, h)

      const mx = (mouseRef.current.x - 0.5) * 2
      const my = (mouseRef.current.y - 0.5) * 2

      const ink = '90, 72, 45'

      ELEMENTS.forEach(el => {
        const ox = mx * el.depth * w
        const oy = my * el.depth * h

        ctx.save()

        if (el.type === 'line') {
          ctx.strokeStyle = `rgba(${ink}, 0.06)`
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo((el.x1 / 100) * w + ox, (el.y1 / 100) * h + oy)
          ctx.lineTo((el.x2 / 100) * w + ox, (el.y2 / 100) * h + oy)
          ctx.stroke()
        }

        if (el.type === 'cross') {
          const px = (el.x / 100) * w + ox
          const py = (el.y / 100) * h + oy
          const s = el.size
          ctx.strokeStyle = `rgba(${ink}, 0.05)`
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(px - s, py)
          ctx.lineTo(px + s, py)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(px, py - s)
          ctx.lineTo(px, py + s)
          ctx.stroke()
        }

        ctx.restore()
      })

      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('touchmove', handleMove)
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
      />
      <div className="relative z-10 text-center max-w-4xl mx-auto px-8">
        <p
          className="text-sm tracking-[0.3em] mb-8"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink-faint)', fontVariantCaps: 'small-caps', letterSpacing: '0.2em' }}
        >
          The Works of
        </p>
        <h1
          className="text-5xl md:text-7xl lg:text-8xl leading-none tracking-tight mb-8"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)', fontStyle: 'italic' }}
        >
          {name}
        </h1>
        <div className="flex items-center justify-center gap-4 max-w-xs mx-auto">
          <hr className="flex-1 border-t border-[var(--color-rule)]" />
          <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink-faint)', fontSize: '1.1rem' }}>&loz;</span>
          <hr className="flex-1 border-t border-[var(--color-rule)]" />
        </div>
        <p
          className="text-sm tracking-[0.15em] mt-8"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink-faint)', fontStyle: 'italic' }}
        >
          Architecture &amp; Design
        </p>
      </div>
    </section>
  )
}
