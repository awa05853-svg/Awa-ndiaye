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

        {/* Desktop CTA + hamburger */}
        <div className="flex items-center gap-3">
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
          <li className="pt-3 pb-2">
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
                href="/assets/CV_Awa_Ndiaye.pdf"
                download
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

function Projects() {
  const projects = [
    {
      num: "01",
      title: "JOJ Dakar 2026",
      tags: ["UX Research", "UX/UI", "Figma"],
      desc: "Analyse de l'expérience utilisateur autour des Jeux Olympiques de la Jeunesse Dakar 2026, avec création de personas, parcours utilisateurs, workflows et wireframes.",
      accent: "green",
      live: true,
    },
    {
      num: "02",
      title: "DENTIALMA",
      tags: ["Innovation", "UX/UI", "Digital"],
      desc: "Concept de solution numérique innovante destinée à simplifier les parcours utilisateurs, valoriser les services et offrir une expérience intuitive et accessible.",
      accent: "blue",
      live: true,
    },
    {
      num: "03",
      title: "Projet à compléter",
      tags: ["Design", "Communication digitale"],
      desc: "Placeholder destiné à accueillir une future réalisation professionnelle, académique ou personnelle.",
      accent: "gray",
      live: false,
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

        <div className="space-y-5">
          {projects.map((p, i) => (
            <FadeIn key={p.num} delay={i * 80}>
              <article
                className={`group bg-white rounded-2xl px-7 py-8 md:px-10 md:py-9 border transition-all duration-300 ${
                  p.live
                    ? "border-gray-100 hover:border-brand-green/20 hover:shadow-[0_8px_30px_rgba(0,154,68,0.07)]"
                    : "border-dashed border-gray-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
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
                    <h3
                      className={`font-display font-semibold text-xl sm:text-2xl mb-2 ${p.live ? "text-gray-900" : "text-gray-400"}`}
                    >
                      {p.title}
                    </h3>
                    <p className="text-[13px] text-gray-400 leading-relaxed max-w-2xl">{p.desc}</p>
                  </div>

                  <div className="flex-shrink-0">
                    <button
                      disabled={!p.live}
                      aria-disabled={!p.live}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium rounded-full border transition-all duration-200 ${
                        p.live
                          ? "border-brand-green text-brand-green hover:bg-brand-green hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green active:scale-95"
                          : "border-gray-200 text-gray-300 cursor-not-allowed"
                      }`}
                    >
                      Voir le projet
                      {p.live && <span aria-hidden="true">→</span>}
                    </button>
                  </div>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
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
      value: "[VOTRE EMAIL]",
      href: "mailto:[VOTRE_EMAIL]",
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.72A2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.68 6.68l1.41-1.41a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
        </svg>
      ),
      label: "Téléphone",
      value: "[VOTRE TÉLÉPHONE]",
      href: "tel:[VOTRE_TELEPHONE]",
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
            Vous êtes recruteur, client ou partenaire ? Écrivez-moi pour échanger sur une opportunité ou une collaboration.
          </p>

          <a
            href="mailto:[VOTRE_EMAIL]"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-green text-white font-medium rounded-full hover:bg-brand-green-dark transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 active:scale-95 text-[15px] mb-16"
          >
            Me contacter
            <span aria-hidden="true">→</span>
          </a>

          <div className="grid sm:grid-cols-3 gap-4 text-left">
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
                    className="text-white text-[13px] hover:text-brand-green transition-colors focus-visible:outline-none focus-visible:underline"
                  >
                    {item.value}
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

        <div className="flex items-center gap-3">
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
            href="[LIEN_GITHUB]"
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
