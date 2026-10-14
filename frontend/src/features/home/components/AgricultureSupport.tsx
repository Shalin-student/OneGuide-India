import React from "react";
import { Link } from "react-router-dom";
import { Sprout, CloudSun, Tractor, Leaf, ArrowRight } from "lucide-react";
import farmerImg from "../../../assets/farmer.png";

const farmerServices = [
  {
    title: 'Farmer Schemes & Subsidies',
    description: 'Financial support, PM-Kisan, and equipment subsidies for agricultural growth.',
    icon: Sprout,
    path: '/services?search=agriculture'
  },
  {
    title: 'Crop & Weather Advisory',
    description: 'Real-time weather updates, crop insurance, and seasonal farming advice.',
    icon: CloudSun,
    path: '/services?search=advisory'
  },
  {
    title: 'Market Prices & Portals',
    description: 'e-NAM, MSP information, and direct market access for selling produce.',
    icon: Tractor,
    path: '/services?search=market'
  },
  {
    title: 'Soil & Fertilizer Support',
    description: 'Soil health cards, fertilizer subsidies, and organic farming initiatives.',
    icon: Leaf,
    path: '/services?search=soil'
  }
];

export const AgricultureSupport = () => {
  return (
    <section className="py-20 md:py-28 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          
          {/* Left Side: Image */}
          <div className="w-full lg:w-1/2">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
              <img
                src={farmerImg}
                alt="Indian Farmer working in a lush green field"
                className="w-full h-full object-cover aspect-[4/3] sm:aspect-auto sm:h-[600px]"
              />
              <div className="absolute inset-0 bg-slate-900/10 mix-blend-multiply pointer-events-none"></div>
            </div>
          </div>

          {/* Right Side: Content */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-emerald-50 border border-emerald-100 mb-6 w-fit">
              <Sprout size={16} className="text-emerald-700" />
              <span className="text-xs font-bold text-emerald-800 tracking-widest uppercase">
                Agriculture Sector
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6 text-slate-900 leading-tight">
              Dedicated Support for <br />
              <span className="text-emerald-700">Indian Farmers</span>
            </h2>

            <p className="text-lg text-slate-600 font-medium leading-relaxed mb-10 max-w-lg">
              Navigate dedicated resources, schemes, and portals to assist with cultivation, financing, and selling produce directly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
              {farmerServices.map((service, index) => {
                const Icon = service.icon;
                return (
                  <Link 
                    key={index} 
                    to={service.path}
                    className="group flex flex-col items-start"
                  >
                    <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                      <Icon size={24} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-[17px] font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      {service.description}
                    </p>
                  </Link>
                );
              })}
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100">
              <Link 
                to="/services/category/Agriculture%20Services"
                className="inline-flex items-center gap-2 text-emerald-700 font-bold hover:text-emerald-800 transition-colors"
              >
                Explore all agriculture services <ArrowRight size={18} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
