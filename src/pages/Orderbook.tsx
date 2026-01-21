import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import OrderBookConnection from "@/services/sockets/orderSubscription";
import { WS_URL } from "@/lib/api";

interface OrderbookEntry {
  price: number;
  quantity: number;
  total: number;
  type: string;
}

interface OrderbookData {
  bids: [number, number][];
  asks: [number, number][];
  total_bids: number;
  total_asks: number;
  price: number;
}

const Orderbook = () => {
  const [bids, setBids] = useState<OrderbookEntry[]>([]);
  const [asks, setAsks] = useState<OrderbookEntry[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState(0);
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Handle real orderbook data from websocket
  const setOrders = (orders: OrderbookEntry[] | OrderbookData) => {
    if (Array.isArray(orders)) {
      // Legacy format - shouldn't happen with new backend
      setBids(orders.filter(order => order.type === 'bid'));
      setAsks(orders.filter(order => order.type === 'ask'));
    } else {
      // New format from MarketDataSnapshot
      const newBids: OrderbookEntry[] = orders.bids.map(([price, quantity]) => ({
        price,
        quantity,
        total: price * quantity,
        type: 'bid',
      }));
      
      const newAsks: OrderbookEntry[] = orders.asks.map(([price, quantity]) => ({
        price,
        quantity,
        total: price * quantity,
        type: 'ask',
      }));
      
      setBids(newBids);
      setAsks(newAsks);
    }
  };

  const setPrice = (newPrice: number) => {
    if (currentPrice !== null) {
      setPreviousPrice(currentPrice);
      setPriceChange(newPrice - currentPrice);
    }
    console.log("Setting price to:", newPrice);
    setCurrentPrice(newPrice);
  };

  const addOrder = (order: OrderbookEntry) => {
    // Handle individual order updates if needed
  };

  const setError = (errorMessage: string) => {
    console.error("Orderbook error:", errorMessage);
    setIsConnected(false);
  };

  const setSuccess = (message: string) => {
    console.log("Orderbook success:", message);
  };

  // Real-time websocket connection
  useEffect(() => {
    const config = {
      url: WS_URL,
      params: "",
    };

    const bookSub = new OrderBookConnection(
      config,
      { 
        setOrders, 
        addOrder, 
        setError,
        setSuccess 
      },
      "QNTX"
    );

    // Open the websocket connection
    bookSub.openConnection();
    setIsConnected(true);

    // Cleanup on unmount
    return () => {
      setIsConnected(false);
      // Close websocket connection if the class has a close method
      bookSub.unsubscribe();
    };
  }, []); // Remove currentPrice dependency to avoid reconnecting

  const maxBidQuantity = Math.max(...bids.map((b) => b.quantity));
  const maxAskQuantity = Math.max(...asks.map((a) => a.quantity));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orderbook</h1>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-lg px-4 py-2">
            <div className="flex items-center space-x-2">
              <span>QNTX</span>
              {currentPrice !== null ? (
                <>
                  <span className={priceChange >= 0 ? "text-success" : "text-sell"}>
                    ${currentPrice.toFixed(2)}
                  </span>
                  {priceChange !== 0 && (
                    <>
                      {priceChange >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-success" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-sell" />
                      )}
                    </>
                  )}
                </>
              ) : (
                <span className="text-muted-foreground">Loading...</span>
              )}
            </div>
          </Badge>
          <Badge variant={isConnected ? "default" : "destructive"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asks (Sell Orders) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sell">Asks (Sell Orders)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="grid grid-cols-3 gap-4 pb-2 border-b text-sm font-medium text-muted-foreground">
                <div>Price</div>
                <div className="text-right">Quantity</div>
                <div className="text-right">Total</div>
              </div>
              {asks.map((ask, index) => (
                <div key={index} className="relative">
                  <div
                    className="absolute inset-0 bg-sell/10 rounded"
                    style={{
                      width: `${(ask.quantity / maxAskQuantity) * 100}%`,
                    }}
                  />
                  <div className="relative grid grid-cols-3 gap-4 py-2 text-sm">
                    <div className="font-medium text-sell">
                      ${ask.price.toFixed(2)}
                    </div>
                    <div className="text-right">{ask.quantity}</div>
                    <div className="text-right">${ask.total.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bids (Buy Orders) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-success">Bids (Buy Orders)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="grid grid-cols-3 gap-4 pb-2 border-b text-sm font-medium text-muted-foreground">
                <div>Price</div>
                <div className="text-right">Quantity</div>
                <div className="text-right">Total</div>
              </div>
              {bids.map((bid, index) => (
                <div key={index} className="relative">
                  <div
                    className="absolute inset-0 bg-success/10 rounded"
                    style={{
                      width: `${(bid.quantity / maxBidQuantity) * 100}%`,
                    }}
                  />
                  <div className="relative grid grid-cols-3 gap-4 py-2 text-sm">
                    <div className="font-medium text-success">
                      ${bid.price.toFixed(2)}
                    </div>
                    <div className="text-right">{bid.quantity}</div>
                    <div className="text-right">${bid.total.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Price */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">
              Current Market Price
            </div>
            {currentPrice !== null ? (
              <>
                <div
                  className={`text-4xl font-bold ${
                    priceChange >= 0 ? "text-success" : "text-sell"
                  }`}
                >
                  ${currentPrice.toFixed(2)}
                </div>
                {priceChange !== 0 && previousPrice !== null && (
                  <div className="text-sm text-muted-foreground mt-2">
                    {priceChange >= 0 ? "+" : ""}${priceChange.toFixed(2)} (
                    {((priceChange / previousPrice) * 100).toFixed(2)}%)
                  </div>
                )}
              </>
            ) : (
              <div className="text-4xl font-bold text-muted-foreground">
                Loading...
              </div>
            )}
            <div className="text-xs text-muted-foreground mt-2">
              {isConnected ? "Live Price" : "Disconnected"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Orderbook;
