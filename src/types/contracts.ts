export type IsoDateString = string;

export type OrderSide = 'buy' | 'sell';
export type OrderType = 'market' | 'limit';
export type OrderStatus = 'pending' | 'partial' | 'filled' | 'cancelled';

export type User = {
  id: number;
  username: string;
  email: string;
  balance: number;
  isAdmin: boolean;
  position?: string | null;
  createdAt: IsoDateString;
  lastLoginAt?: IsoDateString | null;
};

export type Order = {
  id: string; 
  userId: number;
  symbol: string;
  side: OrderSide;
  orderType: OrderType;
  quantity: number;
  price?: number | null;
  filledQuantity: number;
  status: OrderStatus;
  createdAt: IsoDateString;
  updatedAt?: IsoDateString | null;
};

export type Trade = {
  id: number;
  buyOrderId: string;
  sellOrderId: string;
  userId: number;
  symbol: string;
  quantity: number;
  price: number;
  tradeValue: number;
  timestamp: IsoDateString;
  createdAt: IsoDateString;
};

export type Position = {
  id: number;
  userId: number;
  symbol: string;
  quantity: number;
  averagePrice: number;
  unrealizedPnl: number;
  realizedPnl: number;
  updatedAt: IsoDateString;
};

export type MarketData = {
  id: number;
  symbol: string;
  lastPrice: number;
  bidPrice?: number | null;
  askPrice?: number | null;
  volume: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  timestamp: IsoDateString;
};

export type Meeting = {
  id: number;
  meetingDate: IsoDateString;
  overview: string | null;
};

export type AttendanceRecord = {
  id: number;
  userId: number;
  meetingId: number;
};

export type ContractSpec = {
  id: number;
  symbol: string;
  contractSize: number;
  tickSize: number;
  settlementDate?: IsoDateString | null;
  expiryDate?: IsoDateString | null;
  settlementPrice?: number | null;
  isActive: boolean;
  createdAt: IsoDateString;
};
