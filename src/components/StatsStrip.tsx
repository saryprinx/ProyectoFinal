import React from 'react';

export const StatsStrip: React.FC = () => {
  const stats = [
    { value: '38.000+', label: 'Locales en el mundo' },
    { value: '100+', label: 'Países' },
    { value: '< 5 min', label: 'Tiempo promedio de entrega' },
    { value: '70 años', label: 'De historia' },
  ];

  return (
    <div className="bg-[#FFC72C] py-14 px-6 sm:px-12 border-y-2 border-[#DA291C]/20 select-none">
      <div className="max-w-6xl mx-auto flex flex-wrap justify-around items-center gap-8 text-center">
        {stats.map((stat, i) => (
          <div key={i} className="flex-1 min-w-[200px] flex flex-col items-center">
            <span className="text-4xl sm:text-5xl font-black text-[#DA291C] tracking-tight drop-shadow-sm">
              {stat.value}
            </span>
            <span className="text-sm sm:text-base font-bold text-[#2B1B0E] mt-1 tracking-wide">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
