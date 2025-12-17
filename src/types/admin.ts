// TypeScript interfaces matching backend DTOs for admin functionality

export enum AccountRole {
    MEMBER = "MEMBER",
    USER = "user", // Add support for backend's 'user' role
    ADMIN = "admin", // Backend uses lowercase 'admin'
    MODERATOR = "moderator", // Backend uses lowercase 'moderator'
    OWNER = "owner", // Backend uses lowercase 'owner'
    TREASURER = "TREASURER",
    VICE_PRESIDENT = "VICE_PRESIDENT",
    PRESIDENT = "PRESIDENT"
}

export enum OrderStatus {
    PENDING = "PENDING",
    PARTIAL = "PARTIAL",
    FILLED = "FILLED",
    CANCELLED = "CANCELLED",
    CANCELED = "CANCELED", // Backend uses 'canceled' spelling
    REJECTED = "REJECTED"
}

export enum OrderSide {
    BUY = "BUY",
    SELL = "SELL"
}

export enum OrderType {
    MARKET = "MARKET",
    LIMIT = "LIMIT"
}

export interface AccountDTO {
    id: number;
    username: string;
    balance: number;
    role: AccountRole;
    last_login_at: string | null;
    available_cash: number;
}

export interface OrderDTO {
    id: string;
    symbol: string;
    side: OrderSide;
    type: OrderType;
    quantity: number;
    price: number;
    status: OrderStatus;
    remaining_quantity: number;
    created_at: string;
    updated_at: string;
}

export interface TradeDTO {
    id: string;
    buy_order: OrderDTO;
    sell_order: OrderDTO;
    symbol: string;
    quantity: number;
    price: number;
    trade_value: number;
    created_at: string;
    buy_account_id: number;
    sell_account_id: number;

}

export interface PositionDTO {
    id: string;
    symbol: string;
    quantity: number;
    average_price: number;
    unrealized_pnl: number;
    realized_pnl: number;
    updated_at: string;
}

export interface PaginatedResult {
    page: number;
    page_size: number;
}

export interface OrdersResult extends PaginatedResult {
    orders: OrderDTO[];
}

export interface TradesResult extends PaginatedResult {
    trades: TradeDTO[];
}

export interface PositionsResult extends PaginatedResult {
    positions: PositionDTO[];
}

// Extended interfaces for admin dashboard
export interface AdminStats {
    totalMembers: number;
    totalTrades: number;
    activeTraders: number;
    totalCreditsIssued: number;
}

export interface MemberWithStats extends AccountDTO {
    totalTrades: number;
    totalOrders: number;
    totalPnL: number;
    activeCash: number;
}

export interface AdminFilters {
    page?: number;
    page_size?: number;
    role?: AccountRole;
    symbol?: string;
    after?: string;
    before?: string;
}

// Cancel order response
export interface CancelOrderResponse {
    success: boolean;
    message: string;
    order_id: string;
    ticker: string;
    status: OrderStatus;
}

export interface CancelOrderError {
    success: boolean;
    error_code: string;
    error_message: string;
    order_id: string;
}
