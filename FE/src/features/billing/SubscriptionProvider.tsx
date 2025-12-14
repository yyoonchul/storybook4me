import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useSession, useUser } from "@clerk/clerk-react";
import { billingApi, type PlanType } from "./api";

const SESSION_STORAGE_KEY = "subscription_plan_type";

type SubscriptionContextValue = {
  planType: PlanType;
  isLoading: boolean;
  error: string | null;
  refreshSubscription: () => Promise<void>;
};

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { session, isLoaded: isSessionLoaded } = useSession();
  const { user, isLoaded: isUserLoaded } = useUser();
  const [planType, setPlanType] = useState<PlanType>("free");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  const refreshSubscription = useCallback(async () => {
    if (!session || !isSessionLoaded) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = await session.getToken({ template: "storybook4me" });
      const response = await billingApi.getSubscription(token || undefined);
      
      const newPlanType = response.plan_type || "free";
      setPlanType(newPlanType);
      
      // Store in sessionStorage
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, newPlanType);
      } catch (e) {
        // Ignore sessionStorage errors (e.g., in private browsing)
        console.warn("Failed to save subscription to sessionStorage:", e);
      }
    } catch (err: any) {
      console.error("Failed to fetch subscription:", err);
      setError(err?.message || "Failed to fetch subscription");
      // Default to "free" on error
      setPlanType("free");
    } finally {
      setIsLoading(false);
    }
  }, [session, isSessionLoaded]);

  // Load subscription on mount or when session becomes available
  useEffect(() => {
    if (!isSessionLoaded || !isUserLoaded) {
      return;
    }

    // If user is signed out, clear sessionStorage and reset to free
    if (!user || !session) {
      try {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      } catch (e) {
        // Ignore sessionStorage errors
      }
      setPlanType("free");
      setHasLoaded(true);
      return;
    }

    // Check sessionStorage first
    try {
      const cached = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (cached === "free" || cached === "plus") {
        setPlanType(cached);
        setHasLoaded(true);
        return;
      }
    } catch (e) {
      // Ignore sessionStorage errors
    }

    // If not cached, fetch from API
    if (!hasLoaded && !isLoading) {
      refreshSubscription().then(() => {
        setHasLoaded(true);
      });
    }
  }, [isSessionLoaded, isUserLoaded, user, session, hasLoaded, refreshSubscription]);

  // Clear sessionStorage on sign out
  useEffect(() => {
    if (isUserLoaded && !user) {
      try {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      } catch (e) {
        // Ignore sessionStorage errors
      }
      setPlanType("free");
      setHasLoaded(false);
    }
  }, [isUserLoaded, user]);

  return (
    <SubscriptionContext.Provider
      value={{
        planType,
        isLoading,
        error,
        refreshSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};

