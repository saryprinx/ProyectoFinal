import React from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';

interface FooterProps {
  onOpenOperator?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenOperator }) => {
  return (
    <footer id="contacto" className="bg-[#2B1B0E] text-[#D9C7B3] pt-16 pb-12 px-6 sm:px-12 border-t-4 border-[#FFC72C]">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 text-[#FFC72C] font-black text-2xl mb-6">
          <span className="w-8 h-8 relative inline-flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path
                d="M20 90 L20 40 Q20 15 35 15 Q45 15 45 35 L45 90 M55 90 L55 35 Q55 15 65 15 Q80 15 80 40 L80 90"
                stroke="#FFC72C"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span>Arcos Dorados</span>
        </div>

        {/* Store Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full my-6 p-6 rounded-2xl bg-[#3A2616]/70 border border-white/5 text-left text-xs sm:text-sm">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-[#FFC72C] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-bold">Horarios de Atención</strong>
              <span>Lunes a Domingo: 8:00 a.m. a 11:00 p.m. (Auto-Mac 24h en locales clave)</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#FFC72C] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-bold">Nuestra Red</strong>
              <span>Más de 38,000 restaurantes y puntos express a nivel global.</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-[#FFC72C] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-bold">Atención al Cliente</strong>
              <span>soporte@arcosdorados.com · Línea directa 0800-DORADOS</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex gap-6 sm:gap-8 justify-center flex-wrap my-6 text-sm font-semibold">
          <a href="#menu" className="hover:text-[#FFC72C] transition-colors">Menú</a>
          <a href="#valores" className="hover:text-[#FFC72C] transition-colors">Historia</a>
          <a href="#app" className="hover:text-[#FFC72C] transition-colors">App</a>
          <a href="#promo" className="hover:text-[#FFC72C] transition-colors">Ofertas</a>
          <a href="#ruleta" className="hover:text-[#FFC72C] transition-colors">Ruleta</a>
          {onOpenOperator && (
            <button
              onClick={onOpenOperator}
              className="hover:text-[#FFC72C] text-[#FFC72C]/90 font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              <span>Panel del operador</span>
            </button>
          )}
          <a href="#" className="hover:text-[#FFC72C] transition-colors">Trabaja con nosotros</a>
          <a href="#" className="hover:text-[#FFC72C] transition-colors">Términos y condiciones</a>
        </div>

        <p className="text-xs text-[#D9C7B3]/60 max-w-xl mx-auto mt-4 leading-relaxed">
          © 2026 Arcos Dorados. Sitio de demostración interactivo inspirado en McDonald's y creado con propósitos de diseño de interfaz de usuario.
        </p>
      </div>
    </footer>
  );
};
