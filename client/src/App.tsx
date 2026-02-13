import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import Recommendations from "@/pages/recommendations";
import Wardrobe from "@/pages/wardrobe";
import Profile from "@/pages/profile";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Login />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Component />
      </main>
      <Footer />
    </div>
  );
}

function PublicRoute({ component: Component }: { component: React.ComponentType }) {
  const { user } = useAuth();
  
  if (user) {
    return <Dashboard />;
  }
  
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={() => <PublicRoute component={Login} />} />
      <Route path="/register" component={() => <PublicRoute component={Register} />} />
      <Route path="/" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/recommendations" component={() => <ProtectedRoute component={Recommendations} />} />
      <Route path="/wardrobe" component={() => <ProtectedRoute component={Wardrobe} />} />
      <Route path="/profile" component={() => <ProtectedRoute component={Profile} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
