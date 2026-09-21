import React, { useState } from 'react';
import { CATALOG } from '../data/menuData';
import { MenuItem } from '../types';
import { Plus, Check, Flame } from 'lucide-react';

interface MenuSectionProps {
  onAddToCart: (item: MenuItem) => void;
  onQuickOrder: (item: MenuItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ onAddToCart, onQuickOrder }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [addedItemMap, setAddedItemMap] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'todos', label: 'Todos', emoji: '⭐' },
    { id: 'hamburguesas', label: 'Hamburguesas', emoji: '🍔' },
    { id: 'acompanamientos', label: 'Acompañamientos', emoji: '🍟' },
    { id: 'bebidas', label: 'Bebidas', emoji: '🥤' },
    { id: 'postres', label: 'Postres', emoji: '🍦' },
    { id: 'combos', label: 'Combos', emoji: '🍗' },
  ];

  const filteredItems = selectedCategory === 'todos'
    ? CATALOG
    : CATALOG.filter(item => item.category === selectedCategory);

  const handleAdd = (item: MenuItem) => {
    onAddToCart(item);
    setAddedItemMap(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemMap(prev => ({ ...prev, [item.id]: false }));
    }, 1500);
  };

  return (
    <section id="menu" className="py-24 px-6 sm:px-12 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-[#DA291C] font-extrabold text-sm tracking-widest uppercase block mb-2">
          Favoritos de siempre
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-[#2B1B0E] tracking-tight">
          Lo más pedido
        </h2>
        <p className="text-[#5A3E24] mt-3 text-base">
          Recetas preparadas al momento con ingredientes seleccionados y el inconfundible toque dorado.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-12">
        {categories.map(cat => (
          <button
            key={cat.id}
            id={`menu-cat-${cat.id}`}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
              selectedCategory === cat.id
                ? 'bg-[#DA291C] text-white shadow-[#DA291C]/30 scale-105'
                : 'bg-white text-[#2B1B0E] hover:bg-[#FFE28A]/50 border border-[#2B1B0E]/10'
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map(item => {
          const isRecentlyAdded = !!addedItemMap[item.id];
          return (
            <div
              key={item.id}
              id={`menu-card-${item.id}`}
              className="bg-white rounded-3xl p-6 text-center shadow-[0_10px_30px_rgba(43,27,14,0.06)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(43,27,14,0.12)] border-3 border-transparent hover:border-[#FFC72C] transition-all duration-300 relative flex flex-col justify-between group overflow-hidden"
            >
              {/* Badge */}
              {item.badge && (
                <div className="absolute top-4 -right-8 bg-[#DA291C] text-white px-10 py-1 text-[11px] font-black tracking-wider uppercase rotate-45 shadow-sm pointer-events-none z-10">
                  {item.badge}
                </div>
              )}

              {/* Product Photograph */}
              <div>
                <div className="w-full h-48 mx-auto mb-4 rounded-2xl bg-white overflow-hidden relative select-none flex items-center justify-center p-2 border border-neutral-100 shadow-xs">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-xl font-black text-[#2B1B0E] tracking-tight text-left">
                    {item.name}
                  </h3>
                  {item.calories && (
                    <span className="text-[11px] font-semibold text-[#5A3E24]/70 bg-[#FFF8ED] px-2 py-0.5 rounded-md flex items-center gap-0.5">
                      <Flame className="w-3 h-3 text-[#DA291C]" />
                      {item.calories}
                    </span>
                  )}
                </div>

                <p className="text-[#5A3E24] text-xs text-left leading-relaxed line-clamp-2 mb-4">
                  {item.description}
                </p>
              </div>

              {/* Price & Action Button */}
              <div className="pt-4 border-t border-[#FFF8ED] flex items-center justify-between mt-auto">
                <div className="text-left">
                  <span className="text-lg font-black text-[#DA291C] tracking-tight block">
                    ${item.price.toFixed(2)}
                  </span>
                  <span className="text-[10px] font-bold text-[#5A3E24]/60 uppercase">
                    Tier {item.tier}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleAdd(item)}
                    id={`btn-add-${item.id}`}
                    className={`px-3.5 py-2 rounded-xl font-extrabold text-xs transition-all flex items-center gap-1 cursor-pointer ${
                      isRecentlyAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#FFC72C] text-[#2B1B0E] hover:bg-[#FFE28A] active:scale-95 shadow-sm'
                    }`}
                    title="Agregar al pedido"
                  >
                    {isRecentlyAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>¡Listo!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Agregar</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onQuickOrder(item)}
                    className="p-2 rounded-xl text-white bg-[#DA291C] hover:bg-[#A8180D] active:scale-95 transition-all cursor-pointer text-xs font-bold"
                    title="Ordenar en la App"
                  >
                    Pedir
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
