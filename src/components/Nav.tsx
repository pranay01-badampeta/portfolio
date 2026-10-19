import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { PROFILE } from "../content";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 24);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${scrolled || open ? "border-b border-line bg-bg/75 backdrop-blur-xl" : ""}`}>
      <nav className="container-x flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5" aria-label="Back to top">
          <span className="grid size-9 place-items-center rounded-xl border border-line bg-white/5 font-display text-sm font-bold">PB</span>
          <span className="hidden font-display text-sm font-medium sm:block">{PROFILE.name}</span>
        </a>
        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="rounded-full px-3.5 py-2 text-sm text-muted transition-colors hover:text-ink">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <a href={`mailto:${PROFILE.email}`} className="btn btn-light hidden !py-2 !text-sm sm:inline-flex">
            Let&apos;s talk
          </a>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-xl border border-line md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>
      {open && (
        <ul className="container-x grid gap-1 pb-4 md:hidden">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3 font-display text-lg hover:bg-white/5">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
