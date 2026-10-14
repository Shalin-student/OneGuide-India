import React from "react";
import { Link } from "react-router-dom";
import { Fingerprint, CreditCard, ScrollText, Home, Baby, Building2, FileText, Users, ArrowRight, CheckCircle2 } from "lucide-react";

const documents = [
  { name: 'Aadhaar Card', detail: 'Identity and address proof', icon: Fingerprint, path: '/services?search=aadhaar' },
  { name: 'PAN Card', detail: 'Tax and financial identity', icon: CreditCard, path: '/services?search=pan' },
  { name: 'Income Certificate', detail: 'Proof of annual income', icon: ScrollText, path: '/services?search=income' },
  { name: 'Caste Certificate', detail: 'Access category-based benefits', icon: Users, path: '/services?search=caste' },
  { name: 'Residence / Domicile', detail: 'Verify state residence', icon: Home, path: '/services?search=domicile' },
  { name: 'Birth Certificate', detail: 'Register and verify birth records', icon: Baby, path: '/services?search=birth' },
  { name: 'Marriage Certificate', detail: 'Official proof of marriage', icon: Building2, path: '/services?search=marriage' },
  { name: 'Other Documents', detail: 'Explore every document service', icon: FileText, path: `/services/category/${encodeURIComponent('Documents & Certificates')}` },
];

export const DocumentServices = () => {
  return (
    <section className="theme-section relative overflow-hidden py-16 md:py-24 bg-[#fafaf9] border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-primary-700 mb-4">
              <CheckCircle2 size={14} />
              Trusted citizen services
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Government documents, made simple
            </h2>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              Start with the document you need. We help you understand its purpose and find the next official step with confidence.
            </p>
          </div>
          <Link
            to={`/services/category/${encodeURIComponent('Documents & Certificates')}`}
            className="group inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm text-slate-900 font-bold shadow-sm hover:border-primary-400 hover:text-primary-600 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] transition-all"
          >
            Explore all documents <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {documents.map((doc, index) => {
            const Icon = doc.icon;
            return (
              <Link
                key={doc.name}
                to={doc.path}
                className={`group document-card relative flex min-h-44 flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-300 hover:shadow-xl active:scale-[0.99] ${index === 0 ? 'document-card-feature sm:col-span-2 lg:col-span-2 lg:row-span-2 min-h-64 bg-gradient-to-br from-primary-50 to-white p-6' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-all duration-300 group-hover:bg-primary-100 group-hover:text-primary-700 group-hover:scale-105">
                    <Icon size={24} strokeWidth={1.7} />
                  </div>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition-all duration-300 group-hover:border-primary-400 group-hover:bg-primary-600 group-hover:text-white group-hover:translate-x-0.5">
                    <ArrowRight size={16} />
                  </span>
                </div>
                <div className="relative z-10 mt-7">
                  {index === 0 && (
                    <span className="mb-2 inline-block text-[11px] font-black uppercase tracking-[0.16em] text-primary-700">
                      Most requested
                    </span>
                  )}
                  <h3 className={`${index === 0 ? 'text-2xl md:text-3xl' : 'text-lg'} font-extrabold text-slate-900 tracking-tight`}>
                    {doc.name}
                  </h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">{doc.detail}</p>
                </div>
                {index === 0 && (
                  <div className="absolute -bottom-12 -right-8 h-40 w-40 rounded-full bg-primary-100/70 transition-transform duration-500 group-hover:scale-125" />
                )}
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
};
