import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuthActions } from "@convex-dev/auth/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "convex/react";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface User {
  _id: Id<"users">;
  name?: string;
  username?: string;
  email?: string;
  avatarUrl?: string;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
  _creationTime: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = "@framez_auth_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { signIn: convexSignIn, signOut: convexSignOut } = useAuthActions();
  const currentUser = useQuery(api.users.getCurrentUser);
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);
  
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Check for stored auth token on mount
  useEffect(() => {
    checkStoredAuth();
  }, []);

  // Update loading state when user data is fetched
  useEffect(() => {
    if (currentUser !== undefined) {
      setIsLoading(false);
    }
  }, [currentUser]);

  const checkStoredAuth = async () => {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        // Token exists, Convex will automatically restore session
        console.log("Found stored auth token");
      }
    } catch (error) {
      console.error("Error checking stored auth:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setAuthError(null);

      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("flow", "signIn");

      await convexSignIn("password", formData);

      // Store auth token
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, "authenticated");
    } catch (error) {
      // Parse error message for better user feedback
      let errorMessage = "Invalid email or password";
      
      if (error instanceof Error) {
        const message = error.message.toLowerCase();
        if (message.includes("invalidaccountid") || message.includes("invalid")) {
          errorMessage = "Invalid email or password";
        } else if (message.includes("network")) {
          errorMessage = "Network error. Please check your connection";
        } else {
          errorMessage = error.message;
        }
      }
      
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    username: string
  ) => {
    try {
      setIsLoading(true);
      setAuthError(null);

      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("flow", "signUp");

      await convexSignIn("password", formData);

      // Create user profile
      await createOrUpdateUser({
        name,
        username,
        email,
      });

      // Store auth token
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, "authenticated");
    } catch (error) {
      // Parse error message for better user feedback
      let errorMessage = "Could not create account";
      
      if (error instanceof Error) {
        const message = error.message.toLowerCase();
        if (message.includes("already exists") || message.includes("duplicate")) {
          errorMessage = "An account with this email already exists";
        } else if (message.includes("username already taken")) {
          errorMessage = "Username already taken";
        } else if (message.includes("network")) {
          errorMessage = "Network error. Please check your connection";
        } else if (!message.includes("convex") && !message.includes("request id")) {
          errorMessage = error.message;
        }
      }
      
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await convexSignOut();
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user: currentUser ?? null,
    isLoading,
    isAuthenticated: !!currentUser,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
