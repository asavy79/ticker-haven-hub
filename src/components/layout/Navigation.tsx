import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { 
  TrendingUp, 
  BookOpen, 
  Users, 
  BarChart3, 
  Settings,
  LogOut,
  Key,
  FileCode,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/components/ui/use-toast";

const Navigation = () => {
  const location = useLocation();
  const { signOut, isLoading } = useAuth();

  const mainNavItems = [
    { name: "Welcome", href: "/welcome", icon: BookOpen },
    { name: "Portfolio", href: "/portfolio", icon: TrendingUp },
    { name: "Orderbook", href: "/orderbook", icon: BarChart3 },
    { name: "API Keys", href: "/api-keys", icon: Key },
    { name: "API Docs", href: "/api-docs", icon: FileCode },
  ];

  const adminNavItems = [
    { name: "Admin", href: "/admin", icon: Settings },
    { name: "Members", href: "/admin/members", icon: Users },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      toast({
        title: "Sign out failed",
        description: "There was an error signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="border-b bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/portfolio" className="text-xl font-bold text-primary">
                CU Quants
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                    )}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
              disabled={isLoading}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {isLoading ? "Signing Out..." : "Sign Out"}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;