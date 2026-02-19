import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import aiFashionIllustration from "@/assets/ai-fashion-illustration.jpeg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Invalid credentials",
      });
    }
  };

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden"
      style={{
        backgroundImage: `url(${aiFashionIllustration})`,
        backgroundSize: '110% auto',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '100vw',
        filter: 'brightness(0.92) contrast(0.95) saturate(0.92)'
      }}
    >
      {/* Premium blur overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backdropFilter: 'blur(3px) saturate(0.92)',
          WebkitBackdropFilter: 'blur(3px) saturate(0.92)',
        }}
      ></div>
      
      {/* Soft radial light effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.08) 0%, transparent 50%)',
        }}
      ></div>
      
      {/* Login Form Container */}
      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-2xl rounded-2xl">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-xl">
                <Sparkles className="text-white" size={24} />
              </div>
              <span className="text-3xl font-bold font-serif bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent tracking-wide">Wearorithm</span>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">Welcome back</CardTitle>
            <CardDescription className="text-gray-700 text-base font-medium">Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-800 font-semibold text-base">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="input-email"
                  className="rounded-xl border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition-all duration-200 bg-white/95 backdrop-blur-sm text-lg py-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-800 font-semibold text-base">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-testid="input-password"
                  className="rounded-xl border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition-all duration-200 bg-white/95 backdrop-blur-sm text-lg py-2"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg py-3" 
                disabled={isLoading}
                data-testid="button-login"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center pt-2">
            <p className="text-gray-700 font-medium">
              Don't have an account?{" "}
              <Link href="/register" className="text-purple-600 hover:text-purple-700 hover:underline font-semibold transition-colors duration-200" data-testid="link-register">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
