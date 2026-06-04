import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}","./src/components/**/*.{js,ts,jsx,tsx,mdx}","./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: { sans:["Inter","system-ui","sans-serif"], display:["Space Grotesk","Inter","sans-serif"] },
      colors: {
        primary:{50:"#f0f9ff",100:"#e0f2fe",200:"#bae6fd",300:"#7dd3fc",400:"#38bdf8",500:"#0ea5e9",600:"#0284c7",700:"#0369a1",800:"#075985",900:"#0c4a6e",950:"#082f49"},
        dark:{900:"#080c14",800:"#0f1623",700:"#1a2235",600:"#253050"},
      },
      animation: {
        "fade-in":"fadeIn 0.7s ease-out both",
        "slide-up":"slideUp 0.7s cubic-bezier(0.16,1,0.3,1) both",
        "float":"float 4s ease-in-out infinite",
        "float-slow":"float 6s ease-in-out infinite",
        "gradient":"gradientShift 6s ease infinite",
        "shimmer":"shimmer 1.5s infinite",
        "pulse-glow":"pulseGlow 2.5s ease-in-out infinite",
        "rotate-slow":"rotateSpin 20s linear infinite",
        "bounce-in":"bounceIn 0.6s both",
        "scale-pop":"scalePop 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
        "progress":"progressFill 1.2s cubic-bezier(0.16,1,0.3,1) both",
        "blink":"blink 1s step-end infinite",
      },
      keyframes: {
        fadeIn:{from:{opacity:"0"},to:{opacity:"1"}},
        slideUp:{from:{transform:"translateY(40px)",opacity:"0"},to:{transform:"translateY(0)",opacity:"1"}},
        scalePop:{from:{transform:"scale(0.7)",opacity:"0"},to:{transform:"scale(1)",opacity:"1"}},
        float:{"0%,100%":{transform:"translateY(0px)"},"50%":{transform:"translateY(-16px)"}},
        gradientShift:{"0%":{backgroundPosition:"0% 50%"},"50%":{backgroundPosition:"100% 50%"},"100%":{backgroundPosition:"0% 50%"}},
        shimmer:{from:{backgroundPosition:"-200% 0"},to:{backgroundPosition:"200% 0"}},
        pulseGlow:{"0%,100%":{boxShadow:"0 0 0 0 rgba(99,102,241,0.4)"},"50%":{boxShadow:"0 0 30px 8px rgba(99,102,241,0.15)"}},
        rotateSpin:{from:{transform:"rotate(0deg)"},to:{transform:"rotate(360deg)"}},
        bounceIn:{"0%":{transform:"scale(0.3)",opacity:"0"},"50%":{transform:"scale(1.05)"},"70%":{transform:"scale(0.95)"},"100%":{transform:"scale(1)",opacity:"1"}},
        progressFill:{from:{width:"0%"}},
        blink:{"0%,100%":{opacity:"1"},"50%":{opacity:"0"}},
      },
      boxShadow: {
        "glow-indigo":"0 0 20px rgba(99,102,241,0.4)",
        "glow-violet":"0 0 20px rgba(139,92,246,0.4)",
        "card-hover":"0 20px 48px -8px rgba(0,0,0,0.14)",
      },
    },
  },
  plugins: [],
};
export default config;
