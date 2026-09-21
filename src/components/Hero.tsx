import React from 'react';
import { ArrowDown, MapPin, Utensils } from 'lucide-react';

interface HeroProps {
  onOpenApp: (screen?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenApp }) => {
  return (
    <header className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16 bg-[radial-gradient(circle_at_30%_20%,#FF4433_0%,#DA291C_55%,#A8180D_100%)] text-white select-none">
      {/* Background Decorative Arches SVG */}
      <svg
        className="absolute -bottom-10 left-1/2 w-[140%] max-w-[1400px] opacity-90 pointer-events-none animate-float-arches"
        viewBox="0 0 1000 300"
        preserveAspectRatio="xMidYMax slice"
      >
        <path
          d="M150 300 L150 120 Q150 40 210 40 Q260 40 260 110 L260 300
             M340 300 L340 110 Q340 40 390 40 Q450 40 450 120 L450 300"
          stroke="#FFC72C"
          strokeWidth="46"
          fill="none"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M600 300 L600 150 Q600 60 660 60 Q710 60 710 140 L710 300
             M790 300 L790 140 Q790 60 840 60 Q900 60 900 150 L900 300"
          stroke="#FFC72C"
          strokeWidth="46"
          fill="none"
          strokeLinecap="round"
          opacity="0.45"
        />
      </svg>

      {/* Floating Sparkles & Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
        <div className="absolute top-1/4 left-10 w-48 h-48 bg-[#FFC72C] rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-12 w-64 h-64 bg-[#FFE28A] rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        <span className="inline-block bg-[#FFC72C] text-[#2B1B0E] px-5 py-1.5 rounded-full font-extrabold text-xs tracking-widest uppercase mb-6 shadow-sm">
          Desde 1955 · Sabor de siempre
        </span>

        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-[#FFC72C] tracking-tight leading-[0.95] drop-shadow-[0_4px_0_#A8180D] uppercase font-sans">
          HAMBRE<br />DE MÁS
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-white/95 max-w-2xl mt-7 mb-10 leading-relaxed font-medium">
          Ingredientes de calidad, papas doradas al punto y el sabor que ya conoces. Todo listo en minutos, para comer aquí o llevar.
        </p>

        <div className="flex flex-wrap gap-4 justify-center items-center">
          <a
            href="#menu"
            id="hero-ver-menu-btn"
            className="bg-[#FFC72C] text-[#2B1B0E] px-8 py-4 rounded-full font-black text-lg tracking-wide shadow-[0_6px_0_#C99315] hover:translate-y-1 hover:shadow-[0_3px_0_#C99315] active:translate-y-1.5 transition-all flex items-center gap-2 cursor-pointer no-underline"
          >
            <Utensils className="w-5 h-5 text-[#2B1B0E]" />
            <span>Ver el menú</span>
          </a>

          <button
            onClick={() => onOpenApp('home')}
            id="hero-pedir-app-btn"
            className="bg-transparent border-2 border-white text-white px-8 py-3.5 rounded-full font-extrabold text-base tracking-wide hover:bg-white hover:text-[#DA291C] transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Pedir en la App</span>
          </button>

          <a
            href="#contacto"
            id="hero-encontrar-local-btn"
            className="text-white/80 hover:text-white text-sm font-bold flex items-center gap-1.5 px-4 py-2 hover:underline transition-all"
          >
            <MapPin className="w-4 h-4 text-[#FFC72C]" />
            <span>Encontrar un local</span>
          </a>
        </div>
      </div>

      {/* Scroll Down Hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/80 text-xs font-black tracking-widest pointer-events-none">
        <span className="w-0.5 h-7 bg-white rounded-full animate-pulse-line" />
        <span>DESLIZA</span>
        <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
      </div>
    </header>
  );
};
