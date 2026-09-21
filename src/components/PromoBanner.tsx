import React from 'react';
import { Tag, Sparkles } from 'lucide-react';

interface PromoBannerProps {
  onOpenApp: (screen?: string) => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ onOpenApp }) => {
  return (
    <section id="promo" className="py-12 px-6 sm:px-12 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-[#DA291C] via-[#E2382B] to-[#FF5B45] text-white p-10 sm:p-16 text-center shadow-xl border-3 border-[#FFC72C]/40">
        {/* Background glow circle */}
        <div className="absolute -top-32 -right-20 w-80 h-80 rounded-full bg-[#FFC72C] opacity-20 pointer-events-none blur-xl" />
        <div className="absolute -bottom-20 -left-10 w-64 h-64 rounded-full bg-[#FFE28A] opacity-15 pointer-events-none blur-lg" />

        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          <span className="inline-flex items-center gap-1.5 bg-[#FFC72C] text-[#2B1B0E] px-4 py-1 rounded-full font-black text-xs uppercase tracking-wider mb-5 shadow-xs">
            <Tag className="w-3.5 h-3.5 text-[#2B1B0E]" />
            Beneficios Exclusivos
          </span>

          <h2 className="text-3xl sm:text-5xl font-black text-[#FFC72C] tracking-tight mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]">
            App exclusiva: cupones nuevos cada semana
          </h2>

          <p className="text-base sm:text-xl text-white/95 leading-relaxed mb-8 max-w-xl font-medium">
            Descarga la app, junta puntos con cada compra y desbloquea combos a mitad de precio, postres gratis y recompensas únicas.
          </p>

          <button
            id="openAppBtn"
            onClick={() => onOpenApp('promos')}
            className="bg-[#FFC72C] text-[#2B1B0E] px-9 py-4 rounded-full font-black text-lg tracking-wide shadow-[0_6px_0_#C99315] hover:translate-y-1 hover:shadow-[0_3px_0_#C99315] active:translate-y-1.5 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-[#2B1B0E]" />
            <span>Descargar la app</span>
          </button>
        </div>
      </div>
    </section>
  );
};
