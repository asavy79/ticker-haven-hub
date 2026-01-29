import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  RefreshCw,
  X,
  Clock,
  AlertCircle,
} from "lucide-react";
import { AdminService } from "@/services/admin";
import { OrderDTO, OrderStatus } from "@/types/admin";
import { useFirebaseAuth } from "@/contexts/firebase-auth-context";
import OrderBookConnection from "@/services/sockets/orderSubscription";

export interface ActiveOrdersCardHandle {
  refresh: () => void;
  addOrder: (order: OrderDTO) => void;
  removeOrder: (orderId: string) => void;
}

interface ActiveOrdersCardProps {
  ticker: string;
  websocketRef?: React.MutableRefObject<OrderBookConnection | undefined>;
  onCancelSuccess?: (orderId: string) => void;
}

const ActiveOrdersCard = forwardRef<ActiveOrdersCardHandle, ActiveOrdersCardProps>(
  ({ ticker, websocketRef, onCancelSuccess }, ref) => {
    const [orders, setOrders] = useState<OrderDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

    const { user } = useFirebaseAuth();

    const fetchActiveOrders = useCallback(async () => {
      if (!user?.dbId) {
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch orders filtered by symbol, only PENDING and PARTIAL statuses
        const [pendingResult, partialResult] = await Promise.all([
          AdminService.getAccountOrders(user.dbId, {
            symbol: ticker,
            status: OrderStatus.PENDING,
            page_size: 50,
          }),
          AdminService.getAccountOrders(user.dbId, {
            symbol: ticker,
            status: OrderStatus.PARTIAL,
            page_size: 50,
          }),
        ]);

        // Combine and sort by created_at descending
        const combined = [...pendingResult.orders, ...partialResult.orders].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setOrders(combined);
      } catch (err: any) {
        console.error("Error fetching active orders:", err);
        setError("Failed to load active orders");
      } finally {
        setLoading(false);
      }
    }, [user?.dbId, ticker]);

    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
      refresh: fetchActiveOrders,
      addOrder: (order: OrderDTO) => {
        setOrders((prev) => [order, ...prev]);
      },
      removeOrder: (orderId: string) => {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      },
    }), [fetchActiveOrders]);

    useEffect(() => {
      fetchActiveOrders();
    }, [fetchActiveOrders]);

    const handleCancelOrder = async (orderId: string) => {
      if (!websocketRef?.current) {
        console.error("WebSocket not connected");
        return;
      }

      setCancellingOrderId(orderId);

      try {
        await websocketRef.current.cancelOrder(orderId);
        // The actual removal will happen when we receive order_cancel_success via websocket
        // But we can optimistically remove it here
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        onCancelSuccess?.(orderId);
      } catch (err) {
        console.error("Error cancelling order:", err);
      } finally {
        setCancellingOrderId(null);
      }
    };

    const formatPrice = (price: number) => `$${price.toFixed(2)}`;
    const formatTime = (timestamp: string) => {
      return new Date(timestamp).toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    if (loading && orders.length === 0) {
      return (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>My Active Orders</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>My Active Orders</span>
              <Badge variant="outline" className="ml-2">
                {ticker}
              </Badge>
              {orders.length > 0 && (
                <Badge variant="secondary">{orders.length}</Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchActiveOrders}
              disabled={loading}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm mb-3">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {orders.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No active orders for {ticker}</p>
            </div>
          ) : (
            <ScrollArea className="max-h-[300px]">
              <div className="space-y-2">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={order.side === "BUY" ? "default" : "secondary"}
                        className={
                          order.side === "BUY"
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-600 hover:bg-red-700 text-white"
                        }
                      >
                        {order.side}
                      </Badge>
                      <div className="text-sm">
                        <span className="font-medium">{order.remaining_quantity}</span>
                        <span className="text-muted-foreground"> / {order.quantity}</span>
                        <span className="mx-1">@</span>
                        <span className="font-medium">{formatPrice(order.price)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {order.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(order.created_at)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancellingOrderId === order.id}
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        {cancellingOrderId === order.id ? (
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <X className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    );
  }
);

ActiveOrdersCard.displayName = "ActiveOrdersCard";

export default ActiveOrdersCard;
