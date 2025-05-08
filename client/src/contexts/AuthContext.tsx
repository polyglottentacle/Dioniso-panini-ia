import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { User } from "@/lib/data";

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  
  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }
  }, []);
  
  // Mock login function (for demo)
  const login = () => {
    // Create a mock user for demonstration
    const demoUser: User = {
      id: 1,
      displayName: "Marco Fischer",
      email: "marco.fischer@example.com",
      loyaltyPoints: 320,
      loyaltyLevel: "silver"
    };
    
    setUser(demoUser);
    localStorage.setItem('user', JSON.stringify(demoUser));
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
