import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="bg-white p-6 border border-slate-100 rounded-2xl shadow-sm animate-pulse h-full flex flex-col">
      <div className="flex justify-between items-start mb-4 gap-3">
        <div className="h-6 bg-slate-200 rounded w-3/4"></div>
        <div className="h-6 bg-slate-200 rounded-full w-20 shrink-0"></div>
      </div>
      
      <div className="space-y-2 mb-6 flex-grow">
        <div className="h-3 bg-slate-200 rounded w-full"></div>
        <div className="h-3 bg-slate-200 rounded w-full"></div>
        <div className="h-3 bg-slate-200 rounded w-4/5"></div>
      </div>
      
      <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-slate-200 rounded-full"></div>
          <div className="h-3 bg-slate-200 rounded w-1/2"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-slate-200 rounded-full"></div>
          <div className="h-3 bg-slate-200 rounded w-1/3"></div>
        </div>
      </div>
      
      <div className="mt-6 h-10 bg-slate-200 rounded-xl w-full"></div>
    </div>
  );
};
