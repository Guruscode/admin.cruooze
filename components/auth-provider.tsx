"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "@/lib/auth";
import { userLoginService } from "@/services/auth-service";
import type { LoginCredentials } from "@/types/auth.type";
import { onAuthStateChanged, User, browserSessionPersistence } from "firebase/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    auth.setPersistence(browserSessionPersistence).catch((err) => {
      setError(err.message || "Failed to set auth persistence");
    });

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setIsLoading(false);
      },
      (err) => {
        setError(err.message || "Authentication state error");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await userLoginService(email, password);
      if (response.success) {
        setUser(response.user);
        return true;
      } else {
        setError(response.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await auth.signOut();
      setUser(null);
    } catch (err: any) {
      setError(err.message || "Failed to log out");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};