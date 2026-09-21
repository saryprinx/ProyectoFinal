import { ActiveOrder } from '../types';

export const INITIAL_ORDERS: ActiveOrder[] = [
  {
    id: 'DOR-8219',
    customerName: 'Sofía Valenzuela',
    items: [
      { id: 'doble', name: 'Doble con Queso', image: '/images/products/doble.jpg', emoji: '🍔', tier: '$$', price: 6.90, qty: 1 },
      { id: 'papas', name: 'Papas Doradas', image: '/images/products/papas.jpg', emoji: '🍟', tier: '$', price: 2.80, qty: 1 },
      { id: 'bebida', name: 'Combo Refrescante', image: '/images/products/bebida.jpg', emoji: '🥤', tier: '$', price: 2.50, qty: 1 },
    ],
    pickupTime: '1:15 pm',
    status: 'recibido',
    createdAt: Date.now() - 1000 * 60 * 8, // 8 mins ago
    orderType: 'App Móvil',
    notes: 'Sin cebolla en la hamburguesa',
    totalAmount: 12.20,
  },
  {
    id: 'DOR-4902',
    customerName: 'Carlos Mendoza',
    items: [
      { id: 'doble', name: 'Doble con Queso', image: '/images/products/doble.jpg', emoji: '🍔', tier: '$$', price: 6.90, qty: 2 },
      { id: 'papas', name: 'Papas Doradas', image: '/images/products/papas.jpg', emoji: '🍟', tier: '$', price: 2.80, qty: 2 },
      { id: 'bebida', name: 'Combo Refrescante', image: '/images/products/bebida.jpg', emoji: '🥤', tier: '$', price: 2.50, qty: 2 },
      { id: 'helado', name: 'Cono de Vainilla', image: '/images/products/helado.jpg', emoji: '🍦', tier: '$', price: 1.50, qty: 1 },
    ],
    pickupTime: '1:30 pm',
    status: 'preparacion',
    createdAt: Date.now() - 1000 * 60 * 16, // 16 mins ago
    orderType: 'Mostrador',
    notes: 'Papas bien doradas',
    totalAmount: 25.90,
  },
  {
    id: 'DOR-3288',
    customerName: 'Lucía Arismendi',
    items: [
      { id: 'nuggets', name: 'McNuggets Dorados', image: '/images/products/nuggets.jpg', emoji: '🍗', tier: '$$', price: 4.90, qty: 2 },
      { id: 'bebida', name: 'Combo Refrescante', image: '/images/products/bebida.jpg', emoji: '🥤', tier: '$', price: 2.50, qty: 1 },
      { id: 'postre', name: 'Postre del Día', image: '/images/products/postre.jpg', emoji: '🍰', tier: '$$', price: 3.50, qty: 1 },
    ],
    pickupTime: '12:45 pm',
    status: 'listo',
    createdAt: Date.now() - 1000 * 60 * 25, // 25 mins ago
    orderType: 'Auto-Mac',
    notes: 'Salsa barbacoa extra',
    totalAmount: 15.80,
  },
  {
    id: 'DOR-1944',
    customerName: 'Mateo Quiroga',
    items: [
      { id: 'pollo', name: 'Pollo Crocante', image: '/images/products/pollo.jpg', emoji: '🍗', tier: '$$', price: 5.50, qty: 1 },
      { id: 'papas', name: 'Papas Doradas', image: '/images/products/papas.jpg', emoji: '🍟', tier: '$', price: 2.80, qty: 1 },
      { id: 'bebida', name: 'Combo Refrescante', image: '/images/products/bebida.jpg', emoji: '🥤', tier: '$', price: 2.50, qty: 1 },
    ],
    pickupTime: '12:30 pm',
    status: 'entregado',
    createdAt: Date.now() - 1000 * 60 * 45, // 45 mins ago
    finishedAt: Date.now() - 1000 * 60 * 15,
    orderType: 'Mostrador',
    totalAmount: 10.80,
  },
  {
    id: 'DOR-5521',
    customerName: 'Camila Navarro',
    items: [
      { id: 'cafe', name: 'Café Dorado', image: '/images/products/cafe.jpg', emoji: '☕', tier: '$', price: 1.80, qty: 2 },
      { id: 'postre', name: 'Postre del Día', image: '/images/products/postre.jpg', emoji: '🍰', tier: '$$', price: 3.50, qty: 1 },
    ],
    pickupTime: '2:00 pm',
    status: 'recibido',
    createdAt: Date.now() - 1000 * 60 * 3, // 3 mins ago
    orderType: 'App Móvil',
    notes: 'Café con leche de avena si está disponible',
    totalAmount: 7.10,
  },
];

export const ORDERS_STORAGE_KEY = 'doradosOperatorOrdersList';

export function getStoredOrders(): ActiveOrder[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to read orders from localStorage', err);
  }
  return INITIAL_ORDERS;
}

export function saveOrders(orders: ActiveOrder[]): void {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    // Trigger custom event so other components in the same window update in real-time
    window.dispatchEvent(new Event('dorados_orders_updated'));
  } catch (err) {
    console.error('Failed to save orders to localStorage', err);
  }
}
