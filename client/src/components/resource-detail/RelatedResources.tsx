import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Landmark } from 'lucide-react';
import type { GovernmentResource } from './types';

interface RelatedResourcesProps {
  resources: GovernmentResource[];
}

export const RelatedResources: React.FC<RelatedResourcesProps> = ({ resources }) => {
  if (!resources || resources.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resources.map((res) => (
          <Link 
            key={res.id} 
            to={`/service/${res.slug}`}
            className="group bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col h-full hover:border-primary-200"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-primary-50 text-primary-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                {res.module}
              </span>
              <span className="bg-gray-50 text-gray-600 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <Landmark size={10} /> {res.location?.level || 'Central'}
              </span>
            </div>
            
            <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
              {res.name}
            </h3>
            
            <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">
              {res.description}
            </p>
            
            <div className="flex items-center text-primary-600 text-sm font-bold mt-auto group-hover:gap-2 transition-all">
              View Details <ArrowRight size={14} className="ml-1" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
