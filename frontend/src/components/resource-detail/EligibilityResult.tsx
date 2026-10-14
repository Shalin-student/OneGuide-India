import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, HelpCircle } from 'lucide-react';

export type EligibilityStatusType = 'ELIGIBLE' | 'MAYBE' | 'NOT_ELIGIBLE' | 'UNKNOWN';

interface EligibilityResultProps {
  status: EligibilityStatusType;
  reasons: string[];
  missingInfo: string[];
}

export const EligibilityResult = ({ status, reasons, missingInfo }: EligibilityResultProps) => {
  const config = {
    ELIGIBLE: {
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      icon: CheckCircle2,
      title: 'You appear to be eligible',
    },
    MAYBE: {
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: AlertCircle,
      title: 'You may be eligible',
    },
    NOT_ELIGIBLE: {
      color: 'text-rose-700',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      icon: XCircle,
      title: 'You do not appear to be eligible',
    },
    UNKNOWN: {
      color: 'text-slate-700',
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      icon: HelpCircle,
      title: 'Not enough information',
    }
  };

  const { color, bg, border, icon: Icon, title } = config[status];

  return (
    <div className={`rounded-2xl p-6 md:p-8 border ${border} ${bg} mb-6`}>
      <div className="flex items-start gap-4 mb-6">
        <div className={`p-2 rounded-full bg-white shadow-sm shrink-0 ${color}`}>
          <Icon size={32} />
        </div>
        <div>
          <h3 className={`text-xl font-extrabold ${color} tracking-tight`}>{title}</h3>
          {status === 'UNKNOWN' && (
            <p className="text-slate-600 mt-1.5 text-sm font-medium">
              OneGuide does not have enough verified information to determine this condition. Please verify the complete criteria on the official source.
            </p>
          )}
        </div>
      </div>

      {reasons.length > 0 && (
        <div className="mb-5 bg-white/60 rounded-xl p-4">
          <h4 className="text-sm font-bold text-slate-800 mb-3">Why?</h4>
          <ul className="space-y-2.5">
            {reasons.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 font-medium">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {missingInfo.length > 0 && (
        <div className="bg-white/60 rounded-xl p-4">
          <h4 className="text-sm font-bold text-slate-800 mb-3">Information still needed:</h4>
          <ul className="space-y-2.5">
            {missingInfo.map((info, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <span>{info}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
