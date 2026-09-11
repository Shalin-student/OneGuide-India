import React from 'react';
import { ExternalLink, CheckCircle2 } from 'lucide-react';
import type { GovernmentResource } from './types';

interface OfficialSourcesProps {
  resource: GovernmentResource;
}

export const OfficialSources: React.FC<OfficialSourcesProps> = ({ resource }) => {
  if (!resource.officialSources || resource.officialSources.length === 0) return null;

  return (
    <section id="sources" className="scroll-mt-32 mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">
        <ExternalLink className="text-primary-600" /> Official Sources & Verification
      </h2>
      
      <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 relative z-10 gap-4">
          <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
            This information is compiled from official government sources for easy reference. 
            Always verify details on the official portals before applying.
          </p>
          
          <div className="bg-white/10 px-4 py-2 rounded-lg border border-white/5 flex flex-col">
            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Status</span>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span className="text-sm font-bold text-white">{resource.verification?.status || 'Verified'}</span>
            </div>
            {resource.verification?.lastVerified && (
              <span className="text-xs text-gray-400 mt-1">
                Last checked: {new Date(resource.verification.lastVerified).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
          {resource.officialSources.map((source, i) => (
            <a 
              key={i}
              href={source.sourceURL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary-500/30 rounded-xl transition-all group"
            >
              <span className="text-xs text-gray-400 mb-1">{source.sourceType || 'Official Link'}</span>
              <span className="font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-1">{source.sourceName}</span>
              <span className="text-xs text-gray-400 flex items-center gap-1 mt-auto">
                Visit Source <ExternalLink size={10} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
