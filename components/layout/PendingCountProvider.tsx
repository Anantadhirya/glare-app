"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { get_unverified_count } from "./actions";

interface PendingCountContextType {
  pendingCount: number;
  refreshPendingCount: () => Promise<void>;
}

const PendingCountContext = createContext<PendingCountContextType | undefined>(
  undefined
);

export function PendingCountProvider({ children }: { children: ReactNode }) {
  const [pendingCount, setPendingCount] = useState(0);

  const refreshPendingCount = async () => {
    try {
      const count = await get_unverified_count();
      setPendingCount(count);
    } catch (err) {
      console.error("Failed to fetch pending count:", err);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => refreshPendingCount());
  }, []);

  return (
    <PendingCountContext.Provider value={{ pendingCount, refreshPendingCount }}>
      {children}
    </PendingCountContext.Provider>
  );
}

export function usePendingCount() {
  const context = useContext(PendingCountContext);
  if (context === undefined) {
    throw new Error(
      "usePendingCount must be used within a PendingCountProvider"
    );
  }
  return context;
}
