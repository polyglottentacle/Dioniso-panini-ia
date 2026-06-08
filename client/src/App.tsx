import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AnimationProvider, PageTransition } from "@/contexts/AnimationContext";
import { AudioProvider } from "@/contexts/AudioContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import AnimationToggle from "@/components/AnimationToggle";
import AudioToggle from "@/components/AudioToggle";
import HomePage from "@/pages/HomePage";
import DashboardPage from "@/pages/DashboardPage";
import ElenaPage from "@/pages/ElenaPage";
import BookingPage from "@/pages/BookingPage";
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
          <Route path="/dashboard" component={DashboardPage} />
          <Route path="/elena" component={ElenaPage} />
          <Route path="/prenota" component={BookingPage} />
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
            <FavoritesProvider>
              <AnimationProvider>
                <AudioProvider>
                  <TooltipProvider>
                    <Toaster />
                    <Router />
                    <AnimationToggle />
                    <AudioToggle />
                  </TooltipProvider>
                </AudioProvider>
              </AnimationProvider>
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
