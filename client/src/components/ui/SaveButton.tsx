import React, { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSavedResources } from '../../context/SavedResourcesContext';
import { useNavigate } from 'react-router-dom';

interface SaveButtonProps {
  resourceId: string;
  resourceType: string;
  className?: string;
  showLabel?: boolean;
}

export const SaveButton = ({ resourceId, resourceType, className = '', showLabel = false }: SaveButtonProps) => {
  const { user } = useAuth();
  const { isSaved, saveResource, removeResource, loading } = useSavedResources();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const saved = isSaved(resourceType, resourceId);

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // Guide anonymous user to login
      navigate('/login');
      return;
    }

    if (isProcessing || loading) return;

    setIsProcessing(true);
    if (saved) {
      await removeResource(resourceType, resourceId);
    } else {
      await saveResource(resourceType, resourceId);
    }
    setIsProcessing(false);
  };

  return (
    <button
      onClick={handleToggleSave}
      disabled={isProcessing}
      aria-label={saved ? 'Remove from saved resources' : 'Save resource'}
      className={`flex items-center justify-center gap-2 transition-all duration-200 outline-none
        ${saved 
          ? 'text-[#f05c19] hover:text-orange-700' 
          : 'text-slate-400 hover:text-[#f05c19]'
        } 
        ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <Bookmark 
        size={showLabel ? 18 : 20} 
        className={saved ? 'fill-current' : ''} 
      />
      {showLabel && (
        <span className="font-semibold text-sm">
          {saved ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
};
