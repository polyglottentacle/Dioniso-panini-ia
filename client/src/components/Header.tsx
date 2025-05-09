import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import CountdownTimer from "./CountdownTimer";
import LanguageSwitcher from "./LanguageSwitcher";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { t } = useLanguage();
  const { user, login, logout, loading } = useAuth();
  const { cartItems, toggleCart } = useCart();
  
  // Calculate total items in cart
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error("Errore durante il login:", error);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Errore durante il logout:", error);
    }
  };
  
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-3 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold text-fisher-blue">
              Dioniso Caffè
            </h1>

          </div>
          
          <div className="flex flex-col items-center md:items-end space-y-2">
            <CountdownTimer />
            
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              
              {/* Login funzionalità disabilitata temporaneamente */}
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-gray-300 rounded-full text-sm font-medium text-fisher-blue">
                <span>Fisher</span>
              </div>
              
              <button 
                onClick={toggleCart}
                className="relative p-2 text-fisher-blue hover:bg-fisher-gray rounded-full transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-fisher-gold text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
