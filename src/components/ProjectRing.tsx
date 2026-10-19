import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Project } from "../content";

/**
 * Projects on a ring that turns a full 360°: drag it, use the arrows or the keyboard.
 * The card facing you is sharp; the others fade into the distance.
 */
export default function ProjectRing({ projects }: { projects: Project[] }) {
  const ring = useRef<HTMLDivElement>(null);
  const angle = useRef(0);
  const [front, setFront] = useState(0);
  const [radius, setRadius] = useState(420);
  const tween = useRef<gsap.core.Tween | null>(null);
  // At least 8 places on the ring (projects repeat), so neighbours are always in view while it turns.
  const slots = Array.from({ length: Math.max(8, projects.length) }, (_, i) => projects[i % projects.length]);
  const step = 360 / slots.length;

  useEffect(() => {
    const size = () => setRadius(innerWidth < 640 ? 410 : innerWidth < 1024 ? 490 : 560);
    size();
    addEventListener("resize", size);
    return () => removeEventListener("resize", size);
  }, []);

  // Fade and blur cards by how far they face away.
  const paint = (deg: number) => {
    if (!ring.current) return;
    ring.current.style.transform = `translateZ(-${radius}px) rotateY(${deg}deg)`;
    ring.current.querySelectorAll<HTMLElement>("[data-card]").forEach((card, i) => {
      const facing = Math.cos(((i * step + deg) * Math.PI) / 180); // 1 = facing you, -1 = behind
      card.style.opacity = String(0.18 + Math.max(0, facing) * 0.82);
      card.style.filter = facing > 0.9 ? "none" : `blur(${(1 - facing) * 1.5}px)`;
      card.style.pointerEvents = facing > 0.9 ? "auto" : "none";
    });
    const idx = ((Math.round(-deg / step) % slots.length) + slots.length) % slots.length % projects.length;
    setFront(idx);
  };

  useEffect(() => paint(angle.current));

  const turnTo = (deg: number) => {
    const o = { a: angle.current };
    tween.current?.kill();
    tween.current = gsap.to(o, {
      a: deg,
      duration: matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.9,
      ease: "power3.out",
      onUpdate: () => {
        angle.current = o.a;
        paint(o.a);
      },
    });
  };
  const go = (dir: 1 | -1) => turnTo(Math.round(angle.current / step) * step - dir * step);

  // Drag to turn; on release it settles on the nearest card.
  const drag = useRef<{ x: number; a: number } | null>(null);
  const onDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, a: angle.current };
    tween.current?.kill();
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    if (Math.abs(e.clientX - drag.current.x) > 4) (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    angle.current = drag.current.a + (e.clientX - drag.current.x) * 0.35;
    paint(angle.current);
  };
  const onUp = () => {
    if (!drag.current) return;
    drag.current = null;
    turnTo(Math.round(angle.current / step) * step);
  };

  return (
    <div
      className="relative overflow-hidden py-4"
      role="region"
      aria-roledescription="carousel"
      aria-label="Projects"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
    >
      <div
        className="relative mx-auto h-[500px] cursor-grab touch-pan-y select-none active:cursor-grabbing sm:h-[460px]"
        style={{ perspective: "1400px" }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onPointerLeave={onUp}
      >
        <div ref={ring} className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {slots.map((p, i) => (
            <article
              key={i}
              data-card
              aria-hidden={i % projects.length !== front}
              className="card absolute left-1/2 top-1/2 flex h-[440px] w-[min(82vw,360px)] flex-col bg-surface/95 p-6 sm:h-[420px]"
              style={{ transform: `translate(-50%, -50%) rotateY(${i * step}deg) translateZ(${radius}px)`, backfaceVisibility: "hidden" }}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="eyebrow">{p.kind}</p>
                {p.badge && <span className="chip shrink-0 border-accent/40 !text-accent">{p.badge}</span>}
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold leading-tight">{p.title}</h3>
              <p className="mt-2 text-sm text-muted">{p.summary}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-2">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" /> {pt}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
                {p.tags.map((t) => (
                  <span key={t} className="chip !text-xs">{t}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button type="button" onClick={() => go(-1)} aria-label="Previous project" className="grid size-11 place-items-center rounded-full border border-line hover:border-white/30">
          <ChevronLeft className="size-5" />
        </button>
        <div className="flex gap-2" aria-hidden="true">
          {projects.map((p, i) => (
            <span key={p.title} className={`h-1.5 rounded-full transition-all ${i === front ? "w-6 bg-accent" : "w-1.5 bg-white/20"}`} />
          ))}
        </div>
        <button type="button" onClick={() => go(1)} aria-label="Next project" className="grid size-11 place-items-center rounded-full border border-line hover:border-white/30">
          <ChevronRight className="size-5" />
        </button>
      </div>
      <p className="mt-3 text-center text-xs text-muted" aria-live="polite">
        {front + 1} / {projects.length} · {projects[front].title} · drag to turn the ring
      </p>
    </div>
  );
}
