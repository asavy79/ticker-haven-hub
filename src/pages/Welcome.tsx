import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  XCircle,
  Lightbulb,
  BookOpen,
} from "lucide-react";

const Welcome = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to CU Quants
        </h1>
        <p className="text-lg text-muted-foreground">
          Your guide to trading on our platform
        </p>
      </div>

      {/* Order Types Section */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold">Order Types</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Limit Order Card */}
          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <ArrowUpDown className="h-5 w-5 text-primary" />
                  <span>Limit Order</span>
                </span>
                <Badge variant="secondary">Price Control</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                Execute at a <span className="text-foreground font-medium">specific price or better</span>. 
                Your order sits in the book until matched or cancelled.
              </p>
              <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-sm">
                <div className="flex items-start space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span>
                    <span className="font-medium">Buy Limit:</span> Executes at your price or lower
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <TrendingDown className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  <span>
                    <span className="font-medium">Sell Limit:</span> Executes at your price or higher
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Order Card */}
          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Market Order</span>
                </span>
                <Badge variant="secondary">Immediate</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                Execute <span className="text-foreground font-medium">immediately</span> at 
                the best available price. Guarantees execution, not price.
              </p>
              <div className="bg-muted/50 rounded-lg p-3 text-sm">
                <div className="flex items-start space-x-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                  <span>
                    Best for when you need to enter or exit a position quickly 
                    and are willing to accept the current market price.
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trading Rules Section */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold">Trading Rules</h2>
        </div>

        <div className="space-y-4">
          {/* Available Cash Rule */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <DollarSign className="h-5 w-5 text-green-500" />
                <span>Available Cash Requirement</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                Buy orders require sufficient <span className="text-foreground font-medium">available cash</span>, 
                not just account balance.
              </p>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <p className="font-medium text-amber-600 dark:text-amber-400">
                      Why the difference?
                    </p>
                    <p className="text-sm text-muted-foreground">
                      When you place a buy order, funds are <span className="font-medium text-foreground">reserved</span> until 
                      the order fills or is cancelled. Your <span className="font-medium text-foreground">balance</span> shows 
                      total funds, while <span className="font-medium text-foreground">available cash</span> shows 
                      what's actually free to use.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reserved Shares Rule */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Package className="h-5 w-5 text-blue-500" />
                <span>Share Availability Requirement</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                Sell orders require <span className="text-foreground font-medium">available shares</span> for 
                that ticker in your portfolio.
              </p>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <p className="font-medium text-blue-600 dark:text-blue-400">
                      How it works
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Similar to cash, when you place a sell order, shares are <span className="font-medium text-foreground">reserved</span>. 
                      You cannot sell shares that are already committed to pending orders.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Order Management Section */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2">
          <XCircle className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold">Managing Orders</h2>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <XCircle className="h-5 w-5 text-red-500" />
              <span>Cancelling Orders</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Need to cancel a pending order? Head to your{" "}
              <span className="text-foreground font-medium">Portfolio</span> page.
            </p>
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <p className="text-sm font-medium">How to cancel:</p>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>Navigate to the <span className="font-medium text-foreground">Portfolio</span> page</li>
                <li>Scroll to the <span className="font-medium text-foreground">Recent Orders</span> section</li>
                <li>Find orders with <Badge variant="outline" className="mx-1 text-xs">PENDING</Badge> or <Badge variant="outline" className="mx-1 text-xs">PARTIAL</Badge> status</li>
                <li>Click the <span className="font-medium text-foreground text-red-500">Cancel</span> button</li>
              </ol>
              <p className="text-sm text-muted-foreground pt-2 border-t">
                Cancelled orders release reserved cash or shares back to your available balance immediately.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Quick Tips */}
      <Card className="bg-gradient-to-r from-primary/5 to-transparent border-primary/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <span>Quick Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <li className="flex items-start space-x-2">
              <span className="text-primary font-bold">•</span>
              <span>Use limit orders for better price control</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary font-bold">•</span>
              <span>Check available cash before placing buy orders</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary font-bold">•</span>
              <span>Cancel unfilled orders to free up reserved funds</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary font-bold">•</span>
              <span>Monitor the orderbook for market depth</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Welcome;
