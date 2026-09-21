import React from 'react';

export const ValoresSection: React.FC = () => {
  const items = [
    {
      num: '01',
      title: 'Ingredientes frescos',
      desc: 'Seleccionamos proveedores locales certificados y controlamos rigurosamente cada etapa de preparación para garantizar frescura insuperable.',
    },
    {
      num: '02',
      title: 'Rapidez real',
      desc: 'Tu pedido preparado y empaquetado en menos de 5 minutos, sin sacrificar ni el sabor ni la temperatura de tus alimentos favoritos.',
    },
    {
      num: '03',
      title: 'Para toda la familia',
      desc: 'Opciones pensadas para los más pequeños, menús completos para compartir y alternativas ligeras para cualquier momento del día.',
    },
  ];

  return (
    <section id="valores" className="bg-[#2B1B0E] text-white py-24 px-6 sm:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#FFC72C] font-extrabold text-sm tracking-widest uppercase block mb-2">
            Nuestra promesa
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Calidad en cada bocado
          </h2>
          <p className="text-[#D9C7B3] mt-3 text-base">
            Comprometidos desde 1955 con la hospitalidad, la higiene y la sonrisa de nuestros comensales.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          {items.map(item => (
            <div
              key={item.num}
              className="text-center p-8 rounded-3xl bg-[#3A2616]/60 border border-white/5 hover:border-[#FFC72C]/40 transition-all hover:-translate-y-1.5 duration-300"
            >
              <div className="text-5xl sm:text-6xl font-black text-[#FFC72C] mb-4 tracking-tighter">
                {item.num}
              </div>
              <h3 className="text-xl font-black text-white mb-3 tracking-tight">
                {item.title}
              </h3>
              <p className="text-[#D9C7B3] text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
