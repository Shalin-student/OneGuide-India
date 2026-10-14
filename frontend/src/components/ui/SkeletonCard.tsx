import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="bg-white p-5 md:p-6 border border-slate-100 rounded-2xl shadow-sm animate-pulse h-full flex flex-col">
      <div className="flex justify-between items-start mb-2 gap-4">
        <div className="h-7 bg-slate-200 rounded w-2/3"></div>
        <div className="h-6 w-6 bg-slate-200 rounded-full shrink-0 mt-1"></div>
      </div>

      <div className="h-4 bg-slate-200 rounded w-1/3 mb-5"></div>
      
      <div className="space-y-3 mb-6 flex-grow">
        <div className="h-3.5 bg-slate-200 rounded w-full"></div>
        <div className="h-3.5 bg-slate-200 rounded w-full"></div>
        <div className="h-3.5 bg-slate-200 rounded w-4/5"></div>
      </div>
      
      <div className="flex gap-2 mt-auto pt-2">
        <div className="h-7 w-20 bg-slate-200 rounded-full border border-slate-200 bg-transparent"></div>
        <div className="h-7 w-24 bg-slate-200 rounded-full border border-slate-200 bg-transparent"></div>
      </div>
    </div>
  );
};
