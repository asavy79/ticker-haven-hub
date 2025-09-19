import SocketConnection from "./socketSubscription"
import { ConnectionConfig } from "./socketSubscription";
import { Order } from "@/types/contracts";

interface SubscriptionPayload {
    subscription: string;
    type: string;
    ticker: string;
}

interface OrderSnapshotResponse {
    type: "snapshot";
    orders: Order[];
    timestamp: string;
}

interface OrderUpdateResponse {
    type: "update";
    order: Order;
    timestamp: string;
}

interface uiFunctions {
    addOrder: (newOrder: Order) => void;
    setOrders: (orders: Order[]) => void;
}


class OrderBookConnection extends SocketConnection {


    protected addOrder: (newOrder: Order) => void;
    protected setOrders: (orders: Order[]) => void;
    protected isLoaded: boolean;
    protected ticker: string;
    protected initialDataLoaded: boolean;



    constructor(config: ConnectionConfig, updateFunctions: uiFunctions, ticker: string) {
        super(config);

        // component functions passed in to update the ui
        this.addOrder = updateFunctions.addOrder;
        this.setOrders = updateFunctions.setOrders;

        this.isLoaded = false;
        this.ticker = ticker;
        this.initialDataLoaded = false;
    }

    public openConnection() {
        this.connect()

        this.ws.addEventListener("open", () => {
            this.getInitialData();
            this.isLoaded = true;
        })

        this.ws.addEventListener("message", (event) => {
            const data = event.data;

            this.messageHandler(JSON.parse(data));
        })

        // might be useful for something later
        this.ws.addEventListener("close", () => {
            return;
        })

        this.ws.addEventListener(("error"), (error) => {
            console.log(error);
        })

    }

    public messageHandler(data: OrderUpdateResponse | OrderSnapshotResponse) {
        switch(data.type) {
            case "snapshot":
                this.setOrders(data.orders);
                break;
            case "update":
                this.addOrder(data.order);
                break; 
            default:
                break;
        }
    }

    public unsubscribe() {

        try {
        const closingPayload: SubscriptionPayload = {
            type: "orders",
            subscription: "close",
            ticker: this.ticker,

        }
        this.ws.send(JSON.stringify(closingPayload));
    } catch(error) {
        this.ws.close();
    }
    }

    private getInitialData() {
        const snapshotPayload: SubscriptionPayload = {
            type: "orders",
            subscription: "snapshot",
            ticker: this.ticker,
        }
        this.ws.send(JSON.stringify(snapshotPayload));
    }
}

export default OrderBookConnection;