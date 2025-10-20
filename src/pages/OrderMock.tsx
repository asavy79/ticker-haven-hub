import OrderBookConnection from "@/services/sockets/orderSubscription";
import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Clock, 
  DollarSign,
  ArrowUpCircle,
  ArrowDownCircle
} from "lucide-react";

export interface OrderbookEntry {
  id: string;
  price: number;
  quantity: number;
  total: number;
  type: string;
  timestamp: string;
}

const connectionConfig = {
  url: "ws://localhost:8765",
  params: "",
};

const OrderMock = () => {
  const [buyOrders, setBuyOrders] = useState<OrderbookEntry[]>([]);
  const [sellOrders, setSellOrders] = useState<OrderbookEntry[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [newOrderIds, setNewOrderIds] = useState<Set<string>>(new Set());

  const addOrder = (o: OrderbookEntry) => {
    console.log("INSIDE ADD ORDER FUNCTION");
    setLastUpdate(new Date());
    setNewOrderIds(prev => new Set(prev).add(o.id));
    
    // Remove the highlight after 3 seconds
    setTimeout(() => {
      setNewOrderIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(o.id);
        return newSet;
      });
    }, 3000);

    if (o.type === "Buy") {
      setBuyOrders((p) => [o, ...p].slice(0, 50)); // Keep only latest 50 orders
    } else {
      setSellOrders((p) => [o, ...p].slice(0, 50)); // Keep only latest 50 orders
    }
  };

  const setOrders = (snapshot: OrderbookEntry[]) => {
    console.log("INSIDE SET ORDERS FUNCTION!");
    setLastUpdate(new Date());
    const sells = snapshot.filter((o) => o.type === "Sell");
    const buys = snapshot.filter((o) => o.type === "Buy");

    setBuyOrders(buys.slice(0, 50));
    setSellOrders(sells.slice(0, 50));
  };

  const handlersRef = useRef({ addOrder, setOrders });
  handlersRef.current = { addOrder, setOrders };

  useEffect(() => {
    setConnectionStatus('connecting');
    const conn = new OrderBookConnection(
      connectionConfig,
      {
        addOrder: (o) => {
          handlersRef.current.addOrder(o);
        },
        setOrders: (orders) => {
          handlersRef.current.setOrders(orders);
        },
      },
      "QNTX"
    );
    
    conn.openConnection();
    setConnectionStatus('connected');
    
    return () => {
      console.log("Unsubscribing");
      setConnectionStatus('disconnected');
      conn.unsubscribe();
    };
  }, []);

  const formatPrice = (price: number | undefined | null) => {
    if (price == null || isNaN(price)) return '$0.00';
    return `$${price.toFixed(2)}`;
  };
  
  const formatQuantity = (quantity: number | undefined | null) => {
    if (quantity == null || isNaN(quantity)) return '0';
    return quantity.toLocaleString();
  };
  
  const formatTotal = (total: number | undefined | null) => {
    if (total == null || isNaN(total)) return '$0.00';
    return `$${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
  const formatTime = (timestamp: string | undefined | null) => {
    try {
      if (!timestamp) return new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
      return new Date(timestamp).toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
    } catch {
      return new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
    }
  };

  const OrderRow = ({ order, isNew }: { order: OrderbookEntry; isNew: boolean }) => {
    // Safety check to ensure order exists and has required properties
    if (!order || !order.id) {
      return null;
    }

    return (
      <div 
        className={`grid grid-cols-4 gap-3 py-3 px-4 rounded-lg transition-all duration-500 ${
          isNew 
            ? 'bg-primary/20 border border-primary/30 shadow-sm animate-pulse' 
            : 'hover:bg-muted/50'
        }`}
      >
        <div className={`font-semibold ${order.type === 'Buy' ? 'text-success' : 'text-sell'}`}>
          {formatPrice(order.price)}
        </div>
        <div className="text-right font-medium">
          {formatQuantity(order.quantity)}
        </div>
        <div className="text-right">
          {formatTotal(order.total)}
        </div>
        <div className="text-right text-xs text-muted-foreground flex items-center justify-end">
          <Clock className="h-3 w-3 mr-1" />
          {formatTime(order.timestamp)}
        </div>
      </div>
    );
  };

  const ConnectionStatusBadge = () => {
    const statusConfig = {
      connecting: { color: 'bg-warning', text: 'Connecting...', icon: Activity },
      connected: { color: 'bg-success', text: 'Live', icon: Activity },
      disconnected: { color: 'bg-sell', text: 'Disconnected', icon: Activity }
    };
    
    const config = statusConfig[connectionStatus];
    const Icon = config.icon;
    
    return (
      <Badge variant="outline" className={`${config.color}/10 border-${config.color}/20`}>
        <Icon className={`h-3 w-3 mr-1 ${config.color.replace('bg-', 'text-')}`} />
        {config.text}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Live Order Feed</h1>
          <p className="text-muted-foreground">Real-time order updates for QNTX</p>
        </div>
        <div className="flex items-center space-x-4">
          <ConnectionStatusBadge />
          <Badge variant="outline" className="text-sm">
            <DollarSign className="h-3 w-3 mr-1" />
            QNTX
          </Badge>
          <div className="text-right text-sm text-muted-foreground">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Last Update: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ArrowUpCircle className="h-4 w-4 text-success" />
              <div>
                <p className="text-sm font-medium text-success">Buy Orders</p>
                <p className="text-2xl font-bold">{buyOrders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ArrowDownCircle className="h-4 w-4 text-sell" />
              <div>
                <p className="text-sm font-medium text-sell">Sell Orders</p>
                <p className="text-2xl font-bold">{sellOrders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Total Volume</p>
                <p className="text-2xl font-bold">
                  {formatQuantity([...buyOrders, ...sellOrders].reduce((sum, order) => {
                    const quantity = order?.quantity || 0;
                    return sum + (isNaN(quantity) ? 0 : quantity);
                  }, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Total Value</p>
                <p className="text-2xl font-bold">
                  {formatTotal([...buyOrders, ...sellOrders].reduce((sum, order) => {
                    const total = order?.total || 0;
                    return sum + (isNaN(total) ? 0 : total);
                  }, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Buy Orders */}
        <Card className="border-success/20">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <ArrowUpCircle className="h-5 w-5 text-success" />
              <span className="text-success">Buy Orders</span>
              <Badge variant="outline" className="ml-auto bg-success/10 text-success border-success/20">
                {buyOrders.length} orders
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Header */}
            <div className="grid grid-cols-4 gap-3 px-4 py-3 border-b bg-muted/30 text-sm font-medium text-muted-foreground">
              <div>Price</div>
              <div className="text-right">Quantity</div>
              <div className="text-right">Total</div>
              <div className="text-right">Time</div>
            </div>
            
            {/* Orders List */}
            <ScrollArea className="h-[400px]">
              <div className="space-y-1 p-2">
                {buyOrders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No buy orders yet</p>
                    <p className="text-sm">Waiting for live data...</p>
                  </div>
                ) : (
                  buyOrders
                    .filter(order => order && order.id)
                    .map((order) => (
                      <OrderRow 
                        key={order.id} 
                        order={order} 
                        isNew={newOrderIds.has(order.id)} 
                      />
                    ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Sell Orders */}
        <Card className="border-sell/20">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <ArrowDownCircle className="h-5 w-5 text-sell" />
              <span className="text-sell">Sell Orders</span>
              <Badge variant="outline" className="ml-auto bg-sell/10 text-sell border-sell/20">
                {sellOrders.length} orders
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Header */}
            <div className="grid grid-cols-4 gap-3 px-4 py-3 border-b bg-muted/30 text-sm font-medium text-muted-foreground">
              <div>Price</div>
              <div className="text-right">Quantity</div>
              <div className="text-right">Total</div>
              <div className="text-right">Time</div>
            </div>
            
            {/* Orders List */}
            <ScrollArea className="h-[400px]">
              <div className="space-y-1 p-2">
                {sellOrders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No sell orders yet</p>
                    <p className="text-sm">Waiting for live data...</p>
                  </div>
                ) : (
                  sellOrders
                    .filter(order => order && order.id)
                    .map((order) => (
                      <OrderRow 
                        key={order.id} 
                        order={order} 
                        isNew={newOrderIds.has(order.id)} 
                      />
                    ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Footer Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                Buy Orders: {buyOrders.length}
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-sell rounded-full mr-2"></div>
                Sell Orders: {sellOrders.length}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="h-3 w-3" />
              <span>Live updates every few seconds</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderMock;
