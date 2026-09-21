export interface MenuItem {
  id: string;
  name: string;
  image: string;
  emoji: string;
  category: 'combos' | 'hamburguesas' | 'acompanamientos' | 'bebidas' | 'postres';
  tier: '$' | '$$' | '$$$';
  price: number;
  description: string;
  badge?: string;
  calories?: string;
}

export interface CartItem {
  id: string;
  name: string;
  image?: string;
  emoji: string;
  tier: string;
  price: number;
  qty: number;
}

export interface ActiveOrder {
  id: string;
  customerName?: string;
  items: CartItem[];
  pickupTime: string;
  status: 'recibido' | 'preparacion' | 'listo' | 'entregado';
  createdAt: number;
  finishedAt?: number;
  earnedPoints?: number;
  orderType?: 'App Móvil' | 'Mostrador' | 'Auto-Mac' | 'Delivery';
  notes?: string;
  totalAmount?: number;
}

export interface UserLevel {
  name: string;
  min: number;
}

export interface UserBadge {
  id: string;
  emoji: string;
  label: string;
  check: (state: { points: number; history: ActiveOrder[]; activeOrder: ActiveOrder | null }) => boolean;
}

export interface Reward {
  id: string;
  label: string;
  cost: number;
  emoji: string;
  image?: string;
}

export interface WheelPrize {
  label: string;
  weight: number;
  color: string;
  text: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}
