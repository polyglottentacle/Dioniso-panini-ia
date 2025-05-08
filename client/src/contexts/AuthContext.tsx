import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { User } from "@/lib/data";
import { signInWithGoogle, logoutUser, getCurrentUser } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Controlla se l'utente è già autenticato all'avvio
  useEffect(() => {
    const initAuth = async () => {
      try {
        const firebaseUser = await getCurrentUser();
        
        if (firebaseUser) {
          // Converti il FirebaseUser nel formato del nostro User
          const appUser: User = {
            id: 1, // ID temporaneo, in un'app reale dovrebbe essere generato o recuperato dal database
            displayName: firebaseUser.displayName || "Utente",
            email: firebaseUser.email || "",
            avatar: firebaseUser.photoURL || undefined,
            loyaltyPoints: 320, // Valore di default, in un'app reale dovrebbe essere recuperato dal database
            loyaltyLevel: "silver" // Valore di default, in un'app reale dovrebbe essere calcolato
          };
          
          setUser(appUser);
        }
      } catch (error) {
        console.error("Errore durante l'inizializzazione dell'auth:", error);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);
  
  // Login con Google
  const login = async () => {
    try {
      setLoading(true);
      const firebaseUser = await signInWithGoogle();
      
      if (firebaseUser) {
        // Invia le informazioni del firebaseUser al nostro backend
        const response = await fetch('/api/users/firebase-auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL
          })
        });
        
        if (!response.ok) {
          throw new Error('Errore nella risposta del server');
        }
        
        // Ottieni il nostro utente dal database
        const appUser = await response.json();
        setUser(appUser);
      }
    } catch (error) {
      console.error("Errore durante il login:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout
  const logout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error("Errore durante il logout:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
