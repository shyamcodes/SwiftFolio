"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faBolt,
  faBrain,
  faCheck,
  faCode,
  faCrown,
  faEye,
  faFileLines,
  faLink,
  faPaintBrush,
  faRobot,
  faRocket,
  faSpinner,
  faTrophy,
  faUpload,
  faUser,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";

// ── 18 Template Definitions ─────────────────────────────────
const TEMPLATES = [
  {
    id: "aurora",
    name: "Aurora",
    icon: faWandMagicSparkles,
    desc: "Dark glassmorphism with animated gradient orbs",
    preview: "from-indigo-900 via-purple-900 to-slate-900",
    accent: "#818cf8",
    tags: ["Dark","Glass","Animated"],
    effect: "Floating orbs + glass cards",
  },
  {
    id: "neon",
    name: "Neon Pulse",
    icon: faBolt,
    desc: "Cyberpunk neon glow on deep black background",
    preview: "from-black via-gray-950 to-black",
    accent: "#22d3ee",
    tags: ["Dark","Neon","Bold"],
    effect: "Neon glow + pulse rings",
  },
  {
    id: "sunset",
    name: "Sunset Wave",
    icon: faPaintBrush,
    desc: "Warm gradients with wave parallax scrolling",
    preview: "from-orange-500 via-pink-500 to-purple-600",
    accent: "#fb923c",
    tags: ["Warm","Gradient","Elegant"],
    effect: "Wave parallax + float",
  },
  {
    id: "forest",
    name: "Forest Zen",
    icon: faPaintBrush,
    desc: "Calm emerald tones with organic animations",
    preview: "from-emerald-900 via-teal-800 to-cyan-900",
    accent: "#34d399",
    tags: ["Green","Calm","Nature"],
    effect: "Organic morph + breathe",
  },
  {
    id: "ocean",
    name: "Deep Ocean",
    icon: faPaintBrush,
    desc: "Fluid blue waves with depth and motion",
    preview: "from-blue-900 via-cyan-900 to-teal-900",
    accent: "#38bdf8",
    tags: ["Blue","Fluid","Professional"],
    effect: "Wave ripple + drift",
  },
  {
    id: "minimal",
    name: "Minimal Pro",
    icon: faPaintBrush,
    desc: "Clean Swiss-design with micro-interactions",
    preview: "from-gray-50 via-white to-gray-100",
    accent: "#6366f1",
    tags: ["Light","Clean","Corporate"],
    effect: "Micro-hover + underline",
  },
  {
    id: "galaxy",
    name: "Galaxy",
    icon: faWandMagicSparkles,
    desc: "Space theme with particle stars and orbit rings",
    preview: "from-slate-950 via-indigo-950 to-slate-900",
    accent: "#a78bfa",
    tags: ["Dark","Space","Immersive"],
    effect: "Particle stars + orbit",
  },
  {
    id: "retro",
    name: "Retro Wave",
    icon: faCode,
    desc: "80s synthwave with grid perspective and neon",
    preview: "from-purple-950 via-pink-950 to-black",
    accent: "#f0abfc",
    tags: ["Retro","Fun","Unique"],
    effect: "Grid perspective + glow",
  },
  {
    id: "rose",
    name: "Rose Gold",
    icon: faPaintBrush,
    desc: "Elegant pink tones with shimmer and sparkle",
    preview: "from-rose-100 via-pink-50 to-fuchsia-100",
    accent: "#f43f5e",
    tags: ["Light","Elegant","Sparkle"],
    effect: "Shimmer + sparkle burst",
  },
  {
    id: "midnight",
    name: "Midnight",
    icon: faWandMagicSparkles,
    desc: "Ultra-dark with silver accents and star dust",
    preview: "from-gray-950 via-slate-900 to-gray-950",
    accent: "#94a3b8",
    tags: ["Dark","Luxury","Sleek"],
    effect: "Star dust + silver glow",
  },
  {
    id: "fire",
    name: "Inferno",
    icon: faBolt,
    desc: "Bold red-orange fire with ember particles",
    preview: "from-red-900 via-orange-900 to-yellow-900",
    accent: "#fbbf24",
    tags: ["Bold","Energy","Fire"],
    effect: "Ember particles + flicker",
  },
  {
    id: "arctic",
    name: "Arctic Frost",
    icon: faPaintBrush,
    desc: "Icy blue-white with crystal glass morphism",
    preview: "from-sky-100 via-blue-50 to-indigo-100",
    accent: "#0ea5e9",
    tags: ["Light","Ice","Modern"],
    effect: "Frost blur + crystal",
  },
  {
    id: "matrix",
    name: "Matrix Code",
    icon: faCode,
    desc: "Terminal green rain on black — hacker aesthetic",
    preview: "from-black via-green-950 to-black",
    accent: "#4ade80",
    tags: ["Dark","Hacker","Techy"],
    effect: "Code rain + terminal blink",
  },
  {
    id: "candy",
    name: "Candy Pop",
    icon: faPaintBrush,
    desc: "Playful pastels with bouncy spring animations",
    preview: "from-violet-200 via-pink-200 to-yellow-200",
    accent: "#c084fc",
    tags: ["Light","Fun","Creative"],
    effect: "Bounce spring + confetti",
  },
  {
    id: "obsidian",
    name: "Obsidian",
    icon: faCrown,
    desc: "Stone-dark with sharp gold typography accents",
    preview: "from-stone-950 via-stone-900 to-zinc-900",
    accent: "#d97706",
    tags: ["Dark","Gold","Executive"],
    effect: "Gold shimmer + sharp lines",
  },
  {
    id: "holographic",
    name: "Holographic",
    icon: faWandMagicSparkles,
    desc: "Iridescent rainbow spectrum with 3D depth",
    preview: "from-pink-500 via-indigo-500 to-cyan-500",
    accent: "#e879f9",
    tags: ["Vivid","3D","Futuristic"],
    effect: "RGB shift + 3D tilt",
  },
  {
    id: "nature",
    name: "Botanical",
    icon: faPaintBrush,
    desc: "Earth tones with leaf motifs and gentle sway",
    preview: "from-green-100 via-lime-50 to-emerald-100",
    accent: "#16a34a",
    tags: ["Light","Earth","Organic"],
    effect: "Sway + leaf particle",
  },
  {
    id: "terminal",
    name: "Terminal Pro",
    icon: faCode,
    desc: "Developer-first monospace with type-in animation",
    preview: "from-gray-950 via-gray-900 to-slate-950",
    accent: "#86efac",
    tags: ["Dark","Dev","Monospace"],
    effect: "Type-in + cursor blink",
  },
];

const STEPS = [
  { id: 1, label: "Your Info", icon: faUser },
  { id: 2, label: "Platforms", icon: faLink },
  { id: 3, label: "Template", icon: faPaintBrush },
  { id: 4, label: "Generate", icon: faWandMagicSparkles },
];

interface FormData {
  username: string;
  resume: File | null;
  github_username: string;
  leetcode_username: string;
  hackerrank_username: string;
  template: string;
}

export default function Create() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingMsg, setLoadingMsg] = useState("Initializing...");
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    username: "",
    resume: null,
    github_username: "",
    leetcode_username: "",
    hackerrank_username: "",
    template: "aurora",
  });

  const loadingMessages = [
    "Fetching GitHub profile...",
    "Parsing your resume...",
    "Analyzing LeetCode stats...",
    "Pulling HackerRank badges...",
    "Running AI generation...",
    "Crafting your portfolio...",
    "Almost there...",
  ];

  useEffect(() => {
    if (loading) {
      let i = 0;
      const iv = setInterval(() => {
        setLoadingMsg(loadingMessages[i % loadingMessages.length]);
        setProgress(Math.min(90, (i + 1) * 14));
        i++;
      }, 1800);
      return () => clearInterval(iv);
    }
  }, [loading]);

  // scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal,.reveal-left,.reveal-right,.reveal-scale").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [step]);

  const handleSubmit = async () => {
    setLoading(true);
    setProgress(5);
    try {
      let resumeBase64 = null;
      if (formData.resume) {
        const reader = new FileReader();
        resumeBase64 = await new Promise<string>((resolve) => {
          reader.onload = () => resolve((reader.result as string).split(",")[1]);
          reader.readAsDataURL(formData.resume!);
        });
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/portfolio/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.username,
            resume: resumeBase64,
            github_username: formData.github_username || null,
            leetcode_username: formData.leetcode_username || null,
            hackerrank_username: formData.hackerrank_username || null,
            template: formData.template,
          }),
        }
      );
      if (response.ok) {
        setProgress(100);
        setSuccess(true);
        setTimeout(() => router.push(`/portfolio/${formData.username}`), 1800);
      } else {
        alert("Failed to create portfolio. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to create portfolio. Please try again.");
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf")
      setFormData((prev) => ({ ...prev, resume: file }));
  };

  const canNext = () => {
    if (step === 1) return formData.username.trim().length >= 2;
    if (step === 2) return true;
    if (step === 3) return !!formData.template;
    return true;
  };

  // ── Success Screen ───────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900">
        <div className="orb orb-1 w-96 h-96 bg-indigo-600/20 top-0 left-0" />
        <div className="orb orb-2 w-64 h-64 bg-purple-600/20 bottom-0 right-0" />
        <div className="text-center relative z-10 animate-bounce-in">
          <div className="text-8xl mb-6 animate-float"><FontAwesomeIcon icon={faCheck} /></div>
          <h2 className="text-4xl font-bold text-white mb-3">Portfolio Created!</h2>
          <p className="text-indigo-300 text-lg mb-8">Redirecting you now...</p>
          <div className="w-48 h-1.5 bg-white/10 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-progress w-full" />
          </div>
        </div>
      </div>
    );
  }

  // ── Loading Screen ───────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
        <div className="orb orb-1 w-80 h-80 bg-indigo-500/15 top-10 left-10" />
        <div className="orb orb-2 w-60 h-60 bg-purple-500/15 bottom-10 right-10" />
        <div className="text-center relative z-10">
          <div className="relative w-28 h-28 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/30" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-400 animate-spin" />
            <div className="absolute inset-3 rounded-full border-4 border-transparent border-t-purple-400 animate-spin" style={{animationDirection:"reverse",animationDuration:"1.5s"}} />
            <div className="absolute inset-0 flex items-center justify-center text-3xl"><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3 animate-pulse">{loadingMsg}</h3>
          <div className="w-64 h-2 bg-white/10 rounded-full mx-auto overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-indigo-400 mt-3 text-sm">{progress}% complete</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "linear-gradient(135deg, #080c14 0%, #0f1623 50%, #080c14 100%)" }}>
      {/* Animated background orbs */}
      <div className="orb orb-1 w-[500px] h-[500px] bg-indigo-600/10 -top-32 -left-32" />
      <div className="orb orb-2 w-[400px] h-[400px] bg-purple-600/10 -bottom-24 -right-24" />
      <div className="orb orb-3 w-72 h-72 bg-cyan-600/08 top-1/2 left-1/2" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
            <FontAwesomeIcon icon={faWandMagicSparkles} className="w-4 h-4 animate-pulse" />
            AI-Powered Portfolio Generator
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Build Your{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient" style={{backgroundSize:"300% 300%"}}>
              Portfolio
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">4 simple steps to a stunning portfolio</p>
        </div>

        {/* Step Progress */}
        <div className="flex items-center justify-center mb-10 animate-slide-up-d1">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <button
                onClick={() => step > s.id && setStep(s.id)}
                className={`flex flex-col items-center group transition-all duration-300 ${step >= s.id ? "opacity-100" : "opacity-40"}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300 ${
                  step === s.id ? "bg-indigo-600 shadow-glow-indigo scale-110 animate-pulse-glow" :
                  step > s.id ? "bg-indigo-600/60" : "bg-white/5 border border-white/10"
                }`}>
                  {step > s.id ? "✓" : <FontAwesomeIcon icon={s.icon} />}
                </div>
                <span className={`mt-2 text-xs font-medium hidden sm:block ${step === s.id ? "text-indigo-400" : "text-slate-500"}`}>
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`w-12 md:w-24 h-0.5 mx-2 transition-all duration-500 ${step > s.id ? "bg-indigo-600" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="glass rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-scale-pop">
          <div className="p-8 md:p-10">

            {/* ── STEP 1: Your Info ── */}
            {step === 1 && (
              <div className="space-y-8">
                <div className="animate-slide-up">
                  <h2 className="text-2xl font-bold text-white mb-1"><FontAwesomeIcon icon={faUser} className="mr-2" />Your Details</h2>
                  <p className="text-slate-400 text-sm">Set your unique portfolio username and upload resume</p>
                </div>

                {/* Username */}
                <div className="animate-slide-up-d1">
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Portfolio Username <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">swiftfolio.dev/</span>
                    <input
                      type="text" name="username" required
                      value={formData.username} onChange={handleChange}
                      placeholder="yourname"
                      className="w-full pl-36 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 font-mono"
                    />
                  </div>
                </div>

                {/* Resume Upload */}
                <div className="animate-slide-up-d2">
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Resume PDF <span className="text-slate-500 font-normal">(optional)</span></label>
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                      dragOver ? "border-indigo-500 bg-indigo-500/10" : "border-white/15 hover:border-indigo-500/50 hover:bg-white/5"
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleFileDrop}
                    onClick={() => fileRef.current?.click()}
                  >
                    <input ref={fileRef} type="file" accept=".pdf" className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if(f) setFormData(p=>({...p,resume:f})); }} />
                    {formData.resume ? (
                      <div className="animate-bounce-in">
                        <div className="text-4xl mb-3"><FontAwesomeIcon icon={faFileLines} /></div>
                        <p className="text-indigo-300 font-semibold">{formData.resume.name}</p>
                        <p className="text-slate-500 text-sm mt-1">{(formData.resume.size/1024).toFixed(1)} KB</p>
                        <button className="mt-3 text-xs text-rose-400 hover:text-rose-300"
                          onClick={(e)=>{e.stopPropagation();setFormData(p=>({...p,resume:null}))}}>Remove</button>
                      </div>
                    ) : (
                      <div>
                        <FontAwesomeIcon icon={faUpload} className="w-10 h-10 text-slate-500 mx-auto mb-3 group-hover:text-indigo-400 transition-colors" />
                        <p className="text-slate-400 font-medium">Drop PDF here or <span className="text-indigo-400">browse</span></p>
                        <p className="text-slate-600 text-xs mt-1">PDF up to 10MB</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2: Platforms ── */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="animate-slide-up">
                  <h2 className="text-2xl font-bold text-white mb-1"><FontAwesomeIcon icon={faLink} className="mr-2" />Connect Platforms</h2>
                  <p className="text-slate-400 text-sm">Add your coding profiles for richer portfolios</p>
                </div>
                {[
                  { name:"github_username", label:"GitHub", icon:faCode, color:"from-gray-600 to-gray-800", placeholder:"yourgithub", desc:"Repos, stars, contributions" },
                  { name:"leetcode_username", label:"LeetCode", icon:faBrain, color:"from-yellow-600 to-orange-700", placeholder:"yourleetcode", desc:"Problems solved, ranking, streaks" },
                  { name:"hackerrank_username", label:"HackerRank", icon:faTrophy, color:"from-green-700 to-emerald-800", placeholder:"yourhackerrank", desc:"Badges, certificates, score" },
                ].map((p,i) => (
                  <div key={p.name} className={`animate-slide-up-d${i+1} group`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center text-base`}><FontAwesomeIcon icon={p.icon} /></div>
                      <label className="text-sm font-semibold text-slate-300">{p.label} Username</label>
                      <span className="ml-auto text-xs text-slate-600">{p.desc}</span>
                    </div>
                    <input
                      type="text" name={p.name}
                      value={(formData as any)[p.name]} onChange={handleChange}
                      placeholder={p.placeholder}
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 group-hover:border-white/20"
                    />
                  </div>
                ))}
                <div className="animate-slide-up-d4 p-4 rounded-xl bg-indigo-500/8 border border-indigo-500/15">
                  <p className="text-indigo-300 text-sm"><FontAwesomeIcon icon={faBrain} className="mr-2" />All fields optional - add what you have for a richer result!</p>
                </div>
              </div>
            )}

            {/* ── STEP 3: Template ── */}
            {step === 3 && (
              <div>
                <div className="animate-slide-up mb-6">
                  <h2 className="text-2xl font-bold text-white mb-1"><FontAwesomeIcon icon={faPaintBrush} className="mr-2" />Choose Your Template</h2>
                  <p className="text-slate-400 text-sm">18 stunning designs with unique animations</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[520px] overflow-y-auto pr-1 stagger-children">
                  {TEMPLATES.map((t) => (
                    <div
                      key={t.id}
                      className={`template-card rounded-2xl overflow-hidden border transition-all duration-300 ${
                        formData.template === t.id
                          ? "selected border-indigo-500"
                          : "border-white/10 hover:border-white/25"
                      } animate-fade-in`}
                      onClick={() => setFormData(p=>({...p,template:t.id}))}
                    >
                      <div className="check-badge">✓</div>
                      {/* Preview thumbnail */}
                      <div className={`h-24 bg-gradient-to-br ${t.preview} relative overflow-hidden`}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-3xl animate-float"><FontAwesomeIcon icon={t.icon} /></span>
                        </div>
                        {/* Mini animated elements */}
                        <div className="absolute top-2 left-2 w-2 h-2 rounded-full opacity-60" style={{background:t.accent,animation:"float 3s ease-in-out infinite"}} />
                        <div className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full opacity-40" style={{background:t.accent,animation:"float 4s ease-in-out 0.5s infinite"}} />
                        {/* Preview button */}
                        <button
                          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity z-10 text-white text-xs gap-1"
                          onClick={(e)=>{e.stopPropagation();setPreviewTemplate(t.id)}}
                        >
                          <FontAwesomeIcon icon={faEye} className="w-3 h-3" /> Preview
                        </button>
                      </div>
                      <div className="p-3 bg-white/3">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-white font-semibold text-sm">{t.name}</h3>
                          {formData.template === t.id && <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />}
                        </div>
                        <p className="text-slate-500 text-xs mb-2 line-clamp-1">{t.desc}</p>
                        <div className="flex flex-wrap gap-1">
                          {t.tags.map(tag=>(
                            <span key={tag} className="text-xs px-1.5 py-0.5 rounded-md bg-white/8 text-slate-400">{tag}</span>
                          ))}
                        </div>
                        <p className="text-xs text-slate-600 mt-1.5 italic">{t.effect}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── STEP 4: Generate ── */}
            {step === 4 && (
              <div className="space-y-8 animate-scale-pop">
                <div className="text-center">
                  <div className="text-6xl mb-4 animate-float"><FontAwesomeIcon icon={faRocket} /></div>
                  <h2 className="text-3xl font-bold text-white mb-2">Ready to Launch!</h2>
                  <p className="text-slate-400">Review your settings and generate</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label:"Username", value:`@${formData.username}`, icon:faUser },
                    { label:"Template", value:TEMPLATES.find(t=>t.id===formData.template)?.name, icon:faPaintBrush },
                    { label:"Resume", value:formData.resume?.name||"Not uploaded", icon:faFileLines },
                    { label:"GitHub", value:formData.github_username||"Not connected", icon:faCode },
                    { label:"LeetCode", value:formData.leetcode_username||"Not connected", icon:faBrain },
                    { label:"HackerRank", value:formData.hackerrank_username||"Not connected", icon:faTrophy },
                  ].map((item,i)=>(
                    <div key={item.label} className={`flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/8 animate-slide-up-d${Math.min(i+1,6)}`}>
                      <span className="text-xl"><FontAwesomeIcon icon={item.icon} /></span>
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{item.label}</p>
                        <p className="text-white text-sm font-medium mt-0.5 truncate max-w-[160px]">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleSubmit}
                  className="w-full py-5 rounded-2xl text-lg font-bold text-white relative overflow-hidden group btn-magnetic animate-pulse-glow"
                  style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)",backgroundSize:"200% 200%"}}
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <FontAwesomeIcon icon={faWandMagicSparkles} className="w-5 h-5 animate-pulse" />
                    Generate My Portfolio
                    <FontAwesomeIcon icon={faBolt} className="w-5 h-5" />
                  </span>
                  <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                </button>
              </div>
            )}

            {/* Navigation Buttons */}
            {step < 4 && (
              <div className="flex justify-between mt-10 pt-8 border-t border-white/8">
                <button
                  onClick={() => setStep(s=>Math.max(1,s-1))}
                  className={`px-6 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/8 transition-all duration-200 font-medium ${step===1?"opacity-0 pointer-events-none":""}`}
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />Back
                </button>
                <button
                  onClick={() => setStep(s=>Math.min(4,s+1))}
                  disabled={!canNext()}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 btn-magnetic"
                >
                  {step === 3 ? "Review" : "Continue"}
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Template Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={()=>setPreviewTemplate(null)}>
          <div className="bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-white/15 animate-scale-pop" onClick={e=>e.stopPropagation()}>
            {(() => {
              const t = TEMPLATES.find(t=>t.id===previewTemplate)!;
              return (
                <>
                  <div className={`h-48 rounded-xl bg-gradient-to-br ${t.preview} flex items-center justify-center text-5xl mb-4 relative overflow-hidden`}>
                    <span className="animate-float"><FontAwesomeIcon icon={t.icon} /></span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{t.name}</h3>
                  <p className="text-slate-400 text-sm mb-3">{t.desc}</p>
                  <p className="text-indigo-300 text-xs mb-4"><FontAwesomeIcon icon={faWandMagicSparkles} className="mr-1" />{t.effect}</p>
                  <div className="flex gap-3">
                    <button onClick={()=>setPreviewTemplate(null)} className="flex-1 py-2 rounded-lg border border-white/15 text-slate-400 hover:text-white text-sm transition-colors">Close</button>
                    <button onClick={()=>{setFormData(p=>({...p,template:t.id}));setPreviewTemplate(null);}} className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors">
                      Select Template
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
