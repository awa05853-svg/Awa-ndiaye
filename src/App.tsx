import { useState, useEffect, useRef, ReactNode } from "react"
import profilePhoto from "./assets/profile.jpeg"

// ─── Scroll animation wrapper ───────────────────────────────────────────────

interface FadeInProps {
  children: ReactNode
  className?: string
  delay?: number
}

function FadeIn({ children, className = "", delay = 0 }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  useEffect(() => {
    if (reduced) { setVisible(true); return }
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [reduced])

  return (
    <div
      ref={ref}
      className={className}
      style={
        reduced
          ? {}
          : {
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(28px)",
              transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
            }
      }
    >
      {children}
    </div>
  )
}

// ─── Shared label ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] text-brand-green uppercase mb-4">
      <span className="w-8 h-px bg-brand-green" aria-hidden="true" />
      {children}
    </p>
  )
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setOpen(false)
  }

  const links = [
    { label: "Accueil", id: "accueil" },
    { label: "À propos", id: "apropos" },
    { label: "Compétences", id: "competences" },
    { label: "Services", id: "services" },
    { label: "Projets", id: "projets" },
    { label: "Parcours", id: "parcours" },
    { label: "Contact", id: "contact" },
  ]

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/96 backdrop-blur-md shadow-[0_1px_12px_rgba(0,0,0,0.07)]"
          : "bg-white/90 backdrop-blur-sm"
      }`}
    >
      <nav
        className="max-w-6xl mx-auto px-5 sm:px-8 h-[64px] flex items-center justify-between"
        aria-label="Navigation principale"
      >
        {/* Logo */}
        <button
          onClick={() => go("accueil")}
          className="font-display text-[1.45rem] font-semibold text-gray-900 tracking-tight hover:text-brand-green transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green rounded"
          aria-label="Awa Ndiaye — retour en haut"
        >
          Awa<span className="text-brand-green">.</span>
        </button>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-6 lg:gap-8" role="list">
          {links.map((l) => (
            <li key={l.id}>
              <button
                onClick={() => go(l.id)}
                className="relative text-[13px] text-gray-500 hover:text-gray-900 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green rounded"
              >
                {l.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-brand-green transition-all duration-300 group-hover:w-full" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop CTA + CV + hamburger */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <a
            href="/CV_Awa_Ndiaye.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-700 text-[13px] font-medium rounded-full hover:border-brand-green hover:text-brand-green transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
            Mon CV
          </a>

          <button
            onClick={() => go("contact")}
            className="hidden md:inline-flex items-center px-5 py-2 bg-brand-green text-white text-[13px] font-medium rounded-full hover:bg-brand-green-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 active:scale-95"
          >
            Me contacter
          </button>

          <button
            className="md:hidden flex flex-col justify-center items-center gap-[5px] w-10 h-10 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span
              className={`w-5 h-px bg-gray-700 transition-all duration-300 origin-center ${open ? "rotate-45 translate-y-[6px]" : ""}`}
            />
            <span
              className={`w-5 h-px bg-gray-700 transition-all duration-200 ${open ? "opacity-0 scale-x-0" : ""}`}
            />
            <span
              className={`w-5 h-px bg-gray-700 transition-all duration-300 origin-center ${open ? "-rotate-45 -translate-y-[6px]" : ""}`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`md:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!open}
      >
        <ul className="px-5 py-3 space-y-0.5" role="list">
          {links.map((l) => (
            <li key={l.id}>
              <button
                onClick={() => go(l.id)}
                className="w-full text-left py-3.5 text-[15px] text-gray-600 hover:text-brand-green border-b border-gray-50 last:border-0 transition-colors"
              >
                {l.label}
              </button>
            </li>
          ))}
          <li className="pt-3 pb-2 space-y-2">
            <a
              href="/CV_Awa_Ndiaye.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 border border-gray-200 text-gray-800 text-sm font-medium rounded-full inline-flex items-center justify-center gap-2 hover:border-brand-green hover:text-brand-green transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              Consulter mon CV (PDF)
            </a>
            <button
              onClick={() => go("contact")}
              className="w-full py-3 bg-brand-green text-white text-sm font-medium rounded-full hover:bg-brand-green-dark transition-colors active:scale-95"
            >
              Me contacter
            </button>
          </li>
        </ul>
      </div>
    </header>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section id="accueil" className="min-h-screen flex items-center pt-16 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 md:py-24 w-full grid md:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* Left: text */}
        <div className="space-y-8 order-2 md:order-1">
          <FadeIn>
            <SectionLabel>Assistante digitale · UX/UI · Design</SectionLabel>
          </FadeIn>
          <FadeIn delay={80}>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-semibold text-gray-900 leading-[1.1] tracking-tight">
              Je transforme les idées en{" "}
              <em className="not-italic text-brand-blue">expériences</em>{" "}
              numériques{" "}
              <span className="text-brand-green">utiles.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={160}>
            <p className="text-[15px] md:text-base text-gray-500 leading-relaxed max-w-md">
              Bonjour, je suis{" "}
              <strong className="text-gray-700 font-medium">Awa Ndiaye</strong>.
              Assistante digitale, je m&apos;intéresse à la conception de solutions numériques simples, utiles et centrées sur les besoins des utilisateurs.
            </p>
          </FadeIn>
          <FadeIn delay={240}>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => document.getElementById("projets")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-green text-white text-[14px] font-medium rounded-full hover:bg-brand-green-dark transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 active:scale-95"
              >
                Découvrir mes projets
                <span aria-hidden="true">→</span>
              </button>
              <a
                href="/CV_Awa_Ndiaye.pdf"
                download="CV_Awa_Ndiaye.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-gray-200 text-gray-600 text-[14px] font-medium rounded-full hover:border-brand-blue hover:text-brand-blue transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 active:scale-95"
                aria-label="Télécharger le CV d'Awa Ndiaye au format PDF"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M8 1v9m0 0L5 7m3 3 3-3M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
                Télécharger mon CV
              </a>
            </div>
          </FadeIn>
        </div>

        {/* Right: photo */}
        <FadeIn delay={120} className="order-1 md:order-2 flex justify-center md:justify-end">
          <div className="relative">
            {/* Decorative rings */}
            <div className="absolute -top-6 -left-6 w-28 h-28 rounded-full border border-brand-green/15 pointer-events-none" aria-hidden="true" />
            <div className="absolute -bottom-8 -right-4 w-20 h-20 rounded-full border border-brand-blue/15 pointer-events-none" aria-hidden="true" />
            <div className="absolute top-8 -right-3 w-2.5 h-2.5 rounded-full bg-brand-red/60 pointer-events-none" aria-hidden="true" />
            <div className="absolute bottom-16 -left-4 w-1.5 h-1.5 rounded-full bg-brand-green pointer-events-none" aria-hidden="true" />

            {/* Shadow offset layers */}
            <div className="absolute inset-0 rounded-2xl bg-brand-green/8 translate-x-3 translate-y-3 pointer-events-none" aria-hidden="true" />
            <div className="absolute inset-0 rounded-2xl bg-brand-blue/6 -translate-x-2 -translate-y-2 pointer-events-none" aria-hidden="true" />

            {/* Photo frame */}
            <div className="relative w-[280px] h-[350px] sm:w-[310px] sm:h-[390px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200 shadow-[0_16px_36px_rgba(0,0,0,0.12)] group">
              <img
                src={profilePhoto}
                alt="Portrait professionnel d'Awa Ndiaye"
                className="w-full h-full object-cover object-[center_15%] transition-transform duration-700 ease-out group-hover:scale-105"
                loading="eager"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-gray-950/40 via-transparent to-transparent pointer-events-none"
                aria-hidden="true"
              />
            </div>

            {/* Floating card */}
            <div
              className="absolute -bottom-5 -left-8 bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.10)] border border-gray-100 px-4 py-3 pointer-events-none"
              aria-hidden="true"
            >
              <p className="text-[12px] font-semibold text-gray-900 leading-tight">Créativité</p>
              <p className="text-[10px] text-gray-400 mt-0.5">au service du digital</p>
              <div className="flex gap-1 mt-2">
                <span className="w-2 h-2 rounded-full bg-brand-green" />
                <span className="w-2 h-2 rounded-full bg-brand-blue" />
                <span className="w-2 h-2 rounded-full bg-brand-red" />
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// ─── About ────────────────────────────────────────────────────────────────────

function About() {
  const indicators = [
    { label: "UX/UI", desc: "Conception centrée utilisateur", accent: "green" },
    { label: "Digital", desc: "Outils et contenus numériques", accent: "blue" },
    { label: "Projet", desc: "Organisation et collaboration", accent: "green" },
  ]

  return (
    <section id="apropos" className="py-24 bg-[#f9f9f8]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <FadeIn>
          <SectionLabel>À propos</SectionLabel>
          <h2 className="font-display text-3xl md:text-[2.4rem] font-semibold text-gray-900 leading-tight max-w-xl mb-12">
            Une approche{" "}
            <em className="not-italic text-brand-blue">humaine</em>, digitale et orientée solutions.
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
          <FadeIn delay={100}>
            <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed">
              <p>
                Mon parcours combine les compétences numériques, le design et la gestion de projet. Je m&apos;intéresse particulièrement à la création de solutions simples, accessibles et adaptées aux utilisateurs.
              </p>
              <p>
                À travers mes projets de formation et mes réalisations numériques, je développe une méthode de travail basée sur l&apos;écoute, la recherche utilisateur, la structuration des idées et l&apos;amélioration continue.
              </p>
              <div className="pt-2">
                <a
                  href="/CV_Awa_Ndiaye.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-800 text-[13px] font-medium rounded-full hover:border-brand-green hover:text-brand-green hover:shadow-sm transition-all duration-200 active:scale-95"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                  </svg>
                  Consulter mon CV complet (PDF)
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={180}>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {indicators.map((item) => (
                <div
                  key={item.label}
                  className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div
                    className={`w-7 h-[3px] rounded-full mb-3 ${item.accent === "green" ? "bg-brand-green" : "bg-brand-blue"}`}
                    aria-hidden="true"
                  />
                  <p className="font-display font-semibold text-gray-900 text-[15px] mb-1">{item.label}</p>
                  <p className="text-[11px] text-gray-400 leading-snug">{item.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

// ─── Skills ───────────────────────────────────────────────────────────────────

const UxIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="14" rx="2" />
    <path d="M8 20h8M12 18v2" />
    <circle cx="9" cy="11" r="2" />
    <path d="M13 11h4M13 14h4" />
  </svg>
)

const DesignIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
)

const ProjectIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
  </svg>
)

const ToolsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
  </svg>
)

function Skills() {
  const skills = [
    {
      num: "01",
      title: "UX/UI Design",
      desc: "Recherche utilisateur, personas, parcours utilisateurs, wireframes et conception d'interfaces.",
      Icon: UxIcon,
      accent: "green",
    },
    {
      num: "02",
      title: "Design digital",
      desc: "Création de supports visuels, hiérarchie de l'information et identité visuelle.",
      Icon: DesignIcon,
      accent: "blue",
    },
    {
      num: "03",
      title: "Gestion de projet",
      desc: "Organisation des tâches, planification, collaboration et suivi des livrables.",
      Icon: ProjectIcon,
      accent: "green",
    },
    {
      num: "04",
      title: "Outils numériques",
      desc: "Figma, Canva, Microsoft Word, Excel, PowerPoint et outils collaboratifs.",
      Icon: ToolsIcon,
      accent: "blue",
    },
  ]

  return (
    <section id="competences" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <FadeIn>
          <SectionLabel>Compétences</SectionLabel>
          <h2 className="font-display text-3xl md:text-[2.4rem] font-semibold text-gray-900 leading-tight max-w-xl mb-12">
            Ce que je peux{" "}
            <em className="not-italic text-brand-green">apporter</em> à un projet.
          </h2>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {skills.map((s, i) => (
            <FadeIn key={s.num} delay={i * 70}>
              <div className="group h-full bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-[11px] font-medium text-gray-300">{s.num}</span>
                  <span className={s.accent === "green" ? "text-brand-green" : "text-brand-blue"}>
                    <s.Icon />
                  </span>
                </div>
                <h3 className="font-display font-semibold text-gray-900 text-[17px] mb-2.5 group-hover:text-brand-green transition-colors duration-200">
                  {s.title}
                </h3>
                <p className="text-[13px] text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Services ─────────────────────────────────────────────────────────────────

const WireframeIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
)

const BrushIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18.37 2.63L14 7l-1.59-1.59-2.83 2.83 1.41 1.41L3 18l-.5 3.5L6 21l8-8 1.41 1.41 2.83-2.83L16.59 10l4.38-4.37a2 2 0 00-2.6-3z" />
  </svg>
)

const PlanIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
  </svg>
)

function Services() {
  const services = [
    {
      num: "01",
      title: "Conception UX/UI",
      desc: "Recherche utilisateur, personas, parcours utilisateurs, wireframes et maquettes.",
      Icon: WireframeIcon,
    },
    {
      num: "02",
      title: "Design digital",
      desc: "Création d'affiches, présentations, supports de communication et contenus visuels.",
      Icon: BrushIcon,
    },
    {
      num: "03",
      title: "Accompagnement de projet",
      desc: "Organisation, structuration, planification et suivi des étapes d'un projet numérique.",
      Icon: PlanIcon,
    },
  ]

  return (
    <section id="services" className="py-24 bg-[#f9f9f8]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <FadeIn>
          <SectionLabel>Services</SectionLabel>
          <h2 className="font-display text-3xl md:text-[2.4rem] font-semibold text-gray-900 leading-tight max-w-xl mb-12">
            Des services pensés pour{" "}
            <em className="not-italic text-brand-blue">faire avancer</em> vos projets.
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <FadeIn key={s.num} delay={i * 90}>
              <article className="group h-full bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-[0_12px_40px_rgba(0,0,0,0.09)] hover:-translate-y-1.5 transition-all duration-300">
                <div className="flex items-center gap-3 mb-7">
                  <span className="font-mono text-[11px] font-medium text-gray-300">{s.num}</span>
                  <div className="w-px h-4 bg-gray-200" aria-hidden="true" />
                  <span className="text-brand-green group-hover:text-brand-blue transition-colors duration-300">
                    <s.Icon />
                  </span>
                </div>
                <h3 className="font-display font-semibold text-gray-900 text-xl mb-3 group-hover:text-brand-green transition-colors duration-300">
                  {s.title}
                </h3>
                <p className="text-[13px] text-gray-400 leading-relaxed mb-6">{s.desc}</p>
                <div className="h-px w-8 bg-brand-green/25 group-hover:w-14 group-hover:bg-brand-green transition-all duration-400" aria-hidden="true" />
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Projects ─────────────────────────────────────────────────────────────────

// ─── Projects ─────────────────────────────────────────────────────────────────

interface JefandikooModalProps {
  isOpen: boolean
  onClose: () => void
}

function JefandikooModal({ isOpen, onClose }: JefandikooModalProps) {
  const [activeTab, setActiveTab] = useState<"all" | "moodboard" | "logos" | "charte">("all")
  const [lightboxImg, setLightboxImg] = useState<string | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxImg) setLightboxImg(null)
        else onClose()
      }
    }
    if (isOpen) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleKeyDown)
    }
    return () => {
      document.body.style.overflow = "unset"
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, lightboxImg, onClose])

  if (!isOpen) return null

  const logos = [
    {
      src: "/jefandikoo/logo-white.png",
      label: "Version Standard (Fond Blanc)",
      bg: "bg-white",
      desc: "Usage principal pour fonds clairs, documents administratifs et web.",
    },
    {
      src: "/jefandikoo/logo-green.png",
      label: "Version Inversée (Fond Vert #01B501)",
      bg: "bg-[#01B501]",
      desc: "Identité forte sur fond vert naturel — symbole d'agriculture et transformation.",
    },
    {
      src: "/jefandikoo/logo-yellow.png",
      label: "Version Énergie (Fond Jaune #FFC815)",
      bg: "bg-[#FFC815]",
      desc: "Déclinaison chaleureuse et dynamique pour les supports promotionnels.",
    },
  ]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-gray-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-gray-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-gray-900 via-gray-900 to-gray-950 text-white flex items-start justify-between gap-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-brand-green/20 text-brand-green border border-brand-green/30">
                Identité Visuelle & UX
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-brand-blue/20 text-brand-blue border border-brand-blue/30">
                Projet Réalisé
              </span>
            </div>
            <h2 id="modal-title" className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white flex items-center gap-2">
              JËFANDIKOO
              <span className="text-brand-green text-sm font-normal">— Produire. Transformer. Valoriser.</span>
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Conception de l&apos;identité graphique, création des déclinaisons de logo et élaboration du moodboard applicatif pour la valorisation agricole et la transformation locale.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green shrink-0"
            aria-label="Fermer la fenêtre"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Tab filters */}
        <div className="px-6 sm:px-8 pt-4 pb-2 bg-gray-50 border-b border-gray-100 flex flex-wrap gap-2">
          {[
            { id: "all", label: "Vue d'ensemble" },
            { id: "moodboard", label: "Moodboard Complet" },
            { id: "logos", label: "Déclinaisons du Logo (3)" },
            { id: "charte", label: "Charte & Couleurs" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as typeof activeTab)}
              className={`px-4 py-2 text-xs sm:text-[13px] font-medium rounded-full transition-all duration-200 ${
                activeTab === t.id
                  ? "bg-brand-green text-white shadow-sm"
                  : "bg-white text-gray-600 hover:text-gray-900 border border-gray-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
          {/* Section 1: Moodboard */}
          {(activeTab === "all" || activeTab === "moodboard") && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-semibold text-gray-900 text-lg sm:text-xl">
                    1. Moodboard & Univers Visuel
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Synthèse de l&apos;univers de marque, des modules de l&apos;application (Conservation, Transformation, Ventes) et de l&apos;écosystème agricole.
                  </p>
                </div>
                <a
                  href="/jefandikoo/moodboard.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-green border border-brand-green/30 hover:bg-brand-green/10 rounded-full transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  Ouvrir en haute définition
                </a>
              </div>

              <div
                className="group relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                onClick={() => setLightboxImg("/jefandikoo/moodboard.jpg")}
              >
                <img
                  src="/jefandikoo/moodboard.jpg"
                  alt="Moodboard officiel Jefandikoo avec charte graphique, interface et photos d'ateliers"
                  className="w-full h-auto max-h-[520px] object-contain transition-transform duration-500 group-hover:scale-[1.01]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gray-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-medium rounded-full shadow-lg">
                    🔍 Cliquer pour agrandir
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Logos */}
          {(activeTab === "all" || activeTab === "logos") && (
            <div>
              <div className="mb-4">
                <h3 className="font-display font-semibold text-gray-900 text-lg sm:text-xl">
                  2. Déclinaisons Officielles du Logo
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  Trois variantes adaptées à tous les types de supports physiques, packaging et interfaces numériques.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-5">
                {logos.map((logo, idx) => (
                  <div
                    key={idx}
                    className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
                  >
                    <div
                      className={`p-8 ${logo.bg} flex items-center justify-center border-b border-gray-100 min-h-[190px] cursor-pointer relative overflow-hidden`}
                      onClick={() => setLightboxImg(logo.src)}
                    >
                      <img
                        src={logo.src}
                        alt={logo.label}
                        className="w-40 h-auto object-contain transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/40 text-white text-[10px] rounded backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        Agrandir
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">{logo.label}</h4>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{logo.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Charte Graphique */}
          {(activeTab === "all" || activeTab === "charte") && (
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-100">
              <h3 className="font-display font-semibold text-gray-900 text-lg mb-4">
                3. Palette Chromatique & Intentions UX
              </h3>
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-[#01B501] shadow-inner shrink-0" />
                  <div>
                    <p className="text-xs font-mono font-bold text-gray-900">#01B501</p>
                    <p className="text-[11px] text-gray-500">Vert Nature & Écologie</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-[#FFC815] shadow-inner shrink-0" />
                  <div>
                    <p className="text-xs font-mono font-bold text-gray-900">#FFC815</p>
                    <p className="text-[11px] text-gray-500">Jaune Énergie & Chaleur</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-white border border-gray-300 shadow-inner shrink-0" />
                  <div>
                    <p className="text-xs font-mono font-bold text-gray-900">#FFFFFF</p>
                    <p className="text-[11px] text-gray-500">Blanc Clarté & Simplicité</p>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 text-xs text-gray-600">
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <strong className="text-gray-900 block mb-1">📦 Conservation</strong>
                  Gestion intuitive des stocks de matières premières récoltées.
                </div>
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <strong className="text-gray-900 block mb-1">⚙️ Transformation</strong>
                  Suivi des étapes machines et contrôle qualité des produits.
                </div>
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <strong className="text-gray-900 block mb-1">🛍️ Ventes</strong>
                  Distribution et valorisation commerciale des produits finis.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-500">Design réalisé par <strong>Awa Ndiaye</strong></p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-900 text-white text-xs sm:text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>

      {/* Lightbox for large single image */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-5 right-5 p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors text-sm"
          >
            ✕ Fermer l&apos;image
          </button>
          <img
            src={lightboxImg}
            alt="Agrandissement"
            className="max-w-full max-h-[92vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  )
}

// ─── Jangum Jigeen Modal ──────────────────────────────────────────────────────

interface JangumJigeenModalProps {
  isOpen: boolean
  onClose: () => void
}

function JangumJigeenModal({ isOpen, onClose }: JangumJigeenModalProps) {
  const [activeTab, setActiveTab] = useState<"all" | "branding" | "affiches" | "facture">("all")
  const [lightboxImg, setLightboxImg] = useState<string | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxImg) setLightboxImg(null)
        else onClose()
      }
    }
    if (isOpen) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleKeyDown)
    }
    return () => {
      document.body.style.overflow = "unset"
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, lightboxImg, onClose])

  if (!isOpen) return null

  const assets = [
    {
      id: "branding",
      category: "branding",
      title: "Brand Guidelines & Univers Visuel",
      subtitle: "Logo JJ avec toque d'étudiant, Typographie Poppins, Goodies & Mockups",
      src: "/jangum-jigeen/brand-guidelines.png",
      desc: "Charte graphique complète comprenant le logotype JJ, la typographie Poppins, les codes couleurs orange et noir, ainsi que les déclinaisons sur t-shirt, mug, sac, agenda, stylo et ordinateur.",
    },
    {
      id: "affiche1",
      category: "affiches",
      title: "Affiche Officielle & Dépliant",
      subtitle: "« L'éducation d'aujourd'hui, la réussite de demain »",
      src: "/jangum-jigeen/affiche-mockup.jpg",
      desc: "Support de communication grand format et dépliant institutionnel promouvant la formation et l'autonomisation des jeunes femmes.",
    },
    {
      id: "affiche2",
      category: "affiches",
      title: "Flyer A4 Glossy Promotionnel",
      subtitle: "« Chaque femme mérite d'apprendre — Éduquer · Inspirer · Instruire · Réussir »",
      src: "/jangum-jigeen/flyer-mockup.png",
      desc: "Support visuel percutant mettant en avant les piliers du programme (Éduquer, Inspirer, Instruire, Réussir) et les coordonnées de contact.",
    },
    {
      id: "facture",
      category: "facture",
      title: "Facture & Modèle Administratif",
      subtitle: "« S'inscrire pour s'inspirer, s'inspirer pour réussir »",
      src: "/jangum-jigeen/facture-mockup.jpg",
      desc: "Modélisation de la papeterie d'entreprise et des factures officielles avec charte graphique, tableau de prestations (Formation, Atelier, Accompagnement) et conditions de paiement.",
    },
  ]

  const filteredAssets =
    activeTab === "all" ? assets : assets.filter((a) => a.category === activeTab)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title-jj"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-gray-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-gray-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-gray-900 via-gray-900 to-gray-950 text-white flex items-start justify-between gap-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-brand-blue/20 text-brand-blue border border-brand-blue/30">
                Branding & Communication
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-brand-green/20 text-brand-green border border-brand-green/30">
                4 Supports Réalisés
              </span>
            </div>
            <h2 id="modal-title-jj" className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white flex items-center gap-2">
              JANGUM JIGEEN
              <span className="text-brand-blue text-sm font-normal">— Éduquer · Inspirer · Instruire · Réussir</span>
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Création complète de l&apos;identité visuelle, charte graphique Poppins, 2 affiches de communication et modélisation des documents administratifs et factures.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue shrink-0"
            aria-label="Fermer la fenêtre"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Tab filters */}
        <div className="px-6 sm:px-8 pt-4 pb-2 bg-gray-50 border-b border-gray-100 flex flex-wrap gap-2">
          {[
            { id: "all", label: "Tous les supports (4)" },
            { id: "branding", label: "Brand Guidelines" },
            { id: "affiches", label: "Affiches & Flyers (2)" },
            { id: "facture", label: "Facture & Papeterie" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as typeof activeTab)}
              className={`px-4 py-2 text-xs sm:text-[13px] font-medium rounded-full transition-all duration-200 ${
                activeTab === t.id
                  ? "bg-brand-blue text-white shadow-sm"
                  : "bg-white text-gray-600 hover:text-gray-900 border border-gray-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
              >
                <div
                  className="group/img relative bg-gray-100 h-64 sm:h-72 cursor-pointer flex items-center justify-center overflow-hidden border-b border-gray-100"
                  onClick={() => setLightboxImg(asset.src)}
                >
                  <img
                    src={asset.src}
                    alt={asset.title}
                    className="w-full h-full object-contain p-2 group-hover/img:scale-[1.03] transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gray-950/25 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="px-4 py-2 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-medium rounded-full shadow-lg">
                      🔍 Agrandir en haute définition
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <h3 className="font-display font-semibold text-gray-900 text-base sm:text-lg">
                      {asset.title}
                    </h3>
                    <p className="text-xs font-medium text-brand-blue mt-0.5">{asset.subtitle}</p>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">{asset.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <button
                      onClick={() => setLightboxImg(asset.src)}
                      className="text-xs font-medium text-brand-blue hover:text-brand-blue transition-colors inline-flex items-center gap-1"
                    >
                      Afficher en plein écran
                      <span aria-hidden="true">→</span>
                    </button>
                    <a
                      href={asset.src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-gray-400 hover:text-gray-600 underline"
                    >
                      Ouvrir le fichier original
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Guidelines info card */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-display font-semibold text-gray-900 text-sm sm:text-base">
                Charte Graphique Jangum Jigeen
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Typographie principale : <strong>Poppins</strong> · Palette de marque : <strong>Orange Dynamique & Noir Élégance</strong>.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-700 shrink-0">
              🎓 Autonomisation Féminine & Digital
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-500">Design réalisé par <strong>Awa Ndiaye</strong></p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-900 text-white text-xs sm:text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>

      {/* Lightbox for large single image */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-5 right-5 p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors text-sm"
          >
            ✕ Fermer l&apos;image
          </button>
          <img
            src={lightboxImg}
            alt="Agrandissement"
            className="max-w-full max-h-[92vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  )
}

function Projects() {
  const [jefandikooModalOpen, setJefandikooModalOpen] = useState(false)
  const [jangumJigeenModalOpen, setJangumJigeenModalOpen] = useState(false)

  const projects = [
    {
      id: "joj",
      num: "01",
      title: "JOJ Dakar 2026",
      tags: ["UX Research", "UX/UI", "Figma"],
      desc: "Analyse de l'expérience utilisateur autour des Jeux Olympiques de la Jeunesse Dakar 2026, avec création de personas, parcours utilisateurs, workflows et wireframes.",
      accent: "green",
      live: true,
      hasMedia: false,
    },
    {
      id: "jefandikoo",
      num: "02",
      title: "Jefandikoo",
      subtitle: "Produire · Transformer · Valoriser",
      tags: ["Identité Visuelle", "Moodboard", "UX/UI", "Logos"],
      desc: "Conception complète de l'identité de marque, des 3 déclinaisons de logo et du moodboard applicatif dédié à la valorisation agricole et à la transformation locale.",
      accent: "green",
      live: true,
      hasMedia: true,
    },
    {
      id: "jangum-jigeen",
      num: "03",
      title: "Jangum Jigeen",
      subtitle: "Éduquer · Inspirer · Instruire · Réussir",
      tags: ["Brand Guidelines", "Affiches", "Papeterie", "Design"],
      desc: "Conception complète de l'identité visuelle de Jangum Jigeen (Brand Guidelines, typographie Poppins, déclinaisons), création de 2 affiches et modélisation de la facture officielle.",
      accent: "blue",
      live: true,
      hasMedia: true,
    },
  ]

  const tagClass: Record<string, string> = {
    green: "bg-brand-green/10 text-brand-green",
    blue: "bg-brand-blue/10 text-brand-blue",
    gray: "bg-gray-100 text-gray-400",
  }

  return (
    <section id="projets" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <FadeIn>
          <SectionLabel>Projets</SectionLabel>
          <h2 className="font-display text-3xl md:text-[2.4rem] font-semibold text-gray-900 leading-tight max-w-xl mb-12">
            Quelques projets{" "}
            <em className="not-italic text-brand-green">à découvrir.</em>
          </h2>
        </FadeIn>

        <div className="space-y-6">
          {projects.map((p, i) => (
            <FadeIn key={p.num} delay={i * 80}>
              <article
                className={`group bg-white rounded-3xl p-7 md:p-9 border transition-all duration-300 ${
                  p.live
                    ? "border-gray-100 hover:border-brand-green/30 hover:shadow-[0_12px_40px_rgba(0,154,68,0.08)]"
                    : "border-dashed border-gray-200"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5 mb-3">
                      <span className="font-mono text-[11px] font-medium text-gray-300">{p.num}</span>
                      {p.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full ${tagClass[p.accent]}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-display font-semibold text-2xl sm:text-[1.7rem] text-gray-900 mb-2 flex items-center gap-2">
                      {p.title}
                      {"subtitle" in p && p.subtitle && (
                        <span className={`text-xs sm:text-sm font-normal block sm:inline ${p.accent === "green" ? "text-brand-green" : "text-brand-blue"}`}>
                          — {p.subtitle}
                        </span>
                      )}
                    </h3>
                    <p className="text-[14px] text-gray-500 leading-relaxed max-w-3xl mb-4">{p.desc}</p>

                    {/* Rich Visual Preview for Jefandikoo */}
                    {p.id === "jefandikoo" && (
                      <div className="mt-5 pt-5 border-t border-gray-100">
                        <p className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase mb-3 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                          Visuels & Déclinaisons créés pour ce projet :
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {/* Moodboard preview */}
                          <div
                            onClick={() => setJefandikooModalOpen(true)}
                            className="group/img relative rounded-xl overflow-hidden border border-gray-200 bg-gray-100 h-24 sm:h-28 cursor-pointer hover:shadow-md transition-all duration-200"
                            title="Cliquer pour afficher le moodboard complet"
                          >
                            <img
                              src="/jefandikoo/moodboard.jpg"
                              alt="Aperçu Moodboard Jefandikoo"
                              className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                              <span className="text-[10px] font-medium text-white">Moodboard UX</span>
                            </div>
                          </div>

                          {/* Logo 1 */}
                          <div
                            onClick={() => setJefandikooModalOpen(true)}
                            className="group/img relative rounded-xl overflow-hidden border border-gray-200 bg-white h-24 sm:h-28 p-2 flex items-center justify-center cursor-pointer hover:shadow-md transition-all duration-200"
                            title="Logo Fond Blanc"
                          >
                            <img
                              src="/jefandikoo/logo-white.png"
                              alt="Logo Jefandikoo Fond Blanc"
                              className="w-full h-auto max-h-16 object-contain group-hover/img:scale-110 transition-transform duration-300"
                              loading="lazy"
                            />
                            <div className="absolute bottom-1 right-1.5 text-[9px] text-gray-400 font-medium">Fond Blanc</div>
                          </div>

                          {/* Logo 2 */}
                          <div
                            onClick={() => setJefandikooModalOpen(true)}
                            className="group/img relative rounded-xl overflow-hidden border border-gray-200 bg-[#01B501] h-24 sm:h-28 p-2 flex items-center justify-center cursor-pointer hover:shadow-md transition-all duration-200"
                            title="Logo Fond Vert"
                          >
                            <img
                              src="/jefandikoo/logo-green.png"
                              alt="Logo Jefandikoo Fond Vert"
                              className="w-full h-auto max-h-16 object-contain group-hover/img:scale-110 transition-transform duration-300"
                              loading="lazy"
                            />
                            <div className="absolute bottom-1 right-1.5 text-[9px] text-white/90 font-medium">Fond Vert</div>
                          </div>

                          {/* Logo 3 */}
                          <div
                            onClick={() => setJefandikooModalOpen(true)}
                            className="group/img relative rounded-xl overflow-hidden border border-gray-200 bg-[#FFC815] h-24 sm:h-28 p-2 flex items-center justify-center cursor-pointer hover:shadow-md transition-all duration-200"
                            title="Logo Fond Jaune"
                          >
                            <img
                              src="/jefandikoo/logo-yellow.png"
                              alt="Logo Jefandikoo Fond Jaune"
                              className="w-full h-auto max-h-16 object-contain group-hover/img:scale-110 transition-transform duration-300"
                              loading="lazy"
                            />
                            <div className="absolute bottom-1 right-1.5 text-[9px] text-gray-900/90 font-medium">Fond Jaune</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Rich Visual Preview for Jangum Jigeen */}
                    {p.id === "jangum-jigeen" && (
                      <div className="mt-5 pt-5 border-t border-gray-100">
                        <p className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase mb-3 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                          4 Supports créés (Brand Guidelines, 2 Affiches, Facture) :
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {/* Brand Guidelines */}
                          <div
                            onClick={() => setJangumJigeenModalOpen(true)}
                            className="group/img relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 h-24 sm:h-28 cursor-pointer hover:shadow-md transition-all duration-200"
                            title="Cliquer pour afficher la charte graphique Jangum Jigeen"
                          >
                            <img
                              src="/jangum-jigeen/brand-guidelines.png"
                              alt="Brand Guidelines Jangum Jigeen"
                              className="w-full h-full object-cover object-top group-hover/img:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-2">
                              <span className="text-[10px] font-medium text-white">Brand Guidelines</span>
                            </div>
                          </div>

                          {/* Affiche 1 */}
                          <div
                            onClick={() => setJangumJigeenModalOpen(true)}
                            className="group/img relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 h-24 sm:h-28 cursor-pointer hover:shadow-md transition-all duration-200"
                            title="Affiche Officielle & Dépliant"
                          >
                            <img
                              src="/jangum-jigeen/affiche-mockup.jpg"
                              alt="Affiche Officielle Jangum Jigeen"
                              className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-2">
                              <span className="text-[10px] font-medium text-white">Affiche Dépliant</span>
                            </div>
                          </div>

                          {/* Flyer A4 */}
                          <div
                            onClick={() => setJangumJigeenModalOpen(true)}
                            className="group/img relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 h-24 sm:h-28 cursor-pointer hover:shadow-md transition-all duration-200"
                            title="Flyer A4 Glossy"
                          >
                            <img
                              src="/jangum-jigeen/flyer-mockup.png"
                              alt="Flyer A4 Jangum Jigeen"
                              className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-2">
                              <span className="text-[10px] font-medium text-white">Flyer A4 Glossy</span>
                            </div>
                          </div>

                          {/* Facture */}
                          <div
                            onClick={() => setJangumJigeenModalOpen(true)}
                            className="group/img relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 h-24 sm:h-28 cursor-pointer hover:shadow-md transition-all duration-200"
                            title="Facture & Papeterie"
                          >
                            <img
                              src="/jangum-jigeen/facture-mockup.jpg"
                              alt="Facture Mockup Jangum Jigeen"
                              className="w-full h-full object-cover object-top group-hover/img:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-2">
                              <span className="text-[10px] font-medium text-white">Facture Papeterie</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0 flex lg:flex-col items-start lg:items-end justify-between gap-3">
                    <button
                      onClick={() => {
                        if (p.id === "jefandikoo") setJefandikooModalOpen(true)
                        if (p.id === "jangum-jigeen") setJangumJigeenModalOpen(true)
                      }}
                      className={`inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-full border transition-all duration-200 shadow-xs ${
                        p.id === "jefandikoo"
                          ? "bg-brand-green text-white border-brand-green hover:bg-brand-green-dark active:scale-95 cursor-pointer"
                          : p.id === "jangum-jigeen"
                          ? "bg-brand-blue text-white border-brand-blue hover:opacity-90 active:scale-95 cursor-pointer"
                          : "border-brand-green text-brand-green hover:bg-brand-green hover:text-white active:scale-95"
                      }`}
                    >
                      {p.id === "jefandikoo" ? (
                        <>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                          </svg>
                          Voir les visuels & logos
                        </>
                      ) : p.id === "jangum-jigeen" ? (
                        <>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                          </svg>
                          Voir les 4 réalisations
                        </>
                      ) : (
                        <>
                          Voir le projet
                          <span aria-hidden="true">→</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Interactive Modals */}
      <JefandikooModal
        isOpen={jefandikooModalOpen}
        onClose={() => setJefandikooModalOpen(false)}
      />
      <JangumJigeenModal
        isOpen={jangumJigeenModalOpen}
        onClose={() => setJangumJigeenModalOpen(false)}
      />
    </section>
  )
}

// ─── Parcours / Timeline ──────────────────────────────────────────────────────

function Parcours() {
  const steps = [
    {
      title: "Assistante digitale",
      org: "Sonatel Academy",
      accent: "green",
      skills: ["Outils numériques", "Communication digitale", "Design", "UX/UI", "Gestion de projet", "Travail collaboratif"],
    },
    {
      title: "Licence en Sociologie",
      org: "UNCHK",
      accent: "blue",
      skills: ["Analyse", "Recherche", "Compréhension des besoins", "Observation des comportements"],
    },
    {
      title: "Formations complémentaires",
      org: "[À COMPLÉTER]",
      accent: "gray",
      skills: ["Word", "Excel", "PowerPoint", "Design", "Outils numériques"],
    },
  ]

  return (
    <section id="parcours" className="py-24 bg-[#f9f9f8]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <FadeIn>
          <SectionLabel>Parcours</SectionLabel>
          <h2 className="font-display text-3xl md:text-[2.4rem] font-semibold text-gray-900 leading-tight max-w-xl mb-16">
            Formation &{" "}
            <em className="not-italic text-brand-blue">expériences.</em>
          </h2>
        </FadeIn>

        <div className="relative pl-8 md:pl-0 md:max-w-2xl">
          {/* Vertical line */}
          <div
            className="absolute left-3 md:left-0 top-2 bottom-2 w-px bg-gradient-to-b from-brand-green via-brand-blue to-gray-200"
            aria-hidden="true"
          />

          <div className="space-y-8">
            {steps.map((s, i) => (
              <FadeIn key={s.title} delay={i * 100}>
                <div className="relative md:pl-10">
                  {/* Dot */}
                  <div
                    className={`absolute -left-[21px] md:-left-[17px] top-5 w-3 h-3 rounded-full border-2 border-white ${
                      s.accent === "green"
                        ? "bg-brand-green"
                        : s.accent === "blue"
                        ? "bg-brand-blue"
                        : "bg-gray-300"
                    }`}
                    aria-hidden="true"
                  />

                  <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="font-display font-semibold text-gray-900 text-[17px] leading-snug">
                          {s.title}
                        </h3>
                        <p
                          className={`text-[13px] font-medium mt-0.5 ${
                            s.accent === "green"
                              ? "text-brand-green"
                              : s.accent === "blue"
                              ? "text-brand-blue"
                              : "text-gray-400"
                          }`}
                        >
                          {s.org}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {s.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[11px] font-medium bg-gray-50 text-gray-500 px-2.5 py-1 rounded-full border border-gray-100"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* CV Download / Consultation Box */}
        <FadeIn delay={250}>
          <div className="mt-14 bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:border-brand-green/30 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-green/10 text-brand-green flex items-center justify-center shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <div>
                <h3 className="font-display font-semibold text-gray-900 text-base sm:text-lg">Curriculum Vitae</h3>
                <p className="text-[13px] text-gray-400">Consultez ou téléchargez mon CV complet en version PDF.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <a
                href="/CV_Awa_Ndiaye.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-green text-white text-[13px] font-medium rounded-full hover:bg-brand-green-dark transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 active:scale-95 shadow-sm"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                Consulter le CV
              </a>
              <a
                href="/CV_Awa_Ndiaye.pdf"
                download="CV_Awa_Ndiaye.pdf"
                className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 text-[13px] font-medium rounded-full hover:border-brand-blue hover:text-brand-blue transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue active:scale-95"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Télécharger (PDF)
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function Testimonials() {
  return (
    <section id="temoignages" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 text-center">
        <FadeIn>
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <span className="w-8 h-px bg-brand-green" aria-hidden="true" />
            <p className="text-[11px] font-semibold tracking-[0.18em] text-brand-green uppercase">
              Témoignages
            </p>
            <span className="w-8 h-px bg-brand-green" aria-hidden="true" />
          </div>
          <h2 className="font-display text-3xl md:text-[2.4rem] font-semibold text-gray-900 mb-8">
            Ce qu&apos;on dit de mon travail.
          </h2>
          <div className="inline-flex items-center gap-4 bg-gray-50 border border-dashed border-gray-200 rounded-2xl px-8 py-6 mx-auto">
            <span className="text-2xl text-brand-green/40" aria-hidden="true">✦</span>
            <p className="text-[14px] text-gray-400 italic">
              Des témoignages seront ajoutés prochainement.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function Contact() {
  const infos = [
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      label: "Email",
      value: "awa05853@gmail.com",
      href: "mailto:awa05853@gmail.com",
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.72A2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.68 6.68l1.41-1.41a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
        </svg>
      ),
      label: "Téléphone",
      value: "+221 77 171 15 74",
      href: "tel:+221771711574",
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
        </svg>
      ),
      label: "Curriculum Vitae",
      value: "Consulter mon CV (PDF)",
      href: "/CV_Awa_Ndiaye.pdf",
      target: "_blank",
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      label: "Localisation",
      value: "Sénégal",
      href: null,
    },
  ]

  return (
    <section id="contact" className="py-32 bg-gray-950 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute -top-64 -left-40 w-[520px] h-[520px] rounded-full bg-brand-green/8 blur-[120px] pointer-events-none" aria-hidden="true" />
      <div className="absolute -bottom-64 -right-40 w-[520px] h-[520px] rounded-full bg-brand-blue/8 blur-[120px] pointer-events-none" aria-hidden="true" />

      <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center relative z-10">
        <FadeIn>
          <div className="inline-flex items-center justify-center gap-2 mb-6">
            <span className="w-8 h-px bg-brand-green" aria-hidden="true" />
            <p className="text-[11px] font-semibold tracking-[0.18em] text-brand-green uppercase">Contact</p>
            <span className="w-8 h-px bg-brand-green" aria-hidden="true" />
          </div>

          <h2 className="font-display text-4xl md:text-5xl font-semibold text-white leading-tight mb-5">
            Parlons de votre{" "}
            <em className="not-italic text-brand-green">prochain projet.</em>
          </h2>
          <p className="text-gray-400 text-[15px] leading-relaxed max-w-lg mx-auto mb-10">
            Vous êtes recruteur, client ou partenaire ? Écrivez-moi, contactez-moi sur WhatsApp ou téléchargez mon CV pour étudier mon profil.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <a
              href="mailto:awa05853@gmail.com"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-green text-white font-medium rounded-full hover:bg-brand-green-dark transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 active:scale-95 text-[15px]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              M&apos;envoyer un email
            </a>
            <a
              href="https://wa.me/221771711574"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-4 border border-white/15 text-white font-medium rounded-full hover:bg-white/10 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green active:scale-95 text-[15px]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              WhatsApp
            </a>
            <a
              href="/CV_Awa_Ndiaye.pdf"
              download="CV_Awa_Ndiaye.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-4 bg-white/10 text-white font-medium rounded-full hover:bg-white/20 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue active:scale-95 text-[15px]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Télécharger mon CV (PDF)
            </a>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {infos.map((item) => (
              <div
                key={item.label}
                className="bg-white/5 border border-white/8 rounded-xl p-5 hover:bg-white/8 transition-colors duration-200"
              >
                <span className="text-brand-green block mb-2">{item.icon}</span>
                <p className="text-[10px] font-semibold tracking-widest text-gray-500 uppercase mb-1.5">
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.target}
                    rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
                    className="text-white text-[13px] hover:text-brand-green transition-colors focus-visible:outline-none focus-visible:underline inline-flex items-center gap-1"
                  >
                    {item.value}
                    {item.target === "_blank" && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    )}
                  </a>
                ) : (
                  <p className="text-white text-[13px]">{item.value}</p>
                )}
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-white/5 py-10 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="text-center sm:text-left">
          <p className="font-display text-xl font-semibold text-white">
            Awa<span className="text-brand-green">.</span>
          </p>
          <p className="text-gray-600 text-[12px] mt-0.5">Assistante digitale · UX/UI · Design</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="/CV_Awa_Ndiaye.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-brand-green/40 text-brand-green text-[13px] rounded-full hover:bg-brand-green hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
            aria-label="Consulter le CV d'Awa Ndiaye au format PDF (ouvre dans un nouvel onglet)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
            Mon CV (PDF)
          </a>
          <a
            href="[LIEN_LINKEDIN]"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-white/10 text-gray-400 text-[13px] rounded-full hover:border-brand-blue hover:text-brand-blue transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
            aria-label="Profil LinkedIn d'Awa Ndiaye (ouvre dans un nouvel onglet)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
              <circle cx="4" cy="4" r="2" />
            </svg>
            LinkedIn
          </a>
          <a
            href="https://github.com/awa05853-svg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-white/10 text-gray-400 text-[13px] rounded-full hover:border-brand-green hover:text-brand-green transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
            aria-label="Profil GitHub d'Awa Ndiaye (ouvre dans un nouvel onglet)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            GitHub
          </a>
        </div>

        <p className="text-gray-700 text-[12px]">© 2026 Awa Ndiaye — Tous droits réservés.</p>
      </div>
    </footer>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="font-body bg-white text-gray-900 antialiased">
      <Navbar />
      <main id="main-content">
        <Hero />
        <About />
        <Skills />
        <Services />
        <Projects />
        <Parcours />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
