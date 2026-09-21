import React, { useState, useEffect } from 'react';
import { CATALOG, USER_LEVELS, USER_BADGES, REWARDS_CATALOG } from '../data/menuData';
import { CartItem, ActiveOrder, MenuItem } from '../types';
import { X, ArrowLeft, Clock, Check, Sparkles } from 'lucide-react';

interface MiniAppModalProps {
  isOpen: boolean;
  initialScreen?: string;
  onClose: () => void;
  cart: Record<string, number>;
  onUpdateCart: (newCart: Record<string, number>) => void;
  onOrderCreated?: (order: ActiveOrder) => void;
}

const STORAGE_KEY = 'doradosAppStateV1';

interface StoredAppState {
  points: number;
  history: ActiveOrder[];
  redeemed: Array<{ id: string; label: string; at: number }>;
}

export const MiniAppModal: React.FC<MiniAppModalProps> = ({
  isOpen,
  initialScreen = 'home',
  onClose,
  cart,
  onUpdateCart,
  onOrderCreated,
}) => {
  const [currentScreen, setCurrentScreen] = useState<string>(initialScreen);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedPickupTime, setSelectedPickupTime] = useState<string | null>('1:00');
  const [customerName, setCustomerName] = useState<string>('Valentina Cruz');
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(null);

  // App persistent state
  const [appState, setAppState] = useState<StoredAppState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return {
      points: 320,
      history: [],
      redeemed: [],
    };
  });

  // Save state on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch {}
  }, [appState]);

  // Synchronize initial screen when opened
  useEffect(() => {
    if (isOpen && initialScreen) {
      setCurrentScreen(initialScreen);
    }
  }, [isOpen, initialScreen]);

  // Order stage simulation timer
  useEffect(() => {
    if (!activeOrder || activeOrder.status === 'entregado') return;

    const stages: Array<ActiveOrder['status']> = ['recibido', 'preparacion', 'listo', 'entregado'];
    const timer = setInterval(() => {
      setActiveOrder(prevOrder => {
        if (!prevOrder || prevOrder.status === 'entregado') return prevOrder;
        const currentIdx = stages.indexOf(prevOrder.status);
        if (currentIdx < stages.length - 1) {
          const nextStatus = stages[currentIdx + 1];
          const updated: ActiveOrder = { ...prevOrder, status: nextStatus };

          if (nextStatus === 'entregado') {
            const earned = prevOrder.items.reduce((sum, it) => sum + it.qty * 10, 0);
            updated.earnedPoints = earned;
            updated.finishedAt = Date.now();

            // Award points and add to history
            setAppState(prev => ({
              ...prev,
              points: prev.points + earned,
              history: [updated, ...prev.history],
            }));
            triggerToast(`¡Pedido entregado! Ganaste +${earned} McPoints 🏅`);
          }
          return updated;
        }
        return prevOrder;
      });
    }, 3500);

    return () => clearInterval(timer);
  }, [activeOrder]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const cartTotalCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const getCartItemsList = (): CartItem[] => {
    return Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const item = CATALOG.find(p => p.id === id) as MenuItem;
        return {
          id: item.id,
          name: item.name,
          image: item.image,
          emoji: item.emoji,
          tier: item.tier,
          price: item.price,
          qty,
        };
      });
  };

  const handleAddToCart = (id: string) => {
    const next = { ...cart, [id]: (cart[id] || 0) + 1 };
    onUpdateCart(next);
    triggerToast('Agregado al pedido 🛒');
  };

  const handleChangeQty = (id: string, delta: number) => {
    const current = cart[id] || 0;
    const nextQty = Math.max(0, current + delta);
    const next = { ...cart, [id]: nextQty };
    if (nextQty === 0) delete next[id];
    onUpdateCart(next);
  };

  const handleConfirmOrder = () => {
    if (!selectedPickupTime) return;
    const items = getCartItemsList();
    if (items.length === 0) return;

    const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);
    const pickupFormatted = selectedPickupTime.includes('pm') || selectedPickupTime.includes('am')
      ? selectedPickupTime
      : `${selectedPickupTime} pm`;

    const newOrder: ActiveOrder = {
      id: 'DOR-' + Math.random().toString(36).slice(2, 6).toUpperCase(),
      customerName: customerName.trim() || 'Valentina Cruz',
      items,
      pickupTime: pickupFormatted,
      status: 'recibido',
      createdAt: Date.now(),
      orderType: 'App Móvil',
      totalAmount: total,
    };

    setActiveOrder(newOrder);
    onOrderCreated?.(newOrder);
    onUpdateCart({});
    setCurrentScreen('orders');
    triggerToast('¡Pedido confirmado con éxito! 🎉');
  };

  // Levels calculation
  const getCurrentLevel = () => {
    let lvl = USER_LEVELS[0];
    for (const l of USER_LEVELS) {
      if (appState.points >= l.min) lvl = l;
    }
    return lvl;
  };

  const getNextLevel = () => {
    const cur = getCurrentLevel();
    const idx = USER_LEVELS.indexOf(cur);
    return USER_LEVELS[idx + 1] || null;
  };

  const getLevelProgressPct = () => {
    const cur = getCurrentLevel();
    const next = getNextLevel();
    if (!next) return 100;
    return Math.min(100, Math.max(0, Math.round(((appState.points - cur.min) / (next.min - cur.min)) * 100)));
  };

  const handleRedeemReward = (reward: { id: string; label: string; cost: number }) => {
    if (appState.points < reward.cost) return;
    setAppState(prev => ({
      ...prev,
      points: prev.points - reward.cost,
      redeemed: [{ id: reward.id, label: reward.label, at: Date.now() }, ...prev.redeemed],
    }));
    triggerToast(`¡Premio canjeado! ${reward.label} 🎁`);
  };

  if (!isOpen) return null;

  return (
    <div
      id="miniAppOverlay"
      className="fixed inset-0 z-50 bg-[#2B1B0E]/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-pop"
      onClick={onClose}
    >
      {/* Phone Case Container */}
      <div
        className="w-[380px] max-w-full h-[720px] max-h-[94vh] bg-[#151515] rounded-[44px] p-3 shadow-2xl flex flex-col relative border-4 border-neutral-700 select-none overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Physical notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-[#151515] rounded-b-2xl z-30 flex items-center justify-center">
          <div className="w-10 h-2 bg-neutral-900 rounded-full" />
        </div>

        {/* Screen inside phone */}
        <div className="w-full h-full bg-[#FFF8ED] rounded-[34px] overflow-hidden flex flex-col relative">
          {/* Status Bar */}
          <div className="bg-[#2B1B0E] text-white px-5 pt-3 pb-2 flex justify-between items-center text-[11px] font-bold shrink-0">
            <span>9:41</span>
            <div className="flex items-center gap-2">
              <span>5G</span>
              <span>🔋 100%</span>
            </div>
          </div>

          {/* Topbar with Title & Close */}
          <div className="bg-[#2B1B0E] text-white px-4 py-3 flex items-center justify-between border-b border-white/10 shrink-0">
            <span id="miniAppTitle" className="font-black text-sm tracking-wide text-[#FFC72C]">
              {currentScreen === 'home' && 'Inicio · Arcos Dorados'}
              {currentScreen === 'menu' && 'Menú Digital'}
              {currentScreen === 'checkout' && 'Pedido Anticipado'}
              {currentScreen === 'orders' && 'Tus Pedidos'}
              {currentScreen === 'points' && 'Club McPoints'}
              {currentScreen === 'promos' && 'Promociones'}
            </span>
            <button
              id="miniAppClose"
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
              aria-label="Cerrar app"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Main App Body */}
          <div id="miniAppBody" className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 custom-scrollbar text-[#2B1B0E]">
            {/* Screen 1: HOME */}
            {currentScreen === 'home' && (
              <>
                <p className="font-black text-base leading-tight">Hola, bienvenido 👋</p>
                <p className="text-xs text-[#5A3E24] -mt-2">Aquí tienes algunas recomendaciones doradas</p>

                {/* Fake Search */}
                <div
                  onClick={() => setCurrentScreen('menu')}
                  className="bg-white rounded-2xl px-3.5 py-2.5 text-xs text-neutral-400 shadow-xs border border-neutral-100 flex items-center justify-between cursor-pointer"
                >
                  <span>¿Qué se te antoja hoy?</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#FFC72C]" />
                </div>

                {/* Categories */}
                <div className="flex justify-between px-1 py-1">
                  {[
                    ['🍔', 'Combos', 'combos'],
                    ['🍟', 'Solos', 'acompanamientos'],
                    ['🥤', 'Bebidas', 'bebidas'],
                    ['🍰', 'Postres', 'postres'],
                  ].map(([emoji, label, cat]) => (
                    <button
                      key={cat}
                      onClick={() => setCurrentScreen('menu')}
                      className="flex flex-col items-center gap-1 cursor-pointer hover:scale-110 transition-transform"
                    >
                      <span className="text-2xl">{emoji}</span>
                      <em className="not-italic text-[10px] font-bold text-[#5A3E24]">{label}</em>
                    </button>
                  ))}
                </div>

                {/* Featured Highlight Card */}
                <div className="bg-gradient-to-r from-[#DA291C] to-[#C22317] text-white rounded-2xl p-3.5 shadow-md relative overflow-hidden flex items-center justify-between gap-3">
                  <div className="relative z-10 flex-1">
                    <span className="bg-[#FFC72C] text-[#2B1B0E] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider inline-block">
                      Tu favorito
                    </span>
                    <strong className="block text-sm font-black mt-1">Doble con Queso Combo</strong>
                    <p className="text-[11px] text-white/90">Papas doradas y bebida fría</p>
                    <button
                      onClick={() => handleAddToCart('doble')}
                      className="mt-2 bg-[#FFC72C] text-[#2B1B0E] border-none rounded-xl px-3.5 py-1.5 font-black text-xs cursor-pointer hover:bg-[#FFE28A] active:scale-95 transition-transform"
                    >
                      Agregar por $6.90
                    </button>
                  </div>
                  <div className="w-20 h-20 rounded-xl overflow-hidden shadow-xs border border-white/30 shrink-0 bg-white p-1 flex items-center justify-center">
                    <img
                      src="/images/products/combo.jpg"
                      alt="Doble con Queso Combo"
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {/* Special Offers */}
                <p className="text-xs font-black text-[#5A3E24] mt-1">Ofertas para ti</p>
                {['papas', 'postre', 'pollo'].map(id => {
                  const item = CATALOG.find(c => c.id === id);
                  if (!item) return null;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 bg-white rounded-2xl p-2.5 shadow-xs border border-neutral-100"
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-white border border-neutral-100 p-0.5 flex items-center justify-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <strong className="block text-xs font-black truncate">{item.name}</strong>
                        <small className="text-[#DA291C] font-black text-[11px]">${item.price.toFixed(2)}</small>
                      </div>
                      <button
                        onClick={() => handleAddToCart(item.id)}
                        className="bg-[#DA291C] text-white rounded-xl px-3 py-1.5 font-extrabold text-[11px] cursor-pointer hover:bg-[#A8180D] active:scale-95 transition-all"
                      >
                        Agregar
                      </button>
                    </div>
                  );
                })}
              </>
            )}

            {/* Screen 2: MENU */}
            {currentScreen === 'menu' && (
              <>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs font-black text-[#5A3E24] uppercase tracking-wider">Todo el menú</p>
                  <span className="text-[10px] text-neutral-400 font-semibold">{CATALOG.length} productos</span>
                </div>

                {CATALOG.map(p => {
                  const qty = cart[p.id] || 0;
                  return (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 bg-white rounded-2xl p-2.5 shadow-xs border border-neutral-100"
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-white border border-neutral-100 p-0.5 flex items-center justify-center">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <strong className="block text-xs font-black truncate">{p.name}</strong>
                        <small className="text-[#DA291C] font-black text-[11px]">${p.price.toFixed(2)}</small>
                      </div>

                      {qty > 0 ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleChangeQty(p.id, -1)}
                            className="w-6 h-6 rounded-full bg-[#FFC72C] text-[#2B1B0E] font-black flex items-center justify-center text-xs cursor-pointer active:scale-90"
                          >
                            −
                          </button>
                          <span className="min-w-4 text-center font-black text-xs">{qty}</span>
                          <button
                            onClick={() => handleChangeQty(p.id, 1)}
                            className="w-6 h-6 rounded-full bg-[#FFC72C] text-[#2B1B0E] font-black flex items-center justify-center text-xs cursor-pointer active:scale-90"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(p.id)}
                          className="bg-[#DA291C] text-white rounded-xl px-3 py-1.5 font-extrabold text-[11px] cursor-pointer hover:bg-[#A8180D] active:scale-95 transition-all"
                        >
                          Agregar
                        </button>
                      )}
                    </div>
                  );
                })}
              </>
            )}

            {/* Screen 3: CHECKOUT */}
            {currentScreen === 'checkout' && (
              <>
                <button
                  onClick={() => setCurrentScreen('menu')}
                  className="flex items-center gap-1 text-[#DA291C] font-extrabold text-xs cursor-pointer mb-1 hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Seguir agregando productos</span>
                </button>

                <p className="text-xs text-[#5A3E24]">¿A qué hora deseas recoger tu orden?</p>

                {/* Pickup Location */}
                <div className="bg-white rounded-2xl p-2.5 text-[11px] flex justify-between items-center shadow-xs border border-neutral-100">
                  <span className="font-semibold text-[#2B1B0E]">📍 Sucursal Central 01</span>
                  <span className="text-[#DA291C] font-bold text-[10px]">Cambiar</span>
                </div>

                {/* Customer Name Input */}
                <div>
                  <label className="text-xs font-black text-[#5A3E24] block mb-1">Nombre del cliente</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="Tu nombre para el pedido"
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-1.5 text-xs text-[#2B1B0E] outline-none focus:border-[#DA291C]"
                  />
                </div>

                {/* Time Grid */}
                <p className="text-xs font-black text-[#5A3E24] mt-1">Elige la hora de entrega</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {['12:30', '1:00', '1:30', '2:00'].map(t => (
                    <button
                      key={t}
                      onClick={() => setSelectedPickupTime(t)}
                      className={`py-2 rounded-xl font-bold text-xs cursor-pointer transition-all border ${
                        selectedPickupTime === t
                          ? 'bg-[#DA291C] text-white border-[#DA291C] shadow-sm font-black'
                          : 'bg-white text-[#2B1B0E] border-neutral-200 hover:bg-[#FFE28A]/40'
                      }`}
                    >
                      {t} pm
                    </button>
                  ))}
                </div>

                {/* Summary */}
                <p className="text-xs font-black text-[#5A3E24] mt-2">Resumen del pedido</p>
                <div className="bg-white rounded-2xl p-3 flex flex-col gap-2 shadow-xs border border-neutral-100">
                  {getCartItemsList().map(item => (
                    <div key={item.id} className="flex justify-between items-center text-xs gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-white border border-neutral-100 p-0.5 flex items-center justify-center">
                          <img
                            src={item.image || `/images/products/${item.id}.jpg`}
                            alt={item.name}
                            className="w-full h-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <span className="font-medium truncate text-[#2B1B0E]">
                          {item.name} <b className="font-black text-[#DA291C]">x{item.qty}</b>
                        </span>
                      </div>
                      <span className="font-bold text-[#2B1B0E] shrink-0">
                        ${(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  ))}

                  <div className="border-t border-neutral-100 pt-2 flex justify-between font-black text-xs text-[#2B1B0E]">
                    <span>Total a pagar</span>
                    <span className="text-[#DA291C] text-sm">
                      ${getCartItemsList().reduce((sum, it) => sum + it.price * it.qty, 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleConfirmOrder}
                  disabled={!selectedPickupTime || getCartItemsList().length === 0}
                  className="mt-auto w-full bg-[#DA291C] text-white py-3 rounded-2xl font-black text-xs cursor-pointer shadow-[0_4px_0_#A8180D] active:translate-y-0.5 active:shadow-none hover:bg-[#C22317] transition-all"
                >
                  Confirmar pedido (${getCartItemsList().reduce((sum, it) => sum + it.price * it.qty, 0).toFixed(2)})
                </button>
              </>
            )}

            {/* Screen 4: ORDERS */}
            {currentScreen === 'orders' && (
              <>
                {activeOrder ? (
                  <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-neutral-100 flex flex-col gap-3">
                    <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
                      <div>
                        <strong className="block text-xs font-black text-[#2B1B0E]">
                          Pedido {activeOrder.id}
                        </strong>
                        <small className="text-[10px] text-[#5A3E24]">Recogida a las {activeOrder.pickupTime} pm</small>
                      </div>
                      <span className="bg-[#FFC72C] text-[#2B1B0E] text-[10px] font-black px-2 py-0.5 rounded-full">
                        En curso
                      </span>
                    </div>

                    {/* Timeline */}
                    <div className="flex flex-col gap-2.5 my-1">
                      {[
                        { key: 'recibido', label: 'Pedido recibido' },
                        { key: 'preparacion', label: 'En preparación' },
                        { key: 'listo', label: 'Listo para recoger' },
                        { key: 'entregado', label: 'Entregado' },
                      ].map((st, i, arr) => {
                        const stages = arr.map(s => s.key);
                        const curIdx = stages.indexOf(activeOrder.status);
                        const isDone = i <= curIdx;
                        const isCurrent = i === curIdx;

                        return (
                          <div key={st.key} className="flex items-center gap-2.5 text-xs">
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                                isDone
                                  ? 'bg-emerald-600 text-white'
                                  : isCurrent
                                  ? 'bg-[#FFC72C] text-[#2B1B0E] animate-pulse'
                                  : 'bg-neutral-200 text-neutral-400'
                              }`}
                            >
                              {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : i + 1}
                            </span>
                            <span className={isCurrent ? 'font-black text-[#DA291C]' : isDone ? 'font-bold text-[#2B1B0E]' : 'text-neutral-400'}>
                              {st.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Items list */}
                    <div className="bg-[#FFF8ED] rounded-xl p-2 text-[11px] text-[#5A3E24] flex flex-col gap-1.5 border border-[#2B1B0E]/5">
                      {activeOrder.items.map(it => (
                        <div key={it.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-8 h-8 rounded-md overflow-hidden shrink-0 bg-white border border-neutral-100 p-0.5 flex items-center justify-center">
                              <img
                                src={it.image || `/images/products/${it.id}.jpg`}
                                alt={it.name}
                                className="w-full h-full object-contain"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <span className="truncate font-semibold text-[#2B1B0E]">
                              {it.name} <b className="text-[#DA291C] font-black">x{it.qty}</b>
                            </span>
                          </div>
                          <span className="font-bold text-[#5A3E24] shrink-0">${(it.price * it.qty).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-[#5A3E24]">
                    <span className="text-4xl mb-2">🧾</span>
                    <strong className="text-xs font-black text-[#2B1B0E] block mb-1">No tienes pedidos activos</strong>
                    <p className="text-[11px] text-[#5A3E24]">Agrega algo del menú para disfrutar de tu combo caliente.</p>
                    <button
                      onClick={() => setCurrentScreen('menu')}
                      className="mt-3 bg-[#DA291C] text-white px-4 py-1.5 rounded-xl font-bold text-xs cursor-pointer"
                    >
                      Explorar menú
                    </button>
                  </div>
                )}

                {/* History */}
                {appState.history.length > 0 && (
                  <div className="flex flex-col gap-2 mt-2">
                    <p className="text-xs font-black text-[#5A3E24] uppercase tracking-wider">Historial de pedidos</p>
                    {appState.history.slice(0, 4).map(h => (
                      <div key={h.id} className="bg-white rounded-2xl p-2.5 shadow-xs border border-neutral-100 text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <strong className="font-black text-[#2B1B0E]">{h.id}</strong>
                          <span className="text-emerald-700 font-black text-[10px]">+{h.earnedPoints || 20} McPoints</span>
                        </div>
                        <p className="text-[11px] text-[#5A3E24] line-clamp-1">
                          {h.items.map(i => `${i.name} (x${i.qty})`).join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Screen 5: MCPOINTS */}
            {currentScreen === 'points' && (
              <>
                {/* Points Card */}
                <div className="bg-[#242424] text-white rounded-2xl p-4 flex items-center gap-3.5 shadow-md">
                  <span className="text-3xl">🏅</span>
                  <div>
                    <small className="text-[10px] text-[#D9C7B3] uppercase font-bold block">Tus McPoints Acumulados</small>
                    <strong className="text-2xl font-black text-[#FFC72C]">{appState.points} pts</strong>
                  </div>
                </div>

                {/* Level Progress */}
                <div className="bg-white rounded-2xl p-3 border border-neutral-100 shadow-xs">
                  <div className="flex justify-between text-[11px] font-bold text-[#5A3E24] mb-1.5">
                    <span>Nivel: <strong className="text-[#DA291C]">{getCurrentLevel().name}</strong></span>
                    <span>{getNextLevel() ? `Faltan ${getNextLevel()!.min - appState.points} pts` : 'Nivel máximo'}</span>
                  </div>
                  <div className="w-full bg-[#EADFCE] h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#DA291C] h-full rounded-full transition-all duration-500"
                      style={{ width: `${getLevelProgressPct()}%` }}
                    />
                  </div>
                </div>

                {/* Badges */}
                <p className="text-xs font-black text-[#5A3E24] uppercase tracking-wider">Tus insignias</p>
                <div className="flex gap-2.5">
                  {USER_BADGES.map(b => {
                    const unlocked = b.check({ points: appState.points, history: appState.history, activeOrder });
                    return (
                      <div
                        key={b.id}
                        className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-2xl border text-center transition-all ${
                          unlocked
                            ? 'bg-[#FFF8ED] border-[#FFC72C] shadow-xs'
                            : 'bg-neutral-100 border-neutral-200 opacity-40'
                        }`}
                      >
                        <span className="text-xl">{b.emoji}</span>
                        <span className="text-[9px] font-bold text-[#2B1B0E] leading-tight">{b.label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Rewards Redemption */}
                <p className="text-xs font-black text-[#5A3E24] uppercase tracking-wider">Canjea tus puntos</p>
                <div className="flex flex-col gap-2">
                  {REWARDS_CATALOG.map(r => {
                    const canAfford = appState.points >= r.cost;
                    return (
                      <div
                        key={r.id}
                        className="bg-white rounded-2xl p-2.5 flex items-center justify-between shadow-xs border border-neutral-100"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-white border border-neutral-100 p-0.5 flex items-center justify-center">
                            <img
                              src={r.image || '/images/products/combo.jpg'}
                              alt={r.label}
                              className="w-full h-full object-contain"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div>
                            <strong className="block text-xs font-black text-[#2B1B0E]">{r.label}</strong>
                            <small className="text-[10px] text-[#DA291C] font-black">{r.cost} pts</small>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRedeemReward(r)}
                          disabled={!canAfford}
                          className={`px-3 py-1.5 rounded-xl font-black text-[10px] transition-all cursor-pointer ${
                            canAfford
                              ? 'bg-[#DA291C] text-white hover:bg-[#A8180D] active:scale-95'
                              : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                          }`}
                        >
                          Canjear
                        </button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Screen 6: PROMOS */}
            {currentScreen === 'promos' && (
              <>
                <p className="text-xs font-black text-[#5A3E24] uppercase tracking-wider">Promociones activas</p>
                {[
                  { emoji: '🎉', title: '2x1 en Conos de Helado', desc: 'Canjea en mostrador o en Auto-Mac toda esta semana.' },
                  { emoji: '🎡', title: 'Gira la Ruleta Diaria', desc: 'Consigue cupones de hasta 20% de descuento en combos.' },
                  { emoji: '🍔', title: 'Combo Familiar Especial', desc: '2 Dobles con Queso + 2 Papas medianas + 2 Bebidas.' },
                ].map((promo, i) => (
                  <div key={i} className="bg-white rounded-2xl p-3 flex items-start gap-3 shadow-xs border border-neutral-100">
                    <span className="text-2xl mt-0.5">{promo.emoji}</span>
                    <div>
                      <strong className="block text-xs font-black text-[#2B1B0E]">{promo.title}</strong>
                      <p className="text-[10px] text-[#5A3E24] leading-relaxed mt-0.5">{promo.desc}</p>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Sticky Cart Bar inside screens when items exist and not on checkout */}
            {cartTotalCount > 0 && currentScreen !== 'checkout' && (
              <div
                onClick={() => setCurrentScreen('checkout')}
                className="sticky bottom-0 mt-auto bg-[#2B1B0E] text-white rounded-2xl p-3 flex items-center justify-between shadow-lg cursor-pointer hover:bg-[#3A2616] transition-colors shrink-0"
              >
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="bg-[#DA291C] text-white px-2 py-0.5 rounded-full font-black text-[10px]">
                    {cartTotalCount}
                  </span>
                  <span>Ver mi pedido</span>
                </div>
                <span className="bg-[#FFC72C] text-[#2B1B0E] px-3 py-1 rounded-xl text-xs font-black">
                  Continuar →
                </span>
              </div>
            )}
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-[#2B1B0E] text-white text-[11px] font-bold px-4 py-2 rounded-full shadow-lg border border-[#FFC72C] animate-pop z-40 whitespace-nowrap">
              {toastMessage}
            </div>
          )}

          {/* Bottom App Navigation Bar */}
          <nav className="bg-white border-t border-[#EADFCE] flex items-center justify-around py-1.5 px-2 shrink-0">
            {[
              { screen: 'home', label: 'Inicio', icon: '🏠' },
              { screen: 'menu', label: 'Menú', icon: '📋' },
              { screen: 'points', label: 'McPoints', icon: '⭐' },
              { screen: 'orders', label: 'Pedidos', icon: '🧾' },
              { screen: 'promos', label: 'Promos', icon: '🏷️' },
            ].map(tab => (
              <button
                key={tab.screen}
                onClick={() => setCurrentScreen(tab.screen)}
                className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                  currentScreen === tab.screen ? 'text-[#DA291C] scale-105 font-black' : 'text-[#B9A88F] hover:text-[#5A3E24]'
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};
