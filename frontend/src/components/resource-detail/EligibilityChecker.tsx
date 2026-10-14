import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import type { GovernmentResource } from './types';
import { EligibilityResult } from './EligibilityResult';
import type { EligibilityStatusType } from './EligibilityResult';
import { useTranslation } from '../../../node_modules/react-i18next';

interface EligibilityCheckerProps {
  resource: GovernmentResource;
  isOpen: boolean;
  onClose: () => void;
}

export const EligibilityChecker: React.FC<EligibilityCheckerProps> = ({ resource, isOpen, onClose }) => {
  const { t } = useTranslation();
  const e = resource.eligibility;

  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [resultStatus, setResultStatus] = useState<EligibilityStatusType | null>(null);
  const [reasons, setReasons] = useState<string[]>([]);
  const [missingInfo, setMissingInfo] = useState<string[]>([]);

  if (!isOpen) return null;

  const hasAge = !!e?.age;
  const hasState = !!resource.location?.state;
  const hasStudent = !!e?.student;

  const handleCheck = () => {
    let isEligible = true;
    let localReasons: string[] = [];
    let localMissing: string[] = [];

    if (hasAge && answers.age) {
      const ageNum = parseInt(answers.age, 10);
      if (typeof e.age !== 'string' && e.age) {
        if (e.age.min && ageNum < e.age.min) {
          isEligible = false;
        } else if (e.age.max && ageNum > e.age.max) {
          isEligible = false;
        } else {
          localReasons.push(`Your age (${ageNum}) meets the requirement.`);
        }
      }
    } else if (hasAge) {
      localMissing.push('Age requirement');
    }

    if (hasState && answers.state) {
      if (answers.state.toLowerCase() !== resource.location.state?.toLowerCase()) {
        isEligible = false;
      } else {
        localReasons.push(`Your state (${answers.state}) matches the requirement.`);
      }
    } else if (hasState) {
      localMissing.push('State requirement');
    }

    if (hasStudent && answers.isStudent) {
      if (answers.isStudent === 'no') {
        isEligible = false;
      } else {
        localReasons.push('You meet the student status requirement.');
      }
    } else if (hasStudent) {
      localMissing.push('Student status');
    }

    if (!isEligible) {
      setResultStatus('NOT_ELIGIBLE');
    } else {
      if (e?.qualification || e?.incomeLimit || e?.socialCategory?.length || e?.disability) {
        if (e.qualification) localMissing.push('Educational qualification');
        if (e.incomeLimit) localMissing.push('Income limit');
        if (e.socialCategory?.length) localMissing.push('Social category');
        if (e.disability) localMissing.push('Disability criteria');

        setResultStatus(localReasons.length > 0 ? 'MAYBE' : 'UNKNOWN');
      } else {
        setResultStatus(localReasons.length > 0 ? 'ELIGIBLE' : 'UNKNOWN');
      }
    }

    setReasons(localReasons);
    setMissingInfo(localMissing);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl z-[100] flex flex-col transform transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">{t('resource.checkEligibility')}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!resultStatus ? (
            <div className="space-y-6">
              <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed">
                We'll ask a few quick questions based on the known criteria for this resource. Your answers are not stored.
              </p>

              {hasAge && (
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-2 uppercase tracking-wide">What is your age?</label>
                  <input
                    type="number"
                    value={answers.age || ''}
                    onChange={e => setAnswers({ ...answers, age: e.target.value })}
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none font-semibold text-slate-900 transition-all"
                    placeholder="e.g. 25"
                  />
                </div>
              )}

              {hasState && (
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-2 uppercase tracking-wide">Which state are you a resident of?</label>
                  <input
                    type="text"
                    value={answers.state || ''}
                    onChange={e => setAnswers({ ...answers, state: e.target.value })}
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none font-semibold text-slate-900 transition-all"
                    placeholder="e.g. Gujarat"
                  />
                </div>
              )}

              {hasStudent && (
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-2 uppercase tracking-wide">Are you currently a student?</label>
                  <div className="flex gap-3">
                    <label className={`flex items-center gap-2 cursor-pointer p-4 border rounded-xl flex-1 justify-center transition-all ${answers.isStudent === 'yes' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}>
                      <input
                        type="radio"
                        name="student"
                        value="yes"
                        checked={answers.isStudent === 'yes'}
                        onChange={e => setAnswers({ ...answers, isStudent: e.target.value })}
                        className="hidden"
                      />
                      <span className="text-sm font-bold">Yes</span>
                    </label>
                    <label className={`flex items-center gap-2 cursor-pointer p-4 border rounded-xl flex-1 justify-center transition-all ${answers.isStudent === 'no' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}>
                      <input
                        type="radio"
                        name="student"
                        value="no"
                        checked={answers.isStudent === 'no'}
                        onChange={e => setAnswers({ ...answers, isStudent: e.target.value })}
                        className="hidden"
                      />
                      <span className="text-sm font-bold">No</span>
                    </label>
                  </div>
                </div>
              )}

              {!hasAge && !hasState && !hasStudent && (
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium leading-relaxed">
                  We don't have enough structured data to ask specific questions for this resource. Please read the eligibility criteria manually.
                </div>
              )}

              <button
                onClick={handleCheck}
                className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
              >
                {t('resource.checkEligibility')} <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <EligibilityResult
                status={resultStatus}
                reasons={reasons}
                missingInfo={missingInfo}
              />

              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={() => {
                    if (resource.application?.url) {
                      window.open(resource.application.url, '_blank');
                    }
                  }}
                  disabled={!resource.application?.url}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('resource.visitOfficialSource')}
                </button>
                <button
                  onClick={() => { setAnswers({}); setResultStatus(null); }}
                  className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-4 px-4 rounded-xl transition-all"
                >
                  Start Over
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
