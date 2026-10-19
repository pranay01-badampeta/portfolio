import { ArrowUpRight, Award, BookOpen, Download, GraduationCap, Mail } from "lucide-react";
import ProjectRing from "./ProjectRing";
import { ABOUT, CERTIFICATIONS, EDUCATION, EXPERIENCE, FEATURED, PROFILE, PROJECTS, PUBLICATION, SKILLS, STATS } from "../content";

function Heading({ eyebrow, title, id }: { eyebrow: string; title: string; id?: string }) {
  return (
    <div className="reveal mb-12 md:mb-16" id={id}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">{title}</h2>
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="container-x scroll-mt-20 py-28 md:py-36">
      <div className="grid gap-12 md:grid-cols-[1.3fr_1fr] md:gap-20">
        <div>
          <p className="eyebrow reveal">About</p>
          <p className="split-lines mt-5 font-display text-2xl leading-snug sm:text-3xl md:text-[2.4rem] md:leading-[1.2]">{ABOUT[0]}</p>
          <p className="reveal mt-6 max-w-xl text-muted">{ABOUT[1]}</p>
        </div>
        <dl className="grid grid-cols-2 gap-3 self-end">
          {STATS.map((s) => (
            <div key={s.label} className="reveal card p-5">
              <dt className="text-xs text-muted">{s.label}</dt>
              <dd className="mt-2 font-display text-4xl font-bold" data-count={/^\d+$/.test(s.value) && Number(s.value) < 100 ? s.value : undefined}>
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function Work() {
  return (
    <section id="work" className="scroll-mt-20 py-28 md:py-36">
      <div className="container-x">
        <Heading eyebrow="Selected work" title="Models that learn, products that ship." />

        {/* Featured: Cuisine.AI */}
        <article className="reveal card grid overflow-hidden md:grid-cols-[1fr_1.15fr]">
          <div className="flex flex-col p-6 sm:p-10">
            <p className="eyebrow">{FEATURED.kind}</p>
            <h3 className="mt-3 font-display text-4xl font-bold sm:text-5xl">{FEATURED.title}</h3>
            <p className="mt-4 text-muted">{FEATURED.summary}</p>
            <ul className="mt-6 space-y-3 text-sm">
              {FEATURED.points.map((p) => (
                <li key={p} className="flex gap-3">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" /> {p}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-1.5">
              {FEATURED.tags.map((t) => (
                <span key={t} className="chip !text-xs">{t}</span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {FEATURED.links?.map((l, i) => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className={`btn ${i === 0 ? "btn-light" : "btn-ghost"}`}>
                  {l.label} <ArrowUpRight className="size-4" />
                </a>
              ))}
            </div>
          </div>
          <div className="featured-shots relative min-h-[320px] overflow-hidden border-line bg-[radial-gradient(ellipse_at_70%_30%,#13314d,#0b0d10_70%)] max-md:border-t md:border-l">
            <img
              src="media/dashboard.jpg"
              alt="Cuisine.AI dashboard"
              loading="lazy"
              width={800}
              height={500}
              className="shot-a absolute left-[8%] top-[12%] w-[92%] rounded-xl border border-white/10 shadow-2xl shadow-black/60"
            />
            <img
              src="media/invoice-detail.jpg"
              alt="An invoice read by Cuisine.AI"
              loading="lazy"
              width={800}
              height={500}
              className="shot-b absolute bottom-[8%] left-[-6%] w-[62%] rounded-xl border border-white/10 shadow-2xl shadow-black/60"
            />
          </div>
        </article>
      </div>

      <div className="container-x mt-24">
        <div className="reveal mb-6 flex flex-wrap items-end justify-between gap-4">
          <h3 className="font-display text-2xl font-bold sm:text-3xl">More projects</h3>
          <p className="text-sm text-muted">Machine learning, computer vision and security.</p>
        </div>
      </div>
      <div className="reveal">
        <ProjectRing projects={PROJECTS} />
      </div>
    </section>
  );
}

export function Experience() {
  return (
    <section id="experience" className="container-x scroll-mt-20 py-28 md:py-36">
      <Heading eyebrow="Experience" title="Where I've been building." />
      <ol className="timeline relative ml-2 border-l border-line pl-8 md:ml-0 md:pl-12">
        <span className="timeline-fill absolute -left-px top-0 h-full w-px origin-top bg-accent" aria-hidden="true" />
        {EXPERIENCE.map((j) => (
          <li key={j.role + j.org} className="reveal relative pb-14 last:pb-0">
            <span className="absolute -left-[37px] top-1.5 size-2.5 rounded-full bg-accent ring-4 ring-bg md:-left-[53px]" />
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h3 className="font-display text-2xl font-bold">{j.role}</h3>
              <span className="text-sm text-muted">{j.when}</span>
            </div>
            <p className="mt-1 text-accent">
              {j.org} <span className="text-muted">· {j.place}</span>
            </p>
            <ul className="mt-4 max-w-2xl space-y-2 text-muted">
              {j.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Publication() {
  return (
    <section id="publication" className="container-x scroll-mt-20 py-16">
      <article className="reveal card relative overflow-hidden p-6 sm:p-12">
        <div className="pointer-events-none absolute -right-10 -top-10 size-64 rounded-full bg-accent/10 blur-3xl" />
        <p className="eyebrow flex items-center gap-2">
          <BookOpen className="size-4" /> Publication
        </p>
        <h3 className="mt-4 max-w-4xl font-display text-2xl font-bold leading-snug sm:text-4xl">{PUBLICATION.title}</h3>
        <p className="mt-4 text-accent">{PUBLICATION.venue}</p>
        <ul className="mt-6 grid gap-3 text-muted sm:grid-cols-2">
          {PUBLICATION.points.map((p) => (
            <li key={p} className="flex gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" /> {p}
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}

export function Skills() {
  const all = SKILLS.flatMap((g) => g.items);
  const row = (items: string[], reverse = false) => (
    <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <div className={`marquee flex shrink-0 gap-3 pr-3 ${reverse ? "marquee-reverse" : ""}`}>
        {[...items, ...items].map((s, i) => (
          <span key={i} className="whitespace-nowrap rounded-full border border-line px-5 py-2.5 font-display text-lg sm:text-xl">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
  return (
    <section id="skills" className="scroll-mt-20 py-28 md:py-36">
      <div className="container-x">
        <Heading eyebrow="Skills & tools" title="From notebooks to production." />
      </div>
      <div className="space-y-3" aria-hidden="true">
        {row(all.slice(0, Math.ceil(all.length / 2)))}
        {row(all.slice(Math.ceil(all.length / 2)), true)}
      </div>
      <div className="container-x mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {SKILLS.map((g) => (
          <div key={g.group} className="reveal card p-5">
            <h3 className="text-xs uppercase tracking-[0.18em] text-muted">{g.group}</h3>
            <ul className="mt-3 space-y-1.5">
              {g.items.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Education() {
  return (
    <section id="education" className="container-x scroll-mt-20 py-28 md:py-36">
      <div className="grid gap-16 lg:grid-cols-2">
        <div>
          <p className="eyebrow reveal flex items-center gap-2">
            <GraduationCap className="size-4" /> Education
          </p>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {EDUCATION.map((e) => (
              <li key={e.school} className="reveal grid grid-cols-[1fr_auto] gap-x-4 py-5">
                <div>
                  <h3 className="font-display text-lg font-bold">{e.school}</h3>
                  <p className="text-sm text-muted">{e.degree}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="text-muted">{e.when}</p>
                  <p className="font-display text-lg">{e.score}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow reveal flex items-center gap-2">
            <Award className="size-4" /> Certifications & achievements
          </p>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {CERTIFICATIONS.map((c) => (
              <li key={c.name} className="reveal flex items-baseline justify-between gap-4 py-5">
                <span>{c.name}</span>
                <span className="shrink-0 text-sm text-muted">{c.when}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="relative scroll-mt-20 overflow-hidden border-t border-line py-28 md:py-40">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[60%] w-[80%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgb(124_196_255/0.16),transparent_70%)]" />
      <div className="container-x relative text-center">
        <p className="eyebrow reveal">Contact</p>
        <h2 className="reveal mx-auto mt-4 max-w-4xl font-display text-5xl font-bold leading-[0.98] tracking-tight sm:text-7xl md:text-8xl">
          Let&apos;s build something.
        </h2>
        <p className="reveal mx-auto mt-6 max-w-xl text-muted">
          Open to roles and projects in AI, machine learning and full-stack development. The fastest way to reach me is email.
        </p>
        <div className="reveal mt-10 flex flex-wrap justify-center gap-3">
          <a href={`mailto:${PROFILE.email}`} className="btn btn-light">
            <Mail className="size-4" /> {PROFILE.email}
          </a>
          <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" className="btn btn-ghost">
            LinkedIn <ArrowUpRight className="size-4" />
          </a>
          <a href={PROFILE.github} target="_blank" rel="noreferrer" className="btn btn-ghost">
            GitHub <ArrowUpRight className="size-4" />
          </a>
          <a href={PROFILE.resume} download className="btn btn-ghost">
            Résumé <Download className="size-4" />
          </a>
        </div>
      </div>
      <footer className="container-x relative mt-28 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8 text-sm text-muted">
        <span>© {new Date().getFullYear()} {PROFILE.fullName}</span>
        <a href="#top" className="hover:text-ink">Back to top ↑</a>
      </footer>
    </section>
  );
}
