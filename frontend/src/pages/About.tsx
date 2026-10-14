import React from 'react';
import { ShieldCheck, Users, Search, Target, Globe, Award, ArrowRight, BookOpen, Building } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import heroImg from '../assets/about/hero.jpg';
import architectureImg from '../assets/about/architecture.jpg';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const About = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-orange-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-orange-500 blur-[120px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-emerald-500 blur-[120px] opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-slate-700 mb-8">
              <Globe size={16} className="text-orange-400" />
              <span className="text-sm font-bold tracking-widest uppercase text-slate-300">
                Transforming Civic Access
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
              Empowering Citizens <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                Through Technology.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
              OneGuide India is the unified, AI-driven platform designed to dismantle bureaucratic barriers and connect citizens directly with the resources they deserve.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x divide-slate-100"
          >
            <motion.div variants={fadeIn} className="text-center px-4">
              <h4 className="text-4xl font-extrabold text-slate-900 mb-2">8+</h4>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Resource Modules</p>
            </motion.div>
            <motion.div variants={fadeIn} className="text-center px-4">
              <h4 className="text-4xl font-extrabold text-slate-900 mb-2">29</h4>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">States Covered</p>
            </motion.div>
            <motion.div variants={fadeIn} className="text-center px-4">
              <h4 className="text-4xl font-extrabold text-slate-900 mb-2">100%</h4>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Verified Data</p>
            </motion.div>
            <motion.div variants={fadeIn} className="text-center px-4">
              <h4 className="text-4xl font-extrabold text-slate-900 mb-2">24/7</h4>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">AI Assistance</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="lg:w-1/2"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Our Mission is to <br />
                <span className="text-orange-600">Simplify the State.</span>
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Navigating government services shouldn't require a degree in bureaucracy. Millions of citizens miss out on crucial scholarships, vital agricultural subsidies, and employment opportunities simply because the discovery process is fragmented.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                We built OneGuide India to act as a definitive, single source of truth. By aggregating data across central ministries and state departments, we provide a unified gateway to the nation's public infrastructure.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2 relative"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative">
                <img 
                  src={heroImg} 
                  alt="Digital bridge connecting citizens and government" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/60 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl text-white">
                    <Building className="mb-4 text-emerald-400" size={32} />
                    <h3 className="text-xl font-bold mb-2">Bridging the Gap</h3>
                    <p className="text-slate-200 text-sm leading-relaxed">Connecting the administration's intent with the citizen's needs seamlessly.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Our Core Pillars</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              The foundation of OneGuide is built on three uncompromising principles that guide our product engineering and data operations.
            </p>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {/* Pillar 1 */}
            <motion.div variants={fadeIn} className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <Search size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Intelligent Discovery</h3>
              <p className="text-slate-600 leading-relaxed">
                Using advanced search algorithms and strict taxonomy, we ensure that you find exactly what you are looking for—without the noise.
              </p>
            </motion.div>

            {/* Pillar 2 */}
            <motion.div variants={fadeIn} className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Absolute Trust</h3>
              <p className="text-slate-600 leading-relaxed">
                Every scheme, portal, and service is cross-referenced with official government sources. We never compromise on data integrity.
              </p>
            </motion.div>

            {/* Pillar 3 */}
            <motion.div variants={fadeIn} className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <Target size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Hyper-Personalization</h3>
              <p className="text-slate-600 leading-relaxed">
                Our recommendation engine analyzes your demographic profile to surface the specific opportunities you are uniquely eligible for.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2 relative"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative bg-white">
                <img 
                  src={architectureImg} 
                  alt="Modern Tech Stack" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
              </div>
            </motion.div>
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="lg:w-1/2"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Enterprise-Grade <br />
                <span className="text-emerald-600">Architecture.</span>
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                OneGuide India is powered by a modern, highly scalable data infrastructure. We securely process millions of civic data points to ensure you always get real-time, accurate, and personalized recommendations.
              </p>
              <ul className="space-y-4 text-slate-700 font-medium mb-8">
                <li className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                    <Globe size={18} />
                  </div>
                  Scalable Cloud Delivery Network
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                    <ShieldCheck size={18} />
                  </div>
                  End-to-End Data Encryption
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                    <Target size={18} />
                  </div>
                  Real-time ML Personalization Engine
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-orange-600/10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Experience the future of civic engagement.
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Join thousands of citizens who are already using OneGuide to navigate their educational, professional, and agricultural journeys.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/services" 
              className="inline-flex items-center justify-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-500 transition-colors shadow-lg shadow-orange-600/30"
            >
              Explore Services
              <ArrowRight size={20} />
            </Link>
            <Link 
              to="/onboarding" 
              className="inline-flex items-center justify-center gap-2 bg-slate-800 text-white border border-slate-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-700 transition-colors"
            >
              Personalize Your Profile
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
