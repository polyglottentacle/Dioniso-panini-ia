import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { User } from "@/lib/data";
import { signInWithGoogle, logoutUser, getCurrentUser, handleRedirectResult } from "@/lib/firebase";

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
  
  // Controlla se l'utente è già autenticato all'avvio e gestisce il redirect
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Verifica se c'è un risultato del redirect
        const redirectUser = await handleRedirectResult();
        const firebaseUser = redirectUser || await getCurrentUser();
        
        if (firebaseUser && firebaseUser.email) {
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
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            console.error('Server error:', errorData);
            throw new Error(`Errore del server: ${errorData.error || response.statusText}`);
          }

          // Ottieni il nostro utente dal database
          const appUser = await response.json();
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
      // signInWithGoogle adesso effettua solo il redirect, non restituisce nulla
      await signInWithGoogle();
      // L'utente sarà autenticato quando tornerà al sito e verrà gestito in useEffect
    } catch (error) {
      console.error("Errore durante il login:", error);
      setLoading(false);
      throw error;
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
