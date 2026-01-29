import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AdminService } from "@/services/admin";
import { useFirebaseAuth } from "@/contexts/firebase-auth-context";
import {
  DollarSign,
  ArrowUpCircle,
  ArrowDownCircle,
  Plus,
  AlertCircle,
  CheckCircle2,
  Activity,
  Zap,
  Target,
} from "lucide-react";

interface OrderFormProps {
  onPlaceOrder: (order: {
    type: "Buy" | "Sell";
    orderType: "MARKET" | "LIMIT";
    price: number | null;
    quantity: number;
  }) => Promise<void>;
  connectionStatus: "connecting" | "connected" | "disconnected";
}

export const OrderForm = ({
  onPlaceOrder,
  connectionStatus,
}: OrderFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [orderType, setOrderType] = useState<"Buy" | "Sell">("Buy");
  const [priceType, setPriceType] = useState<"MARKET" | "LIMIT">("LIMIT");
  const [orderPrice, setOrderPrice] = useState("");
  const [orderQuantity, setOrderQuantity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableCash, setAvailableCash] = useState<number | null>(null);
  const [cashLoading, setCashLoading] = useState(false);
  const [cashError, setCashError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    price?: string;
    quantity?: string;
    general?: string;
  }>({});

  const { toast } = useToast();
  const { user } = useFirebaseAuth();

  const validateForm = () => {
    const newErrors: typeof errors = {};

    const price = parseFloat(orderPrice);
    const quantity = parseInt(orderQuantity);

    // Only validate price for limit orders
    if (priceType === "LIMIT" && (!orderPrice || isNaN(price) || price <= 0)) {
      newErrors.price = "Please enter a valid price greater than 0";
    }

    if (!orderQuantity || isNaN(quantity) || quantity <= 0) {
      newErrors.quantity = "Please enter a valid quantity greater than 0";
    }

    if (connectionStatus !== "connected") {
      newErrors.general = "Cannot place order: Not connected to trading server";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const price = priceType === "LIMIT" ? parseFloat(orderPrice) : null;
      const quantity = parseInt(orderQuantity);

      await onPlaceOrder({ 
        type: orderType, 
        orderType: priceType,
        price, 
        quantity 
      });
      setOrderPrice("");
      setOrderQuantity("");
      setIsOpen(false);
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      setErrors({ general: "Failed to place order. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    if (isNaN(price)) return "$0.00";
    return `$${price.toFixed(2)}`;
  };

  const formatQuantity = (quantity: number) => {
    if (isNaN(quantity)) return "0";
    return quantity.toLocaleString();
  };

  const formatTotal = (total: number) => {
    if (isNaN(total)) return "$0.00";
    return `$${total.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const calculateTotal = () => {
    if (priceType === "MARKET") return 0; // Can't calculate total for market orders
    const price = parseFloat(orderPrice);
    const quantity = parseInt(orderQuantity);
    if (isNaN(price) || isNaN(quantity)) return 0;
    return price * quantity;
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form when closing
      setOrderPrice("");
      setOrderQuantity("");
      setPriceType("LIMIT");
      setErrors({});
    }
  };

  useEffect(() => {
    // Fetch fresh cash whenever the modal opens.
    // This keeps the number accurate after fills/cancels without requiring a full page refresh.
    const fetchAvailableCash = async () => {
      if (!isOpen) return;

      if (!user?.dbId) {
        setAvailableCash(null);
        setCashError("Sign in to view available cash");
        return;
      }

      setCashLoading(true);
      setCashError(null);
      try {
        const account = await AdminService.getAccount(user.dbId);
        setAvailableCash(account.available_cash ?? 0);
      } catch (err: any) {
        console.error("Error fetching available cash:", err);
        const msg =
          err?.response?.data?.detail?.error_message ||
          err?.response?.data?.detail ||
          "Failed to load available cash";
        setAvailableCash(null);
        setCashError(msg);
      } finally {
        setCashLoading(false);
      }
    };

    fetchAvailableCash();
  }, [isOpen, user?.dbId]);

  const orderTotal = calculateTotal();

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          disabled={connectionStatus !== "connected"}
        >
          <Plus className="h-4 w-4 mr-2" />
          Place Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Place New Order - QNTX</span>
          </DialogTitle>
          <DialogDescription>
      Submit a market or limit order to buy or sell shares
      </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Available Cash */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Available Cash
                </span>
                <span className="font-medium">
                  {cashLoading
                    ? "Loading..."
                    : cashError
                      ? "--"
                      : `$${(availableCash ?? 0).toFixed(2)}`}
                </span>
              </div>
              {cashError && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {cashError}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Buy/Sell Toggle */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Order Side</Label>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={orderType === "Buy" ? "default" : "outline"}
                onClick={() => setOrderType("Buy")}
                className={`flex-1 ${
                  orderType === "Buy"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "border-green-200 text-green-600 hover:bg-green-50"
                }`}
              >
                <ArrowUpCircle className="h-4 w-4 mr-2" />
                Buy
              </Button>
              <Button
                type="button"
                variant={orderType === "Sell" ? "default" : "outline"}
                onClick={() => setOrderType("Sell")}
                className={`flex-1 ${
                  orderType === "Sell"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "border-red-200 text-red-600 hover:bg-red-50"
                }`}
              >
                <ArrowDownCircle className="h-4 w-4 mr-2" />
                Sell
              </Button>
            </div>
          </div>

          {/* Order Type Toggle (Market/Limit) */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Order Type</Label>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={priceType === "MARKET" ? "default" : "outline"}
                onClick={() => setPriceType("MARKET")}
                className={`flex-1 ${
                  priceType === "MARKET"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "border-blue-200 text-blue-600 hover:bg-blue-50"
                }`}
              >
                <Zap className="h-4 w-4 mr-2" />
                Market
              </Button>
              <Button
                type="button"
                variant={priceType === "LIMIT" ? "default" : "outline"}
                onClick={() => setPriceType("LIMIT")}
                className={`flex-1 ${
                  priceType === "LIMIT"
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "border-purple-200 text-purple-600 hover:bg-purple-50"
                }`}
              >
                <Target className="h-4 w-4 mr-2" />
                Limit
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {priceType === "MARKET" 
                ? "Execute immediately at best available price" 
                : "Execute only at your specified price or better"
              }
            </p>
          </div>

          {/* Price Input - Only for Limit Orders */}
          {priceType === "LIMIT" && (
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium">
                Limit Price per Share
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={orderPrice}
                  onChange={(e) => setOrderPrice(e.target.value)}
                  className={`pl-10 ${errors.price ? "border-destructive" : ""}`}
                />
              </div>
              {errors.price && (
                <p className="text-sm text-destructive flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.price}
                </p>
              )}
            </div>
          )}

          {/* Quantity Input */}
          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-sm font-medium">
              Quantity (Shares)
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              placeholder="0"
              value={orderQuantity}
              onChange={(e) => setOrderQuantity(e.target.value)}
              className={errors.quantity ? "border-destructive" : ""}
            />
            {errors.quantity && (
              <p className="text-sm text-destructive flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.quantity}
              </p>
            )}
          </div>

          {/* Order Summary - Compact Inline */}
          {(orderTotal > 0 || (priceType === "MARKET" && orderQuantity)) && (
            <div className={`text-sm font-medium py-2 px-3 rounded-md ${
              orderType === "Buy" 
                ? "bg-green-500/10 text-green-700 dark:text-green-400" 
                : "bg-red-500/10 text-red-700 dark:text-red-400"
            }`}>
              {orderType.toUpperCase()} {priceType} {formatQuantity(parseInt(orderQuantity))} shares
              {priceType === "LIMIT" && <> @ {formatPrice(parseFloat(orderPrice))}</>}
              {priceType === "LIMIT" && <> = {formatTotal(orderTotal)}</>}
              {priceType === "MARKET" && <> @ Market Price</>}
            </div>
          )}

          {/* General Error */}
          {errors.general && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || connectionStatus !== "connected"}
              className={`flex-1 ${
                orderType === "Buy"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              } text-white`}
            >
              {isSubmitting ? (
                <>
                  <Activity className="h-4 w-4 mr-2 animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>
                  {priceType === "MARKET" ? (
                    <Zap className="h-4 w-4 mr-2" />
                  ) : (
                    <Target className="h-4 w-4 mr-2" />
                  )}
                  Place {priceType === "MARKET" ? "Market" : "Limit"} {orderType}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
