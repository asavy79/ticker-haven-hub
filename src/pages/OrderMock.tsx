import OrderBookConnection from "@/services/sockets/orderSubscription";
import { useEffect, useState, useCallback, useMemo } from "react";

interface OrderbookEntry {
  id: string;
  price: number;
  quantity: number;
  total: number;
  type: string;
}

const connectionConfig = {
  url: "",
  params: "",
};

const OrderMock = () => {
  const [buyOrders, setBuyOrders] = useState<OrderbookEntry[]>([]);
  const [sellOrders, setSellOrders] = useState<OrderbookEntry[]>([]);

  const addOrder = useCallback((o: OrderbookEntry) => {
    if (o.type === "buy") setBuyOrders((p) => [...p, o]);
    else setSellOrders((p) => [...p, o]);
  }, []);

  const setOrders = useCallback((snapshot: OrderbookEntry[]) => {
    // replace state atomically, e.g., build fresh maps/arrays here
  }, []);

  const handlers = useMemo(
    () => ({ addOrder, setOrders }),
    [addOrder, setOrders]
  );

  useEffect(() => {
    const conn = new OrderBookConnection(
      { url: "", params: "" },
      handlers,
      "QNTX"
    );
    return () => conn.unsubscribe();
  }, [handlers]);

  return (
    <div>
      <div>
        <h1>Buy Orders</h1>
        {buyOrders.map((o) => {
          return (
            <div key={o.id}>
              {o.price} {o.quantity} {o.total}
            </div>
          );
        })}
      </div>
      <div>
        <h1>Sell Orders</h1>
        {sellOrders.map((o) => {
          return (
            <div key={o.id}>
              {o.price} {o.quantity} {o.total}
            </div>
          );
        })}
      </div>
    </div>
  );
};
