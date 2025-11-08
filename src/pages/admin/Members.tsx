import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, User, Mail, Calendar, AlertCircle, RefreshCw } from "lucide-react";
import { AdminService } from "@/services/admin";
import { MemberWithStats, AccountRole } from "@/types/admin";

const Members = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState<MemberWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const membersData = await AdminService.getMembersWithStats();
      setMembers(membersData);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError('Failed to load members data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const getRoleBadge = (role: AccountRole | string) => {
    // Handle both enum values and string values from backend
    const normalizedRole = typeof role === 'string' ? role.toUpperCase() : role;
    
    const roleConfig = {
      [AccountRole.PRESIDENT]: { variant: "default" as const, className: "bg-primary text-primary-foreground" },
      [AccountRole.VICE_PRESIDENT]: { variant: "secondary" as const, className: "bg-secondary text-secondary-foreground" },
      [AccountRole.TREASURER]: { variant: "secondary" as const, className: "bg-secondary text-secondary-foreground" },
      [AccountRole.ADMIN]: { variant: "outline" as const, className: "border-primary text-primary" },
      [AccountRole.MODERATOR]: { variant: "outline" as const, className: "border-orange-500 text-orange-600" },
      [AccountRole.MEMBER]: { variant: "outline" as const, className: "" },
      [AccountRole.USER]: { variant: "outline" as const, className: "" }, // Handle 'user' role
      'USER': { variant: "outline" as const, className: "" }, // Handle uppercase 'USER'
    };

    const config = roleConfig[normalizedRole as keyof typeof roleConfig] || roleConfig[AccountRole.MEMBER];
    
    // Display name mapping
    const displayNames: Record<string, string> = {
      'user': 'User',
      'USER': 'User',
      'MEMBER': 'Member',
      'ADMIN': 'Admin',
      'MODERATOR': 'Moderator',
      'TREASURER': 'Treasurer',
      'VICE_PRESIDENT': 'Vice President',
      'PRESIDENT': 'President'
    };
    
    const displayName = displayNames[normalizedRole] || 
                       role.toString().toLowerCase().replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

    return (
      <Badge variant={config.variant} className={config.className}>
        {displayName}
      </Badge>
    );
  };

  const filteredMembers = members.filter(member =>
    member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    searchTerm.toLowerCase().includes(member.role.toLowerCase())
  );

  const isActive = (lastLogin: string | null) => {
    if (!lastLogin) return false;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return new Date(lastLogin) > thirtyDaysAgo;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Members</h1>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-lg px-4 py-2">
            {loading ? "Loading..." : `${members.length} Total Members`}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchMembers}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button variant="link" className="p-0 h-auto ml-2" onClick={fetchMembers}>
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members by username or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              disabled={loading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Members List */}
      <div className="grid gap-4">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 5 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          filteredMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{member.username}</h3>
                        {getRoleBadge(member.role)}
                        {!isActive(member.last_login_at) && (
                          <Badge variant="outline" className="border-muted text-muted-foreground">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>ID: {member.id}</span>
                        </div>
                        {member.last_login_at && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Last login: {new Date(member.last_login_at).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-sm font-medium">{(member.balance || 0).toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">Balance</div>
                    </div>

                    <Link to={`/admin/members/${member.id}`}>
                      <Button variant="outline" size="sm">
                        View Activity
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {!loading && filteredMembers.length === 0 && !error && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              {searchTerm ? `No members found matching "${searchTerm}"` : "No members found"}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Members;