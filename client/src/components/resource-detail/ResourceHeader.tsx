import React from 'react';
import { Landmark, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import type { GovernmentResource } from './types';
import { SaveButton } from '../ui/SaveButton';

interface ResourceHeaderProps {
  resource: GovernmentResource;
}

export const ResourceHeader: React.FC<ResourceHeaderProps> = ({ resource }) => {
  const getVerificationIcon = () => {
    if (resource.verification?.status === 'Verified') {
      return <ShieldCheck size={16} className="text-emerald-500" />;
    }
    return <AlertTriangle size={16} className="text-amber-500" />;
  };

  return (
    <div className="bg-white border-b relative z-10 shadow-sm">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 w-full">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-primary-50 text-primary-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {resource.module || resource.resourceType}
                </span>
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Landmark size={12} /> {resource.location?.level || 'Central'}
                </span>
                <span className="bg-slate-50 text-slate-600 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-slate-200">
                  {getVerificationIcon()}
                  {resource.verification?.status || 'Active'}
                </span>
              </div>
              
              {/* @ts-ignore */}
              {resource._id && resource.resourceType && (
                <SaveButton 
                  // @ts-ignore
                  resourceId={resource._id} 
                  resourceType={resource.resourceType}
                  showLabel={true}
                  className="bg-white border border-slate-200 hover:border-[#f05c19] px-4 py-2 rounded-full shadow-sm"
                />
              )}
            </div>
            
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
              {resource.name}
            </h1>
            
            {resource.authority && (
              <p className="text-sm md:text-base text-gray-500 font-medium">
                Provided by: <span className="text-gray-700">{resource.authority}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
