"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowTrendUp,
  faAward,
  faBriefcase,
  faBox,
  faCode,
  faDownload,
  faFileLines,
  faGlobe,
  faLocationDot,
  faPenToSquare,
  faRocket,
  faSpinner,
  faStar,
  faTrophy,
  faUser,
  faWandMagicSparkles,
  faUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";

// ── Types ────────────────────────────────────────────────────
interface Portfolio {
  username: string; about?: string; bio?: string; skills: string[]; language?: string; template?: string;
  resume?: { name?: string; email?: string; phone?: string; education: {degree:string;details?:string}[]; experience: {title:string;details?:string}[]; skills: string[] };
  projects: { name:string; description:string; url?:string; language?:string; stars?:number }[];
  github?: { username:string; name?:string; bio?:string; avatar_url?:string; public_repos:number; followers:number; following:number; repos:{name:string;description:string;url:string;language:string;stars:number;forks:number}[] };
  leetcode?: { username:string; name?:string; avatar_url?:string; ranking?:number; reputation?:number; problems_solved:number; easy_solved:number; medium_solved:number; hard_solved:number; total_submissions:number; acceptance_rate?:number; about?:string; country?:string; company?:string; school?:string; profile_url?:string };
  hackerrank?: { username:string; problems_solved:number; badges:string[] };
}

// ── Theme map for 18 templates ───────────────────────────────
const THEMES: Record<string, { hero: string; accent: string; card: string; text: string; badge: string; glow: string }> = {
  aurora:       { hero:"linear-gradient(135deg,#0f0c29,#302b63,#24243e)", accent:"#818cf8", card:"rgba(255,255,255,0.05)", text:"#e2e8f0", badge:"rgba(129,140,248,0.15)", glow:"rgba(129,140,248,0.3)" },
  neon:         { hero:"linear-gradient(135deg,#000,#001a2e)", accent:"#22d3ee", card:"rgba(34,211,238,0.05)", text:"#e0f9ff", badge:"rgba(34,211,238,0.12)", glow:"rgba(34,211,238,0.4)" },
  sunset:       { hero:"linear-gradient(135deg,#c471ed,#f64f59)", accent:"#fb923c", card:"rgba(255,255,255,0.1)", text:"#fff7ed", badge:"rgba(251,146,60,0.2)", glow:"rgba(251,146,60,0.3)" },
  forest:       { hero:"linear-gradient(135deg,#0a2e1a,#1a4a2e)", accent:"#34d399", card:"rgba(52,211,153,0.07)", text:"#d1fae5", badge:"rgba(52,211,153,0.15)", glow:"rgba(52,211,153,0.3)" },
  ocean:        { hero:"linear-gradient(135deg,#001a3e,#002b5e)", accent:"#38bdf8", card:"rgba(56,189,248,0.07)", text:"#e0f2fe", badge:"rgba(56,189,248,0.15)", glow:"rgba(56,189,248,0.3)" },
  minimal:      { hero:"linear-gradient(135deg,#f8fafc,#f1f5f9)", accent:"#6366f1", card:"rgba(0,0,0,0.03)", text:"#1e293b", badge:"rgba(99,102,241,0.1)", glow:"rgba(99,102,241,0.2)" },
  galaxy:       { hero:"linear-gradient(135deg,#020617,#0f0a3c)", accent:"#a78bfa", card:"rgba(167,139,250,0.07)", text:"#f5f3ff", badge:"rgba(167,139,250,0.15)", glow:"rgba(167,139,250,0.35)" },
  retro:        { hero:"linear-gradient(135deg,#1a001a,#2d0047)", accent:"#f0abfc", card:"rgba(240,171,252,0.07)", text:"#fdf4ff", badge:"rgba(240,171,252,0.15)", glow:"rgba(240,171,252,0.35)" },
  rose:         { hero:"linear-gradient(135deg,#fff1f2,#fce7f3)", accent:"#f43f5e", card:"rgba(0,0,0,0.04)", text:"#1e293b", badge:"rgba(244,63,94,0.1)", glow:"rgba(244,63,94,0.2)" },
  midnight:     { hero:"linear-gradient(135deg,#020617,#0f172a)", accent:"#94a3b8", card:"rgba(255,255,255,0.04)", text:"#e2e8f0", badge:"rgba(148,163,184,0.1)", glow:"rgba(148,163,184,0.25)" },
  fire:         { hero:"linear-gradient(135deg,#1c0000,#3d1100)", accent:"#fbbf24", card:"rgba(251,191,36,0.07)", text:"#fef3c7", badge:"rgba(251,191,36,0.15)", glow:"rgba(251,191,36,0.35)" },
  arctic:       { hero:"linear-gradient(135deg,#f0f9ff,#e0f2fe)", accent:"#0ea5e9", card:"rgba(0,0,0,0.04)", text:"#0c4a6e", badge:"rgba(14,165,233,0.1)", glow:"rgba(14,165,233,0.2)" },
  matrix:       { hero:"linear-gradient(135deg,#000,#001200)", accent:"#4ade80", card:"rgba(74,222,128,0.05)", text:"#dcfce7", badge:"rgba(74,222,128,0.12)", glow:"rgba(74,222,128,0.35)" },
  candy:        { hero:"linear-gradient(135deg,#fdf4ff,#fce7f3)", accent:"#c084fc", card:"rgba(0,0,0,0.03)", text:"#1e293b", badge:"rgba(192,132,252,0.12)", glow:"rgba(192,132,252,0.25)" },
  obsidian:     { hero:"linear-gradient(135deg,#0c0a09,#1c1917)", accent:"#d97706", card:"rgba(217,119,6,0.07)", text:"#fef3c7", badge:"rgba(217,119,6,0.15)", glow:"rgba(217,119,6,0.3)" },
  holographic:  { hero:"linear-gradient(135deg,#1e1b4b,#312e81,#1e3a5f)", accent:"#e879f9", card:"rgba(232,121,249,0.07)", text:"#fdf4ff", badge:"rgba(232,121,249,0.15)", glow:"rgba(232,121,249,0.3)" },
  nature:       { hero:"linear-gradient(135deg,#f0fdf4,#ecfdf5)", accent:"#16a34a", card:"rgba(0,0,0,0.04)", text:"#14532d", badge:"rgba(22,163,74,0.1)", glow:"rgba(22,163,74,0.2)" },
  terminal:     { hero:"linear-gradient(135deg,#030712,#0f172a)", accent:"#86efac", card:"rgba(134,239,172,0.05)", text:"#dcfce7", badge:"rgba(134,239,172,0.1)", glow:"rgba(134,239,172,0.3)" },
};

// Animated counter component
function AnimatedCounter({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const steps = 40;
        const stepVal = value / steps;
        let cur = 0;
        const iv = setInterval(() => {
          cur = Math.min(cur + stepVal, value);
          setCount(Math.round(cur));
          if (cur >= value) clearInterval(iv);
        }, duration / steps);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value, duration]);
  return <span ref={ref}>{count.toLocaleString()}</span>;
}

// Skill pill with animated reveal
function SkillPill({ skill, i, accent }: { skill: string; i: number; accent: string }) {
  return (
    <span
      className="px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-300 hover:scale-105 animate-scale-pop"
      style={{ background:`${accent}18`, borderColor:`${accent}35`, color:accent, animationDelay:`${i*0.05}s` }}
    >
      {skill}
    </span>
  );
}

// Section wrapper with scroll reveal
function Section({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && e.target.classList.add("visible"), { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`} style={style}>{children}</div>;
}

export default function PortfolioPage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [languages, setLanguages] = useState<{code:string;name:string}[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const url = username === "demo"
          ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/portfolio/latest`
          : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/portfolio/${username}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Portfolio not found");
        const data = await res.json();
        setPortfolio(data);
        setSelectedLanguage(data.language || "en");
        const langRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/portfolio/languages/available`);
        if (langRes.ok) { const d = await langRes.json(); setLanguages(d.languages); }
      } catch { setError("Portfolio not found"); }
      finally { setLoading(false); }
    };
    if (username) fetchPortfolio();
  }, [username]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:"linear-gradient(135deg,#080c14,#0f1623)"}}>
      <div className="text-center animate-fade-in">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20" />
          <div className="absolute inset-0 rounded-full border-4 border-t-indigo-400 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          <div className="absolute inset-3 rounded-full border-4 border-t-purple-400 border-r-transparent border-b-transparent border-l-transparent animate-spin" style={{animationDirection:"reverse"}} />
          <div className="absolute inset-0 flex items-center justify-center text-2xl"><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>
        </div>
        <p className="text-slate-400 animate-pulse">Loading portfolio…</p>
      </div>
    </div>
  );

  if (error || !portfolio) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:"linear-gradient(135deg,#080c14,#0f1623)"}}>
      <div className="text-center animate-bounce-in">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-white mb-2">Portfolio Not Found</h2>
        <p className="text-slate-400">This portfolio doesn't exist yet.</p>
      </div>
    </div>
  );

  const apiUsername = portfolio.username || username;
  const tmplId = portfolio.template || "aurora";
  const t = THEMES[tmplId] || THEMES.aurora;
  const isDark = !["minimal","rose","arctic","candy","nature"].includes(tmplId);

  const handleTranslate = async () => {
    if (!portfolio) return;
    setTranslating(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/portfolio/${apiUsername}/translate/${selectedLanguage}`, { method:"POST" });
      if (res.ok) { const d = await res.json(); setPortfolio({...portfolio,...d.data}); }
      else alert("Translation failed.");
    } catch { alert("Error translating portfolio"); }
    finally { setTranslating(false); }
  };

  return (
    <div style={{color:t.text, minHeight:"100vh", background: isDark ? "#080c14" : "#f8fafc"}}>

      {/* ══ HERO ══ */}
      <section className="relative overflow-hidden" style={{background:t.hero, minHeight:"520px"}}>
        {/* Animated orbs */}
        <div className="orb orb-1 w-96 h-96 top-0 left-0" style={{background:`${t.accent}15`}} />
        <div className="orb orb-2 w-72 h-72 bottom-0 right-0" style={{background:`${t.accent}12`}} />

        {/* Matrix code rain for matrix template */}
        {tmplId === "matrix" && (
          <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
            {[...Array(12)].map((_,i)=>(
              <div key={i} className="absolute top-0 text-green-400 text-xs font-mono animate-fall"
                style={{left:`${i*8.5}%`,animationDuration:`${3+i*0.4}s`,animationDelay:`${i*0.3}s`,animationIterationCount:"infinite",animationName:"slideUp"}}>
                {"01".repeat(20)}
              </div>
            ))}
          </div>
        )}

        {/* Retro grid */}
        {tmplId === "retro" && (
          <div className="absolute inset-0 opacity-20 pointer-events-none"
            style={{backgroundImage:`linear-gradient(${t.accent}33 1px,transparent 1px),linear-gradient(90deg,${t.accent}33 1px,transparent 1px)`,backgroundSize:"40px 40px",transform:"perspective(400px) rotateX(30deg)",transformOrigin:"bottom"}} />
        )}

        {/* Neon scanlines */}
        {tmplId === "neon" && (
          <div className="absolute inset-0 pointer-events-none opacity-5"
            style={{backgroundImage:"repeating-linear-gradient(0deg,#22d3ee,#22d3ee 1px,transparent 1px,transparent 4px)"}} />
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-10">
            {/* Left: avatar + info */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 flex-1 animate-slide-up">
              {portfolio.github?.avatar_url && (
                <div className="relative flex-shrink-0">
                  <div className="absolute -inset-1.5 rounded-full animate-rotate-slow opacity-60"
                    style={{background:`conic-gradient(${t.accent},transparent,${t.accent})`}} />
                  <img src={portfolio.github.avatar_url} alt={portfolio.username}
                    className="relative w-28 h-28 rounded-full border-4 object-cover"
                    style={{borderColor:`${t.accent}60`}} />
                  <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
                </div>
              )}
              <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-black mb-2" style={{color:t.text}}>
                  {portfolio.github?.name || portfolio.username}
                  {tmplId === "neon" && <span className="text-sm ml-2 animate-blink" style={{color:t.accent}}>█</span>}
                </h1>
                <p className="text-lg mb-3 font-mono" style={{color:`${t.accent}cc`}}>@{portfolio.username}</p>
                {portfolio.bio && (
                  <p className="text-base max-w-xl leading-relaxed" style={{color:`${t.text}bb`}}>{portfolio.bio}</p>
                )}
                {/* Stats pills */}
                {portfolio.github && (
                  <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                    {[
                      {icon:faBox, val:portfolio.github.public_repos, label:"Repos"},
                      {icon:faUser, val:portfolio.github.followers, label:"Followers"},
                    ].map(({icon,val,label})=>(
                      <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold"
                        style={{background:`${t.accent}18`,color:t.accent,border:`1px solid ${t.accent}30`}}>
                        <FontAwesomeIcon icon={icon} /> <AnimatedCounter value={val} /> {label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: action buttons */}
            <div className="flex flex-col gap-2 w-full lg:w-auto animate-slide-right">
              <div className="flex gap-2">
                <select value={selectedLanguage} onChange={(e)=>setSelectedLanguage(e.target.value)} disabled={translating}
                  className="flex-1 px-3 py-2 rounded-xl text-sm font-medium border transition-all"
                  style={{background:`${t.accent}10`,color:t.text,borderColor:`${t.accent}30`,outline:"none"}}>
                  {languages.map(l=><option key={l.code} value={l.code} style={{background:"#1e293b",color:"white"}}>{l.name}</option>)}
                </select>
                <button onClick={handleTranslate} disabled={translating||selectedLanguage===(portfolio.language||"en")}
                  className="px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-40 btn-magnetic flex items-center gap-2"
                  style={{background:t.accent,color:"white"}}>
                  {translating ? <><FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin"/>…</> : <><FontAwesomeIcon icon={faGlobe} className="w-4 h-4"/>Translate</>}
                </button>
              </div>
                {[
                  {label:"Edit", icon:faPenToSquare, onClick:()=>router.push(`/portfolio/${apiUsername}/edit`), primary:false},
                  {label:"JSON", icon:faFileLines, onClick:()=>window.location.href=`${process.env.NEXT_PUBLIC_API_URL||"http://localhost:8000"}/api/portfolio/${apiUsername}/export/json`, primary:false},
                  {label:"HTML", icon:faGlobe, onClick:()=>window.location.href=`${process.env.NEXT_PUBLIC_API_URL||"http://localhost:8000"}/api/portfolio/${apiUsername}/export/html`, primary:true},
                ].map(btn=>(
                <button key={btn.label} onClick={btn.onClick}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-bold transition-all btn-magnetic"
                  style={btn.primary ? {background:t.accent,color:"white"} : {background:`${t.accent}10`,color:t.text,border:`1px solid ${t.accent}25`}}>
                    <FontAwesomeIcon icon={btn.icon} className="mr-2" />{btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* ══ ABOUT ══ */}
        {portfolio.about && (
          <Section>
            <SectionHeader title="About Me" icon={faUser} accent={t.accent} />
            <p className="text-lg leading-relaxed" style={{color:`${t.text}cc`}}>{portfolio.about}</p>
          </Section>
        )}

        {/* ══ SKILLS ══ */}
        {portfolio.skills?.length > 0 && (
          <Section>
            <SectionHeader title="Skills & Technologies" icon={faCode} accent={t.accent} />
            <div className="flex flex-wrap gap-3 stagger-children">
              {portfolio.skills.map((skill, i) => (
                <SkillPill key={i} skill={skill} i={i} accent={t.accent} />
              ))}
            </div>
          </Section>
        )}

        {/* ══ GITHUB ══ */}
        {portfolio.github && (
          <Section>
            <SectionHeader title="GitHub" icon={faCode} accent={t.accent} />
            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-4 mb-8 stagger-children">
                {[
                  {label:"Repositories", val:portfolio.github.public_repos, icon:faBox},
                  {label:"Followers",    val:portfolio.github.followers,    icon:faUser},
                  {label:"Following",    val:portfolio.github.following,     icon:faUser},
                ].map(({label,val,icon})=>(
                <div key={label} className="text-center p-6 rounded-2xl border card-hover animate-fade-in"
                  style={{background:`${t.accent}0a`,borderColor:`${t.accent}20`}}>
                  <div className="text-3xl mb-2"><FontAwesomeIcon icon={icon} /></div>
                  <div className="text-3xl md:text-4xl font-black mb-1" style={{color:t.accent}}>
                    <AnimatedCounter value={val} />
                  </div>
                  <div className="text-sm" style={{color:`${t.text}80`}}>{label}</div>
                </div>
              ))}
            </div>
            {/* Repos */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
              {portfolio.github.repos?.map((repo, i) => (
                <a key={i} href={repo.url} target="_blank" rel="noopener noreferrer"
                  className="block p-5 rounded-2xl border group card-hover animate-fade-in"
                  style={{background:`${t.accent}06`,borderColor:`${t.accent}15`,animationDelay:`${i*0.07}s`}}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold truncate pr-2 group-hover:underline" style={{color:t.text}}>{repo.name}</h3>
                    <FontAwesomeIcon icon={faUpRightFromSquare} className="w-4 h-4 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" style={{color:t.accent}} />
                  </div>
                  <p className="text-sm mb-4 line-clamp-2" style={{color:`${t.text}70`}}>
                    {repo.description || "No description"}
                  </p>
                  <div className="flex items-center gap-4 text-xs" style={{color:`${t.text}60`}}>
                    {repo.language && (
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{background:t.accent}} />
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1"><FontAwesomeIcon icon={faStar} className="w-3.5 h-3.5" />{repo.stars}</span>
                    <span className="flex items-center gap-1"><FontAwesomeIcon icon={faCode} className="w-3.5 h-3.5" />{repo.forks}</span>
                  </div>
                </a>
              ))}
            </div>
          </Section>
        )}

        {/* ══ LEETCODE ══ */}
        {portfolio.leetcode && (
          <Section>
            <SectionHeader title="LeetCode" icon={faCode} accent={t.accent} />
            {/* Profile */}
            {(portfolio.leetcode.avatar_url || portfolio.leetcode.name) && (
              <div className="flex flex-col sm:flex-row gap-4 p-6 rounded-2xl border mb-6 card-hover"
                style={{background:`${t.accent}06`,borderColor:`${t.accent}15`}}>
                {portfolio.leetcode.avatar_url && (
                  <img src={portfolio.leetcode.avatar_url} alt={portfolio.leetcode.name||portfolio.leetcode.username}
                    className="w-16 h-16 rounded-full border-2" style={{borderColor:`${t.accent}40`}} />
                )}
                <div className="flex-1">
                  {portfolio.leetcode.name && <h3 className="text-lg font-bold">{portfolio.leetcode.name}</h3>}
                  <p className="text-sm opacity-60">@{portfolio.leetcode.username}</p>
                  {portfolio.leetcode.country && <p className="text-sm mt-1"><FontAwesomeIcon icon={faLocationDot} className="mr-1" /> {portfolio.leetcode.country}</p>}
                </div>
                {portfolio.leetcode.profile_url && (
                  <a href={portfolio.leetcode.profile_url} target="_blank" rel="noopener noreferrer"
                    className="self-start px-4 py-2 rounded-xl text-sm font-bold btn-magnetic"
                    style={{background:t.accent,color:"white"}}>
                    View Profile
                  </a>
                )}
              </div>
            )}
            {/* Difficulty stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 stagger-children">
              {[
                {label:"Total Solved", val:portfolio.leetcode.problems_solved, color:"#6366f1"},
                {label:"Easy",         val:portfolio.leetcode.easy_solved,    color:"#22c55e"},
                {label:"Medium",       val:portfolio.leetcode.medium_solved,  color:"#f59e0b"},
                {label:"Hard",         val:portfolio.leetcode.hard_solved,    color:"#ef4444"},
              ].map(({label,val,color})=>(
                <div key={label} className="text-center p-5 rounded-2xl border card-hover animate-bounce-in"
                  style={{background:`${color}0f`,borderColor:`${color}25`}}>
                  <div className="text-3xl font-black mb-1" style={{color}}>
                    <AnimatedCounter value={val} />
                  </div>
                  <div className="text-xs font-semibold" style={{color:`${t.text}70`}}>{label}</div>
                </div>
              ))}
            </div>
            {/* Difficulty bars */}
            <div className="space-y-3 p-5 rounded-2xl border" style={{background:`${t.accent}05`,borderColor:`${t.accent}12`}}>
              {[
                {label:"Easy",   val:portfolio.leetcode.easy_solved,   total:portfolio.leetcode.problems_solved, color:"#22c55e"},
                {label:"Medium", val:portfolio.leetcode.medium_solved, total:portfolio.leetcode.problems_solved, color:"#f59e0b"},
                {label:"Hard",   val:portfolio.leetcode.hard_solved,   total:portfolio.leetcode.problems_solved, color:"#ef4444"},
              ].map(({label,val,total,color})=>(
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1" style={{color:`${t.text}80`}}>
                    <span>{label}</span>
                    <span style={{color}}>{val}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{background:`${color}20`}}>
                    <div className="h-full rounded-full skill-bar"
                      style={{width:`${total>0?(val/total*100):0}%`,background:color}} />
                  </div>
                </div>
              ))}
            </div>
            {/* Extra metrics */}
            <div className="flex flex-wrap gap-3 mt-4">
              {portfolio.leetcode.ranking && (
                <span className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                  style={{background:`${t.accent}12`,color:t.accent,border:`1px solid ${t.accent}25`}}>
                  <FontAwesomeIcon icon={faTrophy} className="w-4 h-4" /> #{portfolio.leetcode.ranking.toLocaleString()} Global
                </span>
              )}
              {portfolio.leetcode.acceptance_rate != null && (
                <span className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                  style={{background:`${t.accent}12`,color:t.accent,border:`1px solid ${t.accent}25`}}>
                  <FontAwesomeIcon icon={faArrowTrendUp} className="w-4 h-4" /> {portfolio.leetcode.acceptance_rate.toFixed(1)}% Acceptance
                </span>
              )}
            </div>
          </Section>
        )}

        {/* ══ HACKERRANK ══ */}
        {portfolio.hackerrank && (
          <Section>
            <SectionHeader title="HackerRank" icon={faTrophy} accent={t.accent} />
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl border text-center card-hover"
                style={{background:`${t.accent}08`,borderColor:`${t.accent}20`}}>
                <div className="text-5xl font-black mb-2" style={{color:t.accent}}>
                  <AnimatedCounter value={portfolio.hackerrank.problems_solved} />
                </div>
                <p className="text-sm" style={{color:`${t.text}70`}}>Problems Solved</p>
              </div>
              {portfolio.hackerrank.badges?.length > 0 && (
                <div className="p-6 rounded-2xl border card-hover" style={{background:`${t.accent}08`,borderColor:`${t.accent}20`}}>
                  <h3 className="font-bold mb-3 flex items-center gap-2"><FontAwesomeIcon icon={faAward} className="w-4 h-4" style={{color:t.accent}} /> Badges</h3>
                  <div className="flex flex-wrap gap-2">
                    {portfolio.hackerrank.badges.map((badge,i)=>(
                      <span key={i} className="px-3 py-1 rounded-full text-xs font-bold animate-scale-pop"
                        style={{background:`#f59e0b20`,color:"#f59e0b",border:"1px solid #f59e0b30",animationDelay:`${i*0.08}s`}}>
                        <FontAwesomeIcon icon={faAward} className="mr-1" /> {badge}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* ══ RESUME ══ */}
        {portfolio.resume && (
          <Section>
            <div className="flex items-center justify-between mb-6">
              <SectionHeader title="Resume" icon={faFileLines} accent={t.accent} noMargin />
              <a href={`${process.env.NEXT_PUBLIC_API_URL||"http://localhost:8000"}/api/portfolio/${apiUsername}/resume/download`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold btn-magnetic transition-all"
                style={{background:t.accent,color:"white"}}>
                <FontAwesomeIcon icon={faDownload} className="w-4 h-4" /> Download PDF
              </a>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {portfolio.resume.education?.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{color:t.accent}}><FontAwesomeIcon icon={faAward} /> Education</h3>
                  <div className="space-y-3">
                    {portfolio.resume.education.map((item,i)=>(
                      <div key={i} className="p-4 rounded-xl border animate-slide-up"
                        style={{background:`${t.accent}06`,borderColor:`${t.accent}18`,animationDelay:`${i*0.1}s`}}>
                        <p className="font-semibold">{item.degree}</p>
                        {item.details && <p className="text-sm mt-1 opacity-70">{item.details}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {portfolio.resume.experience?.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{color:t.accent}}><FontAwesomeIcon icon={faBriefcase} /> Experience</h3>
                  <div className="space-y-3">
                    {portfolio.resume.experience.map((item,i)=>(
                      <div key={i} className="p-4 rounded-xl border relative animate-slide-up"
                        style={{background:`${t.accent}06`,borderColor:`${t.accent}18`,animationDelay:`${i*0.1}s`}}>
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl" style={{background:t.accent}} />
                        <p className="font-semibold pl-2">{item.title}</p>
                        {item.details && <p className="text-sm mt-1 pl-2 opacity-70">{item.details}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* ══ PROJECTS ══ */}
        {portfolio.projects?.length > 0 && (
          <Section>
            <SectionHeader title="Projects" icon={faRocket} accent={t.accent} />
            <div className="grid md:grid-cols-2 gap-5 stagger-children">
              {portfolio.projects.map((project,i)=>(
                <div key={i} className="p-6 rounded-2xl border group card-hover animate-fade-in relative overflow-hidden"
                  style={{background:`${t.accent}06`,borderColor:`${t.accent}15`,animationDelay:`${i*0.1}s`}}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{background:`linear-gradient(135deg,${t.accent}08,transparent)`}} />
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2" style={{color:t.text}}>{project.name}</h3>
                    <p className="text-sm mb-4 leading-relaxed" style={{color:`${t.text}75`}}>{project.description}</p>
                    <div className="flex items-center gap-4">
                      {project.url && (
                        <a href={project.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm font-semibold transition-colors"
                          style={{color:t.accent}}>
                          <FontAwesomeIcon icon={faUpRightFromSquare} className="w-4 h-4" /> View Project
                        </a>
                      )}
                      {project.stars != null && project.stars > 0 && (
                        <span className="flex items-center gap-1 text-sm" style={{color:`${t.text}60`}}>
                          <FontAwesomeIcon icon={faStar} className="w-3.5 h-3.5" />{project.stars}
                        </span>
                      )}
                      {project.language && (
                        <span className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-full"
                          style={{background:`${t.accent}15`,color:t.accent}}>
                          <span className="w-2 h-2 rounded-full" style={{background:t.accent}} />
                          {project.language}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>

      {/* Footer bar */}
      <div className="mt-16 py-6 text-center text-sm border-t" style={{borderColor:`${t.accent}15`,color:`${t.text}40`}}>
        Built with <FontAwesomeIcon icon={faWandMagicSparkles} className="mx-1" /> <a href="/" className="hover:underline" style={{color:t.accent}}>SwiftFolio</a>
        {portfolio.template && (
          <span className="ml-2 px-2 py-0.5 rounded-full text-xs" style={{background:`${t.accent}12`,color:t.accent}}>
            {portfolio.template} template
          </span>
        )}
      </div>
    </div>
  );
}

// Section header helper component
function SectionHeader({title,icon,accent,noMargin=false}:{title:string;icon:any;accent:string;noMargin?:boolean}) {
  return (
    <div className={`flex items-center gap-3 ${noMargin?"":"mb-6"}`}>
      <span className="text-2xl animate-float"><FontAwesomeIcon icon={icon} /></span>
      <h2 className="text-2xl md:text-3xl font-black">{title}</h2>
      <div className="flex-1 h-px ml-2" style={{background:`linear-gradient(to right,${accent}50,transparent)`}} />
    </div>
  );
}
