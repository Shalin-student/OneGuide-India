import React from 'react';
import { Landmark } from 'lucide-react';
import type { GovernmentResource } from './types';

export const ResourceHeader = ({ resource }: { resource: GovernmentResource }) => {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="bg-primary-100 text-primary-800 text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest">
          {resource.resourceType || 'Resource'}
        </span>
        {resource.location?.level === 'State' && resource.location?.state && (
          <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest flex items-center gap-1.5">
            <Landmark size={12} /> {resource.location.state}
          </span>
        )}
        {resource.location?.level === 'Central' && (
          <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest flex items-center gap-1.5">
            <Landmark size={12} /> Central Government
          </span>
        )}
      </div>
      
      <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-4">
        {resource.name}
      </h1>
      
      {resource.authority && (
        <p className="text-base text-slate-600 font-medium flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
          Provided by <span className="text-slate-900 font-bold">{resource.authority}</span>
        </p>
      )}
    </div>
  );
};
