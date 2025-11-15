import { createContext } from 'react';
import type { SharedState } from '../types/state.types';

export const SharedStateContext = createContext<SharedState | undefined>(undefined);
