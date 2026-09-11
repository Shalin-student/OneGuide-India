import React from 'react';
import { ShieldCheck, Info, Calendar } from 'lucide-react';
import type { GovernmentResource } from './types';

interface ApplicationStepsProps {
  resource: GovernmentResource;
}

export const ApplicationSteps: React.FC<ApplicationStepsProps> = ({ resource }) => {
  const { application } = resource;
  if (!application) return null;

  const hasSteps = application.processSteps && 
    (Array.isArray(application.processSteps) ? application.processSteps.length > 0 : true);

  return (
    <section id="application" className="scroll-mt-32">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">
        <ShieldCheck className="text-primary-600" /> How to Apply
      </h2>
      
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-8">
        
        {/* Important Info Alert if dates/fees are present */}
        {(application.deadline || application.fees || application.processingTime || application.applicationMode) && (
          <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex gap-4">
            <Info className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-blue-900">
              <h4 className="font-bold mb-2">Important Application Information</h4>
              <ul className="space-y-1">
                {application.applicationMode && <li><strong>Mode:</strong> {application.applicationMode}</li>}
                {application.deadline && <li><strong>Deadline:</strong> {new Date(application.deadline).toLocaleDateString()}</li>}
                {application.fees && <li><strong>Fees:</strong> {application.fees}</li>}
                {application.processingTime && <li><strong>Processing Time:</strong> {application.processingTime}</li>}
              </ul>
            </div>
          </div>
        )}

        {hasSteps ? (
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-6">Step-by-step Guide</h3>
            {Array.isArray(application.processSteps) ? (
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {application.processSteps.map((step: any, i: number) => {
                  const stepText = typeof step === 'string' ? step : step.description || step.title;
                  return (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-slate-300 text-slate-500 font-bold text-xs shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                        {i + 1}
                      </div>
                      <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-sm leading-relaxed">
                        {stepText}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{application.processSteps}</p>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 mb-4">
              Detailed application steps are not available in our verified information. Please follow the instructions on the official government portal.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
