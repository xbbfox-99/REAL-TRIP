export interface Tag {
  type: 'price' | 'booking' | 'food' | 'menu' | 'buy' | 'sight';
  text: string;
  color?: string;
}

export interface ItineraryItem {
  time?: string;
  type: 'sight' | 'food' | 'transit' | 'hotel' | 'misc';
  icon: string;
  title: string;
  body?: string;
  tags?: Tag[];
  map?: string;
  guide?: string;
}

export interface Day {
  label: string;
  title: string;
  loc: string;
  lat: number;
  lon: number;
  items: ItineraryItem[];
}

export type CurrencyType = 'JPY' | 'TWD' | 'KRW';

export interface Expense {
  id: string | number;
  member: number;
  name: string;
  store?: string;
  amount: number;
  preTaxAmount?: number;
  currency: CurrencyType;
  category: string;
  date: string;
  tripId?: string;
  items?: { name: string; translatedName?: string; price: number }[];
  order?: number;
}

export interface SplitExpense {
  id: string | number;
  name: string;
  amount: number;
  currency: CurrencyType;
  payer: string;
  participants: string[];
  date: string;
  tripId?: string;
  order?: number;
}

export interface FlightInfo {
  date: string;
  from: string;
  fromName: string;
  to: string;
  toName: string;
  depTime: string;
  arrTime: string;
  note: string;
  back?: boolean;
}

export interface HotelInfo {
  name: string;
  dates: string;
  price?: string;
  note: string;
  link?: string;
}

export interface BookingInfo {
  category: string;
  name: string;
  time: string;
  bookedBy: string;
}

export interface EmergencyInfo {
  label: string;
  number: string;
  colSpan?: boolean;
}

export interface TravelTip {
  title: string;
  content: string;
  tag?: string;
}

export interface TripConfig {
  id: string; // 'osaka' | 'jeju'
  name: string; // '大阪・京都' | '濟州島'
  country: string; // '日本' | '韓國'
  flag: string; // '🇯🇵' | '🇰🇷'
  cityEn: string; // 'OSAKA' | 'JEJU'
  year: string; // '2026'
  dateRange: string; // '5月03日 — 5月09日' | '10月15日 — 10月20日'
  durationLabel: string; // '7 天' | '6 天'
  tagSeason: string; // '春季版' | '海島版'
  bgCode: string; // 'JP' | 'JEJU'
  themeColor: string; // '#A6301A' (Osaka) | '#E0571B' (Jeju citrus)
  headerGradient: string; // custom gradient
  currency: 'JPY' | 'KRW';
  currencySymbol: string; // '¥' | '₩'
  exchangeRate: number; // rate to TWD
  members: string[];
  memberColors: string[];
  categories: string[];
  days: Day[];
  info: {
    flights: FlightInfo[];
    hotels: HotelInfo[];
    bookings: BookingInfo[];
    emergencies: EmergencyInfo[];
    tips?: TravelTip[];
  };
}

