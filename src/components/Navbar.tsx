import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, ChefHat } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenApp: (screen?: string) => void;
  onOpenOperator: () => void;
  ordersCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenApp,
  onOpenOperator,
  ordersCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Menú', href: '#menu' },
    { label: 'Historia', href: '#valores' },
    { label: 'App', href: '#app' },
    { label: 'Ofertas', href: '#promo' },
    { label: 'Ruleta', href: '#ruleta' },
    { label: 'Locales', href: '#contacto' },
  ];

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 sm:px-12 py-4 flex items-center justify-between border-b-3 border-[#FFC72C] ${
        scrolled ? 'bg-[#FFF8ED]/95 backdrop-blur-md shadow-md' : 'bg-[#FFF8ED]/90 backdrop-blur-sm'
      }`}
    >
      {/* Brand Logo */}
      <a href="#" className="flex items-center gap-2.5 text-[#DA291C] font-black text-xl tracking-tight select-none">
        <span className="w-8 h-8 relative inline-flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
            <path
              d="M20 90 L20 40 Q20 15 35 15 Q45 15 45 35 L45 90 M55 90 L55 35 Q55 15 65 15 Q80 15 80 40 L80 90"
              stroke="#DA291C"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <span className="text-[#DA291C] text-xl font-extrabold tracking-tight">Arcos Dorados</span>
      </a>

      {/* Desktop Links */}
      <ul className="hidden md:flex items-center gap-7 list-none m-0 p-0">
        {navLinks.map(link => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-[#2B1B0E] font-bold text-sm tracking-wide relative py-1 transition-colors hover:text-[#DA291C] group"
            >
              {link.label}
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#DA291C] transition-all duration-250 group-hover:w-full" />
            </a>
          </li>
        ))}
        <li>
          <button
            id="nav-link-operator"
            onClick={onOpenOperator}
            className="text-[#5A3E24] hover:text-[#DA291C] font-bold text-sm tracking-wide relative py-1 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ChefHat className="w-4 h-4 text-[#DA291C]" />
            <span>Panel operador</span>
          </button>
        </li>
      </ul>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Dedicated Operator Button */}
        <button
          id="btn-nav-operator"
          onClick={onOpenOperator}
          className="hidden sm:inline-flex items-center gap-1.5 bg-[#FFF8ED] hover:bg-[#FFE28A]/50 text-[#2B1B0E] border-2 border-[#FFC72C] px-3.5 py-2 rounded-full font-black text-xs tracking-wide transition-all shadow-2xs cursor-pointer hover:border-[#DA291C]"
          title="Abrir Panel del operador"
        >
          <ChefHat className="w-4 h-4 text-[#DA291C]" />
          <span className="hidden xl:inline">Panel del</span>
          <span>Operador</span>
          {ordersCount !== undefined && ordersCount > 0 && (
            <span className="bg-[#DA291C] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
              {ordersCount}
            </span>
          )}
        </button>

        <button
          id="btn-pedir-ahora-nav"
          onClick={() => onOpenApp('home')}
          className="bg-[#DA291C] text-white px-5 py-2.5 rounded-full font-extrabold text-sm tracking-wide shadow-[0_4px_0_#A8180D] active:translate-y-1 active:shadow-[0_1px_0_#A8180D] transition-all cursor-pointer flex items-center gap-2 hover:bg-[#C22317]"
        >
          <span>Pedir ahora</span>
        </button>

        {/* Shopping Cart Button */}
        <button
          id="navbar-cart-btn"
          onClick={() => onOpenApp(cartCount > 0 ? 'checkout' : 'menu')}
          className="relative bg-[#DA291C] hover:bg-[#C22317] p-2.5 rounded-full text-white shadow-[0_4px_0_#A8180D] active:translate-y-1 active:shadow-[0_1px_0_#A8180D] transition-all cursor-pointer flex items-center justify-center shrink-0 border border-white/20"
          aria-label="Abrir carrito de compra"
          title="Ver carrito de compras"
        >
          <ShoppingCart className="w-5 h-5 text-white stroke-[2.2]" />
          {/* Small indicator with quantity of added items */}
          <span
            id="navbar-cart-badge"
            className={`absolute -top-1.5 -right-1.5 text-[10px] font-black min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center border-2 border-white shadow-xs transition-transform ${
              cartCount > 0
                ? 'bg-[#FFC72C] text-[#2B1B0E] scale-100 animate-pop'
                : 'bg-neutral-800 text-white scale-90'
            }`}
          >
            {cartCount}
          </span>
        </button>

        {/* Mobile menu toggle */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#2B1B0E] rounded-lg hover:bg-[#FFC72C]/20 transition-colors"
          aria-label="Abrir menú"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#FFF8ED] border-b-2 border-[#FFC72C] shadow-xl py-4 px-6 flex flex-col gap-3 animate-pop">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#2B1B0E] font-bold text-base py-2 border-b border-[#2B1B0E]/10 flex items-center justify-between"
            >
              <span>{link.label}</span>
              <span className="text-[#DA291C]">→</span>
            </a>
          ))}

          {/* Panel del operador in mobile menu */}
          <button
            id="mobile-nav-operator-btn"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenOperator();
            }}
            className="w-full bg-white border-2 border-[#FFC72C] text-[#2B1B0E] py-2.5 px-4 rounded-2xl font-black text-sm text-left flex items-center justify-between cursor-pointer hover:bg-[#FFE28A]/30 transition-colors shadow-2xs mt-1"
          >
            <div className="flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-[#DA291C]" />
              <span>Panel del operador</span>
            </div>
            {ordersCount !== undefined && ordersCount > 0 && (
              <span className="bg-[#DA291C] text-white text-xs font-black px-2 py-0.5 rounded-full">
                {ordersCount} activos
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenApp('home');
            }}
            className="w-full bg-[#DA291C] text-white py-3 rounded-full font-extrabold text-center mt-2 shadow-[0_4px_0_#A8180D]"
          >
            Abrir App y Pedir
          </button>
        </div>
      )}
    </nav>
  );
};
