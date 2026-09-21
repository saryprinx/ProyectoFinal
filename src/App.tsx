import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { StatsStrip } from './components/StatsStrip';
import { ValoresSection } from './components/ValoresSection';
import { AppShowcase } from './components/AppShowcase';
import { PromoBanner } from './components/PromoBanner';
import { RuletaSection } from './components/RuletaSection';
import { Footer } from './components/Footer';
import { MiniAppModal } from './components/MiniAppModal';
import { AssistantChat } from './components/AssistantChat';
import { OperatorPanel } from './components/OperatorPanel';
import { MenuItem, ActiveOrder } from './types';
import { getStoredOrders, saveOrders, INITIAL_ORDERS } from './data/initialOrders';

const CART_STORAGE_KEY = 'doradosCartState';

export default function App() {
  const [cart, setCart] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [appModalInitialScreen, setAppModalInitialScreen] = useState('home');

  // Operator Panel State
  const [isOperatorModalOpen, setIsOperatorModalOpen] = useState(false);
  const [orders, setOrders] = useState<ActiveOrder[]>(() => getStoredOrders());

  // Listen for storage / cross-tab / local updates
  useEffect(() => {
    const handleOrdersUpdate = () => {
      setOrders(getStoredOrders());
    };
    window.addEventListener('dorados_orders_updated', handleOrdersUpdate);
    window.addEventListener('storage', handleOrdersUpdate);
    return () => {
      window.removeEventListener('dorados_orders_updated', handleOrdersUpdate);
      window.removeEventListener('storage', handleOrdersUpdate);
    };
  }, []);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // Handle URL hash navigation on mount (e.g. #menu)
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, []);

  const totalCartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'entregado').length;

  const handleOpenApp = (screen: string = 'home') => {
    setAppModalInitialScreen(screen);
    setIsAppModalOpen(true);
  };

  const handleOpenOperator = () => {
    setIsOperatorModalOpen(true);
  };

  const handleAddToCartFromLanding = (item: MenuItem) => {
    setCart(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1,
    }));
  };

  const handleQuickOrderFromLanding = (item: MenuItem) => {
    setCart(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1,
    }));
    handleOpenApp('checkout');
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: ActiveOrder['status']) => {
    setOrders(prev => {
      const updated = prev.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            status: newStatus,
            finishedAt: newStatus === 'entregado' ? Date.now() : o.finishedAt,
          };
        }
        return o;
      });
      saveOrders(updated);
      return updated;
    });
  };

  const handleAddNewOrder = (newOrder: ActiveOrder) => {
    setOrders(prev => {
      const updated = [newOrder, ...prev];
      saveOrders(updated);
      return updated;
    });
  };

  const handleResetOrders = () => {
    setOrders(INITIAL_ORDERS);
    saveOrders(INITIAL_ORDERS);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8ED] text-[#2B1B0E] selection:bg-[#FFC72C] selection:text-[#2B1B0E]">
      {/* Fixed Navigation Bar */}
      <Navbar
        cartCount={totalCartCount}
        onOpenApp={handleOpenApp}
        onOpenOperator={handleOpenOperator}
        ordersCount={activeOrdersCount}
      />

      {/* Hero Section */}
      <main className="flex-1">
        <Hero onOpenApp={handleOpenApp} />

        {/* Menu Section (#menu) */}
        <MenuSection
          onAddToCart={handleAddToCartFromLanding}
          onQuickOrder={handleQuickOrderFromLanding}
        />

        {/* Stats Strip */}
        <StatsStrip />

        {/* History / Values Section (#valores) */}
        <ValoresSection />

        {/* App Showcase Mockups (#app) */}
        <AppShowcase onOpenApp={handleOpenApp} />

        {/* Weekly Promo Banner (#promo) */}
        <PromoBanner onOpenApp={handleOpenApp} />

        {/* Lucky Prize Wheel Section (#ruleta) */}
        <RuletaSection />
      </main>

      {/* Footer (#contacto) */}
      <Footer onOpenOperator={handleOpenOperator} />

      {/* Interactive Smartphone Order Simulator (Overlay) */}
      <MiniAppModal
        isOpen={isAppModalOpen}
        initialScreen={appModalInitialScreen}
        onClose={() => setIsAppModalOpen(false)}
        cart={cart}
        onUpdateCart={setCart}
        onOrderCreated={handleAddNewOrder}
      />

      {/* Panel del Operador (Overlay Modal) */}
      <OperatorPanel
        isOpen={isOperatorModalOpen}
        onClose={() => setIsOperatorModalOpen(false)}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onAddNewOrder={handleAddNewOrder}
        onResetOrders={handleResetOrders}
      />

      {/* Floating AI Virtual Assistant "Dorado" */}
      <AssistantChat
        onOpenMenu={() => {
          const el = document.getElementById('menu');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenApp={() => handleOpenApp('home')}
      />
    </div>
  );
}
