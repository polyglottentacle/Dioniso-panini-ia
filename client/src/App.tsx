import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AnimationProvider, PageTransition } from "@/contexts/AnimationContext";
import AnimationToggle from "@/components/AnimationToggle";
import HomePage from "@/pages/HomePage";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

// Component per gestire lo scroll al cambio di pagina
function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <PageTransition>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route component={NotFound} />
        </Switch>
      </PageTransition>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <AnimationProvider>
              <TooltipProvider>
                <Toaster />
                <Router />
                <AnimationToggle />
              </TooltipProvider>
            </AnimationProvider>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
