"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faFloppyDisk, faFolderOpen, faPlus, faSpinner, faTriangleExclamation, faWandMagicSparkles, faXmark } from "@fortawesome/free-solid-svg-icons";

interface Portfolio {
  username: string; about?: string; bio?: string; skills: string[];
  projects: { name:string; description:string; url?:string; language?:string; stars?:number }[];
}

export default function EditPortfolioPage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({ about:"", bio:"", skills:[] as string[], projects:[] as Portfolio["projects"] });
  const [skillInput, setSkillInput] = useState("");
  const apiUsername = portfolio?.username || username;

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const url = username === "demo"
          ? `${process.env.NEXT_PUBLIC_API_URL||"http://localhost:8000"}/api/portfolio/latest`
          : `${process.env.NEXT_PUBLIC_API_URL||"http://localhost:8000"}/api/portfolio/${username}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Portfolio not found");
        const data = await res.json();
        setPortfolio(data);
        setFormData({ about:data.about||"", bio:data.bio||"", skills:data.skills||[], projects:data.projects||[] });
      } catch { setError("Failed to load portfolio"); }
      finally { setLoading(false); }
    };
    if (username) fetch_();
  }, [username]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL||"http://localhost:8000"}/api/portfolio/${apiUsername}/edit`,
        { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify(formData) });
      if (!res.ok) throw new Error("Failed to save");
      setSaved(true);
      setTimeout(() => router.push(`/portfolio/${apiUsername}`), 1200);
    } catch { setError("Failed to save portfolio"); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:"linear-gradient(135deg,#080c14,#0f1623)"}}>
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20" />
        <div className="absolute inset-0 rounded-full border-4 border-t-indigo-400 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-2xl"><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>
      </div>
    </div>
  );

  if (saved) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:"linear-gradient(135deg,#080c14,#0f1623)"}}>
      <div className="text-center animate-bounce-in">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-white">Saved!</h2>
        <p className="text-slate-400 mt-2">Redirecting…</p>
      </div>
    </div>
  );

  const inputCls = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300";

  return (
    <div className="min-h-screen relative" style={{background:"linear-gradient(135deg,#080c14 0%,#0f1623 100%)"}}>
      <div className="orb orb-1 w-96 h-96 bg-indigo-600/8 top-0 left-0" />
      <div className="orb orb-2 w-72 h-72 bg-purple-600/8 bottom-0 right-0" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <button onClick={()=>router.back()} className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-4 transition-colors text-sm font-medium">
            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" /> Back to Portfolio
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <FontAwesomeIcon icon={faWandMagicSparkles} className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Edit Portfolio</h1>
              <p className="text-slate-500 text-sm mt-0.5">Customize your profile details</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">

          {/* Bio */}
          <div className="glass rounded-2xl border border-white/10 p-6 animate-slide-up-d1">
            <label className="block text-sm font-bold text-indigo-400 mb-1 uppercase tracking-wide"><FontAwesomeIcon icon={faWandMagicSparkles} className="mr-1" />Bio</label>
            <p className="text-slate-600 text-xs mb-3">Short tagline shown on your hero section</p>
            <input type="text" value={formData.bio} onChange={e=>setFormData(p=>({...p,bio:e.target.value}))}
              placeholder="e.g. Full-Stack Developer & Open Source Enthusiast" className={inputCls} />
          </div>

          {/* About */}
          <div className="glass rounded-2xl border border-white/10 p-6 animate-slide-up-d2">
            <label className="block text-sm font-bold text-indigo-400 mb-1 uppercase tracking-wide"><FontAwesomeIcon icon={faWandMagicSparkles} className="mr-1" />About</label>
            <p className="text-slate-600 text-xs mb-3">Longer paragraph about yourself</p>
            <textarea value={formData.about} onChange={e=>setFormData(p=>({...p,about:e.target.value}))}
              placeholder="Tell the world about yourself, your journey, your passions…" rows={4} className={inputCls} />
          </div>

          {/* Skills */}
          <div className="glass rounded-2xl border border-white/10 p-6 animate-slide-up-d3">
            <label className="block text-sm font-bold text-indigo-400 mb-1 uppercase tracking-wide"><FontAwesomeIcon icon={faWandMagicSparkles} className="mr-1" />Skills</label>
            <p className="text-slate-600 text-xs mb-3">Technologies and tools you're proficient with</p>
            <div className="flex gap-2 mb-4">
              <input type="text" value={skillInput}
                onChange={e=>setSkillInput(e.target.value)}
                onKeyDown={e=>{ if(e.key==="Enter"&&skillInput.trim()){setFormData(p=>({...p,skills:[...p.skills,skillInput.trim()]}));setSkillInput("");}}}
                placeholder="Type a skill and press Enter…" className={`flex-1 ${inputCls}`} />
              <button onClick={()=>{ if(skillInput.trim()){setFormData(p=>({...p,skills:[...p.skills,skillInput.trim()]}));setSkillInput("");}}}
                className="px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-colors btn-magnetic">
                <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 stagger-children">
              {formData.skills.map((skill,i)=>(
                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 animate-scale-pop">
                  {skill}
                  <button onClick={()=>setFormData(p=>({...p,skills:p.skills.filter((_,j)=>j!==i)}))}
                    className="w-4 h-4 rounded-full hover:bg-red-500/30 flex items-center justify-center transition-colors">
                    <FontAwesomeIcon icon={faXmark} className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="glass rounded-2xl border border-white/10 p-6 animate-slide-up-d4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <label className="block text-sm font-bold text-indigo-400 uppercase tracking-wide"><FontAwesomeIcon icon={faWandMagicSparkles} className="mr-1" />Projects</label>
                <p className="text-slate-600 text-xs mt-0.5">Showcase your best work</p>
              </div>
              <button onClick={()=>setFormData(p=>({...p,projects:[...p.projects,{name:"",description:"",url:"",language:"",stars:0}]}))}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-sm font-semibold hover:bg-indigo-600/30 transition-all btn-magnetic">
                <FontAwesomeIcon icon={faPlus} className="w-4 h-4" /> Add Project
              </button>
            </div>
            <div className="space-y-4">
              {formData.projects.map((project, i)=>(
                <div key={i} className="border border-white/8 rounded-xl p-4 space-y-3 bg-white/3 animate-slide-up">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Project {i+1}</span>
                    <button onClick={()=>setFormData(p=>({...p,projects:p.projects.filter((_,j)=>j!==i)}))}
                      className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-colors">
                      <FontAwesomeIcon icon={faXmark} className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input type="text" value={project.name}
                    onChange={e=>setFormData(p=>{const np=[...p.projects];np[i]={...np[i],name:e.target.value};return{...p,projects:np};})}
                    placeholder="Project name" className={inputCls} />
                  <textarea value={project.description}
                    onChange={e=>setFormData(p=>{const np=[...p.projects];np[i]={...np[i],description:e.target.value};return{...p,projects:np};})}
                    placeholder="What does this project do?" rows={2} className={inputCls} />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" value={project.url||""}
                      onChange={e=>setFormData(p=>{const np=[...p.projects];np[i]={...np[i],url:e.target.value};return{...p,projects:np};})}
                      placeholder="Project URL" className={inputCls} />
                    <input type="text" value={project.language||""}
                      onChange={e=>setFormData(p=>{const np=[...p.projects];np[i]={...np[i],language:e.target.value};return{...p,projects:np};})}
                      placeholder="Language" className={inputCls} />
                  </div>
                </div>
              ))}
              {formData.projects.length === 0 && (
                <div className="text-center py-10 text-slate-600">
                  <div className="text-4xl mb-2"><FontAwesomeIcon icon={faFolderOpen} /></div>
                  <p className="text-sm">No projects yet — add your first one!</p>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 animate-slide-up-d5">
            <button onClick={handleSave} disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold text-lg disabled:opacity-50 btn-magnetic relative overflow-hidden group"
              style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)"}}>
              {saving ? <><FontAwesomeIcon icon={faSpinner} className="w-5 h-5 animate-spin"/>Saving…</> : <><FontAwesomeIcon icon={faFloppyDisk} className="w-5 h-5"/>Save Changes</>}
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
            </button>
            <button onClick={()=>router.back()}
              className="px-8 py-4 rounded-2xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all font-semibold">
              Cancel
            </button>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-bounce-in">
              <FontAwesomeIcon icon={faTriangleExclamation} className="mr-2" />{error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
