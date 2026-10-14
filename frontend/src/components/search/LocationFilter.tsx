import React, { useState } from 'react';
import { MapPin, Minus, Plus } from 'lucide-react';
import { INDIA_STATES, INDIA_STATES_AND_DISTRICTS } from '../../data/indiaData';

interface LocationFilterProps {
  selectedState: string;
  selectedDistrict: string;
  onChange: (state: string, district: string) => void;
}

export const LocationFilter: React.FC<LocationFilterProps> = ({
  selectedState,
  selectedDistrict,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const availableDistricts = selectedState && selectedState !== 'All India' 
    ? INDIA_STATES_AND_DISTRICTS[selectedState] || [] 
    : [];

  return (
    <div className="border-b border-slate-200 py-2">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex w-full items-center justify-between rounded-xl px-2 py-1.5 text-left outline-none transition-all duration-200 hover:bg-slate-50 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-primary-500"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2 font-bold text-slate-800 text-sm tracking-wide">
          <MapPin size={16} className="text-primary-600" aria-hidden="true" />
          Location
          <span className="hidden text-xs font-medium text-slate-400 sm:inline">
            {selectedDistrict || selectedState}
          </span>
          {selectedState !== 'All India' && (
            <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-bold text-primary-700">
              Active
            </span>
          )}
        </span>
        <span className={`flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-200 group-hover:border-primary-300 group-hover:text-primary-600 ${isOpen ? 'scale-105 border-primary-300 text-primary-600' : ''}`}>
          {isOpen ? <Minus size={14} aria-hidden="true" /> : <Plus size={14} aria-hidden="true" />}
        </span>
      </button>

      {isOpen && (
        <div className="mt-2 space-y-2.5 rounded-xl bg-slate-50/70 p-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">State / UT</label>
            <select
              value={selectedState}
              onChange={(e) => onChange(e.target.value, '')}
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all appearance-none"
            >
              <option value="All India">All India</option>
              {INDIA_STATES.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => onChange(selectedState, e.target.value)}
              disabled={!selectedState || selectedState === 'All India'}
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">All Districts</option>
              {availableDistricts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
            <p className="text-[10px] font-medium text-slate-400 mt-1">Note: District filtering relies on text matching.</p>
          </div>
        </div>
      )}
    </div>
  );
};
