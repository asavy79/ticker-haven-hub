import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Copy, ChevronRight } from "lucide-react";

// ============================================================================
// Code Block Component with Copy Button
// ============================================================================

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

const CodeBlock = ({ code, language = "python", title }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-950 my-4">
      {title && (
        <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900 text-xs text-zinc-400 font-mono">
          {title}
        </div>
      )}
      <div className="relative">
        <pre className="p-4 overflow-x-auto text-sm">
          <code className={`language-${language} text-zinc-100`}>{code}</code>
        </pre>
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 hover:bg-zinc-700 text-zinc-400"
          onClick={copyToClipboard}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

// ============================================================================
// Inline Code Component
// ============================================================================

const InlineCode = ({ children }: { children: React.ReactNode }) => (
  <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-sm font-mono">
    {children}
  </code>
);

// ============================================================================
// Section Components
// ============================================================================

const SectionTitle = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h2 id={id} className="text-2xl font-bold mt-12 mb-4 scroll-mt-20 flex items-center gap-2">
    {children}
  </h2>
);

const SubsectionTitle = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h3 id={id} className="text-xl font-semibold mt-8 mb-3 scroll-mt-20">
    {children}
  </h3>
);

const Paragraph = ({ children }: { children: React.ReactNode }) => (
  <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
);

const MethodSignature = ({ children }: { children: React.ReactNode }) => (
  <div className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-4 py-3 rounded-lg mb-4 overflow-x-auto">
    {children}
  </div>
);

const ParamTable = ({ params }: { params: { name: string; type: string; description: string }[] }) => (
  <div className="overflow-x-auto mb-4">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-zinc-200 dark:border-zinc-800">
          <th className="text-left py-2 pr-4 font-medium">Parameter</th>
          <th className="text-left py-2 pr-4 font-medium">Type</th>
          <th className="text-left py-2 font-medium">Description</th>
        </tr>
      </thead>
      <tbody>
        {params.map((param) => (
          <tr key={param.name} className="border-b border-zinc-100 dark:border-zinc-800/50">
            <td className="py-2 pr-4 font-mono text-primary">{param.name}</td>
            <td className="py-2 pr-4 font-mono text-muted-foreground">{param.type}</td>
            <td className="py-2 text-muted-foreground">{param.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ============================================================================
// Sidebar Navigation
// ============================================================================

const sections = [
  { id: "getting-started", title: "Getting Started" },
  { id: "quick-start", title: "Quick Start" },
  { id: "client-reference", title: "Client Reference" },
  { id: "events", title: "Events" },
  { id: "models", title: "Models" },
  { id: "error-handling", title: "Error Handling" },
  { id: "examples", title: "Examples" },
];

const Sidebar = ({ activeSection }: { activeSection: string }) => (
  <nav className="hidden lg:block w-64 shrink-0">
    <div className="sticky top-24 space-y-1">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
        On this page
      </div>
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className={cn(
            "block py-1.5 px-3 rounded-md text-sm transition-colors",
            activeSection === section.id
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          {section.title}
        </a>
      ))}
    </div>
  </nav>
);

// ============================================================================
// Main Documentation Content
// ============================================================================

const ApiDocs = () => {
  const [activeSection, setActiveSection] = useState("getting-started");

  // Update active section on scroll (simplified)
  const handleScroll = () => {
    const scrollPosition = window.scrollY + 100;
    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) {
        const { offsetTop, offsetHeight } = element;
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveSection(section.id);
          break;
        }
      }
    }
  };

  // Attach scroll listener
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", handleScroll, { passive: true });
  }

  return (
    <div className="flex gap-10">
      <Sidebar activeSection={activeSection} />
      
      <main className="flex-1 min-w-0 max-w-3xl">
        {/* Header */}
        <div className="mb-10">
          <Badge variant="outline" className="mb-4">Python SDK</Badge>
          <h1 className="text-4xl font-bold mb-4">QuantX Client API</h1>
          <Paragraph>
            The QuantX Python SDK provides a simple, async interface for connecting to the 
            QuantX trading platform. Build trading bots, algorithmic strategies, or integrate 
            QuantX into your existing systems.
          </Paragraph>
        </div>

        {/* Getting Started */}
        <section id="getting-started">
          <SectionTitle id="getting-started-title">Getting Started</SectionTitle>
          
          <SubsectionTitle id="prerequisites">Prerequisites</SubsectionTitle>
          <Paragraph>
            Before using the QuantX client, you'll need:
          </Paragraph>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li>Python 3.8 or higher</li>
            <li>The <InlineCode>websockets</InlineCode> library</li>
            <li>A QuantX API key (generate one from the <a href="/api-keys" className="text-primary hover:underline">API Keys</a> page)</li>
          </ul>

          <SubsectionTitle id="installation">Installation</SubsectionTitle>
          <Paragraph>
            Install the required dependency:
          </Paragraph>
          <CodeBlock code="pip install websockets" language="bash" />

          <SubsectionTitle id="api-key">Getting an API Key</SubsectionTitle>
          <Paragraph>
            Navigate to the <a href="/api-keys" className="text-primary hover:underline">API Keys</a> page 
            and click "Create New Key". Give your key a descriptive name and save the generated key 
            securely—you won't be able to see it again.
          </Paragraph>
          <Paragraph>
            Your API key will look like: <InlineCode>qntx_live_a1b2c3d4e5f6g7h8...</InlineCode>
          </Paragraph>
        </section>

        {/* Quick Start */}
        <section id="quick-start">
          <SectionTitle id="quick-start-title">Quick Start</SectionTitle>
          <Paragraph>
            Here's a minimal example to connect to QuantX and start receiving market data:
          </Paragraph>
          <CodeBlock
            title="quickstart.py"
            code={`import asyncio
from quantx.client_api import QuantXClient, EventType, OrderSide

async def main():
    # Initialize client with your API key
    client = QuantXClient(api_key="qntx_live_your_key_here")
    
    # Register event handlers
    client.on(EventType.MARKET_DATA, lambda data: 
        print(f"Best bid: {data.best_bid}, Best ask: {data.best_ask}")
    )
    
    client.on(EventType.TRADE, lambda trade: 
        print(f"Trade: {trade.quantity} @ {trade.price}")
    )
    
    # Connect to a ticker
    await client.connect("QNTX")
    
    # Subscribe to your private order updates
    await client.subscribe_private()
    
    # Place an order
    await client.send_order(
        side=OrderSide.BUY,
        quantity=10,
        price=50.00
    )
    
    # Keep running to receive events
    await client.run_forever()

asyncio.run(main())`}
          />
        </section>

        {/* Client Reference */}
        <section id="client-reference">
          <SectionTitle id="client-reference-title">Client Reference</SectionTitle>
          <Paragraph>
            The <InlineCode>QuantXClient</InlineCode> class is the main interface for interacting 
            with the QuantX trading platform.
          </Paragraph>

          {/* Constructor */}
          <SubsectionTitle id="constructor">Constructor</SubsectionTitle>
          <MethodSignature>
            <span className="text-purple-400">QuantXClient</span>
            <span className="text-zinc-400">(</span>
            <span className="text-orange-400">api_key</span>
            <span className="text-zinc-400">: str, </span>
            <span className="text-orange-400">base_url</span>
            <span className="text-zinc-400">: str = "ws://localhost:8000"</span>
            <span className="text-zinc-400">)</span>
          </MethodSignature>
          <ParamTable
            params={[
              { name: "api_key", type: "str", description: "Your QuantX API key" },
              { name: "base_url", type: "str", description: "WebSocket server URL (optional)" },
            ]}
          />

          {/* connect */}
          <SubsectionTitle id="connect">connect()</SubsectionTitle>
          <MethodSignature>
            <span className="text-blue-400">await</span>{" "}
            <span className="text-yellow-400">connect</span>
            <span className="text-zinc-400">(</span>
            <span className="text-orange-400">ticker</span>
            <span className="text-zinc-400">: str) → None</span>
          </MethodSignature>
          <Paragraph>
            Connect to the WebSocket server for a specific ticker. Automatically authenticates 
            with your API key.
          </Paragraph>
          <ParamTable
            params={[
              { name: "ticker", type: "str", description: 'The ticker symbol (e.g., "QNTX")' },
            ]}
          />
          <CodeBlock
            code={`await client.connect("QNTX")`}
          />

          {/* disconnect */}
          <SubsectionTitle id="disconnect">disconnect()</SubsectionTitle>
          <MethodSignature>
            <span className="text-blue-400">await</span>{" "}
            <span className="text-yellow-400">disconnect</span>
            <span className="text-zinc-400">() → None</span>
          </MethodSignature>
          <Paragraph>
            Disconnect from the WebSocket server and clean up resources.
          </Paragraph>

          {/* run_forever */}
          <SubsectionTitle id="run-forever">run_forever()</SubsectionTitle>
          <MethodSignature>
            <span className="text-blue-400">await</span>{" "}
            <span className="text-yellow-400">run_forever</span>
            <span className="text-zinc-400">() → None</span>
          </MethodSignature>
          <Paragraph>
            Block until <InlineCode>disconnect()</InlineCode> is called or the connection is lost. 
            Use this to keep your script running while receiving events.
          </Paragraph>

          {/* on */}
          <SubsectionTitle id="on">on()</SubsectionTitle>
          <MethodSignature>
            <span className="text-yellow-400">on</span>
            <span className="text-zinc-400">(</span>
            <span className="text-orange-400">event_type</span>
            <span className="text-zinc-400">: EventType, </span>
            <span className="text-orange-400">handler</span>
            <span className="text-zinc-400">: Callable) → None</span>
          </MethodSignature>
          <Paragraph>
            Register an event handler. Handlers can be sync or async functions.
          </Paragraph>
          <ParamTable
            params={[
              { name: "event_type", type: "EventType", description: "The type of event to listen for" },
              { name: "handler", type: "Callable", description: "Callback function to invoke when event occurs" },
            ]}
          />
          <CodeBlock
            code={`# Sync handler
client.on(EventType.TRADE, lambda trade: print(trade))

# Async handler
async def handle_fill(order):
    await save_to_database(order)
    
client.on(EventType.ORDER_FILLED, handle_fill)`}
          />

          {/* off */}
          <SubsectionTitle id="off">off()</SubsectionTitle>
          <MethodSignature>
            <span className="text-yellow-400">off</span>
            <span className="text-zinc-400">(</span>
            <span className="text-orange-400">event_type</span>
            <span className="text-zinc-400">: EventType, </span>
            <span className="text-orange-400">handler</span>
            <span className="text-zinc-400">: Callable) → None</span>
          </MethodSignature>
          <Paragraph>
            Remove a previously registered event handler.
          </Paragraph>

          {/* subscribe_public */}
          <SubsectionTitle id="subscribe-public">subscribe_public()</SubsectionTitle>
          <MethodSignature>
            <span className="text-blue-400">await</span>{" "}
            <span className="text-yellow-400">subscribe_public</span>
            <span className="text-zinc-400">(</span>
            <span className="text-orange-400">ticker</span>
            <span className="text-zinc-400">: str | None = None) → None</span>
          </MethodSignature>
          <Paragraph>
            Subscribe to the public event stream for a ticker. Defaults to the connected ticker.
            You'll receive <InlineCode>TRADE</InlineCode> events for all trades on that ticker.
          </Paragraph>

          {/* subscribe_private */}
          <SubsectionTitle id="subscribe-private">subscribe_private()</SubsectionTitle>
          <MethodSignature>
            <span className="text-blue-400">await</span>{" "}
            <span className="text-yellow-400">subscribe_private</span>
            <span className="text-zinc-400">() → None</span>
          </MethodSignature>
          <Paragraph>
            Subscribe to your private event stream. This enables receiving updates about your 
            own orders: <InlineCode>ORDER_ACCEPTED</InlineCode>, <InlineCode>ORDER_REJECTED</InlineCode>, 
            <InlineCode>ORDER_FILLED</InlineCode>, and <InlineCode>ORDER_CANCELLED</InlineCode>.
          </Paragraph>

          {/* send_order */}
          <SubsectionTitle id="send-order">send_order()</SubsectionTitle>
          <MethodSignature>
            <span className="text-blue-400">await</span>{" "}
            <span className="text-yellow-400">send_order</span>
            <span className="text-zinc-400">(</span>
            <span className="text-orange-400">side</span>
            <span className="text-zinc-400">: OrderSide, </span>
            <span className="text-orange-400">quantity</span>
            <span className="text-zinc-400">: int, </span>
            <span className="text-orange-400">price</span>
            <span className="text-zinc-400">: float, </span>
            <span className="text-orange-400">order_type</span>
            <span className="text-zinc-400">: OrderType = LIMIT) → None</span>
          </MethodSignature>
          <Paragraph>
            Submit a new order. The order is sent asynchronously—register handlers for 
            <InlineCode>ORDER_ACCEPTED</InlineCode> and <InlineCode>ORDER_REJECTED</InlineCode> 
            to receive confirmation.
          </Paragraph>
          <ParamTable
            params={[
              { name: "side", type: "OrderSide", description: "OrderSide.BUY or OrderSide.SELL" },
              { name: "quantity", type: "int", description: "Number of units to trade" },
              { name: "price", type: "float", description: "Price per unit" },
              { name: "order_type", type: "OrderType", description: "LIMIT or MARKET (default: LIMIT)" },
            ]}
          />
          <CodeBlock
            code={`# Place a limit buy order
await client.send_order(
    side=OrderSide.BUY,
    quantity=100,
    price=49.50
)

# Place a market sell order
await client.send_order(
    side=OrderSide.SELL,
    quantity=50,
    price=0,  # Price ignored for market orders
    order_type=OrderType.MARKET
)`}
          />

          {/* cancel_order */}
          <SubsectionTitle id="cancel-order">cancel_order()</SubsectionTitle>
          <MethodSignature>
            <span className="text-blue-400">await</span>{" "}
            <span className="text-yellow-400">cancel_order</span>
            <span className="text-zinc-400">(</span>
            <span className="text-orange-400">order_id</span>
            <span className="text-zinc-400">: str) → None</span>
          </MethodSignature>
          <Paragraph>
            Cancel an existing order. Listen for <InlineCode>ORDER_CANCELLED</InlineCode> to 
            confirm cancellation.
          </Paragraph>
          <ParamTable
            params={[
              { name: "order_id", type: "str", description: "The ID of the order to cancel" },
            ]}
          />

          {/* Properties */}
          <SubsectionTitle id="properties">Properties</SubsectionTitle>
          <div className="space-y-4">
            <div>
              <InlineCode>is_connected: bool</InlineCode>
              <Paragraph>Returns True if connected and authenticated.</Paragraph>
            </div>
            <div>
              <InlineCode>ticker: str | None</InlineCode>
              <Paragraph>The currently connected ticker symbol.</Paragraph>
            </div>
            <div>
              <InlineCode>account_id: int | None</InlineCode>
              <Paragraph>Your authenticated account ID.</Paragraph>
            </div>
          </div>
        </section>

        {/* Events */}
        <section id="events">
          <SectionTitle id="events-title">Events</SectionTitle>
          <Paragraph>
            Events are the primary way to receive data from the server. Register handlers 
            using <InlineCode>client.on(EventType.X, handler)</InlineCode>.
          </Paragraph>

          <div className="space-y-6 mt-6">
            {/* CONNECTED */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge>EventType.CONNECTED</Badge>
              </div>
              <Paragraph>Emitted when successfully connected to the server.</Paragraph>
              <div className="text-sm text-muted-foreground">
                <strong>Data:</strong> <InlineCode>{`{"ticker": "QNTX"}`}</InlineCode>
              </div>
            </div>

            {/* AUTHENTICATED */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge>EventType.AUTHENTICATED</Badge>
              </div>
              <Paragraph>Emitted after successful API key authentication.</Paragraph>
              <div className="text-sm text-muted-foreground">
                <strong>Data:</strong> <InlineCode>AuthInfo(account_id, username)</InlineCode>
              </div>
            </div>

            {/* MARKET_DATA */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge>EventType.MARKET_DATA</Badge>
                <Badge variant="outline">Public</Badge>
              </div>
              <Paragraph>Order book snapshot updates. Received automatically after connecting.</Paragraph>
              <div className="text-sm text-muted-foreground">
                <strong>Data:</strong> <InlineCode>MarketData</InlineCode> object
              </div>
            </div>

            {/* TRADE */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge>EventType.TRADE</Badge>
                <Badge variant="outline">Public</Badge>
              </div>
              <Paragraph>A trade occurred on the exchange. Requires <InlineCode>subscribe_public()</InlineCode>.</Paragraph>
              <div className="text-sm text-muted-foreground">
                <strong>Data:</strong> <InlineCode>Trade</InlineCode> object
              </div>
            </div>

            {/* ORDER_ACCEPTED */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge>EventType.ORDER_ACCEPTED</Badge>
                <Badge variant="secondary">Private</Badge>
              </div>
              <Paragraph>Your order was accepted and added to the order book. Requires <InlineCode>subscribe_private()</InlineCode>.</Paragraph>
              <div className="text-sm text-muted-foreground">
                <strong>Data:</strong> <InlineCode>Order</InlineCode> object
              </div>
            </div>

            {/* ORDER_REJECTED */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="destructive">EventType.ORDER_REJECTED</Badge>
                <Badge variant="secondary">Private</Badge>
              </div>
              <Paragraph>Your order was rejected (e.g., insufficient funds). Requires <InlineCode>subscribe_private()</InlineCode>.</Paragraph>
              <div className="text-sm text-muted-foreground">
                <strong>Data:</strong> <InlineCode>ErrorInfo(error_type, error_message)</InlineCode>
              </div>
            </div>

            {/* ORDER_FILLED */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-green-600">EventType.ORDER_FILLED</Badge>
                <Badge variant="secondary">Private</Badge>
              </div>
              <Paragraph>Your order was filled (fully or partially). Requires <InlineCode>subscribe_private()</InlineCode>.</Paragraph>
              <div className="text-sm text-muted-foreground">
                <strong>Data:</strong> <InlineCode>Order</InlineCode> object with updated fill quantities
              </div>
            </div>

            {/* ORDER_CANCELLED */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">EventType.ORDER_CANCELLED</Badge>
                <Badge variant="secondary">Private</Badge>
              </div>
              <Paragraph>Your order was cancelled. Requires <InlineCode>subscribe_private()</InlineCode>.</Paragraph>
              <div className="text-sm text-muted-foreground">
                <strong>Data:</strong> <InlineCode>Order</InlineCode> object
              </div>
            </div>

            {/* ERROR */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="destructive">EventType.ERROR</Badge>
              </div>
              <Paragraph>A server-side error occurred.</Paragraph>
              <div className="text-sm text-muted-foreground">
                <strong>Data:</strong> <InlineCode>ErrorInfo(error_type, error_message)</InlineCode>
              </div>
            </div>

            {/* DISCONNECTED */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">EventType.DISCONNECTED</Badge>
              </div>
              <Paragraph>Connection to the server was lost.</Paragraph>
              <div className="text-sm text-muted-foreground">
                <strong>Data:</strong> <InlineCode>{`{"reason": "..."}`}</InlineCode>
              </div>
            </div>
          </div>
        </section>

        {/* Models */}
        <section id="models">
          <SectionTitle id="models-title">Models</SectionTitle>
          <Paragraph>
            Data models are Python dataclasses that represent structured data from the server.
          </Paragraph>

          {/* MarketData */}
          <SubsectionTitle id="model-marketdata">MarketData</SubsectionTitle>
          <Paragraph>Order book snapshot for a ticker.</Paragraph>
          <CodeBlock
            code={`@dataclass
class MarketData:
    ticker: str
    bids: List[OrderBookLevel]      # Buy orders (price, quantity)
    asks: List[OrderBookLevel]      # Sell orders (price, quantity)
    best_bid: Optional[float]       # Highest buy price
    best_ask: Optional[float]       # Lowest sell price
    mid_price: Optional[float]      # (best_bid + best_ask) / 2
    last_trade_price: Optional[float]
    last_trade_quantity: Optional[int]
    total_bid_quantity: int
    total_ask_quantity: int`}
          />

          {/* OrderBookLevel */}
          <SubsectionTitle id="model-orderbooklevel">OrderBookLevel</SubsectionTitle>
          <Paragraph>A single price level in the order book.</Paragraph>
          <CodeBlock
            code={`@dataclass
class OrderBookLevel:
    price: float
    quantity: int`}
          />

          {/* Trade */}
          <SubsectionTitle id="model-trade">Trade</SubsectionTitle>
          <Paragraph>A trade that occurred on the exchange.</Paragraph>
          <CodeBlock
            code={`@dataclass
class Trade:
    id: str
    ticker: str
    price: float
    quantity: int
    buyer_order_id: Optional[str]
    seller_order_id: Optional[str]
    timestamp: Optional[datetime]`}
          />

          {/* Order */}
          <SubsectionTitle id="model-order">Order</SubsectionTitle>
          <Paragraph>An order in the system.</Paragraph>
          <CodeBlock
            code={`@dataclass
class Order:
    id: str
    ticker: str
    side: OrderSide              # BUY or SELL
    quantity: int                # Original quantity
    price: float
    order_type: OrderType        # LIMIT or MARKET
    status: OrderStatus          # PENDING, PARTIAL, FILLED, CANCELLED
    filled_quantity: int         # How much has been filled
    remaining_quantity: int      # How much is left
    created_at: Optional[datetime]`}
          />
        </section>

        {/* Error Handling */}
        <section id="error-handling">
          <SectionTitle id="error-handling-title">Error Handling</SectionTitle>
          <Paragraph>
            The SDK raises specific exceptions for different error conditions. All exceptions 
            inherit from <InlineCode>QuantXError</InlineCode>.
          </Paragraph>

          <div className="space-y-6 mt-6">
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-semibold">AuthenticationError</h4>
              <Paragraph>Raised when API key authentication fails (invalid or expired key).</Paragraph>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-semibold">ConnectionError</h4>
              <Paragraph>Raised when the WebSocket connection fails.</Paragraph>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-semibold">NotConnectedError</h4>
              <Paragraph>Raised when attempting operations without an active connection.</Paragraph>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold">OrderError</h4>
              <Paragraph>Raised when order submission or cancellation fails.</Paragraph>
            </div>
          </div>

          <CodeBlock
            title="error_handling.py"
            code={`from quantx.client_api import (
    QuantXClient, 
    AuthenticationError, 
    ConnectionError,
    NotConnectedError
)

async def main():
    client = QuantXClient(api_key="qntx_live_...")
    
    try:
        await client.connect("QNTX")
    except AuthenticationError as e:
        print(f"Invalid API key: {e.message}")
        return
    except ConnectionError as e:
        print(f"Could not connect: {e.message}")
        return
    
    try:
        await client.send_order(...)
    except NotConnectedError:
        print("Lost connection, reconnecting...")
        await client.connect("QNTX")`}
          />
        </section>

        {/* Examples */}
        <section id="examples">
          <SectionTitle id="examples-title">Examples</SectionTitle>

          <SubsectionTitle id="example-simple-bot">Simple Trading Bot</SubsectionTitle>
          <Paragraph>
            A basic trading bot that buys when the price drops and sells when it rises.
          </Paragraph>
          <CodeBlock
            title="simple_bot.py"
            code={`import asyncio
from quantx.client_api import (
    QuantXClient, 
    EventType, 
    OrderSide,
    MarketData,
    Order
)

class SimpleBot:
    def __init__(self, api_key: str, ticker: str):
        self.client = QuantXClient(api_key=api_key)
        self.ticker = ticker
        self.last_price = None
        self.position = 0
        
    async def start(self):
        # Register handlers
        self.client.on(EventType.MARKET_DATA, self.on_market_data)
        self.client.on(EventType.ORDER_FILLED, self.on_fill)
        self.client.on(EventType.ORDER_REJECTED, self.on_reject)
        
        # Connect and subscribe
        await self.client.connect(self.ticker)
        await self.client.subscribe_private()
        
        print(f"Bot started for {self.ticker}")
        await self.client.run_forever()
    
    async def on_market_data(self, data: MarketData):
        if data.last_trade_price is None:
            return
            
        current_price = data.last_trade_price
        
        # Simple strategy: buy on dip, sell on rise
        if self.last_price is not None:
            change = (current_price - self.last_price) / self.last_price
            
            if change < -0.01 and self.position < 100:
                # Price dropped 1%, buy
                await self.client.send_order(
                    side=OrderSide.BUY,
                    quantity=10,
                    price=current_price
                )
            elif change > 0.01 and self.position > 0:
                # Price rose 1%, sell
                await self.client.send_order(
                    side=OrderSide.SELL,
                    quantity=min(10, self.position),
                    price=current_price
                )
        
        self.last_price = current_price
    
    def on_fill(self, order: Order):
        if order.side == OrderSide.BUY:
            self.position += order.filled_quantity
        else:
            self.position -= order.filled_quantity
        print(f"Filled: {order.side.value} {order.filled_quantity} @ {order.price}")
        print(f"Position: {self.position}")
    
    def on_reject(self, error):
        print(f"Order rejected: {error.error_message}")

# Run the bot
bot = SimpleBot(api_key="qntx_live_...", ticker="QNTX")
asyncio.run(bot.start())`}
          />

          <SubsectionTitle id="example-order-tracker">Order Tracker</SubsectionTitle>
          <Paragraph>
            Track all your orders and their status in real-time.
          </Paragraph>
          <CodeBlock
            title="order_tracker.py"
            code={`import asyncio
from quantx.client_api import QuantXClient, EventType, Order

class OrderTracker:
    def __init__(self, api_key: str):
        self.client = QuantXClient(api_key=api_key)
        self.orders = {}  # order_id -> Order
    
    async def start(self, ticker: str):
        self.client.on(EventType.ORDER_ACCEPTED, self.on_accepted)
        self.client.on(EventType.ORDER_FILLED, self.on_filled)
        self.client.on(EventType.ORDER_CANCELLED, self.on_cancelled)
        
        await self.client.connect(ticker)
        await self.client.subscribe_private()
        await self.client.run_forever()
    
    def on_accepted(self, order: Order):
        self.orders[order.id] = order
        print(f"✓ Order {order.id[:8]} accepted: {order.side.value} {order.quantity} @ {order.price}")
    
    def on_filled(self, order: Order):
        self.orders[order.id] = order
        status = "FILLED" if order.remaining_quantity == 0 else "PARTIAL"
        print(f"💰 Order {order.id[:8]} {status}: {order.filled_quantity}/{order.quantity} filled")
    
    def on_cancelled(self, order: Order):
        self.orders[order.id] = order
        print(f"✗ Order {order.id[:8]} cancelled")
    
    def get_open_orders(self):
        return [o for o in self.orders.values() if o.status in ("PENDING", "PARTIAL")]

tracker = OrderTracker(api_key="qntx_live_...")
asyncio.run(tracker.start("QNTX"))`}
          />
        </section>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <Paragraph>
            Need help? Check out the <a href="/api-keys" className="text-primary hover:underline">API Keys</a> page 
            to manage your keys, or reach out to the QuantX team for support.
          </Paragraph>
        </div>
      </main>
    </div>
  );
};

export default ApiDocs;

