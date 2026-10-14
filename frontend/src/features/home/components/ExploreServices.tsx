import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Landmark, Briefcase, GraduationCap, Laptop, Sprout, FileCheck, Globe, PhoneCall } from "lucide-react";

export const ExploreServices = () => {
  const MODULES = [
    {
      title: "Government Schemes",
      icon: Landmark,
      color: "text-blue-600",
      bg: "bg-blue-50",
      description: "Welfare and financial assistance programs",
      path: "/services?category=Government%20Schemes"
    },
    {
      title: "Jobs & Exams",
      icon: Briefcase,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      description: "Government recruitments and test updates",
      path: "/services?category=Jobs%20%26%20Exams"
    },
    {
      title: "Scholarships",
      icon: GraduationCap,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      description: "Financial aid and educational grants",
      path: "/services/category/Scholarships"
    },
    {
      title: "Internships",
      icon: Laptop,
      color: "text-violet-600",
      bg: "bg-violet-50",
      description: "Official training and skill programs",
      path: "/services/category/Internships"
    },
    {
      title: "Agriculture Services",
      icon: Sprout,
      color: "text-green-600",
      bg: "bg-green-50",
      description: "Support and subsidies for farmers",
      path: "/services/category/Agriculture%20Services"
    },
    {
      title: "Documents & Certificates",
      icon: FileCheck,
      color: "text-amber-600",
      bg: "bg-amber-50",
      description: "Identity and official registrations",
      path: "/services/category/Documents%20%26%20Certificates"
    },
    {
      title: "Government Portals",
      icon: Globe,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      description: "Direct links to official departments",
      path: "/services/category/Government%20Portals"
    },
    {
      title: "Helplines",
      icon: PhoneCall,
      color: "text-rose-600",
      bg: "bg-rose-50",
      description: "Emergency and support contacts",
      path: "/services/category/Helplines"
    }
  ];

  return (
    <section className="pt-20 pb-16 md:pt-28 md:pb-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Explore Government Resources
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Find verified schemes, jobs, scholarships, services, documents, portals, and helplines in one place.
          </p>
        </div>

        {/* 4x2 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MODULES.map((module) => {
            const { icon: Icon, color, bg, title, description, path } = module;
            return (
              <Link
                key={title}
                to={path}
                className="group flex flex-col p-6 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                aria-label={`Explore ${title}`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${bg} ${color} shrink-0`}>
                    <Icon size={28} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[17px] font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                    {title}
                  </h3>
                </div>
                
                <p className="text-sm text-slate-500 mb-6 flex-grow leading-relaxed">
                  {description}
                </p>
                
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 mt-auto">
                  <span>Explore Resources</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="mt-16 flex justify-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
            aria-label="View all resources"
          >
            View All Resources <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </section>
  );
};
