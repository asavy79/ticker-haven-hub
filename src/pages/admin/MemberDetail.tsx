import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Mail, Calendar, DollarSign, TrendingUp, Trash2, Edit } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const MemberDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditBalanceOpen, setIsEditBalanceOpen] = useState(false);
  const [newBalance, setNewBalance] = useState("");

  // Mock member data - in real app this would be fetched based on ID
  const member = {
    id: "1",
    name: "John Smith", 
    email: "john.smith@colorado.edu",
    role: "president",
    joinDate: "2023-08-15",
    creditsBalance: 1200,
    meetingsAttended: 18,
    totalTrades: 45,
    totalPnL: 250.75,
    isActive: true,
    lastLogin: "2024-01-10"
  };

  const tradeHistory = [
    { id: "1", date: "2024-01-10", type: "Buy", symbol: "MOCK-FUTURE", quantity: 10, price: 105.50, pnl: 25.00 },
    { id: "2", date: "2024-01-09", type: "Sell", symbol: "MOCK-FUTURE", quantity: -5, price: 103.25, pnl: -12.50 },
    { id: "3", date: "2024-01-08", type: "Buy", symbol: "MOCK-FUTURE", quantity: 15, price: 102.00, pnl: 45.75 }
  ];

  const meetingHistory = [
    { id: "1", title: "Advanced Options Strategies", date: "2024-01-08", attended: true, reward: 100 },
    { id: "2", title: "Market Microstructure Analysis", date: "2024-01-01", attended: true, reward: 100 },
    { id: "3", title: "Risk Management in Trading", date: "2023-12-18", attended: false, reward: 0 }
  ];

  const handleEditBalance = () => {
    if (!newBalance) return;
    
    toast({
      title: "Balance Updated",
      description: `${member.name}'s balance updated to ${newBalance} credits`,
    });
    setIsEditBalanceOpen(false);
    setNewBalance("");
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account Deleted",
      description: `${member.name}'s account has been deleted`,
      variant: "destructive"
    });
    navigate("/admin/members");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate("/admin/members")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Members
          </Button>
          <h1 className="text-3xl font-bold">{member.name}</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant={member.role === "president" ? "default" : "outline"} className="text-lg px-4 py-2">
            {member.role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
          {member.isActive ? (
            <Badge variant="outline" className="border-success text-success">Active</Badge>
          ) : (
            <Badge variant="outline" className="border-muted text-muted-foreground">Inactive</Badge>
          )}
        </div>
      </div>

      {/* Member Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{member.creditsBalance}</div>
            <p className="text-xs text-muted-foreground">Available credits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${member.totalPnL >= 0 ? 'text-success' : 'text-sell'}`}>
              ${member.totalPnL}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meetings Attended</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{member.meetingsAttended}</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{member.totalTrades}</div>
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
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{member.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined: {new Date(member.joinDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Last Login: {new Date(member.lastLogin).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <Dialog open={isEditBalanceOpen} onOpenChange={setIsEditBalanceOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Balance
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Credits Balance</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="balance">New Balance</Label>
                      <Input
                        id="balance"
                        type="number"
                        placeholder="Enter new balance"
                        value={newBalance}
                        onChange={(e) => setNewBalance(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleEditBalance} className="w-full">
                      Update Balance
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button variant="destructive" onClick={handleDeleteAccount} className="w-full">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trade History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Trade History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tradeHistory.map((trade) => (
              <div key={trade.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Badge variant={trade.type === "Buy" ? "default" : "secondary"}>
                    {trade.type}
                  </Badge>
                  <div>
                    <div className="font-medium">{trade.symbol}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(trade.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{trade.quantity} @ ${trade.price}</div>
                  <div className={`text-sm ${trade.pnl >= 0 ? 'text-success' : 'text-sell'}`}>
                    {trade.pnl >= 0 ? '+' : ''}${trade.pnl}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Meeting Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Meeting Attendance History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {meetingHistory.map((meeting) => (
              <div key={meeting.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">{meeting.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(meeting.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={meeting.attended ? "default" : "secondary"}>
                    {meeting.attended ? "Attended" : "Missed"}
                  </Badge>
                  {meeting.attended && (
                    <Badge variant="outline" className="text-success border-success">
                      +{meeting.reward} Credits
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberDetail;