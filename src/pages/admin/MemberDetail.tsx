import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  DollarSign,
  TrendingUp,
  Edit,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { AdminService } from "@/services/admin";
import {
  AccountDTO,
  TradeDTO,
  OrderDTO,
  PositionDTO,
  AccountRole,
} from "@/types/admin";
import { useAuth } from "@/hooks/use-auth";

const MemberDetail = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const [isAdjustBalanceOpen, setIsAdjustBalanceOpen] = useState(false);
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [newRole, setNewRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updatingRole, setUpdatingRole] = useState(false);

  // State for member data
  const [member, setMember] = useState<AccountDTO | null>(null);
  const [trades, setTrades] = useState<TradeDTO[]>([]);
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [positions, setPositions] = useState<PositionDTO[]>([]);
  const { user, isLoading } = useAuth();

  const fetchMemberData = async () => {
    if (!accountId) {
      setError("Invalid account ID");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const accountIdNum = parseInt(accountId);
      if (isNaN(accountIdNum)) {
        throw new Error("Invalid account ID format");
      }

      const [memberData, tradesData, ordersData, positionsData] =
        await Promise.all([
          AdminService.getAccount(accountIdNum),
          AdminService.getAccountTrades(accountIdNum, { page_size: 50 }),
          AdminService.getAccountOrders(accountIdNum, { page_size: 50 }),
          AdminService.getAccountPositions(accountIdNum, { page_size: 50 }),
        ]);

      console.log(memberData);
      console.log(tradesData);
      console.log(ordersData);
      console.log(positionsData);

      setMember(memberData);
      setTrades(tradesData.trades);
      setOrders(ordersData.orders);
      setPositions(positionsData.positions);
    } catch (err: any) {
      console.error("Error fetching member data:", err);
      if (err.response?.status === 404) {
        setError("Member not found");
      } else {
        setError("Failed to load member data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMemberData();
    }
  }, [accountId, user]);

  const handleAdjustBalance = async () => {
    if (!adjustAmount || !member || !accountId) return;

    try {
      setUpdating(true);
      const accountIdNum = parseInt(accountId);
      const amountNum = parseFloat(adjustAmount);

      if (isNaN(amountNum)) {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid number",
          variant: "destructive",
        });
        return;
      }

      const updatedMember = await AdminService.adjustAccountBalance(
        accountIdNum,
        amountNum
      );
      setMember(updatedMember);

      const action = amountNum >= 0 ? "added to" : "removed from";
      const absAmount = Math.abs(amountNum);
      
      toast({
        title: "Balance Adjusted",
        description: `${absAmount.toFixed(2)} credits ${action} ${member.username}'s account`,
      });
      setIsAdjustBalanceOpen(false);
      setAdjustAmount("");
    } catch (err) {
      console.error("Error adjusting balance:", err);
      toast({
        title: "Adjustment Failed",
        description: "Failed to adjust balance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleEditRole = async () => {
    if (!newRole || !member || !accountId) return;

    try {
      setUpdatingRole(true);
      const accountIdNum = parseInt(accountId);

      const updatedMember = await AdminService.updateAccountRole(
        accountIdNum,
        newRole
      );
      setMember(updatedMember);

      toast({
        title: "Role Updated",
        description: `${member.username}'s role updated to ${newRole}`,
      });
      setIsEditRoleOpen(false);
      setNewRole("");
    } catch (err) {
      console.error("Error updating role:", err);
      toast({
        title: "Update Failed",
        description: "Failed to update role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingRole(false);
    }
  };

  const getRoleBadge = (role: AccountRole | string) => {
    // Handle both enum values and string values from backend
    const normalizedRole = typeof role === "string" ? role.toLowerCase() : role;

    const roleConfig: Record<
      string,
      { variant: "default" | "secondary" | "outline"; className: string }
    > = {
      [AccountRole.PRESIDENT]: {
        variant: "default",
        className: "bg-primary text-primary-foreground",
      },
      [AccountRole.VICE_PRESIDENT]: {
        variant: "secondary",
        className: "bg-secondary text-secondary-foreground",
      },
      [AccountRole.TREASURER]: {
        variant: "secondary",
        className: "bg-secondary text-secondary-foreground",
      },
      [AccountRole.ADMIN]: {
        variant: "outline",
        className: "border-primary text-primary",
      },
      [AccountRole.MODERATOR]: {
        variant: "outline",
        className: "border-orange-500 text-orange-600",
      },
      [AccountRole.OWNER]: {
        variant: "default",
        className: "bg-red-600 text-white",
      },
      [AccountRole.MEMBER]: { variant: "outline", className: "" },
      [AccountRole.USER]: { variant: "outline", className: "" },
    };

    const config = roleConfig[normalizedRole] || roleConfig[AccountRole.USER];

    // Display name mapping
    const displayNames: Record<string, string> = {
      user: "User",
      admin: "Admin",
      moderator: "Moderator",
      owner: "Owner",
      MEMBER: "Member",
      TREASURER: "Treasurer",
      VICE_PRESIDENT: "Vice President",
      PRESIDENT: "President",
    };

    const displayName =
      displayNames[normalizedRole] ||
      role
        .toString()
        .toLowerCase()
        .replace("_", " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

    return (
      <Badge variant={config.variant} className={config.className}>
        {displayName}
      </Badge>
    );
  };

  const isActive = (lastLogin: string | null) => {
    if (!lastLogin) return false;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return new Date(lastLogin) > thirtyDaysAgo;
  };

  const calculateTotalPnL = () => {
    return positions.reduce(
      (sum, position) =>
        sum + (position.realized_pnl || 0) + (position.unrealized_pnl || 0),
      0
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate("/admin/members")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Members
          </Button>
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate("/admin/members")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Members
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button
              variant="link"
              className="p-0 h-auto ml-2"
              onClick={fetchMemberData}
            >
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate("/admin/members")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Members
          </Button>
          <h1 className="text-3xl font-bold">{member.username}</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchMemberData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          {getRoleBadge(member.role)}
          {isActive(member.last_login_at) ? (
            <Badge
              variant="outline"
              className="border-green-500 text-green-600"
            >
              Active
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="border-muted text-muted-foreground"
            >
              Inactive
            </Badge>
          )}
        </div>
      </div>

      {/* Member Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Account Balance
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(member.balance || 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Available credits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                calculateTotalPnL() >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ${calculateTotalPnL().toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Realized + Unrealized
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Positions
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{positions.length}</div>
            <p className="text-xs text-muted-foreground">Open positions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trades.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Member Details */}
      <Card>
        <CardHeader>
          <CardTitle>Member Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Account ID: {member.id}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Username: {member.username}</span>
              </div>
              {member.last_login_at && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Last Login:{" "}
                    {new Date(member.last_login_at).toLocaleDateString()}
                  </span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span>Total Orders: {orders.length}</span>
              </div>
            </div>

            <div className="space-y-4">
              <Dialog
                open={isAdjustBalanceOpen}
                onOpenChange={setIsAdjustBalanceOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Adjust Credits
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adjust Account Credits</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      <p>Current Balance: <span className="font-medium">${(member.balance || 0).toFixed(2)}</span></p>
                      <p>Available Cash: <span className="font-medium">${(member.available_cash || 0).toFixed(2)}</span></p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount to Add/Remove</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 100 or -50"
                        value={adjustAmount}
                        onChange={(e) => setAdjustAmount(e.target.value)}
                        disabled={updating}
                      />
                      <p className="text-xs text-muted-foreground">
                        Use positive numbers to add credits, negative to remove
                      </p>
                    </div>
                    {adjustAmount && !isNaN(parseFloat(adjustAmount)) && (
                      <div className={`text-sm font-medium ${parseFloat(adjustAmount) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {parseFloat(adjustAmount) >= 0 ? 'Adding' : 'Removing'} {Math.abs(parseFloat(adjustAmount)).toFixed(2)} credits
                        <br />
                        <span className="text-muted-foreground font-normal">
                          New balance: ${((member.balance || 0) + parseFloat(adjustAmount)).toFixed(2)}
                        </span>
                      </div>
                    )}
                    <Button
                      onClick={handleAdjustBalance}
                      className="w-full"
                      disabled={updating || !adjustAmount}
                    >
                      {updating ? "Adjusting..." : "Adjust Credits"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isEditRoleOpen} onOpenChange={setIsEditRoleOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Role
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Account Role</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="role">New Role</Label>
                      <Select
                        value={newRole}
                        onValueChange={setNewRole}
                        disabled={updatingRole}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={`Current: ${member.role}`}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="moderator">Moderator</SelectItem>
                          <SelectItem value="owner">Owner</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={handleEditRole}
                      className="w-full"
                      disabled={updatingRole || !newRole}
                    >
                      {updatingRole ? "Updating..." : "Update Role"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trade History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Trade History ({trades.length} total)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trades.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No trades found for this member
              </div>
            ) : (
              trades.slice(0, 10).map((trade) => (
                <div
                  key={trade.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <Badge variant="default">Trade</Badge>
                    <div>
                      <div className="font-medium">{trade.symbol}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(trade.created_at).toLocaleDateString()}
                      </div>
                      <div>
                        {trade.buy_account_id == accountId ? (
                          <p className="text-green-500">Buy</p>
                        ) : (
                          <p className="text-red-500">Sell</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {trade.quantity} @ ${(trade.price || 0).toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Value: ${(trade.trade_value || 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            )}
            {trades.length > 10 && (
              <div className="text-center text-sm text-muted-foreground">
                Showing 10 of {trades.length} trades
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Active Positions */}
      <Card>
        <CardHeader>
          <CardTitle>Active Positions ({positions.length} total)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {positions.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No active positions for this member
              </div>
            ) : (
              positions.map((position) => (
                <div
                  key={position.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline">Position</Badge>
                    <div>
                      <div className="font-medium">{position.symbol}</div>
                      <div className="text-sm text-muted-foreground">
                        Avg Price: ${(position.average_price || 0).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">Qty: {position.quantity}</div>
                    <div className="flex space-x-2 text-sm">
                      <span
                        className={`${
                          (position.realized_pnl || 0) >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        Realized: ${(position.realized_pnl || 0).toFixed(2)}
                      </span>
                      <span
                        className={`${
                          (position.unrealized_pnl || 0) >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        Unrealized: ${(position.unrealized_pnl || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders ({orders.length} total)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No orders found for this member
              </div>
            ) : (
              orders.slice(0, 10).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <Badge
                      variant={order.side === "BUY" ? "default" : "secondary"}
                    >
                      {order.side}
                    </Badge>
                    <div>
                      <div className="font-medium">{order.symbol}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {order.quantity} @ ${(order.price || 0).toFixed(2)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          order.status === "FILLED"
                            ? "default"
                            : order.status === "CANCELLED"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {order.status}
                      </Badge>
                      {order.remaining_quantity > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {order.remaining_quantity} remaining
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            {orders.length > 10 && (
              <div className="text-center text-sm text-muted-foreground">
                Showing 10 of {orders.length} orders
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberDetail;
