import React from 'react';
import { RadioGroupContext } from '../context/RadioGroupContext.ts';
import type { RadioGroupProps } from '../types/radio.types.ts';

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value = undefined,
  onChange,
  children,
  label,
  className = '',
}) => {
  return (
    <RadioGroupContext.Provider value={{ selectedValue: value, onChange, name }}>
      <div className={`space-y-2 ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {label}
          </label>
        )}
        <div className="space-y-2">{children}</div>
      </div>
    </RadioGroupContext.Provider>
  );
};