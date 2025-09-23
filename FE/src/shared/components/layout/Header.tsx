import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Settings, CreditCard, LogOut } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, SignUpButton, SignOutButton, UserButton, useClerk } from "@/features/auth";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { openUserProfile } = useClerk();
  

  const scrollOrNavigate = (targetId: string) => {
    if (location.pathname === "/") {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      navigate("/", { state: { scrollTo: targetId, timestamp: Date.now() } });
    }
  };

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
            <SignedIn>
              <a
                href="/#bookshelf"
                onClick={(e) => {
                  e.preventDefault();
                  scrollOrNavigate("bookshelf");
                }}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                My Bookshelf
              </a>
              <a
                href="/#family"
                onClick={(e) => {
                  e.preventDefault();
                  scrollOrNavigate("family");
                }}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                My Family
              </a>
              <Link to="/explore" className="text-sm font-medium transition-colors hover:text-primary">
                Explore
              </Link>
            </SignedIn>
            <SignedOut>
              <Link to="/explore" className="text-sm font-medium transition-colors hover:text-primary">
                Explore
              </Link>
              <Link to="/pricing" className="text-sm font-medium transition-colors hover:text-primary">
                Pricing
              </Link>
            </SignedOut>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton mode="modal" oauthFlow="popup">
              <Button variant="ghost">Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal" oauthFlow="popup">
              <Button>Sign Up</Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div>
                  <UserButton 
                    userProfileMode="modal"
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem onClick={() => openUserProfile()}>
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings/billing")}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing & Subscription
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SignOutButton redirectUrl="/">
                    <div className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </div>
                  </SignOutButton>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Header;