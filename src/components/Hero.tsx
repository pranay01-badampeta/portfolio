import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight, Download, MoveHorizontal } from "lucide-react";
import Globe from "./Globe";
import { PROFILE } from "../content";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Intro: the big name rises letter by letter, the planet grows, then the photo and copy.
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from(".hero-letter", { yPercent: 110, duration: 1.4, stagger: 0.05 })
          .from(".hero-globe", { scale: 0.6, opacity: 0, duration: 1.8 }, 0.1)
          .from(".hero-photo", { y: 120, opacity: 0, duration: 1.4 }, 0.35)
          .from(".hero-copy > *", { y: 24, opacity: 0, duration: 1, stagger: 0.08 }, 0.6)
          .from(".hero-side > *", { y: 24, opacity: 0, duration: 1, stagger: 0.08 }, 0.8);

        // Scroll: layers move at different speeds for depth.
        const scrub = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to(".hero-name", { xPercent: -12, ease: "none", scrollTrigger: scrub });
        gsap.to(".hero-globe-wrap", { yPercent: 25, scale: 1.15, ease: "none", scrollTrigger: scrub });
        gsap.to(".hero-photo", { yPercent: 12, ease: "none", scrollTrigger: scrub });
        gsap.to(".hero-fade", { opacity: 1, ease: "none", scrollTrigger: { ...scrub, end: "60% top" } });
      });
    }, root);
    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  const first = "PRANAY";

  return (
    <section ref={root} id="top" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* Sky-to-night backdrop */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_50%_40%,#0f2236_0%,#07080a_62%)]" />

      {/* Huge outlined first name behind everything */}
      <div className="hero-name pointer-events-none absolute inset-x-0 top-[13svh] -z-10 select-none overflow-hidden whitespace-nowrap text-center font-display font-bold leading-[0.8] tracking-tight text-outline text-[30vw] md:text-[22vw]">
        {first.split("").map((c, i) => (
          <span key={i} className="inline-block overflow-hidden align-top">
            <span className="hero-letter inline-block">{c}</span>
          </span>
        ))}
      </div>

      {/* The planet, centred behind the head */}
      {/* Planet + photo. On phones this is the top block; on large screens it fills the hero. */}
      <div className="relative h-[64svh] min-h-[440px] lg:absolute lg:inset-0 lg:h-auto">
        {/* The wrapper moves with the scroll; the planet inside plays the intro. */}
        <div className="hero-globe-wrap absolute left-1/2 top-[50%] -z-10 aspect-square w-[min(112vw,720px)] -translate-x-1/2 -translate-y-1/2 lg:top-[45%]">
          <Globe className="hero-globe h-full w-full cursor-grab active:cursor-grabbing" />
        </div>
        <img
          src={PROFILE.photo}
          alt="Pranay Badampeta"
          width={900}
          height={835}
          fetchPriority="high"
          className="hero-photo pointer-events-none absolute bottom-0 left-1/2 z-0 w-[min(100vw,520px)] -translate-x-1/2 [mask-image:linear-gradient(to_bottom,black_72%,transparent)] lg:w-[min(46vw,620px)]"
        />
      </div>
      <div className="hero-fade pointer-events-none absolute inset-0 z-10 bg-bg opacity-0" />

      <div className="container-x relative z-20 grid gap-8 pb-12 pt-2 lg:mt-auto lg:grid-cols-[1fr_auto] lg:items-end lg:pb-14 lg:pt-28">
        <div className="hero-copy max-w-md">
          <p className="eyebrow">{PROFILE.role}</p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl">{PROFILE.name}</h1>
          <p className="mt-4 text-base text-muted sm:text-lg">{PROFILE.tagline}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#work" className="btn btn-light">
              See my work <ArrowDown className="size-4" />
            </a>
            <a href={PROFILE.resume} download className="btn btn-ghost">
              Résumé <Download className="size-4" />
            </a>
          </div>
        </div>

        <div className="hero-side hidden flex-col items-end gap-3 text-right lg:flex">
          <a href="#publication" className="chip gap-2 hover:border-white/30">
            <span className="size-1.5 rounded-full bg-accent" /> Published · IEEE CICT 2025 <ArrowUpRight className="size-3.5" />
          </a>
          <span className="chip gap-2">
            <span className="size-1.5 rounded-full bg-accent" /> NASA Space Apps 2024 · Galactic Problem Solver
          </span>
          <span className="mt-2 flex items-center gap-2 text-xs text-muted">
            <MoveHorizontal className="size-4" /> Drag the planet to spin it
          </span>
        </div>
      </div>
    </section>
  );
}
