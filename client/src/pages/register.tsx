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

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { register, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password mismatch",
        description: "Passwords do not match",
      });
      return;
    }

    try {
      await register(formData);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "Failed to create account",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center p-4 overflow-auto"
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
      
      {/* Register Form Container */}
      <div className="relative z-10 w-full max-w-lg">
        <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-xl">
                <Sparkles className="text-white" size={24} />
              </div>
              <span className="text-3xl font-bold font-serif bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent tracking-wide">Wearorithm</span>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-1">Create your account</CardTitle>
            <CardDescription className="text-gray-700 text-base font-medium">Join the AI-powered fashion revolution</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="firstName" className="text-gray-800 font-semibold text-sm">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    data-testid="input-firstname"
                    className="rounded-xl border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition-all duration-200 bg-white/95 backdrop-blur-sm text-base py-2"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lastName" className="text-gray-800 font-semibold text-sm">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    data-testid="input-lastname"
                    className="rounded-xl border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition-all duration-200 bg-white/95 backdrop-blur-sm text-base py-2"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="username" className="text-gray-800 font-semibold text-sm">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  data-testid="input-username"
                  className="rounded-xl border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition-all duration-200 bg-white/95 backdrop-blur-sm text-base py-2"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email" className="text-gray-800 font-semibold text-sm">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  data-testid="input-email"
                  className="rounded-xl border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition-all duration-200 bg-white/95 backdrop-blur-sm text-base py-2"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password" className="text-gray-800 font-semibold text-sm">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  data-testid="input-password"
                  className="rounded-xl border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition-all duration-200 bg-white/95 backdrop-blur-sm text-base py-2"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirmPassword" className="text-gray-800 font-semibold text-sm">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  data-testid="input-confirm-password"
                  className="rounded-xl border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition-all duration-200 bg-white/95 backdrop-blur-sm text-base py-2"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-base py-2" 
                disabled={isLoading}
                data-testid="button-register"
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center pt-0">
            <p className="text-gray-700 font-medium text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-600 hover:text-purple-700 hover:underline font-semibold transition-colors duration-200" data-testid="link-login">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
