import React from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

export const PersonalizedDiscovery = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/register');
    } else {
      navigate('/onboarding');
    }
  };

  return (
    <section className="py-10 md:py-12 bg-transparent">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4 flex items-center justify-center gap-3"
          >
            <Sparkles className="text-orange-500" size={32} />
            Find Opportunities for Me
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            Tell us about your interests and goals, and OneGuide will find relevant government opportunities and services for you.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-primary-100 text-center"
        >
          <div className="flex justify-center">
            <button
              onClick={handleSearch}
              className="bg-primary-600 hover:bg-primary-700 text-white px-10 py-5 rounded-full text-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-3 group w-full md:w-auto justify-center"
            >
              <Sparkles size={24} className="text-primary-200" />
              Find Opportunities For Me
              <ArrowRight size={24} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
