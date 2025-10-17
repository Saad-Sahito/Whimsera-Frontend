"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase/client";

interface AuthContextType {
  isAuthenticated: boolean;
  setAuthenticated: (val: boolean) => void;
  userId: string | null;
  setUserId: (id: string) => void;
  isLoading: boolean;
  accessToken: string | null; // 👈 Add access token
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setAuthenticated: () => {},
  userId: null,
  setUserId: () => {},
  isLoading: true,
  accessToken: null, // 👈 Default to null
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null); // 👈 Store token

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        console.log("Initial session:", data.session);
        if (error) {
          console.error("Error fetching session:", error.message);
          setIsAuthenticated(false);
          setUserId(null);
          setAccessToken(null);
          return;
        }
        if (data.session?.user) {
          setIsAuthenticated(true);
          setUserId(data.session.user.id);
          setAccessToken(data.session.access_token); // 👈 Set token
        } else {
          setIsAuthenticated(false);
          setUserId(null);
          setAccessToken(null);
        }
      } catch (err) {
        console.error("Unexpected error in getSession:", err);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change:", event, session);
      if (session?.user) {
        setIsAuthenticated(true);
        setUserId(session.user.id);
        setAccessToken(session.access_token); // 👈 Update token
      } else {
        setIsAuthenticated(false);
        setUserId(null);
        setAccessToken(null);
      }
      setIsLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setAuthenticated: setIsAuthenticated, userId, setUserId, isLoading, accessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);