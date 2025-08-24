import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface OrderbookEntry {
  price: number;
  quantity: number;
  total: number;
}

const Orderbook = () => {
  const [bids, setBids] = useState<OrderbookEntry[]>([]);
  const [asks, setAsks] = useState<OrderbookEntry[]>([]);
  const [currentPrice, setCurrentPrice] = useState(105.50);
  const [priceChange, setPriceChange] = useState(0);

  // Generate mock orderbook data
  const generateOrderbookData = (basePrice: number) => {
    const newBids: OrderbookEntry[] = [];
    const newAsks: OrderbookEntry[] = [];

    // Generate bids (buy orders) - below current price
    for (let i = 0; i < 10; i++) {
      const price = basePrice - (i + 1) * 0.25;
      const quantity = Math.floor(Math.random() * 50) + 5;
      newBids.push({
        price,
        quantity,
        total: price * quantity
      });
    }

    // Generate asks (sell orders) - above current price  
    for (let i = 0; i < 10; i++) {
      const price = basePrice + (i + 1) * 0.25;
      const quantity = Math.floor(Math.random() * 50) + 5;
      newAsks.push({
        price,
        quantity,
        total: price * quantity
      });
    }

    setBids(newBids);
    setAsks(newAsks);
  };

  // Mock real-time updates
  useEffect(() => {
    generateOrderbookData(currentPrice);

    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        const change = (Math.random() - 0.5) * 2;
        const newPrice = Math.max(90, Math.min(120, prev + change));
        setPriceChange(newPrice - prev);
        generateOrderbookData(newPrice);
        return newPrice;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentPrice]);

  const maxBidQuantity = Math.max(...bids.map(b => b.quantity));
  const maxAskQuantity = Math.max(...asks.map(a => a.quantity));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orderbook</h1>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-lg px-4 py-2">
            <div className="flex items-center space-x-2">
              <span>MOCK-FUTURE</span>
              <span className={priceChange >= 0 ? 'text-success' : 'text-sell'}>
                ${currentPrice.toFixed(2)}
              </span>
              {priceChange >= 0 ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-sell" />
              )}
            </div>
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
            <div className="text-sm text-muted-foreground mb-2">Current Market Price</div>
            <div className={`text-4xl font-bold ${priceChange >= 0 ? 'text-success' : 'text-sell'}`}>
              ${currentPrice.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              {priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)} (
              {((priceChange / (currentPrice - priceChange)) * 100).toFixed(2)}%)
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Orderbook;