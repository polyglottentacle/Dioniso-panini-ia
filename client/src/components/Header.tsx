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
            <span className="font-playfair italic text-lg text-fisher-accent">
              A.S.F. Fischer BV
            </span>
          </div>
          
          <div className="flex flex-col items-center md:items-end space-y-2">
            <CountdownTimer />
            
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              
              {loading ? (
                <div className="w-8 h-8 rounded-full animate-pulse bg-gray-200"></div>
              ) : !user ? (
                <button 
                  onClick={handleLogin}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-gray-300 rounded-full text-sm font-medium text-fisher-blue hover:bg-fisher-gray transition"
                  disabled={loading}
                >
                  <img 
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                    alt="Google logo" 
                    className="w-4 h-4" 
                  />
                  <span>{t('header.login')}</span>
                </button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center space-x-2 focus:outline-none">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium hidden md:inline">{user.displayName}</span>
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.displayName}
                          className="w-8 h-8 rounded-full border border-fisher-gray"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-fisher-blue text-white flex items-center justify-center">
                          {user.displayName.split(' ').map(name => name[0]).join('')}
                        </div>
                      )}
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem disabled className="cursor-default">
                      <div className="flex flex-col">
                        <span className="font-semibold">{user.displayName}</span>
                        <span className="text-xs text-gray-500">{user.email}</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled className="cursor-default">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-fisher-gold"></div>
                        <span>{t('header.points', { points: user.loyaltyPoints })}</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={handleLogout}>
                      {t('header.logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              
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
