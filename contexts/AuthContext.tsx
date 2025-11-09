import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuthActions } from "@convex-dev/auth/react";
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const { signIn: convexSignIn, signOut: convexSignOut } = useAuthActions();
  const currentUser = useQuery(api.users.getCurrentUser);
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);
  
  const [isLoading, setIsLoading] = useState(true);

  // Update loading state when user data is fetched
  // currentUser will be undefined while loading, null if not authenticated, or the user object if authenticated
  useEffect(() => {
    if (currentUser !== undefined) {
      setIsLoading(false);
    }
  }, [currentUser]);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("flow", "signIn");

      await convexSignIn("password", formData);
      // Convex Auth automatically persists the session via the storage adapter
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

      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("flow", "signUp");

      await convexSignIn("password", formData);
      // Convex Auth automatically persists the session via the storage adapter

      // Update user profile after successful signup
      // We'll retry a few times in case the user document isn't ready yet
      let retries = 0;
      const maxRetries = 3;
      
      while (retries < maxRetries) {
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));
          await createOrUpdateUser({
            name,
            username,
            email,
          });
          break; // Success, exit loop
        } catch (err) {
          retries++;
          if (retries >= maxRetries) {
            // If we can't update the profile, that's okay - they can do it later
            console.warn("Could not update profile immediately:", err);
          }
        }
      }
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
      
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await convexSignOut();
      // Convex Auth automatically clears the session from storage
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
