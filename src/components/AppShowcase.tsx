import React from 'react';
import { Smartphone, Sparkles, Check, Clock, Award } from 'lucide-react';

interface AppShowcaseProps {
  onOpenApp: (screen?: string) => void;
}

export const AppShowcase: React.FC<AppShowcaseProps> = ({ onOpenApp }) => {
  return (
    <section id="app" className="py-24 px-6 sm:px-12 bg-gradient-to-b from-[#FFF8ED] to-[#FFF1DC]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#DA291C] font-extrabold text-sm tracking-widest uppercase block mb-2">
            Todo desde tu bolsillo
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#2B1B0E] tracking-tight">
            Pide más rápido con la app
          </h2>
          <p className="text-[#5A3E24] mt-3 text-base">
            Olvídate de las filas. Personaliza tus hamburguesas, programa tu recogida y gana puntos en cada bocado.
          </p>
        </div>

        {/* Phones Row */}
        <div className="flex flex-wrap justify-center gap-8 lg:gap-10 mb-14">
          {/* Phone 1: Para ti */}
          <div className="w-[260px] flex flex-col items-center group">
            <div className="w-[260px] h-[520px] rounded-[36px] bg-[#151515] p-2.5 shadow-[0_20px_45px_rgba(43,27,14,0.25)] relative transition-transform duration-300 group-hover:-translate-y-2 border-2 border-neutral-800">
              {/* Phone Notch */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-4 bg-[#151515] rounded-b-xl z-20" />

              {/* Screen */}
              <div className="w-full h-full rounded-[28px] bg-[#FFF8ED] overflow-hidden p-4 pt-6 flex flex-col gap-2.5 text-left text-[#2B1B0E] select-none">
                {/* Status bar */}
                <div className="flex justify-between items-center text-[10px] font-extrabold text-[#2B1B0E]/70 mb-1 px-1">
                  <span>9:41</span>
                  <span>📶 🔋</span>
                </div>

                {/* Topbar */}
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 text-[#DA291C] font-black">🍟</span>
                  <div>
                    <p className="text-xs font-black text-[#2B1B0E] leading-tight">Hola, Fer ✨</p>
                    <p className="text-[10px] text-[#5A3E24] leading-tight">Recomendaciones para ti</p>
                  </div>
                </div>

                {/* Search */}
                <div className="bg-white rounded-xl px-3 py-2 text-[11px] text-[#5A3E24]/60 shadow-xs border border-neutral-100 flex items-center justify-between">
                  <span>¿Qué se te antoja hoy?</span>
                  <Sparkles className="w-3 h-3 text-[#FFC72C]" />
                </div>

                {/* Categories */}
                <div className="flex justify-between px-1 py-1">
                  <div className="flex flex-col items-center text-center">
                    <span className="text-lg">🍔</span>
                    <span className="text-[9px] font-bold text-[#5A3E24]">Combos</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <span className="text-lg">🍟</span>
                    <span className="text-[9px] font-bold text-[#5A3E24]">Solos</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <span className="text-lg">🥤</span>
                    <span className="text-[9px] font-bold text-[#5A3E24]">Bebidas</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <span className="text-lg">🍰</span>
                    <span className="text-[9px] font-bold text-[#5A3E24]">Postres</span>
                  </div>
                </div>

                {/* Highlight Card */}
                <div className="bg-gradient-to-r from-[#DA291C] to-[#C22317] text-white rounded-2xl p-2.5 shadow-md relative overflow-hidden flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <span className="bg-[#FFC72C] text-[#2B1B0E] text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider inline-block mb-1">
                      Tu favorito
                    </span>
                    <strong className="block text-[11px] font-black truncate">Doble con Queso Combo</strong>
                    <span className="text-[9px] text-white/90 block truncate">Papas doradas + bebida fría</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-xs border border-white/20 bg-white p-0.5 flex items-center justify-center">
                    <img
                      src="/images/products/combo.jpg"
                      alt="Doble con Queso Combo"
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {/* Quick Offers */}
                <p className="text-[11px] font-extrabold text-[#5A3E24] mt-1">Ofertas especiales</p>
                <div className="flex gap-2">
                  <div className="flex-1 bg-white rounded-xl p-1.5 text-center shadow-xs border border-neutral-100 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-lg overflow-hidden mb-1 bg-white flex items-center justify-center p-0.5">
                      <img
                        src="/images/products/nuggets.jpg"
                        alt="McNuggets"
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="block text-[#DA291C] font-black text-[11px]">-20%</span>
                    <span className="text-[9px] font-bold text-[#2B1B0E] truncate w-full">McNuggets</span>
                  </div>
                  <div className="flex-1 bg-white rounded-xl p-1.5 text-center shadow-xs border border-neutral-100 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-lg overflow-hidden mb-1 bg-white flex items-center justify-center p-0.5">
                      <img
                        src="/images/products/postre.jpg"
                        alt="Postre dulce"
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="block text-[#DA291C] font-black text-[11px]">-15%</span>
                    <span className="text-[9px] font-bold text-[#2B1B0E] truncate w-full">Postre dulce</span>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-black text-[#2B1B0E] mt-5 mb-1">Para ti</h3>
            <p className="text-[#5A3E24] text-xs leading-relaxed max-w-[220px] text-center">
              Recomendaciones personalizadas según lo que más pides.
            </p>
          </div>

          {/* Phone 2: Pedido anticipado */}
          <div className="w-[260px] flex flex-col items-center group">
            <div className="w-[260px] h-[520px] rounded-[36px] bg-[#151515] p-2.5 shadow-[0_20px_45px_rgba(43,27,14,0.25)] relative transition-transform duration-300 group-hover:-translate-y-2 border-2 border-neutral-800">
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-4 bg-[#151515] rounded-b-xl z-20" />

              <div className="w-full h-full rounded-[28px] bg-[#FFF8ED] overflow-hidden p-4 pt-6 flex flex-col gap-2.5 text-left text-[#2B1B0E] select-none">
                <div className="flex justify-between items-center text-[10px] font-extrabold text-[#2B1B0E]/70 mb-1 px-1">
                  <span>9:41</span>
                  <span>📶 🔋</span>
                </div>

                <p className="text-xs font-black text-[#2B1B0E]">Pedido anticipado</p>
                <p className="text-[10px] text-[#5A3E24] -mt-1.5">¿A qué hora quieres recogerlo?</p>

                <div className="bg-white rounded-xl p-2.5 text-[10px] flex justify-between items-center shadow-xs border border-neutral-100">
                  <span className="font-semibold text-[#2B1B0E]">📍 Local Centro Plaza</span>
                  <span className="text-[#DA291C] font-black cursor-pointer">Cambiar</span>
                </div>

                <p className="text-[11px] font-extrabold text-[#5A3E24] mt-1">Elige la hora</p>
                <div className="grid grid-cols-4 gap-1.5 text-center">
                  <span className="bg-white rounded-lg py-1.5 text-[10px] font-bold text-[#2B1B0E] border border-neutral-100">12:30</span>
                  <span className="bg-[#DA291C] text-white rounded-lg py-1.5 text-[10px] font-black shadow-xs">1:00</span>
                  <span className="bg-white rounded-lg py-1.5 text-[10px] font-bold text-[#2B1B0E] border border-neutral-100">1:30</span>
                  <span className="bg-white rounded-lg py-1.5 text-[10px] font-bold text-[#2B1B0E] border border-neutral-100">2:00</span>
                </div>

                {/* Order Summary item */}
                <div className="mt-auto bg-white rounded-xl p-2.5 flex items-center gap-2.5 shadow-xs border border-neutral-100">
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-white border border-neutral-100 p-0.5 flex items-center justify-center">
                    <img
                      src="/images/products/combo.jpg"
                      alt="Doble con Queso Combo"
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <strong className="block text-[11px] font-black leading-tight">Doble con Queso Combo</strong>
                    <small className="text-[9px] text-[#5A3E24]">Papas medianas + Bebida 500ml</small>
                  </div>
                </div>

                <button
                  onClick={() => onOpenApp('checkout')}
                  className="w-full bg-[#DA291C] text-white py-2.5 rounded-xl font-black text-xs shadow-sm hover:bg-[#A8180D] transition-colors"
                >
                  Continuar al pago
                </button>
              </div>
            </div>
            <h3 className="text-lg font-black text-[#2B1B0E] mt-5 mb-1">Pedido anticipado</h3>
            <p className="text-[#5A3E24] text-xs leading-relaxed max-w-[220px] text-center">
              Eliges tu pedido y la hora aproximada de recogida sin esperas.
            </p>
          </div>

          {/* Phone 3: Seguimiento */}
          <div className="w-[260px] flex flex-col items-center group">
            <div className="w-[260px] h-[520px] rounded-[36px] bg-[#151515] p-2.5 shadow-[0_20px_45px_rgba(43,27,14,0.25)] relative transition-transform duration-300 group-hover:-translate-y-2 border-2 border-neutral-800">
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-4 bg-[#151515] rounded-b-xl z-20" />

              <div className="w-full h-full rounded-[28px] bg-[#FFF8ED] overflow-hidden p-4 pt-6 flex flex-col gap-2.5 text-left text-[#2B1B0E] select-none">
                <div className="flex justify-between items-center text-[10px] font-extrabold text-[#2B1B0E]/70 mb-1 px-1">
                  <span>9:41</span>
                  <span>📶 🔋</span>
                </div>

                <p className="text-xs font-black text-[#2B1B0E]">Tu pedido #1234</p>
                <p className="text-[10px] text-[#5A3E24] -mt-1.5 flex items-center gap-1 font-semibold">
                  <Clock className="w-3 h-3 text-[#DA291C]" />
                  <span>Hora estimada: 1:05 p.m.</span>
                </p>

                {/* Timeline */}
                <ul className="list-none p-0 m-0 flex flex-col gap-2.5 mt-2">
                  <li className="flex items-center gap-2.5 text-[11px] font-bold text-[#2B1B0E]">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                    <span>Pedido recibido</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-[11px] font-bold text-[#2B1B0E]">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                    <span>En preparación</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-[11px] font-black text-[#DA291C]">
                    <span className="w-5 h-5 rounded-full bg-[#FFC72C] text-[#2B1B0E] flex items-center justify-center text-[10px] font-black animate-pulse">
                      ●
                    </span>
                    <span>Listo para recoger</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-[11px] font-semibold text-neutral-400">
                    <span className="w-5 h-5 rounded-full bg-neutral-200 text-neutral-400 flex items-center justify-center text-[10px]">
                      ○
                    </span>
                    <span>Entregado</span>
                  </li>
                </ul>

                {/* Map status */}
                <div className="mt-auto bg-white rounded-xl p-3 text-center text-[10px] text-[#5A3E24] font-bold shadow-xs border border-neutral-100 flex flex-col items-center gap-1">
                  <span className="text-xl">🗺️</span>
                  <span>Mostrador #3 listo con tu orden caliente</span>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-black text-[#2B1B0E] mt-5 mb-1">Seguimiento</h3>
            <p className="text-[#5A3E24] text-xs leading-relaxed max-w-[220px] text-center">
              Consulta en tiempo real el estado y preparación de tu pedido.
            </p>
          </div>

          {/* Phone 4: McPoints */}
          <div className="w-[260px] flex flex-col items-center group">
            <div className="w-[260px] h-[520px] rounded-[36px] bg-[#151515] p-2.5 shadow-[0_20px_45px_rgba(43,27,14,0.25)] relative transition-transform duration-300 group-hover:-translate-y-2 border-2 border-neutral-800">
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-4 bg-[#151515] rounded-b-xl z-20" />

              <div className="w-full h-full rounded-[28px] bg-[#242424] overflow-hidden p-4 pt-6 flex flex-col gap-2.5 text-left text-white select-none">
                <div className="flex justify-between items-center text-[10px] font-extrabold text-white/60 mb-1 px-1">
                  <span>9:41</span>
                  <span>📶 🔋</span>
                </div>

                <p className="text-xs font-black text-white flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#FFC72C]" />
                  <span>McPoints Club</span>
                </p>

                {/* Points Card */}
                <div className="bg-[#303030] rounded-2xl p-3 flex items-center gap-3 border border-neutral-700">
                  <span className="text-3xl">🏅</span>
                  <div>
                    <small className="block text-[9px] text-[#D9C7B3] font-semibold">Tus McPoints</small>
                    <strong className="text-lg font-black text-[#FFC72C]">320 pts</strong>
                  </div>
                </div>

                {/* Level progress */}
                <div className="bg-[#1C1C1C] rounded-xl p-2.5 border border-neutral-800">
                  <div className="flex justify-between text-[9px] text-[#D9C7B3] font-bold mb-1.5">
                    <span>Nivel actual: Fan</span>
                    <span className="text-[#FFC72C]">64%</span>
                  </div>
                  <div className="w-full bg-neutral-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#FFC72C] h-full rounded-full" style={{ width: '64%' }} />
                  </div>
                </div>

                {/* Badges */}
                <p className="text-[10px] font-black text-[#D9C7B3] uppercase tracking-wider mt-1">Tus insignias</p>
                <div className="flex gap-2">
                  <span className="w-9 h-9 rounded-full bg-[#FFC72C] text-[#2B1B0E] flex items-center justify-center text-base shadow-sm">
                    🍔
                  </span>
                  <span className="w-9 h-9 rounded-full bg-[#FFC72C] text-[#2B1B0E] flex items-center justify-center text-base shadow-sm">
                    ⚡
                  </span>
                  <span className="w-9 h-9 rounded-full bg-[#3A2C1C] text-neutral-500 flex items-center justify-center text-base opacity-50">
                    👑
                  </span>
                </div>

                {/* Redeem button preview */}
                <button
                  onClick={() => onOpenApp('points')}
                  className="mt-auto w-full bg-[#DA291C] text-white py-2.5 rounded-xl font-black text-xs hover:bg-[#A8180D] transition-colors"
                >
                  Canjear premios
                </button>
              </div>
            </div>
            <h3 className="text-lg font-black text-[#2B1B0E] mt-5 mb-1">McPoints</h3>
            <p className="text-[#5A3E24] text-xs leading-relaxed max-w-[220px] text-center">
              Acumula puntos con cada compra y canjéalos por recompensas.
            </p>
          </div>
        </div>

        {/* CTA Launch Mini App */}
        <div className="text-center">
          <button
            id="openAppBtn2"
            onClick={() => onOpenApp('home')}
            className="bg-[#FFC72C] text-[#2B1B0E] px-10 py-4 rounded-full font-black text-lg tracking-wide shadow-[0_6px_0_#C99315] hover:translate-y-1 hover:shadow-[0_3px_0_#C99315] active:translate-y-1.5 transition-all inline-flex items-center gap-3 cursor-pointer"
          >
            <Smartphone className="w-5 h-5 text-[#2B1B0E]" />
            <span>Probar la app ahora</span>
          </button>
        </div>
      </div>
    </section>
  );
};
