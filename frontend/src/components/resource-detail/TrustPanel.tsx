import React from 'react';
import { ShieldCheck, CalendarClock, Info, CheckCircle2 } from 'lucide-react';
import type { GovernmentResource } from './types';
import { useTranslation } from '../../../node_modules/react-i18next';

export const TrustPanel = ({ resource }: { resource: GovernmentResource }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-900 px-5 py-4 flex items-center gap-2">
        <ShieldCheck size={20} className="text-emerald-400" />
        <h3 className="text-white font-bold text-[13px] uppercase tracking-widest">{t('resource.trustVerification')}</h3>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-[13px] text-slate-700 font-medium leading-relaxed">
            Information sourced from available verified records
          </p>
        </div>
        {resource.officialSources && resource.officialSources.length > 0 && (
          <div className="flex items-start gap-3">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[13px] text-slate-700 font-medium leading-relaxed">
              Official source provided
            </p>
          </div>
        )}

        {resource.verification?.lastVerified && (
          <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
            <CalendarClock size={16} className="text-slate-400 shrink-0 mt-0.5" />
            <p className="text-[13px] text-slate-500 font-medium">
              Last verified: {new Date(resource.verification.lastVerified).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        )}

        <div className="flex items-start gap-3 bg-amber-50/50 p-3 rounded-xl border border-amber-100/50 mt-2">
          <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-800 font-semibold leading-relaxed">
            Government information can change. Always verify critical details on the official source before applying.
          </p>
        </div>
      </div>
    </div>
  );
};
