import React, { useState } from 'react';
import { X, CheckCircle, XCircle, AlertCircle, ArrowRight } from 'lucide-react';
import type { GovernmentResource } from './types';

interface EligibilityCheckerProps {
  resource: GovernmentResource;
  isOpen: boolean;
  onClose: () => void;
}

export const EligibilityChecker: React.FC<EligibilityCheckerProps> = ({ resource, isOpen, onClose }) => {
  const e = resource.eligibility;
  
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [result, setResult] = useState<'pending' | 'eligible' | 'ineligible' | 'unknown'>('pending');

  if (!isOpen) return null;

  // We only ask questions if we have criteria
  const hasAge = !!e?.age;
  const hasState = !!resource.location?.state;
  const hasIncome = !!e?.incomeLimit;
  const hasStudent = !!e?.student;

  const handleCheck = () => {
    let eligible = true;
    let missingInfo = false;

    if (hasAge && answers.age) {
      const ageNum = parseInt(answers.age, 10);
      if (typeof e.age !== 'string' && e.age) {
        if (e.age.min && ageNum < e.age.min) eligible = false;
        if (e.age.max && ageNum > e.age.max) eligible = false;
      }
    }

    if (hasState && answers.state) {
      if (answers.state.toLowerCase() !== resource.location.state?.toLowerCase()) {
        eligible = false;
      }
    }

    if (hasStudent && answers.isStudent === 'no') {
      eligible = false;
    }

    // A deterministic check: if any known hard criteria fail, they are ineligible.
    // If we pass all asked, but there are un-askable fields (like complex qualifications), we are 'unknown' / 'may be eligible'.
    if (!eligible) {
      setResult('ineligible');
    } else if (e.qualification || e.socialCategory?.length || e.occupation?.length || e.disability) {
      // If there are other complex criteria we didn't ask about, they MIGHT be eligible
      setResult('unknown');
    } else {
      setResult('eligible');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Quick Eligibility Check</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 bg-blue-50 text-blue-800 p-4 rounded-xl text-sm leading-relaxed border border-blue-100">
            This quick check uses the verified information we have about <strong>{resource.name}</strong>. It does not store your information.
          </div>

          {result === 'pending' ? (
            <div className="space-y-6">
              {hasAge && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">What is your age?</label>
                  <input 
                    type="number" 
                    value={answers.age || ''} 
                    onChange={e => setAnswers({...answers, age: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    placeholder="e.g. 25"
                  />
                </div>
              )}

              {hasState && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Which state are you a resident of?</label>
                  <input 
                    type="text" 
                    value={answers.state || ''} 
                    onChange={e => setAnswers({...answers, state: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    placeholder="e.g. Gujarat"
                  />
                </div>
              )}

              {hasStudent && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Are you currently a student?</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="student" 
                        value="yes"
                        checked={answers.isStudent === 'yes'}
                        onChange={e => setAnswers({...answers, isStudent: e.target.value})}
                        className="text-primary-600 focus:ring-primary-500 w-4 h-4"
                      />
                      <span className="text-sm font-medium">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="student" 
                        value="no"
                        checked={answers.isStudent === 'no'}
                        onChange={e => setAnswers({...answers, isStudent: e.target.value})}
                        className="text-primary-600 focus:ring-primary-500 w-4 h-4"
                      />
                      <span className="text-sm font-medium">No</span>
                    </label>
                  </div>
                </div>
              )}

              {/* If we have no checkable criteria */}
              {!hasAge && !hasState && !hasStudent && (
                <div className="text-slate-500 italic text-sm">
                  We don't have enough structured data to ask specific questions for this resource. Please read the eligibility criteria manually.
                </div>
              )}

              <button 
                onClick={handleCheck}
                disabled={!hasAge && !hasState && !hasStudent}
                className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Check Now <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-10 space-y-4">
              {result === 'eligible' && (
                <>
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">You appear to be eligible!</h3>
                  <p className="text-slate-600 text-sm">Based on the information provided, you meet the primary criteria for this resource.</p>
                </>
              )}
              
              {result === 'ineligible' && (
                <>
                  <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-2">
                    <XCircle size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">You may not be eligible</h3>
                  <p className="text-slate-600 text-sm">Based on your answers, you do not meet one or more mandatory criteria for this resource.</p>
                </>
              )}

              {result === 'unknown' && (
                <>
                  <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-2">
                    <AlertCircle size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">More information needed</h3>
                  <p className="text-slate-600 text-sm">You pass the basic criteria, but some eligibility information (like exact qualifications or income categories) could not be automatically verified. Please confirm the latest criteria on the official source.</p>
                </>
              )}

              <button 
                onClick={() => { setAnswers({}); setResult('pending'); }}
                className="mt-6 text-primary-600 font-bold hover:underline"
              >
                Start Over
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
