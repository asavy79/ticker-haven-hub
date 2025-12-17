import axiosInstance from "@/lib/api";
import {
    AccountDTO,
    TradeDTO,
    OrderDTO,
    PositionDTO,
    TradesResult,
    OrdersResult,
    PositionsResult,
    AdminStats,
    MemberWithStats,
    AdminFilters,
    CancelOrderResponse
} from "@/types/admin";

export class AdminService {
    // Get all accounts (members)
    static async getAllAccounts(filters?: AdminFilters): Promise<AccountDTO[]> {
        const params = new URLSearchParams();
        if (filters?.role) params.append('role', filters.role);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.page_size) params.append('page_size', filters.page_size.toString());

        const response = await axiosInstance.get(`/api/v1/accounts?${params.toString()}`);
        return response.data;
    }

    // Get specific account by ID
    static async getAccount(accountId: number): Promise<AccountDTO> {
        const response = await axiosInstance.get(`/api/v1/accounts/${accountId}`);
        return response.data;
    }

    // Get all trades (for admin overview)
    static async getAllTrades(filters?: AdminFilters): Promise<TradeDTO[]> {
        const params = new URLSearchParams();
        if (filters?.symbol) params.append('symbol', filters.symbol);
        if (filters?.after) params.append('after', filters.after);
        if (filters?.before) params.append('before', filters.before);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.page_size) params.append('page_size', filters.page_size.toString());

        const response = await axiosInstance.get(`/api/v1/trades?${params.toString()}`);
        return response.data;
    }

    // Get trades for specific account
    static async getAccountTrades(accountId: number, filters?: AdminFilters): Promise<TradesResult> {
        const params = new URLSearchParams();
        if (filters?.symbol) params.append('symbol', filters.symbol);
        if (filters?.after) params.append('after', filters.after);
        if (filters?.before) params.append('before', filters.before);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.page_size) params.append('page_size', filters.page_size.toString());

        const response = await axiosInstance.get(`/api/v1/accounts/${accountId}/trades?${params.toString()}`);
        return response.data;
    }

    // Get orders for specific account
    static async getAccountOrders(accountId: number, filters?: AdminFilters): Promise<OrdersResult> {
        const params = new URLSearchParams();
        if (filters?.symbol) params.append('symbol', filters.symbol);
        if (filters?.after) params.append('after', filters.after);
        if (filters?.before) params.append('before', filters.before);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.page_size) params.append('page_size', filters.page_size.toString());

        const response = await axiosInstance.get(`/api/v1/accounts/${accountId}/orders?${params.toString()}`);
        return response.data;
    }

    // Get positions for specific account
    static async getAccountPositions(accountId: number, filters?: AdminFilters): Promise<PositionsResult> {
        const params = new URLSearchParams();
        if (filters?.symbol) params.append('symbol', filters.symbol);
        if (filters?.after) params.append('after', filters.after);
        if (filters?.before) params.append('before', filters.before);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.page_size) params.append('page_size', filters.page_size.toString());

        const response = await axiosInstance.get(`/api/v1/accounts/${accountId}/positions?${params.toString()}`);
        return response.data;
    }

    // Get admin dashboard statistics
    static async getAdminStats(): Promise<AdminStats> {
        try {
            const [accounts, trades] = await Promise.all([
                this.getAllAccounts(),
                this.getAllTrades()
            ]);

            // Calculate stats from the data
            const totalMembers = accounts.length;
            const totalTrades = trades.length;
            const activeTraders = accounts.filter(account =>
                account.last_login_at &&
                new Date(account.last_login_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Active in last 30 days
            ).length;

            // Calculate total credits issued (sum of all balances)
            const totalCreditsIssued = accounts.reduce((sum, account) => sum + account.balance, 0);

            return {
                totalMembers,
                totalTrades,
                activeTraders,
                totalCreditsIssued
            };
        } catch (error) {
            console.error('Error fetching admin stats:', error);
            throw error;
        }
    }

    // Get members with trading statistics
    static async getMembersWithStats(): Promise<MemberWithStats[]> {
        try {
            const accounts = await this.getAllAccounts();
            console.log(accounts)

            // For each account, get their trading stats
            const membersWithStats = await Promise.all(
                accounts.map(async (account) => {
                    try {


                        // Only return basic account info, no expensive trading stats
                        return {
                            ...account,
                            totalTrades: 0,
                            totalOrders: 0,
                            totalPnL: 0,
                            activeCash: account.balance
                        };
                    } catch (error) {
                        console.error(`Error fetching stats for account ${account.id}:`, error);
                        // Return account with default stats if individual fetch fails
                        return {
                            ...account,
                            totalTrades: 0,
                            totalOrders: 0,
                            totalPnL: 0,
                            activeCash: account.balance
                        };
                    }
                })
            );

            return membersWithStats;
        } catch (error) {
            console.error('Error fetching members with stats:', error);
            throw error;
        }
    }

    // Update account balance (admin only)
    static async updateAccountBalance(accountId: number, balance: number): Promise<AccountDTO> {
        const response = await axiosInstance.put(`/api/v1/accounts/${accountId}/balance`, {
            balance
        });
        return response.data;
    }

    // Update account role (admin only)
    static async updateAccountRole(accountId: number, role: string): Promise<AccountDTO> {
        const response = await axiosInstance.patch(`/api/v1/accounts/${accountId}/role`, {
            role
        });
        return response.data;
    }

    // Cancel an order
    static async cancelOrder(orderId: string): Promise<CancelOrderResponse> {
        const response = await axiosInstance.post(`/api/v1/orders/${orderId}/cancel`);
        return response.data;
    }
}
