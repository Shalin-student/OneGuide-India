import React from 'react';
import { Target, X } from 'lucide-react';

interface ProfileFilterSummaryProps {
  isPersonalized: boolean;
  onClear: () => void;
}

export const ProfileFilterSummary: React.FC<ProfileFilterSummaryProps> = ({
  isPersonalized,
  onClear
}) => {
  if (!isPersonalized) return null;

  return (
    <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mb-6 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center shrink-0">
          <Target size={20} />
        </div>
        <div>
          <h3 className="font-bold text-primary-900 leading-tight">Personalized for you</h3>
          <p className="text-primary-700 text-sm font-medium">We've applied filters based on your profile.</p>
        </div>
      </div>
      <button 
        onClick={onClear}
        className="px-4 py-2 bg-white text-primary-600 hover:bg-primary-50 hover:text-primary-800 font-bold text-sm rounded-lg border border-primary-200 shadow-sm transition-all focus:outline-none"
      >
        Clear Profile
      </button>
    </div>
  );
};
