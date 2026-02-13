import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sparkles, Moon, Bell, LogOut, User, Settings } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { href: "/", label: "Dashboard", active: location === "/" },
    { href: "/recommendations", label: "Recommendations", active: location === "/recommendations" },
    { href: "/wardrobe", label: "My Wardrobe", active: location === "/wardrobe" },
    { href: "/profile", label: "Profile", active: location === "/profile" },
  ];

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50" data-testid="navbar">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="text-primary-foreground" size={16} />
              </div>
              <span className="text-xl font-bold font-serif text-primary">Wearorithm</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={`transition-colors font-medium ${
                  item.active 
                    ? "text-foreground" 
                    : "text-muted-foreground hover:text-primary"
                }`}
                data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" data-testid="button-theme-toggle">
              <Moon size={18} />
            </Button>
            <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"></span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-3" data-testid="button-user-menu">
                  <span className="text-sm font-medium hidden sm:block">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center" data-testid="link-profile-menu">
                    <User size={16} className="mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings size={16} className="mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} data-testid="button-logout">
                  <LogOut size={16} className="mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
