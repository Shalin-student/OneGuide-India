import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterSectionProps {
  id: string;
  title: string;
  options: FilterOption[];
  selectedValue: string | string[]; // Using single string for exact match, or array for multi
  onChange: (value: string) => void;
  isMultiSelect?: boolean;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  options,
  selectedValue,
  onChange,
  isMultiSelect = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const isChecked = (val: string) => {
    if (isMultiSelect && Array.isArray(selectedValue)) {
      return selectedValue.includes(val);
    }
    return selectedValue === val;
  };

  return (
    <div className="border-b border-slate-200 py-2">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex w-full items-center justify-between rounded-xl px-2 py-1.5 text-left outline-none transition-all duration-200 hover:bg-slate-50 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-primary-500"
        aria-expanded={isOpen}
      >
        <span className="font-bold text-slate-800 text-sm tracking-wide">{title}</span>
        <span className={`flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-200 group-hover:border-primary-300 group-hover:text-primary-600 ${isOpen ? 'scale-105 border-primary-300 text-primary-600' : ''}`}>
          {isOpen ? <Minus size={14} aria-hidden="true" /> : <Plus size={14} aria-hidden="true" />}
        </span>
      </button>

      {isOpen && (
        <div className="mt-2 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative flex items-center justify-center">
                <input
                  type={isMultiSelect ? 'checkbox' : 'radio'}
                  checked={isChecked(option.value)}
                  onChange={() => onChange(option.value)}
                  className="peer sr-only"
                />
                <div
                  className={`w-5 h-5 flex items-center justify-center border-2 rounded transition-all ${
                    isChecked(option.value)
                      ? 'bg-primary-600 border-primary-600'
                      : 'bg-white border-slate-300 group-hover:border-primary-400'
                  } ${!isMultiSelect ? 'rounded-full' : 'rounded'}`}
                >
                  {isChecked(option.value) && (
                    <div className={!isMultiSelect ? 'w-2 h-2 rounded-full bg-white' : 'text-white'}>
                      {isMultiSelect && (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <span className="text-slate-600 text-sm font-medium group-hover:text-slate-900 transition-colors">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
