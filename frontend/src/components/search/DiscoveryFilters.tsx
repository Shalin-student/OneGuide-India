import React, { useState, type ReactNode } from 'react';
import { Minus, Plus } from 'lucide-react';
import { FilterSection } from './FilterSection';
import { LocationFilter } from './LocationFilter';

export interface DiscoveryFiltersProps {
  category: string;
  filters: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onClear: () => void;
  resultCount: number;
  categorySlot?: ReactNode;
}

const COMMON_OPTIONS = {
  yesNo: [
    { value: 'All', label: 'All' },
    { value: 'true', label: 'Yes' },
    { value: 'false', label: 'No' }
  ],
  gender: [
    { value: 'All', label: 'All' },
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' }
  ],
  socialCategory: [
    { value: 'All', label: 'All' },
    { value: 'General', label: 'General' },
    { value: 'OBC', label: 'OBC' },
    { value: 'SC', label: 'SC' },
    { value: 'ST', label: 'ST' }
  ],
  employmentStatus: [
    { value: 'All', label: 'All' },
    { value: 'Student', label: 'Student' },
    { value: 'Employed', label: 'Employed' },
    { value: 'Unemployed', label: 'Unemployed' },
    { value: 'Self-employed', label: 'Self-employed' },
    { value: 'Farmer', label: 'Farmer' },
    { value: 'Business owner', label: 'Business owner' }
  ],
  maritalStatus: [
    { value: 'All', label: 'All' },
    { value: 'Single', label: 'Single' },
    { value: 'Married', label: 'Married' },
    { value: 'Divorced', label: 'Divorced' },
    { value: 'Widowed', label: 'Widowed' }
  ],
  qualification: [
    { value: 'All', label: 'All' },
    { value: '10th Pass', label: '10th Pass' },
    { value: '12th Pass', label: '12th Pass' },
    { value: 'Diploma', label: 'Diploma' },
    { value: 'Undergraduate', label: 'Undergraduate' },
    { value: 'Postgraduate', label: 'Postgraduate' },
    { value: 'PhD', label: 'PhD' }
  ],
  jobType: [
    { value: 'All', label: 'All' },
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Part-time', label: 'Part-time' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Freelance', label: 'Freelance' }
  ]
};

const MODULE_CONFIG: Record<string, { id: string, label: string, options: any[] }[]> = {
  'Government Schemes': [
    { id: 'gender', label: 'Gender', options: COMMON_OPTIONS.gender },
    { id: 'socialCategory', label: 'Social Category (Caste)', options: COMMON_OPTIONS.socialCategory },
    { id: 'maritalStatus', label: 'Marital Status', options: COMMON_OPTIONS.maritalStatus },
    { id: 'employmentStatus', label: 'Employment Status', options: COMMON_OPTIONS.employmentStatus },
    { id: 'specialCategories', label: 'Special Categories', options: [
      { value: 'bpl', label: 'Below Poverty Line' },
      { value: 'student', label: 'Student Exclusive' },
      { value: 'disabilityStatus', label: 'Differently Abled' },
      { value: 'minorityStatus', label: 'Minority Community' }
    ]}
  ],
  'Jobs & Exams': [
    { id: 'qualification', label: 'Qualification', options: COMMON_OPTIONS.qualification },
    { id: 'jobType', label: 'Job Type', options: COMMON_OPTIONS.jobType }
  ],
  'Scholarships': [
    { id: 'qualification', label: 'Qualification', options: COMMON_OPTIONS.qualification }
  ],
  'Internships': [
    { id: 'qualification', label: 'Qualification', options: COMMON_OPTIONS.qualification }
  ],
  'Agriculture Services': [
    { id: 'gender', label: 'Gender', options: COMMON_OPTIONS.gender },
    { id: 'socialCategory', label: 'Social Category (Caste)', options: COMMON_OPTIONS.socialCategory }
  ],
  'Default': [
    { id: 'gender', label: 'Gender', options: COMMON_OPTIONS.gender },
    { id: 'socialCategory', label: 'Social Category (Caste)', options: COMMON_OPTIONS.socialCategory },
    { id: 'employmentStatus', label: 'Employment Status', options: COMMON_OPTIONS.employmentStatus },
    { id: 'specialCategories', label: 'Special Categories', options: [
      { value: 'disabilityStatus', label: 'Differently Abled' }
    ]}
  ]
};

const SpecialCategoriesFilter = ({
  options,
  filters,
  onChange
}: {
  options: any[];
  filters: Record<string, string>;
  onChange: (key: string, value: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-200 py-2">
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="group flex w-full items-center justify-between rounded-xl px-2 py-1.5 text-left transition-all duration-200 hover:bg-slate-50 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-primary-500" aria-expanded={isOpen}>
        <span className="font-bold text-slate-800 text-sm tracking-wide">Special Categories</span>
        <span className={`flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-200 group-hover:border-primary-300 group-hover:text-primary-600 ${isOpen ? 'scale-105 border-primary-300 text-primary-600' : ''}`}>
          {isOpen ? <Minus size={14} /> : <Plus size={14} />}
        </span>
      </button>
      {isOpen && (
        <div className="mt-2 space-y-1.5 px-2 animate-in fade-in slide-in-from-top-1 duration-200">
          {options.map(opt => (
            <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={filters[opt.value] === 'true' || filters[opt.value] === 'Yes'} onChange={(e) => onChange(opt.value, e.target.checked ? 'true' : 'All')} className="peer sr-only" />
              <div className={`w-5 h-5 flex items-center justify-center border-2 rounded transition-all ${(filters[opt.value] === 'true' || filters[opt.value] === 'Yes') ? 'bg-primary-600 border-primary-600' : 'bg-white border-slate-300 group-hover:border-primary-400'}`}>
                {(filters[opt.value] === 'true' || filters[opt.value] === 'Yes') && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              </div>
              <span className="text-slate-600 text-sm font-medium group-hover:text-slate-900 transition-colors">{opt.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export const DiscoveryFilters: React.FC<DiscoveryFiltersProps> = ({
  category,
  filters,
  onChange,
  onClear,
  categorySlot
}) => {
  const activeConfig = MODULE_CONFIG[category] || MODULE_CONFIG['Default'];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
          Filters
        </h3>
        <button 
          onClick={onClear}
          className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-all duration-200 active:scale-95 underline decoration-slate-300 underline-offset-4"
        >
          Reset All
        </button>
      </div>

      {categorySlot}
      
      <div className="space-y-0">
        <LocationFilter 
          selectedState={filters.state || 'All India'}
          selectedDistrict={filters.district || ''}
          onChange={(s, d) => {
            onChange('state', s);
            onChange('district', d);
          }}
        />

        {activeConfig.map((group) => {
          if (group.id === 'specialCategories') {
            return <SpecialCategoriesFilter key="specialCategories" options={group.options} filters={filters} onChange={onChange} />;
          }
          return (
            <FilterSection
              key={group.id}
              id={group.id}
              title={group.label}
              options={group.options}
              selectedValue={filters[group.id] || 'All'}
              onChange={(val) => onChange(group.id, val)}
            />
          );
        })}
      </div>
    </div>
  );
};
