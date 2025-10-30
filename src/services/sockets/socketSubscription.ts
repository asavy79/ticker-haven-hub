interface BaseMessage {
    type: string;
    model: any;
    timestamp: string;
}

export interface ConnectionConfig {
    url: string;
    params: any
}

interface UnsubscribeMessage extends BaseMessage {
    type: "unsubscribe";
    model: {
        channel: string;
        url: string;
    }
}


abstract class SocketConnection {
    protected url: string;
    protected ws: WebSocket | null = null;
    protected isConnecting = false;
    protected channel: string;

    constructor(config: ConnectionConfig) {
        this.url = config.url;
    }

    abstract messageHandler(data: any): void;

    abstract openConnection(): void;

    abstract getUrl(): string;


    public unsubscribe() {
        try {
            this.ws.close();
        } catch(error) {
            console.log(error);
        }
    }

    public connect() {
        if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
            return;
          }
        try {
            const url = this.getUrl();
            this.ws = new WebSocket(url);
        } catch(error) {
            console.error(error);
        }
    }

    private async subscribe(subscribePayload: BaseMessage) {
        this.ws.send(JSON.stringify(subscribePayload));
    }
    



}

export default SocketConnection