import React, { useContext } from 'react';
import { RadioGroupContext } from '../context/RadioGroupContext.js';
import type { RadioBoxProps } from '../types/radio.types.ts';

export const RadioBox: React.FC<RadioBoxProps> = ({
  value,
  label,
  description,
  disabled = false,
}) => {
  const context = useContext(RadioGroupContext);

  if (!context) {
    console.error('RadioBox deve essere usato dentro un RadioGroup');
    return null;
  }

  const { selectedValue, onChange, name } = context;
  const isSelected = selectedValue == value;
  const id = `radio-${name}-${value}`;

  console.log(selectedValue, typeof selectedValue, value ,typeof value, isSelected);
  
  return (
    <label key={id}
      htmlFor={id}
      className={`
        flex items-start gap-1 p-2 rounded-lg border-2 cursor-pointer
        transition-all duration-200
        ${isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 bg-white hover:border-gray-300'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <div className="flex items-center h-6">
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={isSelected}
          onChange={(e) => !disabled && onChange(e.target.value)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`
            w-5 h-5 rounded-full border-2 flex items-center justify-center
            transition-all duration-200
            ${isSelected
              ? 'border-blue-500 bg-white'
              : 'border-gray-300 bg-white'
            }
          `}
        >
          {isSelected && (
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          )}
        </div>
      </div>

      <div className="flex-1">
        <div className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
          {label}
        </div>
        {description && (
          <div className="text-sm text-gray-500 mt-1">{description}</div>
        )}
      </div>
    </label>
  );
};