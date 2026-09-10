import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Landmark, Briefcase, GraduationCap, FileCheck, Sprout } from "lucide-react";

const exploreCategories = [
  {
    title: 'Government Schemes',
    icon: Landmark,
    path: `/services?category=${encodeURIComponent('Government Schemes')}`,
    color: 'text-primary-600',
    count: 1453,
    label: 'Schemes'
  },
  {
    title: 'Government Jobs & Exams',
    icon: Briefcase,
    path: `/services?category=${encodeURIComponent('Jobs & Exams')}`,
    color: 'text-blue-600',
    count: 401,
    label: 'Jobs & Exams'
  },
  {
    title: 'Scholarships & Education',
    icon: GraduationCap,
    path: `/services?category=${encodeURIComponent('Scholarships')}`,
    color: 'text-indigo-600',
    count: 1110,
    label: 'Scholarships'
  },
  {
    title: 'Documents & Certificates',
    icon: FileCheck,
    path: `/services?category=${encodeURIComponent('Documents & Certificates')}`,
    color: 'text-slate-600',
    count: 58,
    label: 'Documents'
  },
  {
    title: 'Agriculture Services',
    icon: Sprout,
    path: `/services?category=${encodeURIComponent('Agriculture Services')}`,
    color: 'text-green-600',
    count: 862,
    label: 'Services'
  }
];

export const ExploreServices = () => {
  return (
    <section className="pt-20 pb-10 md:pt-28 md:pb-12 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4"
          >
            Find Government Services by Category
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            Explore schemes, jobs, scholarships, documents, agriculture services and other government services in one place.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
          {exploreCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Link
                  to={category.path}
                  className="group flex flex-col items-center text-center focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-xl p-3 transition-all hover:bg-slate-50/50"
                  aria-label={`Explore ${category.title}`}
                >
                  <div className="relative mb-3 w-16 h-12 flex justify-center items-center mx-auto">
                    <div className="absolute inset-0 bg-[#eef6ff] rounded-[50%] -rotate-[20deg] transform scale-125 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12"></div>
                    <Icon size={32} strokeWidth={1.5} className={`relative z-10 ${category.color} transition-transform duration-300 group-hover:scale-110`} />
                  </div>
                  <div className="text-[11px] font-medium text-primary-600 mb-1.5 uppercase tracking-wider">
                    {category.count} {category.label}
                  </div>
                  <h3 className="text-sm md:text-[14.5px] font-medium text-slate-700 group-hover:text-primary-700 transition-colors leading-snug">
                    {category.title}
                  </h3>
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
