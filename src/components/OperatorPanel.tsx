import React, { useState, useEffect } from 'react';
import { ActiveOrder } from '../types';
import { CATALOG } from '../data/menuData';
import {
  X,
  Search,
  Clock,
  User,
  ShoppingBag,
  CheckCircle2,
  ChefHat,
  PackageCheck,
  RefreshCw,
  Plus,
  Filter,
  Check,
  Flame,
  AlertCircle
} from 'lucide-react';

interface OperatorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  orders: ActiveOrder[];
  onUpdateOrderStatus: (orderId: string, newStatus: ActiveOrder['status']) => void;
  onAddNewOrder: (order: ActiveOrder) => void;
  onResetOrders?: () => void;
}

export const OperatorPanel: React.FC<OperatorPanelProps> = ({
  isOpen,
  onClose,
  orders,
  onUpdateOrderStatus,
  onAddNewOrder,
  onResetOrders,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  // New Order Form state
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newPickupTime, setNewPickupTime] = useState('1:30 pm');
  const [newOrderType, setNewOrderType] = useState<'App Móvil' | 'Mostrador' | 'Auto-Mac'>('Mostrador');
  const [newOrderNotes, setNewOrderNotes] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<Record<string, number>>({
    doble: 1,
    papas: 1,
    bebida: 1,
  });

  // Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleStatusChange = (orderId: string, status: ActiveOrder['status']) => {
    onUpdateOrderStatus(orderId, status);
    const statusLabels: Record<ActiveOrder['status'], string> = {
      recibido: 'Recibido',
      preparacion: 'En preparación',
      listo: 'Listo para entrega',
      entregado: 'Entregado',
    };
    triggerToast(`Pedido ${orderId} marcado como "${statusLabels[status]}"`);
  };

  const handleCreateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = newCustomerName.trim() || 'Cliente Mostrador';
    const items = Object.entries(selectedProductIds)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const item = CATALOG.find(p => p.id === id);
        return {
          id,
          name: item ? item.name : 'Producto Arcos Dorados',
          image: item ? item.image : `/images/products/${id}.jpg`,
          emoji: item ? item.emoji : '🍔',
          tier: item ? item.tier : '$$',
          price: item ? item.price : 5.0,
          qty,
        };
      });

    if (items.length === 0) {
      triggerToast('Selecciona al menos un producto');
      return;
    }

    const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);

    const newOrder: ActiveOrder = {
      id: 'DOR-' + Math.random().toString(36).slice(2, 6).toUpperCase(),
      customerName: customer,
      items,
      pickupTime: newPickupTime,
      status: 'recibido',
      createdAt: Date.now(),
      orderType: newOrderType,
      notes: newOrderNotes.trim() || undefined,
      totalAmount: total,
    };

    onAddNewOrder(newOrder);
    setIsNewOrderModalOpen(false);
    setNewCustomerName('');
    setNewOrderNotes('');
    triggerToast(`¡Pedido ${newOrder.id} creado para ${customer}!`);
  };

  // Filtered orders
  const filteredOrders = orders.filter(order => {
    // Status filter
    if (filterStatus !== 'todos' && order.status !== filterStatus) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchCustomer = (order.customerName || '').toLowerCase().includes(q);
      const matchItems = order.items.some(it => it.name.toLowerCase().includes(q));
      return matchId || matchCustomer || matchItems;
    }

    return true;
  });

  // KPI counts
  const totalCount = orders.length;
  const recibidoCount = orders.filter(o => o.status === 'recibido').length;
  const preparacionCount = orders.filter(o => o.status === 'preparacion').length;
  const listoCount = orders.filter(o => o.status === 'listo').length;
  const entregadoCount = orders.filter(o => o.status === 'entregado').length;

  if (!isOpen) return null;

  return (
    <div
      id="operatorPanelOverlay"
      className="fixed inset-0 z-50 bg-[#2B1B0E]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="operatorPanelContainer"
        className="bg-[#FFF8ED] w-full max-w-6xl max-h-[92vh] rounded-[28px] shadow-2xl border-3 border-[#FFC72C] flex flex-col overflow-hidden relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#2B1B0E] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#FFC72C] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#DA291C] flex items-center justify-center text-xl shadow-xs">
              <ChefHat className="w-6 h-6 text-[#FFC72C]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="operatorPanelHeading" className="text-xl sm:text-2xl font-black text-[#FFC72C] tracking-tight">
                  Panel del operador
                </h2>
                <span className="hidden sm:inline-block bg-[#DA291C] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Cocina & Despacho
                </span>
              </div>
              <p className="text-xs text-[#D9C7B3]">
                Visualiza, controla y actualiza en tiempo real los pedidos de mostrador y app
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Live Clock */}
            <div className="hidden md:flex items-center gap-1.5 bg-[#3A2616] px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono font-bold text-[#FFC72C]">
              <Clock className="w-3.5 h-3.5 text-[#FFC72C]" />
              <span>{currentTime}</span>
            </div>

            {/* Quick Action: New Order */}
            <button
              id="btnOperatorNewOrder"
              onClick={() => setIsNewOrderModalOpen(true)}
              className="bg-[#FFC72C] text-[#2B1B0E] hover:bg-[#FFE28A] px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 text-[#2B1B0E]" />
              <span>Nuevo pedido</span>
            </button>

            {/* Reset Demo Data */}
            {onResetOrders && (
              <button
                onClick={onResetOrders}
                title="Reiniciar pedidos de demostración"
                className="bg-white/10 hover:bg-white/20 text-[#D9C7B3] hover:text-white p-2 rounded-xl text-xs flex items-center transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}

            {/* Close Button */}
            <button
              id="btnOperatorClose"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#DA291C] text-white flex items-center justify-center transition-colors cursor-pointer ml-1"
              aria-label="Cerrar panel del operador"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Metrics Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 p-4 bg-white border-b border-[#EADFCE] shrink-0">
          <div
            onClick={() => setFilterStatus('todos')}
            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              filterStatus === 'todos' ? 'bg-[#FFF8ED] border-[#2B1B0E] shadow-xs' : 'bg-neutral-50/70 border-neutral-200 hover:bg-[#FFF8ED]/50'
            }`}
          >
            <div>
              <span className="text-[11px] font-bold text-[#5A3E24] uppercase block">Total</span>
              <strong className="text-xl font-black text-[#2B1B0E]">{totalCount}</strong>
            </div>
            <ShoppingBag className="w-5 h-5 text-[#2B1B0E]/60" />
          </div>

          <div
            onClick={() => setFilterStatus('recibido')}
            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              filterStatus === 'recibido' ? 'bg-[#FEF3C7] border-[#D97706] shadow-xs' : 'bg-neutral-50/70 border-neutral-200 hover:bg-[#FEF3C7]/40'
            }`}
          >
            <div>
              <span className="text-[11px] font-bold text-[#B45309] uppercase block">Recibidos</span>
              <strong className="text-xl font-black text-[#B45309]">{recibidoCount}</strong>
            </div>
            <AlertCircle className="w-5 h-5 text-[#D97706]" />
          </div>

          <div
            onClick={() => setFilterStatus('preparacion')}
            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              filterStatus === 'preparacion' ? 'bg-[#FFEDD5] border-[#EA580C] shadow-xs' : 'bg-neutral-50/70 border-neutral-200 hover:bg-[#FFEDD5]/40'
            }`}
          >
            <div>
              <span className="text-[11px] font-bold text-[#EA580C] uppercase block">En Cocina</span>
              <strong className="text-xl font-black text-[#EA580C]">{preparacionCount}</strong>
            </div>
            <Flame className="w-5 h-5 text-[#EA580C] animate-pulse" />
          </div>

          <div
            onClick={() => setFilterStatus('listo')}
            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              filterStatus === 'listo' ? 'bg-[#DCFCE7] border-[#16A34A] shadow-xs' : 'bg-neutral-50/70 border-neutral-200 hover:bg-[#DCFCE7]/40'
            }`}
          >
            <div>
              <span className="text-[11px] font-bold text-[#15803D] uppercase block">Listos</span>
              <strong className="text-xl font-black text-[#15803D]">{listoCount}</strong>
            </div>
            <PackageCheck className="w-5 h-5 text-[#16A34A]" />
          </div>

          <div
            onClick={() => setFilterStatus('entregado')}
            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between col-span-2 sm:col-span-1 ${
              filterStatus === 'entregado' ? 'bg-[#F3F4F6] border-[#4B5563] shadow-xs' : 'bg-neutral-50/70 border-neutral-200 hover:bg-neutral-100'
            }`}
          >
            <div>
              <span className="text-[11px] font-bold text-[#4B5563] uppercase block">Entregados</span>
              <strong className="text-xl font-black text-[#4B5563]">{entregadoCount}</strong>
            </div>
            <CheckCircle2 className="w-5 h-5 text-[#4B5563]" />
          </div>
        </div>

        {/* Toolbar: Search & Filters */}
        <div className="p-4 bg-[#FFF8ED] border-b border-[#EADFCE] flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
            <span className="text-xs font-bold text-[#5A3E24] flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" />
              Filtrar:
            </span>
            {[
              { key: 'todos', label: 'Todos', count: totalCount },
              { key: 'recibido', label: 'Recibidos', count: recibidoCount },
              { key: 'preparacion', label: 'En preparación', count: preparacionCount },
              { key: 'listo', label: 'Listos', count: listoCount },
              { key: 'entregado', label: 'Entregados', count: entregadoCount },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilterStatus(tab.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  filterStatus === tab.key
                    ? 'bg-[#DA291C] text-white shadow-xs'
                    : 'bg-white text-[#5A3E24] hover:bg-[#FFE28A]/40 border border-neutral-200'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    filterStatus === tab.key ? 'bg-white/20 text-white' : 'bg-neutral-100 text-[#5A3E24]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#5A3E24]/60 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="operatorSearchInput"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar por cliente, pedido o producto..."
              className="w-full bg-white border border-neutral-200 rounded-full pl-9 pr-8 py-1.5 text-xs text-[#2B1B0E] outline-none focus:border-[#DA291C] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Orders List / Table Container */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#FFF8ED]">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center flex flex-col items-center justify-center border border-neutral-200">
              <ShoppingBag className="w-12 h-12 text-neutral-300 mb-3" />
              <strong className="text-base font-black text-[#2B1B0E] mb-1">
                No hay pedidos en esta categoría
              </strong>
              <p className="text-xs text-[#5A3E24] max-w-sm mb-4">
                {searchQuery
                  ? 'No se encontraron resultados para tu búsqueda. Intenta con otro término.'
                  : 'No hay pedidos activos que coincidan con el filtro seleccionado.'}
              </p>
              <button
                onClick={() => {
                  setFilterStatus('todos');
                  setSearchQuery('');
                }}
                className="text-xs font-bold text-[#DA291C] underline cursor-pointer"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {/* Responsive Desktop Table */}
              <div className="hidden lg:block bg-white rounded-2xl shadow-xs border border-neutral-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#2B1B0E] text-[#FFC72C] text-[11px] font-black uppercase tracking-wider">
                      <th className="py-3 px-4">Pedido / Canal</th>
                      <th className="py-3 px-4">Nombre del cliente</th>
                      <th className="py-3 px-4">Hora de entrega</th>
                      <th className="py-3 px-4">Productos a entregar</th>
                      <th className="py-3 px-4">Estado actual</th>
                      <th className="py-3 px-4 text-center">Cambiar estado del pedido</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-xs text-[#2B1B0E]">
                    {filteredOrders.map(order => (
                      <tr
                        key={order.id}
                        className={`hover:bg-[#FFF8ED]/60 transition-colors ${
                          order.status === 'listo'
                            ? 'bg-emerald-50/40'
                            : order.status === 'preparacion'
                            ? 'bg-orange-50/30'
                            : ''
                        }`}
                      >
                        {/* Order ID & Type */}
                        <td className="py-3.5 px-4 font-mono font-black">
                          <span className="text-[#DA291C] font-black text-sm block">{order.id}</span>
                          <span className="inline-block mt-0.5 text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#FFF8ED] text-[#5A3E24] border border-[#2B1B0E]/10">
                            {order.orderType || 'App Móvil'}
                          </span>
                        </td>

                        {/* Customer Name */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#FFC72C]/30 text-[#2B1B0E] flex items-center justify-center font-black text-xs shrink-0">
                              <User className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <strong className="block font-black text-sm text-[#2B1B0E]">
                                {order.customerName || 'Cliente Arcos'}
                              </strong>
                              {order.notes && (
                                <span className="text-[10px] text-amber-700 italic block mt-0.5">
                                  Nota: "{order.notes}"
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Pickup / Delivery Time */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 font-bold text-[#5A3E24]">
                            <Clock className="w-4 h-4 text-[#DA291C] shrink-0" />
                            <span className="text-xs font-black">{order.pickupTime}</span>
                          </div>
                        </td>

                        {/* Products to deliver */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="flex flex-col gap-1.5">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-[11px]">
                                <div className="w-7 h-7 rounded-md overflow-hidden shrink-0 bg-white border border-neutral-100 p-0.5 flex items-center justify-center">
                                  <img
                                    src={item.image || `/images/products/${item.id}.jpg`}
                                    alt={item.name}
                                    className="w-full h-full object-contain"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <span className="font-extrabold text-[#2B1B0E]">{item.qty}x</span>
                                <span className="truncate text-[#5A3E24] font-medium">{item.name}</span>
                              </div>
                            ))}
                            {order.totalAmount && (
                              <span className="text-[10px] font-black text-[#DA291C] mt-0.5">
                                Total: ${order.totalAmount.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Current Status Badge */}
                        <td className="py-3.5 px-4">
                          {order.status === 'recibido' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-100 text-amber-800 border border-amber-300">
                              <AlertCircle className="w-3 h-3" />
                              Recibido
                            </span>
                          )}
                          {order.status === 'preparacion' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-orange-100 text-orange-800 border border-orange-300 animate-pulse">
                              <Flame className="w-3 h-3 text-orange-600" />
                              En preparación
                            </span>
                          )}
                          {order.status === 'listo' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <PackageCheck className="w-3 h-3 text-emerald-600" />
                              Listo
                            </span>
                          )}
                          {order.status === 'entregado' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-neutral-100 text-neutral-600 border border-neutral-300">
                              <CheckCircle2 className="w-3 h-3" />
                              Entregado
                            </span>
                          )}
                        </td>

                        {/* Status Action Buttons */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Botón: En preparación */}
                            <button
                              id={`btn-prep-${order.id}`}
                              onClick={() => handleStatusChange(order.id, 'preparacion')}
                              className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1 shadow-2xs ${
                                order.status === 'preparacion'
                                  ? 'bg-orange-600 text-white ring-2 ring-orange-400 font-black'
                                  : 'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100'
                              }`}
                              title="Marcar pedido en preparación en cocina"
                            >
                              <Flame className="w-3 h-3" />
                              <span>En preparación</span>
                            </button>

                            {/* Botón: Listo */}
                            <button
                              id={`btn-listo-${order.id}`}
                              onClick={() => handleStatusChange(order.id, 'listo')}
                              className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1 shadow-2xs ${
                                order.status === 'listo'
                                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 font-black'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              }`}
                              title="Marcar pedido listo para entrega"
                            >
                              <PackageCheck className="w-3 h-3" />
                              <span>Listo</span>
                            </button>

                            {/* Botón: Entregado */}
                            <button
                              id={`btn-entregado-${order.id}`}
                              onClick={() => handleStatusChange(order.id, 'entregado')}
                              className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1 shadow-2xs ${
                                order.status === 'entregado'
                                  ? 'bg-neutral-800 text-white ring-2 ring-neutral-500 font-black'
                                  : 'bg-neutral-100 text-neutral-700 border border-neutral-300 hover:bg-neutral-200'
                              }`}
                              title="Marcar pedido entregado al cliente"
                            >
                              <Check className="w-3 h-3" />
                              <span>Entregado</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile / Tablet Cards View */}
              <div className="lg:hidden flex flex-col gap-3">
                {filteredOrders.map(order => (
                  <div
                    key={order.id}
                    className={`bg-white rounded-2xl p-4 shadow-xs border transition-all ${
                      order.status === 'listo'
                        ? 'border-emerald-300 bg-emerald-50/30'
                        : order.status === 'preparacion'
                        ? 'border-orange-300 bg-orange-50/20'
                        : 'border-neutral-200'
                    }`}
                  >
                    {/* Header of Card */}
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5 mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-[#DA291C]">
                          {order.id}
                        </span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#FFF8ED] text-[#5A3E24] border border-[#2B1B0E]/10">
                          {order.orderType || 'App Móvil'}
                        </span>
                      </div>

                      {/* Status pill */}
                      {order.status === 'recibido' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800">
                          Recibido
                        </span>
                      )}
                      {order.status === 'preparacion' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-orange-100 text-orange-800 animate-pulse">
                          En preparación
                        </span>
                      )}
                      {order.status === 'listo' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                          Listo
                        </span>
                      )}
                      {order.status === 'entregado' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-neutral-100 text-neutral-600">
                          Entregado
                        </span>
                      )}
                    </div>

                    {/* Customer & Time */}
                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                      <div>
                        <span className="text-[10px] text-[#5A3E24] font-bold block uppercase">Cliente</span>
                        <strong className="text-sm font-black text-[#2B1B0E] block">
                          {order.customerName || 'Cliente Arcos'}
                        </strong>
                        {order.notes && (
                          <span className="text-[10px] text-amber-700 italic block mt-0.5">
                            "{order.notes}"
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="text-[10px] text-[#5A3E24] font-bold block uppercase">Hora de entrega</span>
                        <div className="flex items-center gap-1 font-black text-sm text-[#DA291C] mt-0.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{order.pickupTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Products */}
                    <div className="bg-[#FFF8ED] rounded-xl p-2.5 mb-3 text-xs border border-[#EADFCE]">
                      <span className="text-[10px] font-black text-[#5A3E24] uppercase block mb-1">
                        Productos a entregar:
                      </span>
                      <div className="flex flex-col gap-1.5">
                        {order.items.map((it, i) => (
                          <div key={i} className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-7 h-7 rounded-md overflow-hidden shrink-0 bg-white border border-neutral-100 p-0.5 flex items-center justify-center">
                                <img
                                  src={it.image || `/images/products/${it.id}.jpg`}
                                  alt={it.name}
                                  className="w-full h-full object-contain"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <span className="font-semibold text-[#2B1B0E] truncate">
                                {it.name} <b className="text-[#DA291C] font-black">x{it.qty}</b>
                              </span>
                            </div>
                            <span className="font-bold text-[#5A3E24] shrink-0 ml-2">
                              ${(it.price * it.qty).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                      {order.totalAmount && (
                        <div className="border-t border-neutral-200 mt-1.5 pt-1 flex justify-between font-black text-xs">
                          <span>Total</span>
                          <span className="text-[#DA291C]">${order.totalAmount.toFixed(2)}</span>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        onClick={() => handleStatusChange(order.id, 'preparacion')}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                          order.status === 'preparacion'
                            ? 'bg-orange-600 text-white font-black'
                            : 'bg-orange-50 text-orange-800 border border-orange-200'
                        }`}
                      >
                        <Flame className="w-3.5 h-3.5" />
                        <span>En preparación</span>
                      </button>

                      <button
                        onClick={() => handleStatusChange(order.id, 'listo')}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                          order.status === 'listo'
                            ? 'bg-emerald-600 text-white font-black'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        <PackageCheck className="w-3.5 h-3.5" />
                        <span>Listo</span>
                      </button>

                      <button
                        onClick={() => handleStatusChange(order.id, 'entregado')}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                          order.status === 'entregado'
                            ? 'bg-neutral-800 text-white font-black'
                            : 'bg-neutral-100 text-neutral-700 border border-neutral-300'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Entregado</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info strip */}
        <div className="bg-white border-t border-[#EADFCE] px-6 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#5A3E24] shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-bold">Sistema de Cocina Arcos Dorados en línea</span>
          </div>
          <span className="font-semibold text-[11px] text-neutral-400">
            Mostrando {filteredOrders.length} de {totalCount} pedidos registrados
          </span>
        </div>

        {/* Toast Feedback */}
        {toastMessage && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-[#2B1B0E] text-[#FFC72C] text-xs font-black px-5 py-2.5 rounded-full shadow-2xl border-2 border-[#FFC72C] z-50 animate-pop whitespace-nowrap">
            {toastMessage}
          </div>
        )}
      </div>

      {/* Modal: Registrar Nuevo Pedido Manual */}
      {isNewOrderModalOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsNewOrderModalOpen(false)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border-3 border-[#FFC72C] flex flex-col gap-4 text-[#2B1B0E]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#DA291C]" />
                <h3 className="font-black text-lg text-[#2B1B0E]">Registrar nuevo pedido</h3>
              </div>
              <button
                onClick={() => setIsNewOrderModalOpen(false)}
                className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOrderSubmit} className="flex flex-col gap-3.5 text-xs">
              <div>
                <label className="font-extrabold text-[#5A3E24] block mb-1">Nombre del cliente:</label>
                <input
                  type="text"
                  required
                  value={newCustomerName}
                  onChange={e => setNewCustomerName(e.target.value)}
                  placeholder="Ej. Valentina Morales"
                  className="w-full bg-[#FFF8ED] border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-[#2B1B0E] outline-none focus:border-[#DA291C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-[#5A3E24] block mb-1">Hora de entrega:</label>
                  <input
                    type="text"
                    required
                    value={newPickupTime}
                    onChange={e => setNewPickupTime(e.target.value)}
                    placeholder="Ej. 1:45 pm"
                    className="w-full bg-[#FFF8ED] border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-[#2B1B0E] outline-none focus:border-[#DA291C]"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-[#5A3E24] block mb-1">Canal de atención:</label>
                  <select
                    value={newOrderType}
                    onChange={e => setNewOrderType(e.target.value as any)}
                    className="w-full bg-[#FFF8ED] border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-[#2B1B0E] outline-none focus:border-[#DA291C]"
                  >
                    <option value="Mostrador">Mostrador</option>
                    <option value="Auto-Mac">Auto-Mac</option>
                    <option value="App Móvil">App Móvil</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-extrabold text-[#5A3E24] block mb-1">Productos a incluir:</label>
                <div className="max-h-40 overflow-y-auto border border-neutral-200 rounded-2xl p-2 bg-[#FFF8ED]/50 flex flex-col gap-1.5 custom-scrollbar">
                  {CATALOG.map(p => {
                    const qty = selectedProductIds[p.id] || 0;
                    return (
                      <div key={p.id} className="flex items-center justify-between bg-white px-3 py-1.5 rounded-xl border border-neutral-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-md overflow-hidden shrink-0 bg-white border border-neutral-100 p-0.5 flex items-center justify-center">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-full h-full object-contain"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <span className="font-medium text-xs">
                            {p.name} <b className="text-[#DA291C]">(${p.price.toFixed(2)})</b>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const next = Math.max(0, qty - 1);
                              setSelectedProductIds(prev => ({ ...prev, [p.id]: next }));
                            }}
                            className="w-5 h-5 rounded-full bg-[#FFC72C] text-[#2B1B0E] font-black flex items-center justify-center text-xs cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-4 text-center font-black text-xs">{qty}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedProductIds(prev => ({ ...prev, [p.id]: qty + 1 }));
                            }}
                            className="w-5 h-5 rounded-full bg-[#DA291C] text-white font-black flex items-center justify-center text-xs cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="font-extrabold text-[#5A3E24] block mb-1">Notas especiales (opcional):</label>
                <input
                  type="text"
                  value={newOrderNotes}
                  onChange={e => setNewOrderNotes(e.target.value)}
                  placeholder="Ej. Sin hielo en la bebida, extra servilletas"
                  className="w-full bg-[#FFF8ED] border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-[#2B1B0E] outline-none focus:border-[#DA291C]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-neutral-100 mt-1">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-neutral-600 hover:bg-neutral-100 font-bold text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#DA291C] hover:bg-[#C22317] text-white font-black text-xs cursor-pointer shadow-sm"
                >
                  Crear pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
