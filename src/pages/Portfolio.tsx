import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  X,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { AdminService } from "@/services/admin";
import {
  AccountDTO,
  TradeDTO,
  OrderDTO,
  PositionDTO,
  AccountRole,
  OrderStatus,
} from "@/types/admin";
import { useFirebaseAuth } from "@/contexts/firebase-auth-context";

const Portfolio = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

  // State for user data
  const [member, setMember] = useState<AccountDTO | null>(null);
  const [trades, setTrades] = useState<TradeDTO[]>([]);
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [positions, setPositions] = useState<PositionDTO[]>([]);
  
  const { user, isLoading: authLoading } = useFirebaseAuth();

  // Check if an order can be cancelled
  const isOrderCancellable = (status: string): boolean => {
    const normalizedStatus = status.toUpperCase();
    return normalizedStatus === OrderStatus.PENDING || normalizedStatus === OrderStatus.PARTIAL;
  };

  // Handle order cancellation
  const handleCancelOrder = async (orderId: string) => {
    setCancellingOrderId(orderId);
    
    try {
      const response = await AdminService.cancelOrder(orderId);
      
      if (response.success) {
        toast({
          title: "Order Cancelled",
          description: response.message,
        });
        
        // Update the order in the local state (use CANCELED - backend spelling)
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId
              ? { ...order, status: OrderStatus.CANCELED }
              : order
          )
        );
      }
    } catch (err: any) {
      console.error("Error cancelling order:", err);
      
      const errorMessage =
        err.response?.data?.detail?.error_message ||
        err.response?.data?.detail ||
        "Failed to cancel order. Please try again.";
      
      toast({
        title: "Cancel Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setCancellingOrderId(null);
    }
  };

  const fetchPortfolioData = async () => {
    if (!user?.dbId) {
      setError("User not authenticated or missing database ID");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const accountId = user.dbId;

      const [memberData, tradesData, ordersData, positionsData] =
        await Promise.all([
          AdminService.getAccount(accountId),
          AdminService.getAccountTrades(accountId, { page_size: 50 }),
          AdminService.getAccountOrders(accountId, { page_size: 50 }),
          AdminService.getAccountPositions(accountId, { page_size: 50 }),
        ]);

      console.log("Portfolio data:", { memberData, tradesData, ordersData, positionsData });

      setMember(memberData);
      setTrades(tradesData.trades);
      setOrders(ordersData.orders);
      setPositions(positionsData.positions);
    } catch (err: any) {
      console.error("Error fetching portfolio data:", err);
      if (err.response?.status === 404) {
        setError("Account not found");
      } else {
        setError("Failed to load portfolio data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && !authLoading) {
      fetchPortfolioData();
    }
  }, [user, authLoading]);

  const getRoleBadge = (role: AccountRole | string) => {
    // Handle both enum values and string values from backend
    const normalizedRole = typeof role === "string" ? role.toLowerCase() : role;

    const roleConfig: Record<
      string,
      { variant: "default" | "secondary" | "outline"; className: string }
    > = {
      [AccountRole.PRESIDENT]: {
        variant: "default",
        className: "bg-primary text-primary-foreground",
      },
      [AccountRole.VICE_PRESIDENT]: {
        variant: "secondary",
        className: "bg-secondary text-secondary-foreground",
      },
      [AccountRole.TREASURER]: {
        variant: "secondary",
        className: "bg-secondary text-secondary-foreground",
      },
      [AccountRole.ADMIN]: {
        variant: "outline",
        className: "border-primary text-primary",
      },
      [AccountRole.MODERATOR]: {
        variant: "outline",
        className: "border-orange-500 text-orange-600",
      },
      [AccountRole.OWNER]: {
        variant: "default",
        className: "bg-red-600 text-white",
      },
      [AccountRole.MEMBER]: { variant: "outline", className: "" },
      [AccountRole.USER]: { variant: "outline", className: "" },
    };

    const config = roleConfig[normalizedRole] || roleConfig[AccountRole.USER];

    // Display name mapping
    const displayNames: Record<string, string> = {
      user: "User",
      admin: "Admin",
      moderator: "Moderator",
      owner: "Owner",
      MEMBER: "Member",
      TREASURER: "Treasurer",
      VICE_PRESIDENT: "Vice President",
      PRESIDENT: "President",
    };

    const displayName =
      displayNames[normalizedRole] ||
      role
        .toString()
        .toLowerCase()
        .replace("_", " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

    return (
      <Badge variant={config.variant} className={config.className}>
        {displayName}
      </Badge>
    );
  };

  const isActive = (lastLogin: string | null) => {
    if (!lastLogin) return false;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return new Date(lastLogin) > thirtyDaysAgo;
  };

  const calculateTotalPnL = () => {
    return positions.reduce(
      (sum, position) =>
        sum + (position.realized_pnl || 0) + (position.unrealized_pnl || 0),
      0
    );
  };

  if (authLoading || loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Portfolio</h1>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button
              variant="link"
              className="p-0 h-auto ml-2"
              onClick={fetchPortfolioData}
            >
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold">My Portfolio</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPortfolioData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          {getRoleBadge(member.role)}
          {isActive(member.last_login_at) ? (
            <Badge
              variant="outline"
              className="border-green-500 text-green-600"
            >
              Active
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="border-muted text-muted-foreground"
            >
              Inactive
            </Badge>
          )}
        </div>
      </div>

      {/* Account Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Account Balance
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(member.balance || 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Available credits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                calculateTotalPnL() >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ${calculateTotalPnL().toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Realized + Unrealized
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Positions
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{positions.length}</div>
            <p className="text-xs text-muted-foreground">Open positions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trades.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Account ID: {member.id}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Username: {member.username}</span>
              </div>
              {member.last_login_at && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Last Login:{" "}
                    {new Date(member.last_login_at).toLocaleDateString()}
                  </span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span>Total Orders: {orders.length}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Positions */}
      <Card>
        <CardHeader>
          <CardTitle>Active Positions ({positions.length} total)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {positions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No active positions</p>
                <p className="text-sm">Start trading to see your positions here</p>
              </div>
            ) : (
              positions.map((position) => (
                <div
                  key={position.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline">Position</Badge>
                    <div>
                      <div className="font-medium">{position.symbol}</div>
                      <div className="text-sm text-muted-foreground">
                        Avg Price: ${(position.average_price || 0).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">Qty: {position.quantity}</div>
                    <div className="flex space-x-2 text-sm">
                      <span
                        className={`${
                          (position.realized_pnl || 0) >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        Realized: ${(position.realized_pnl || 0).toFixed(2)}
                      </span>
                      <span
                        className={`${
                          (position.unrealized_pnl || 0) >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        Unrealized: ${(position.unrealized_pnl || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Trade History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Trade History ({trades.length} total)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trades.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No trades yet</p>
                <p className="text-sm">Your trading history will appear here</p>
              </div>
            ) : (
              trades.slice(0, 10).map((trade) => (
                <div
                  key={trade.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <Badge variant="default">Trade</Badge>
                    <div>
                      <div className="font-medium">{trade.symbol}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(trade.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {trade.quantity} @ ${(trade.price || 0).toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Value: ${(trade.value || 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            )}
            {trades.length > 10 && (
              <div className="text-center text-sm text-muted-foreground">
                Showing 10 of {trades.length} trades
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders ({orders.length} total)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No orders yet</p>
                <p className="text-sm">Place your first order to get started</p>
              </div>
            ) : (
              orders.slice(0, 10).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <Badge
                      variant={order.side === "BUY" ? "default" : "secondary"}
                    >
                      {order.side}
                    </Badge>
                    <div>
                      <div className="font-medium">{order.symbol}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-medium">
                        {order.quantity} @ ${(order.price || 0).toFixed(2)}
                      </div>
                      <div className="flex items-center justify-end space-x-2">
                        <Badge
                          variant={
                            order.status.toUpperCase() === "FILLED"
                              ? "default"
                              : order.status.toUpperCase() === "CANCELLED" || order.status.toUpperCase() === "CANCELED"
                              ? "destructive"
                              : "outline"
                          }
                        >
                          {order.status}
                        </Badge>
                        {order.remaining_quantity > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {order.remaining_quantity} remaining
                          </span>
                        )}
                      </div>
                    </div>
                    {isOrderCancellable(order.status) && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancellingOrderId === order.id}
                      >
                        {cancellingOrderId === order.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
            {orders.length > 10 && (
              <div className="text-center text-sm text-muted-foreground">
                Showing 10 of {orders.length} orders
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Portfolio;