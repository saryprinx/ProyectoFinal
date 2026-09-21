import { MenuItem, WheelPrize, UserLevel, UserBadge, Reward } from '../types';

export const CATALOG: MenuItem[] = [
  {
    id: 'doble',
    name: 'Doble con Queso',
    image: '/images/products/doble.jpg',
    emoji: '🍔',
    category: 'hamburguesas',
    tier: '$$',
    price: 6.90,
    description: 'Dos carnes 100% de res, queso cheddar y nuestra salsa especial.',
    badge: 'Clásico',
    calories: '450 kcal'
  },
  {
    id: 'papas',
    name: 'Papas Doradas',
    image: '/images/products/papas.jpg',
    emoji: '🍟',
    category: 'acompanamientos',
    tier: '$',
    price: 2.80,
    description: 'Crujientes por fuera, suaves por dentro. El acompañante perfecto.',
    badge: 'Favorito',
    calories: '320 kcal'
  },
  {
    id: 'bebida',
    name: 'Combo Refrescante',
    image: '/images/products/bebida.jpg',
    emoji: '🥤',
    category: 'bebidas',
    tier: '$',
    price: 2.50,
    description: 'Bebida grande a elección con hielo bien picado.',
    badge: 'Nuevo',
    calories: '150 kcal'
  },
  {
    id: 'helado',
    name: 'Cono de Vainilla',
    image: '/images/products/helado.jpg',
    emoji: '🍦',
    category: 'postres',
    tier: '$',
    price: 1.50,
    description: 'Cremoso, suave y listo en segundos. El cierre ideal.',
    calories: '180 kcal'
  },
  {
    id: 'pollo',
    name: 'Pollo Crocante',
    image: '/images/products/pollo.jpg',
    emoji: '🥪',
    category: 'hamburguesas',
    tier: '$$',
    price: 6.50,
    description: 'Pechuga empanizada, lechuga fresca y mayo especial.',
    badge: 'Crujiente',
    calories: '420 kcal'
  },
  {
    id: 'postre',
    name: 'Postre del Día',
    image: '/images/products/postre.jpg',
    emoji: '🍰',
    category: 'postres',
    tier: '$$',
    price: 3.20,
    description: 'Nuestra selección dulce, ideal para cerrar el pedido.',
    badge: 'Especial',
    calories: '280 kcal'
  },
  {
    id: 'nuggets',
    name: 'McNuggets Dorados',
    image: '/images/products/nuggets.jpg',
    emoji: '🍗',
    category: 'combos',
    tier: '$$',
    price: 4.80,
    description: 'Piezas doradas y tiernas de pechuga con tus salsas favoritas.',
    badge: 'Promo',
    calories: '390 kcal'
  },
  {
    id: 'cafe',
    name: 'Café de la Mañana',
    image: '/images/products/cafe.jpg',
    emoji: '☕',
    category: 'bebidas',
    tier: '$',
    price: 1.90,
    description: 'Café aromático 100% arábica recién molido para recargar energías.',
    calories: '25 kcal'
  }
];

export const WHEEL_PRIZES: WheelPrize[] = [
  { label: '20% dcto', weight: 2, color: '#DA291C', text: '#FFFFFF' },
  { label: 'Papas gratis', weight: 3, color: '#FFC72C', text: '#2B1B0E' },
  { label: 'Sigue intentando', weight: 5, color: '#2B1B0E', text: '#FFC72C' },
  { label: 'Bebida gratis', weight: 3, color: '#DA291C', text: '#FFFFFF' },
  { label: 'Combo gratis', weight: 1, color: '#FFC72C', text: '#2B1B0E' },
  { label: '2x1 helado', weight: 3, color: '#2B1B0E', text: '#FFC72C' },
  { label: '10% dcto', weight: 3, color: '#DA291C', text: '#FFFFFF' },
  { label: 'Premio sorpresa', weight: 1, color: '#FFC72C', text: '#2B1B0E' },
];

export const USER_LEVELS: UserLevel[] = [
  { name: 'Nuevo', min: 0 },
  { name: 'Fan', min: 150 },
  { name: 'Súper Fan', min: 400 },
  { name: 'Leyenda', min: 800 },
];

export const USER_BADGES: UserBadge[] = [
  {
    id: 'first',
    emoji: '🍔',
    label: 'Primer pedido',
    check: s => s.history.length >= 1 || (s.activeOrder !== null)
  },
  {
    id: 'three',
    emoji: '⚡',
    label: '3 pedidos',
    check: s => s.history.length >= 3
  },
  {
    id: 'crown',
    emoji: '👑',
    label: 'Leyenda',
    check: s => s.points >= 800
  },
];

export const REWARDS_CATALOG: Reward[] = [
  { id: 'papas_free', label: 'Papas doradas gratis', cost: 80, emoji: '🍟', image: '/images/products/papas.jpg' },
  { id: 'bebida_free', label: 'Bebida mediana gratis', cost: 60, emoji: '🥤', image: '/images/products/bebida.jpg' },
  { id: 'dcto20', label: '20% de descuento en combo', cost: 150, emoji: '🏷️', image: '/images/products/combo.jpg' },
  { id: 'helado_free', label: 'Cono de vainilla suave', cost: 50, emoji: '🍦', image: '/images/products/helado.jpg' },
];

export const ASSISTANT_KNOWLEDGE = [
  {
    keywords: ['hola', 'buenas', 'hey', 'buenos dias', 'buenas tardes', 'buenas noches', 'hi'],
    reply: '¡Hola! 😊 Soy Dorado. Puedo ayudarte con el menú, precios, la ruleta de premios, horarios o promociones. ¿Qué necesitas?'
  },
  {
    keywords: ['menu', 'carta', 'que tienen', 'platos', 'comida', 'hamburguesa', 'burger'],
    reply: 'Nuestros favoritos son la Doble con Queso 🍔, Pollo Crocante 🥪, Papas Doradas 🍟, Combo Refrescante 🥤, Cono de Vainilla 🍦 y el Postre del Día 🍰. ¡Puedes verlos en la sección "Menú" o pedir directamente con el simulador!'
  },
  {
    keywords: ['precio', 'cuanto cuesta', 'vale', 'costo', 'cuesta'],
    reply: 'Los precios se muestran por nivel: "$" es económico (ej. Papas Doradas a $2.80) y "$$" es más completo (ej. Doble con Queso a $6.90). ¡Excelente calidad a precio justo!'
  },
  {
    keywords: ['ruleta', 'premio', 'premios', 'ganar', 'sorteo', 'descuento', 'cupon'],
    reply: 'La ruleta 🎡 está en la sección "Ruleta". Tienes 3 giros por día y puedes ganar descuentos, papas gratis, bebidas, combos y más. Si ganas, obtienes un código para canjear en caja dentro de 7 días.'
  },
  {
    keywords: ['horario', 'hora', 'abren', 'cierran', 'abierto', 'cerrado'],
    reply: 'Nuestros locales abren todos los días de 8:00 a.m. a 11:00 p.m. En sucursales seleccionadas tenemos servicio 24 horas y Auto-Mac activo. 🕗'
  },
  {
    keywords: ['ubicacion', 'direccion', 'local', 'sucursal', 'donde estan', 'cerca'],
    reply: 'Contamos con más de 38,000 locales en más de 100 países. Revisa la sección de locales al pie de página o indícanos tu zona para ayudarte.'
  },
  {
    keywords: ['promocion', 'oferta', 'app', 'descarga', 'combo'],
    reply: 'En la app exclusiva encuentras cupones nuevos cada semana y puedes juntar McPoints con cada compra para desbloquear combos a mitad de precio. 🎉'
  },
  {
    keywords: ['vegetariano', 'vegano', 'sin gluten', 'alergia', 'alergias', 'ingredientes'],
    reply: 'Contamos con opciones adaptadas y papas 100% vegetales. Siempre puedes personalizar tus ingredientes en cocina. Indícalo en caja para cualquier alergia alimentaria. 🥗'
  },
  {
    keywords: ['pedido', 'domicilio', 'delivery', 'envio', 'llevar', 'recoger'],
    reply: 'Puedes pedir para comer en el local, llevar o pedir por anticipado con hora programada. ¡Nuestro tiempo promedio de preparación es menor a 5 minutos! 🚀'
  },
  {
    keywords: ['gracias', 'genial', 'perfecto', 'excelente'],
    reply: '¡Con gusto! 😄 Si necesitas algo más del menú, la ruleta o las promociones, aquí estaré siempre listo.'
  },
  {
    keywords: ['chao', 'adios', 'nos vemos', 'bye'],
    reply: '¡Hasta pronto! Que disfrutes un día dorado con mucho sabor 🍔✨'
  }
];
