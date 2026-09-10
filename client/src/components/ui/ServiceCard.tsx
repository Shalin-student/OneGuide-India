import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Building2, ChevronRight, FileText } from 'lucide-react';
import { motion } from 'motion/react';

interface ServiceCardProps {
  service: {
    _id: string;
    name: string;
    description: string;
    categoryId?: { name: string };
    governmentDepartment?: string;
    stateOrCentral?: string;
    slug: string;
  };
}

export const ServiceCard = ({ service }: ServiceCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white p-6 border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 group flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-4 gap-3">
        <h3 className="text-[1.15rem] font-bold text-slate-800 leading-snug group-hover:text-primary-700 transition-colors">
          {service.name}
        </h3>
        <span className="bg-primary-50 text-primary-700 border border-primary-200/50 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-bold whitespace-nowrap shrink-0">
          {service.categoryId?.name || 'Service'}
        </span>
      </div>
      
      <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
        {service.description}
      </p>
      
      <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-slate-100">
        <div className="flex items-center text-xs font-medium text-slate-500">
          <Building2 size={14} className="mr-2 text-slate-400" />
          <span className="truncate">{service.governmentDepartment || 'General Department'}</span>
        </div>
        <div className="flex items-center text-xs font-medium text-slate-500">
          <MapPin size={14} className="mr-2 text-slate-400" />
          <span>{service.stateOrCentral || 'Central Government'}</span>
        </div>
      </div>
      
      <Link 
        to={`/service/${service.slug}`} 
        className="mt-6 flex items-center justify-center gap-2 w-full text-center bg-slate-50 hover:bg-primary-600 text-slate-700 hover:text-white border border-slate-200 hover:border-primary-600 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
      >
        <FileText size={16} />
        View Details
        <ChevronRight size={16} className="opacity-70 group-hover:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  );
};
