import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import { About, Contact, Education, Experience, Publication, Skills, Work } from "./components/Sections";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Sections rise into place as they enter.
      gsap.set(".reveal", { y: 40, opacity: 0 });
      ScrollTrigger.batch(".reveal", {
        start: "top 88%",
        once: true,
        onEnter: (els) => gsap.to(els, { y: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.08 }),
      });

      // The about statement lights up word by word as you scroll through it.
      document.querySelectorAll<HTMLElement>(".split-lines").forEach((el) => {
        if (!el.dataset.split) {
          el.innerHTML = el.textContent!.split(" ").map((w) => `<span class="word">${w}</span>`).join(" ");
          el.dataset.split = "1";
        }
        gsap.fromTo(
          el.querySelectorAll(".word"),
          { opacity: 0.15 },
          { opacity: 1, stagger: 0.05, ease: "none", scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true } },
        );
      });

      // Experience line fills as you read down the timeline.
      gsap.fromTo(".timeline-fill", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".timeline", start: "top 70%", end: "bottom 60%", scrub: true } });

      // Featured screenshots drift apart for depth.
      gsap.fromTo(".shot-a", { y: 40 }, { y: -30, ease: "none", scrollTrigger: { trigger: ".featured-shots", scrub: true } });
      gsap.fromTo(".shot-b", { y: 80, rotate: -4 }, { y: -20, rotate: 0, ease: "none", scrollTrigger: { trigger: ".featured-shots", scrub: true } });

      // Small numbers count up.
      document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
        const to = Number(el.dataset.count);
        const o = { n: 0 };
        gsap.to(o, { n: to, duration: 1.4, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 90%", once: true }, onUpdate: () => (el.textContent = String(Math.round(o.n))) });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <div className="grain">
      <a href="#about" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-bg">
        Skip to content
      </a>
      <Nav />
      <main>
        <Hero />
        <About />
        <Work />
        <Experience />
        <Publication />
        <Skills />
        <Education />
        <Contact />
      </main>
    </div>
  );
}
