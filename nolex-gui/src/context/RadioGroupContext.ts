import { createContext } from 'react';
import type { RadioGroupContextValue } from '../types/radio.types.ts';

export const RadioGroupContext = createContext<RadioGroupContextValue | undefined>(undefined);