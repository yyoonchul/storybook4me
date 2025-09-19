import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Mail, Lock, Chrome } from "lucide-react";
import { useAuth } from "../lib/auth";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal = ({ open, onOpenChange, initialMode = 'login' }: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();

  // 모달이 열릴 때마다 initialMode로 리셋
  useEffect(() => {
    if (open) {
      setMode(initialMode);
      // 폼도 초기화
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');
      setIsLoading(false);
    }
  }, [open, initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // 실제 로그인/가입 로직이 없으므로 간단히 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 로그인 상태로 변경
    login({
      userName: name || email.split('@')[0],
      userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    });
    
    setIsLoading(false);
    onOpenChange(false);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    // Google 로그인 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    login({
      userName: 'Google User',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=google'
    });
    
    setIsLoading(false);
    onOpenChange(false);
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl rounded-2xl">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold text-center sparkle-text">
            {mode === 'login' ? 'Welcome Back!' : 'Join Storybook4me'}
          </DialogTitle>
          <DialogDescription className="text-center text-base text-gray-800">
            {mode === 'login' 
              ? 'Sign in to continue your magical storytelling journey'
              : 'Create your account and start crafting amazing stories'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Google 로그인 버튼 */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 text-base font-medium border-2 hover:bg-gray-50 transition-all duration-200"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <Chrome className="w-5 h-5 mr-3" />
            Continue with Google
          </Button>

            <div className="relative">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-4 text-sm text-gray-700 font-medium">or</span>
              </div>
            </div>

          {/* 이메일/비밀번호 폼 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 pl-4 pr-4 text-base"
                    required={mode === 'signup'}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 pl-11 pr-4 text-base"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input
                  id="password"
                  type="password"
                  placeholder={mode === 'login' ? 'Enter your password' : 'Create a password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pl-11 pr-4 text-base"
                  required
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 pl-11 pr-4 text-base"
                    required={mode === 'signup'}
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold magic-gradient text-white hover:opacity-90 transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading 
                ? (mode === 'login' ? 'Signing in...' : 'Creating account...') 
                : (mode === 'login' ? 'Sign In' : 'Create Account')
              }
            </Button>
          </form>

          {/* 모드 전환 */}
          <div className="text-center pt-4">
            <p className="text-sm text-gray-800">
              {mode === 'login' 
                ? "Don't have an account? " 
                : "Already have an account? "
              }
              <button
                type="button"
                onClick={toggleMode}
                className="font-medium text-primary hover:underline transition-colors"
                disabled={isLoading}
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
