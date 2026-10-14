import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import type { GovernmentResource } from './types';

export const ResourceBreadcrumbs = ({ resource }: { resource: GovernmentResource }) => {
  return (
    <nav className="flex items-center text-sm font-medium text-slate-500 mb-6 overflow-hidden w-full whitespace-nowrap" aria-label="Breadcrumb">
      <Link to="/" className="hover:text-primary-600 transition-colors flex items-center gap-1.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-sm">
        <Home size={14} />
        <span className="hidden sm:inline">Home</span>
      </Link>
      
      <ChevronRight size={14} className="mx-2 shrink-0 text-slate-400" />
      
      <Link to={`/explore?module=${encodeURIComponent(resource.module)}`} className="hover:text-primary-600 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-sm">
        {resource.module || 'Resources'}
      </Link>
      
      <ChevronRight size={14} className="mx-2 shrink-0 text-slate-400" />
      
      <span className="text-slate-900 truncate font-semibold" aria-current="page">
        {resource.name}
      </span>
    </nav>
  );
};
