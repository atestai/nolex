import { useContext } from "react";
import { SharedStateContext } from "../context/StoreContext";
import type { SharedState } from "../types/state.types";

export function useSharedState(): SharedState {
  const context = useContext(SharedStateContext);

  if (!context) {
    throw new Error(
        "useSharedState deve essere usato dentro SharedStateProvider"
    );
  }

  return context;
}
