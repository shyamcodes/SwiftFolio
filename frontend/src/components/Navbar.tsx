"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faWandMagicSparkles, faXmark } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navBg = isHome
    ? scrolled
      ? "bg-slate-950/95 backdrop-blur-xl border-b border-white/8 shadow-xl shadow-black/20"
      : "bg-transparent border-b border-transparent"
    : "bg-slate-950/95 backdrop-blur-xl border-b border-white/8 sticky top-0";

  return (
    <nav className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${isHome ? navBg : "bg-slate-950/95 backdrop-blur-xl border-b border-white/8 sticky top-0"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 group-hover:scale-110 transition-transform duration-300 shadow-glow-indigo">
              <Image src="/logo.svg" alt="SwiftFolio" width={22} height={22} priority className="brightness-0 invert" />
            </div>
            <span className="text-xl font-black text-white tracking-tight">
              Swift<span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Folio</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { href: "/", label: "Home" },
              { href: "/#about", label: "How It Works" },
            ].map((item) => (
              <Link key={item.href} href={item.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/8 transition-all duration-200 underline-grow">
                {item.label}
              </Link>
            ))}
            <Link href="/create"
              className="ml-4 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white relative overflow-hidden group btn-magnetic"
              style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)"}}>
              <FontAwesomeIcon icon={faWandMagicSparkles} className="w-4 h-4 animate-pulse" />
              Create Portfolio
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
            </Link>
          </div>

          {/* Mobile button */}
          <button
            type="button"
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/8 transition-all"
            aria-label="Toggle menu"
            onClick={() => setIsMenuOpen(p => !p)}
          >
            {isMenuOpen ? <FontAwesomeIcon icon={faXmark} className="w-5 h-5" /> : <FontAwesomeIcon icon={faBars} className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-white/8 mt-2 pt-4 space-y-1 animate-slide-up">
            {["Home", "How It Works"].map((label, i) => (
              <Link key={i}
                href={i === 0 ? "/" : "/#about"}
                className="block px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/8 transition-all text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >{label}</Link>
            ))}
            <Link href="/create"
              className="block px-4 py-3 rounded-xl text-white font-bold text-sm text-center mt-2"
              style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)"}}
              onClick={() => setIsMenuOpen(false)}>
              Create Portfolio
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
