import SocketConnection from "./socketSubscription"
import { ConnectionConfig } from "./socketSubscription";
import { Order } from "@/types/contracts";

interface SubscriptionPayload {
    subscription: string;
    type: string;
    ticker: string;
}

interface OrderSnapshotResponse {
    type: "batch";
    orders: OrderbookEntry[];
    timestamp: string;
}

interface OrderUpdateResponse {
    type: "update";
    order: OrderbookEntry;
    timestamp: string;
}

interface OrderbookEntry {
    id: string;
    price: number;
    quantity: number;
    total: number;
    type: string;
    timestamp: string;
  }

interface uiFunctions {
    addOrder: (newOrder: OrderbookEntry) => void;
    setOrders: (orders: OrderbookEntry[]) => void;
}


export class OrderBookConnection extends SocketConnection {


    protected addOrder: (newOrder: OrderbookEntry) => void;
    protected setOrders: (orders: OrderbookEntry[]) => void;
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

    public messageHandler(data: OrderUpdateResponse | OrderSnapshotResponse) {

        switch(data.type) {
            case "batch":
                console.log(data.orders);
                this.uiFunctions.setOrders(data.orders);
                this.initialDataLoaded = true;
                break;
            case "update":
                if(this.initialDataLoaded) {
                    this.uiFunctions.addOrder(data.order);
                }
                break; 
            default:
                // something
                break;
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