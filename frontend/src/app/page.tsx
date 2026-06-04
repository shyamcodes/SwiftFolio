"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBolt,
  faChevronDown,
  faClipboardList,
  faClock,
  faCode,
  faFileLines,
  faGlobe,
  faLink,
  faPalette,
  faRocket,
  faStar,
  faUser,
  faUsers,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

// Typewriter hook
function useTypewriter(words: string[], speed = 100) {
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx % words.length];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(word.substring(0, text.length + 1));
        if (text.length + 1 === word.length) setTimeout(() => setIsDeleting(true), 1500);
      } else {
        setText(word.substring(0, text.length - 1));
        if (text.length - 1 === 0) { setIsDeleting(false); setWordIdx(i => i + 1); }
      }
    }, isDeleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIdx, words, speed]);

  return text;
}

// Scroll reveal hook
function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    document.querySelectorAll(".reveal,.reveal-left,.reveal-right,.reveal-scale").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// Animated counter
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const duration = 1500;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
          start = Math.min(start + step, target);
          setCount(Math.floor(start));
          if (start >= target) clearInterval(timer);
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);

  return <div ref={ref}>{count.toLocaleString()}{suffix}</div>;
}

const FEATURES = [
  {
    icon: faFileLines, title: "Smart Resume Parsing",
    desc: "AI extracts skills, experience, education from your PDF in seconds — perfectly structured.",
    gradient: "from-blue-600/20 to-cyan-600/20", border: "border-blue-500/20",
    badge: "AI Powered", badgeColor: "bg-blue-500/15 text-blue-400",
  },
  {
    icon: faGithub, title: "GitHub Deep Sync",
    desc: "Showcase repos, contributions, commit graphs, and language stats pulled live from GitHub.",
    gradient: "from-violet-600/20 to-purple-600/20", border: "border-violet-500/20",
    badge: "Real-time", badgeColor: "bg-violet-500/15 text-violet-400",
  },
  {
    icon: faCode, title: "Coding Stats Dashboard",
    desc: "Display LeetCode & HackerRank rankings, solved counts, badges and more in beautiful cards.",
    gradient: "from-emerald-600/20 to-teal-600/20", border: "border-emerald-500/20",
    badge: "Live Data", badgeColor: "bg-emerald-500/15 text-emerald-400",
  },
  {
    icon: faPalette, title: "18 Stunning Templates",
    desc: "From Aurora glassmorphism to Matrix code rain — choose a template that matches your style.",
    gradient: "from-rose-600/20 to-pink-600/20", border: "border-rose-500/20",
    badge: "New!", badgeColor: "bg-rose-500/15 text-rose-400",
  },
  {
    icon: faBolt, title: "Instant Generation",
    desc: "Your entire portfolio is generated in under 30 seconds. No manual editing required.",
    gradient: "from-amber-600/20 to-orange-600/20", border: "border-amber-500/20",
    badge: "Fast", badgeColor: "bg-amber-500/15 text-amber-400",
  },
  {
    icon: faGlobe, title: "Multilingual Export",
    desc: "Translate your portfolio to 50+ languages and export as HTML, JSON, or PDF.",
    gradient: "from-cyan-600/20 to-sky-600/20", border: "border-cyan-500/20",
    badge: "50+ Langs", badgeColor: "bg-cyan-500/15 text-cyan-400",
  },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Upload Resume", desc: "Drop your PDF - AI parses everything automatically", icon: faFileLines, color: "from-blue-600 to-cyan-500" },
  { step: "02", title: "Add Profiles", desc: "Link GitHub, LeetCode, HackerRank usernames", icon: faLink, color: "from-violet-600 to-purple-500" },
  { step: "03", title: "Pick Template", desc: "Choose from 18 animated portfolio themes", icon: faPalette, color: "from-pink-600 to-rose-500" },
  { step: "04", title: "Go Live!", desc: "Your stunning portfolio is instantly published", icon: faRocket, color: "from-emerald-600 to-teal-500" },
];

const STATS = [
  { value: 12000, suffix: "+", label: "Portfolios Created", icon: faClipboardList },
  { value: 98, suffix: "%", label: "Satisfaction Rate", icon: faStar },
  { value: 18, suffix: "", label: "Unique Templates", icon: faPalette },
  { value: 30, suffix: "s", label: "Average Generation", icon: faClock },
];

const TESTIMONIALS = [
  { name: "Aryan Kumar", role: "SWE @ Google", avatar: faUser, text: "SwiftFolio built my entire portfolio in under a minute. The Aurora template is absolutely gorgeous - got 3 interview calls the same week!", stars: 5 },
  { name: "Priya Mehta", role: "ML Engineer", avatar: faUser, text: "The GitHub integration is incredible - live repos, star counts, language stats all rendered beautifully. Used it to land my dream role!", stars: 5 },
  { name: "James Chen", role: "Fullstack Dev", avatar: faUser, text: "18 templates! I changed my mind 5 times before picking Matrix Code. My portfolio literally has a code-rain background now. 10/10.", stars: 5 },
];

export default function Home() {
  const typeText = useTypewriter(["Stunning Portfolios", "GitHub Showcases", "Developer Brands", "Career Launchers"], 80);
  useScrollReveal();

  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* ══════════════════════ HERO ══════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden" style={{background:"linear-gradient(135deg,#080c14 0%,#0f1623 50%,#080c14 100%)"}}>
        {/* Animated orbs */}
        <div className="orb orb-1 w-[700px] h-[700px] bg-indigo-600/12 -top-48 -left-48" />
        <div className="orb orb-2 w-[500px] h-[500px] bg-purple-600/10 -bottom-32 -right-32" />
        <div className="orb orb-3 w-96 h-96 bg-cyan-600/08 top-1/3 right-1/4" />

        {/* Video background with overlay */}
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-10">
          <source src="/home.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/80" />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{backgroundImage:"linear-gradient(#6366f1 1px,transparent 1px),linear-gradient(90deg,#6366f1 1px,transparent 1px)",backgroundSize:"60px 60px"}} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-sm font-medium mb-8 animate-slide-up animate-pulse-glow">
            <FontAwesomeIcon icon={faWandMagicSparkles} className="w-4 h-4 animate-pulse" />
            18 New Templates — Just Launched!
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 animate-slide-up-d1 leading-[1.05]">
            Build{" "}
            <span
              className="animate-gradient bg-clip-text text-transparent"
              style={{backgroundImage:"linear-gradient(90deg,#818cf8,#c084fc,#22d3ee,#818cf8)",backgroundSize:"300% 100%"}}
            >
              {typeText}
            </span>
            <span className="animate-blink text-indigo-400">|</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto animate-slide-up-d2 leading-relaxed">
            Generate a <span className="text-white font-semibold">stunning developer portfolio</span> from your GitHub, LeetCode & HackerRank in{" "}
            <span className="text-indigo-400 font-bold">under 30 seconds</span> — with 18 animated templates.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up-d3">
            <Link href="/create"
              className="group relative flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-bold text-white overflow-hidden btn-magnetic"
              style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)"}}>
              <span className="relative z-10 flex items-center gap-2">
                <FontAwesomeIcon icon={faWandMagicSparkles} className="w-5 h-5 animate-pulse" />
                Create Free Portfolio
                <FontAwesomeIcon icon={faArrowRight} className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
            </Link>
            <Link href="/portfolio/demo"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-lg font-semibold text-slate-300 border border-white/10 hover:border-white/25 hover:text-white hover:bg-white/5 transition-all duration-200 btn-magnetic">
              View Live Demo →
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-6 mt-12 animate-slide-up-d4">
            <div className="flex -space-x-2">
              {[1,2,3,4,5].map((e,i)=>(
                <div key={i} className="w-9 h-9 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-sm">
                  <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-slate-200" />
                </div>
              ))}
            </div>
            <div className="text-sm text-slate-500">
              <span className="text-white font-bold">12,000+</span> developers already using SwiftFolio
            </div>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(i=><FontAwesomeIcon key={i} icon={faStar} className="w-4 h-4 text-amber-400"/>)}
              <span className="text-slate-500 text-sm ml-1">4.9/5</span>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float flex flex-col items-center gap-2 text-slate-600">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <FontAwesomeIcon icon={faChevronDown} className="w-5 h-5" />
          </div>
        </div>
      </section>

      {/* ══════════════════════ STATS ══════════════════════ */}
      <section className="py-20 bg-slate-950 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <div key={i} className="text-center reveal" style={{transitionDelay:`${i*0.1}s`}}>
                <div className="text-3xl mb-2"><FontAwesomeIcon icon={s.icon} /></div>
                <div className="text-4xl md:text-5xl font-black text-white mb-1">
                  <Counter target={s.value} suffix={s.suffix} />
                </div>
                <p className="text-slate-500 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ FEATURES ══════════════════════ */}
      <section className="py-28 relative overflow-hidden" style={{background:"linear-gradient(180deg,#080c14,#0a0f1e,#080c14)"}}>
        <div className="orb orb-1 w-96 h-96 bg-indigo-600/8 top-0 right-0" />
        <div className="orb orb-2 w-72 h-72 bg-purple-600/8 bottom-0 left-0" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-4 reveal">
              Everything You Need
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 reveal">
              Supercharged{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Features</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto reveal">All tools to build a world-class developer portfolio</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {FEATURES.map((f, i) => (
              <div key={i}
                className={`reveal tilt-card p-6 rounded-2xl bg-gradient-to-br ${f.gradient} border ${f.border} group`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-3xl animate-float-d1"><FontAwesomeIcon icon={f.icon} /></div>
                  <span className={`ml-auto px-2.5 py-1 rounded-full text-xs font-semibold ${f.badgeColor}`}>{f.badge}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                <div className="mt-4 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ HOW IT WORKS ══════════════════════ */}
      <section id="about" className="py-28 bg-slate-950 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 reveal">
              <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">4 Steps</span> to Live
            </h2>
            <p className="text-slate-400 text-lg reveal">Faster than making a coffee</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 opacity-30" />

            {HOW_IT_WORKS.map((item, i) => (
              <div key={i} className="text-center group reveal-scale" style={{transitionDelay:`${i*0.15}s`}}>
                <div className={`relative w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300 animate-float`}
                  style={{animationDelay:`${i*0.4}s`}}>
                  <FontAwesomeIcon icon={item.icon} />
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center">
                    <span className="text-xs font-black text-slate-400">{item.step}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ TEMPLATES PREVIEW ══════════════════════ */}
      <section className="py-28 relative overflow-hidden" style={{background:"linear-gradient(135deg,#0f0c29,#302b63,#24243e)"}}>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 reveal">18 Unique Templates</h2>
            <p className="text-slate-300 text-lg reveal">Each with its own real-life animation effect</p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-10 stagger-children">
            {[
              {name:"Aurora",icon:faGlobe,colors:"from-indigo-900 to-purple-900"},
              {name:"Neon",icon:faBolt,colors:"from-black to-cyan-950"},
              {name:"Sunset",icon:faGlobe,colors:"from-orange-600 to-pink-700"},
              {name:"Forest",icon:faGlobe,colors:"from-emerald-900 to-teal-900"},
              {name:"Ocean",icon:faGlobe,colors:"from-blue-900 to-cyan-900"},
              {name:"Galaxy",icon:faGlobe,colors:"from-slate-950 to-indigo-950"},
              {name:"Retro",icon:faCode,colors:"from-purple-950 to-pink-950"},
              {name:"Rose",icon:faPalette,colors:"from-rose-200 to-pink-200"},
              {name:"Fire",icon:faBolt,colors:"from-red-900 to-orange-900"},
              {name:"Arctic",icon:faGlobe,colors:"from-sky-100 to-blue-200"},
              {name:"Matrix",icon:faCode,colors:"from-black to-green-950"},
              {name:"Holo",icon:faWandMagicSparkles,colors:"from-pink-600 to-cyan-600"},
            ].map((t,i)=>(
              <div key={i} className={`reveal-scale h-20 rounded-xl bg-gradient-to-br ${t.colors} flex flex-col items-center justify-center gap-1 border border-white/10 card-hover cursor-pointer`}
                style={{transitionDelay:`${i*0.04}s`}}>
                <span className="text-xl animate-float" style={{animationDelay:`${i*0.3}s`}}><FontAwesomeIcon icon={t.icon} /></span>
                <span className="text-white/70 text-xs font-medium">{t.name}</span>
              </div>
            ))}
          </div>
          <div className="text-center reveal">
            <Link href="/create"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-slate-900 font-bold text-lg hover:bg-indigo-50 transition-colors btn-magnetic">
              Browse All 18 Templates <FontAwesomeIcon icon={faArrowRight} className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════ TESTIMONIALS ══════════════════════ */}
      <section className="py-28 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4 reveal">Loved by Developers</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 stagger-children">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="reveal p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/8 card-hover">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.stars)].map((_, j) => <FontAwesomeIcon key={j} icon={faStar} className="w-4 h-4 text-amber-400" />)}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xl"><FontAwesomeIcon icon={t.avatar} className="w-4 h-4 text-slate-200" /></div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ CTA ══════════════════════ */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 animate-gradient" style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4,#6366f1)",backgroundSize:"300% 300%"}} />
        <div className="absolute inset-0 bg-black/30" />
        <div className="orb orb-1 w-96 h-96 bg-white/5 top-0 left-0" />
        <div className="orb orb-2 w-72 h-72 bg-white/5 bottom-0 right-0" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="text-6xl mb-6 animate-float"><FontAwesomeIcon icon={faRocket} /></div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 reveal">
            Ready to Stand Out?
          </h2>
          <p className="text-xl text-white/80 mb-10 reveal">
            Join 12,000+ developers who built stunning portfolios in minutes — completely free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center reveal">
            <Link href="/create"
              className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-slate-900 font-black text-xl hover:bg-indigo-50 transition-all duration-200 btn-magnetic">
              <FontAwesomeIcon icon={faWandMagicSparkles} className="w-6 h-6 text-indigo-600 animate-pulse" />
              Build Mine Free
              <FontAwesomeIcon icon={faArrowRight} className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <p className="text-white/50 text-sm mt-6 reveal">No signup required · Ready in 30 seconds</p>
        </div>
      </section>
    </div>
  );
}
