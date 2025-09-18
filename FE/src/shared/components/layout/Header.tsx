import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { User, Settings, CreditCard, LogOut } from "lucide-react";

interface HeaderProps {
  isLoggedIn?: boolean;
  userAvatar?: string;
  userName?: string;
  onLogin?: () => void;
  onLogout?: () => void;
}

const Header = ({ isLoggedIn = false, userAvatar, userName, onLogin, onLogout }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onLogin?.();
  };

  const handleLogout = () => {
    onLogout?.();
    navigate("/");
  };

  if (isLoggedIn) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img 
                  src="/logo.png" 
                  alt="Sparkbook Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                storybook<span className="sparkle-text">4me</span>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#bookshelf" className="text-sm font-medium transition-colors hover:text-primary">
                My Bookshelf
              </a>
              <a href="#family" className="text-sm font-medium transition-colors hover:text-primary">
                My Family
              </a>
              <Link to="/explore" className="text-sm font-medium transition-colors hover:text-primary">
                Explore
              </Link>
            </nav>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem onClick={() => navigate("/settings/account")}>
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings/billing")}>
                <CreditCard className="mr-2 h-4 w-4" />
                Billing & Subscription
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <img 
                src="/logo.png" 
                alt="Sparkbook Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              storybook<span className="sparkle-text">4me</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/explore" className="text-sm font-medium transition-colors hover:text-primary">
              Explore
            </Link>
            <Link to="/pricing" className="text-sm font-medium transition-colors hover:text-primary">
              Pricing
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={handleLogin}>
            Log In
          </Button>
          <Button onClick={handleLogin}>
            Sign Up Free
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;