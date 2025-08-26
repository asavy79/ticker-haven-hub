import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Position {
  id: string;
  symbol: string;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  type: "long" | "short";
}

const Portfolio = () => {
  const [positions, setPositions] = useState<Position[]>([
    {
      id: "1",
      symbol: "MOCK-FUTURE",
      quantity: 10,
      entryPrice: 100,
      currentPrice: 105.5,
      pnl: 55,
      type: "long",
    },
    {
      id: "2",
      symbol: "MOCK-FUTURE",
      quantity: -5,
      entryPrice: 98,
      currentPrice: 105.5,
      pnl: -37.5,
      type: "short",
    },
  ]);

  const [currentPrice, setCurrentPrice] = useState(105.5);
  const [tradeForm, setTradeForm] = useState({
    type: "",
    quantity: "",
    price: "",
  });

  // Mock real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice((prev) => {
        const change = (Math.random() - 0.5) * 2; // Random price movement
        const newPrice = Math.max(90, Math.min(120, prev + change));

        // Update positions with new price
        setPositions((prevPositions) =>
          prevPositions.map((pos) => ({
            ...pos,
            currentPrice: newPrice,
            pnl:
              pos.type === "long"
                ? (newPrice - pos.entryPrice) * pos.quantity
                : (pos.entryPrice - newPrice) * Math.abs(pos.quantity),
          }))
        );

        return newPrice;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const totalPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0);
  const accountBalance = 10000; // Mock balance

  const handleTrade = () => {
    if (!tradeForm.type || !tradeForm.quantity || !tradeForm.price) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Trade Placed",
      description: `${tradeForm.type.toUpperCase()} ${
        tradeForm.quantity
      } units at $${tradeForm.price}`,
    });

    setTradeForm({ type: "", quantity: "", price: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Portfolio</h1>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-lg px-4 py-2">
            MOCK-FUTURE: ${currentPrice.toFixed(2)}
          </Badge>
        </div>
      </div>

      {/* Account Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Account Balance
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${accountBalance.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
            {totalPnL >= 0 ? (
              <TrendingUp className="h-4 w-4 text-success" />
            ) : (
              <TrendingDown className="h-4 w-4 text-sell" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                totalPnL >= 0 ? "text-success" : "text-sell"
              }`}
            >
              ${totalPnL.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Open Positions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{positions.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Positions */}
      <Card>
        <CardHeader>
          <CardTitle>Open Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {positions.map((position) => (
              <div
                key={position.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <Badge
                    variant={position.type === "long" ? "default" : "secondary"}
                  >
                    {position.type.toUpperCase()}
                  </Badge>
                  <div>
                    <div className="font-semibold">{position.symbol}</div>
                    <div className="text-sm text-muted-foreground">
                      Qty: {position.quantity} | Entry: ${position.entryPrice}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    ${position.currentPrice.toFixed(2)}
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      position.pnl >= 0 ? "text-success" : "text-sell"
                    }`}
                  >
                    {position.pnl >= 0 ? "+" : ""}${position.pnl.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trade Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Place Trade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trade-type">Type</Label>
              <Select
                value={tradeForm.type}
                onValueChange={(value) =>
                  setTradeForm((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Buy/Sell" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">Buy (Long)</SelectItem>
                  <SelectItem value="sell">Sell (Short)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="0"
                value={tradeForm.quantity}
                onChange={(e) =>
                  setTradeForm((prev) => ({
                    ...prev,
                    quantity: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                value={tradeForm.price}
                onChange={(e) =>
                  setTradeForm((prev) => ({ ...prev, price: e.target.value }))
                }
              />
            </div>

            <div className="flex items-end">
              <Button onClick={handleTrade} className="w-full">
                Place Trade
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Portfolio;
