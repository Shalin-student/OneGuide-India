import React from "react";
import { motion } from "motion/react";
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
    <section className="py-12 md:py-16 relative overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12">

          {/* Left Side: Indian Farmer Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-[45%] flex justify-center relative"
          >
            {/* Decorative background blob for the image */}
            <div className="absolute inset-0 bg-orange-300/20 rounded-full blur-[80px] -z-10" />

            <img
              src={farmerImg}
              alt="Indian Farmer working in a lush green field"
              className="w-full h-full object-cover rounded-3xl shadow-lg"
            />
          </motion.div>

          {/* Right Side: Text & Background */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-[55%] bg-[#f4fbf6] p-6 sm:p-8 lg:p-10 rounded-3xl border border-emerald-100/50 flex flex-col justify-center"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50/80 border border-orange-100 mb-4 text-xs font-bold text-orange-600">
                <Sprout size={14} /> Agriculture Sector
              </div>

              <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-3 text-slate-900 leading-tight">
                Support for <span className="text-orange-600">Farmers</span>
              </h2>

              <p className="text-base text-slate-600 font-medium leading-relaxed">
                Dedicated resources, schemes, and portals to assist farmers with cultivation, financing, and selling produce directly.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
