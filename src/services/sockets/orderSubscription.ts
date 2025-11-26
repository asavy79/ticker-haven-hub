import SocketConnection from "./socketSubscription"
import { ConnectionConfig } from "./socketSubscription";
import { Order } from "@/types/contracts";
import { getFirebaseToken } from "@/services/auth";

interface SubscriptionPayload {
    subscription: string;
    type: string;
    ticker: string;
}

// New interface for the incoming data format
interface OrderbookData {
    bids: [number, number][]; // Array of [price, quantity] tuples
    asks: [number, number][]; // Array of [price, quantity] tuples
    total_bids: number; // Total volume of all bids
    total_asks: number; // Total volume of all asks
    price: number; // Current market price estimate
}

interface OrderSnapshotResponse {
    type: "batch";
    orders: OrderbookEntry[] | OrderbookData;
    last_trade?: number;
    timestamp?: string;
    price?: number;
}

interface OrderUpdateResponse {
    type: "update";
    order: OrderbookEntry;
    timestamp: string;
}

interface ErrorResponse {
    type: "error";
    error_message: string;
    error: string;
}

interface OrderSuccessResponse {
    type: "order_success";
    message: string;
}

interface OrderbookEntry {
    id: string;
    price: number;
    quantity: number;
    total: number;
    type: string;
    timestamp: string;
    ticker: string;
}

interface uiFunctions {
    addOrder: (newOrder: OrderbookEntry) => void;
    setOrders: (orders: OrderbookEntry[] | OrderbookData) => void;
    setError: (errorMessage: string) => void;
    setSuccess: (message: string) => void;
}


export class OrderBookConnection extends SocketConnection {

    protected addOrder: (newOrder: OrderbookEntry) => void;
    protected setOrders: (orders: OrderbookEntry[] | OrderbookData) => void;
    protected isLoaded: boolean;
    protected ticker: string;
    protected initialDataLoaded: boolean;
    protected uiFunctions: uiFunctions;



    constructor(config: ConnectionConfig, updateFunctions: uiFunctions, ticker: string) {
        super(config);



        // component functions passed in to update the ui
        this.addOrder = updateFunctions.addOrder;
        this.setOrders = updateFunctions.setOrders;
        this.uiFunctions = updateFunctions;


        this.isLoaded = false;
        this.ticker = ticker;
        this.initialDataLoaded = false;
    }

    public openConnection() {
        this.connect()

        this.ws.addEventListener("open", () => {
            // this.getInitialData();
            this.isLoaded = true;
        })

        this.ws.addEventListener("message", (event) => {
            const data = event.data;
            this.messageHandler(JSON.parse(data));
        })

        // might be useful for something later
        this.ws.addEventListener("close", () => {
            console.log("Connection has been closed!");
            return;
        })

        this.ws.addEventListener(("error"), (error) => {
            console.log(error);
        })

    }

    public messageHandler(data: OrderUpdateResponse | OrderSnapshotResponse | ErrorResponse | OrderSuccessResponse) {
        switch (data.type) {
            case "batch":
                this.uiFunctions.setOrders(data.orders);


                this.initialDataLoaded = true;
                break;
            case "update":
                if (this.initialDataLoaded) {
                    this.uiFunctions.addOrder(data.order);
                }
                break;
            case "error":
                this.uiFunctions.setError(data.error_message)
                break;
            case "order_success":
                this.uiFunctions.setSuccess(data.message)
                break;
            default:
                // something
                break;
        }
    }

    public async sendOrder(order: Omit<OrderbookEntry, "id" | "timestamp" | "total">) {
        try {
            const token = await getFirebaseToken();
            if (!token) {
                console.error("No token found!");
            }
            this.ws.send(JSON.stringify({ type: "order", order: order, token: token }));
        } catch (error) {
            console.error(error);
        }
    }

    public getUrl() {
        return `${this.url}/ws/${this.ticker}`
    }

}

export default OrderBookConnection;