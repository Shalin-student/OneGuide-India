import React from 'react';
import { CheckCircle2, User, MapPin, GraduationCap, IndianRupee, Briefcase } from 'lucide-react';
import type { GovernmentResource } from './types';

interface EligibilitySectionProps {
  resource: GovernmentResource;
}

export const EligibilitySection: React.FC<EligibilitySectionProps> = ({ resource }) => {
  const e = resource.eligibility;
  if (!e || Object.keys(e).length === 0) return null;

  return (
    <section id="eligibility" className="scroll-mt-32">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">
        <CheckCircle2 className="text-primary-600" /> Eligibility Criteria
      </h2>
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        
        {e.overview && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Overview</h3>
            <p className="text-gray-700 leading-relaxed">{e.overview}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {e.age && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-500">
                <User size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Age Requirement</h4>
                <p className="text-slate-600 text-sm mt-1">
                  {typeof e.age === 'string' ? e.age : 
                    `${e.age.min ? `Min: ${e.age.min} ` : ''}${e.age.max ? `Max: ${e.age.max}` : ''}`}
                </p>
              </div>
            </div>
          )}

          {e.qualification && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-500">
                <GraduationCap size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Education</h4>
                <p className="text-slate-600 text-sm mt-1">{e.qualification}</p>
              </div>
            </div>
          )}

          {e.incomeLimit && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-500">
                <IndianRupee size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Income Limit</h4>
                <p className="text-slate-600 text-sm mt-1">{e.incomeLimit}</p>
              </div>
            </div>
          )}

          {e.occupation && e.occupation.length > 0 && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-500">
                <Briefcase size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Occupation Status</h4>
                <p className="text-slate-600 text-sm mt-1">{e.occupation.join(', ')}</p>
              </div>
            </div>
          )}

          {resource.location?.state && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-500">
                <MapPin size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">State / Domicile</h4>
                <p className="text-slate-600 text-sm mt-1">Must be a resident of {resource.location.state}</p>
              </div>
            </div>
          )}
        </div>

        {/* Tags for specific status */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
          {e.student && (
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">Student</span>
          )}
          {e.disability && (
            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full">Persons with Disabilities</span>
          )}
          {e.targetAudience?.includes('BPL') && (
            <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full">Below Poverty Line (BPL)</span>
          )}
          {e.socialCategory && e.socialCategory.length > 0 && e.socialCategory.map(cat => (
             <span key={cat} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">{cat}</span>
          ))}
          {e.gender && e.gender.length > 0 && e.gender.map(g => (
             <span key={g} className="px-3 py-1 bg-pink-50 text-pink-700 text-xs font-bold rounded-full">{g} Only</span>
          ))}
        </div>
      </div>
    </section>
  );
};
