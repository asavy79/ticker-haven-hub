import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, User, Mail, Calendar } from "lucide-react";

interface Member {
  id: string;
  name: string;
  email: string;
  role: "member" | "admin" | "treasurer" | "vice-president" | "president";
  joinDate: string;
  creditsBalance: number;
  meetingsAttended: number;
  totalTrades: number;
  isActive: boolean;
}

const Members = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const members: Member[] = [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@colorado.edu",
      role: "president",
      joinDate: "2023-08-15",
      creditsBalance: 1200,
      meetingsAttended: 18,
      totalTrades: 45,
      isActive: true
    },
    {
      id: "2", 
      name: "Sarah Johnson",
      email: "sarah.johnson@colorado.edu",
      role: "vice-president",
      joinDate: "2023-08-15",
      creditsBalance: 1100,
      meetingsAttended: 17,
      totalTrades: 38,
      isActive: true
    },
    {
      id: "3",
      name: "Mike Chen",
      email: "mike.chen@colorado.edu", 
      role: "treasurer",
      joinDate: "2023-08-20",
      creditsBalance: 950,
      meetingsAttended: 16,
      totalTrades: 52,
      isActive: true
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily.davis@colorado.edu",
      role: "admin",
      joinDate: "2023-09-01",
      creditsBalance: 800,
      meetingsAttended: 14,
      totalTrades: 29,
      isActive: true
    },
    {
      id: "5",
      name: "Alex Rodriguez",
      email: "alex.rodriguez@colorado.edu",
      role: "member",
      joinDate: "2023-10-15",
      creditsBalance: 600,
      meetingsAttended: 12,
      totalTrades: 23,
      isActive: true
    },
    {
      id: "6",
      name: "Jessica Wong",
      email: "jessica.wong@colorado.edu",
      role: "member", 
      joinDate: "2023-11-01",
      creditsBalance: 500,
      meetingsAttended: 8,
      totalTrades: 15,
      isActive: false
    }
  ];

  const getRoleBadge = (role: Member['role']) => {
    const variants = {
      president: "default",
      "vice-president": "secondary", 
      treasurer: "secondary",
      admin: "outline",
      member: "outline"
    } as const;

    const colors = {
      president: "bg-primary text-primary-foreground",
      "vice-president": "bg-secondary text-secondary-foreground",
      treasurer: "bg-secondary text-secondary-foreground", 
      admin: "border-primary text-primary",
      member: ""
    };

    return (
      <Badge variant={variants[role]} className={colors[role]}>
        {role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Badge>
    );
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Members</h1>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {members.length} Total Members
        </Badge>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Members List */}
      <div className="grid gap-4">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{member.name}</h3>
                      {getRoleBadge(member.role)}
                      {!member.isActive && (
                        <Badge variant="outline" className="border-muted text-muted-foreground">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>{member.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {new Date(member.joinDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-sm font-medium">{member.creditsBalance}</div>
                    <div className="text-xs text-muted-foreground">Credits</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm font-medium">{member.meetingsAttended}</div>
                    <div className="text-xs text-muted-foreground">Meetings</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm font-medium">{member.totalTrades}</div>
                    <div className="text-xs text-muted-foreground">Trades</div>
                  </div>

                  <Link to={`/admin/members/${member.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              No members found matching "{searchTerm}"
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Members;