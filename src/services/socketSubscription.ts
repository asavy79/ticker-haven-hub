interface BaseMessage {
    type: string;
    model: any;
    timestamp: string;
}

interface ConnectionConfig {
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

    abstract messageHandler(): void;


    public async connect() {
        if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
            return;
          }
        try {
            this.ws = new WebSocket(this.url);
        } catch(error) {
            console.error(error);
        }
    }

    private async subscribe(subscribePayload: BaseMessage) {
        this.ws.send(JSON.stringify(subscribePayload));
    }
    
    private async unsubscribe(payload: UnsubscribeMessage) {
        this.ws.send(JSON.stringify(payload));
    }


    private unsubscribePayload(): UnsubscribeMessage {
        return {
            type: "unsubscribe",
            model: {
                channel: this.channel,
                url: this.url,
            },
            timestamp: (new Date()).toISOString(),
        }
    }


    public async disconnect() {
        if(!this.ws) {
            return;
        }
        else {
            const payload = this.unsubscribePayload()
            this.unsubscribe(payload)
        }
    }

}