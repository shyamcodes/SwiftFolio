"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faHeart, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedinIn, faXTwitter } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{background:"linear-gradient(180deg,#080c14,#040608)"}} className="border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <FontAwesomeIcon icon={faWandMagicSparkles} className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-black text-white">Swift<span className="text-indigo-400">Folio</span></span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Build stunning developer portfolios in seconds — powered by AI, GitHub, and LeetCode integrations.
            </p>
            <div className="flex items-center gap-4 mt-6">
              {[
                {icon: faGithub, href:"https://github.com", label:"GitHub"},
                {icon: faXTwitter, href:"https://twitter.com", label:"Twitter"},
                {icon: faLinkedinIn, href:"https://linkedin.com", label:"LinkedIn"},
                {icon: faEnvelope, href:"mailto:hello@swiftfolio.dev", label:"Email"},
              ].map(({icon:Icon,href,label})=>(
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-slate-500 hover:text-white hover:bg-indigo-500/20 hover:border-indigo-500/30 transition-all duration-200 card-hover">
                  <FontAwesomeIcon icon={Icon} className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
            <ul className="space-y-2.5">
              {[["Create Portfolio","/create"],["View Demo","/portfolio/demo"],["Templates","/create"],["How It Works","/#about"]].map(([label,href])=>(
                <li key={label}><a href={href} className="text-slate-500 hover:text-slate-300 text-sm transition-colors underline-grow">{label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Templates</h4>
            <ul className="space-y-2.5">
              {["Aurora","Neon Pulse","Sunset Wave","Forest Zen","Galaxy","+ 13 more"].map(t=>(
                <li key={t}><span className="text-slate-500 text-sm">{t}</span></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 gap-4">
          <p className="text-slate-600 text-sm">© {year} SwiftFolio. Built with <FontAwesomeIcon icon={faHeart} className="mx-1" /> using FastAPI + Next.js</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-600 text-sm">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
