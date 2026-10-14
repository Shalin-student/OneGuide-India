import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../../node_modules/react-i18next';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import { ServiceCard } from '../../components/ui/ServiceCard';
import { SkeletonCard } from '../../components/ui/SkeletonCard';

export const RecommendedForYou = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchRecommendations = async () => {
      const cacheKey = `recs_${user?._id}`;
      
      const cached = sessionStorage.getItem(cacheKey);
      
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            setRecommendations(parsed);
            setLoading(false);
            return;
          }
        } catch (e) {
          // ignore cache error and fetch
        }
      }

      setLoading(true);
      try {
        const res = await api.get('/recommendations');
        if (res.data?.status === 'success' && res.data.data) {
          setRecommendations(res.data.data);
          sessionStorage.setItem(cacheKey, JSON.stringify(res.data.data));
        } else {
          setRecommendations([]);
        }
      } catch (error) {
        console.error("Failed to load recommendations", error);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchRecommendations();
    }
  }, [user]);

  if (!user) return null;

  return (
    <section className="theme-section py-12 md:py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl border border-primary-100 shadow-sm">
            <Sparkles size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t('recommendations.title')}</h2>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-slate-500 font-medium text-sm">{t('recommendations.subtitle')}</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => <SkeletonCard key={n} />)}
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((service, index) => (
              <motion.div
                key={service._id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col h-full"
              >
                <div className="flex-1">
                  <ServiceCard service={service} />
                </div>
                {service.matchReason && (
                  <div className="mt-4 bg-orange-50 text-orange-900 text-[13px] font-bold px-5 py-4 rounded-xl flex items-start gap-3 border border-orange-200/60 shadow-sm relative">
                    <div className="absolute -top-2.5 left-5 bg-white border border-orange-200 text-orange-600 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md shadow-sm">
                      Why this for you
                    </div>
                    <Sparkles size={16} className="text-orange-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{service.matchReason}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="card-base p-12 text-center max-w-2xl mx-auto mt-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-50 mb-6 border border-slate-100 shadow-inner">
              <BookOpen className="text-slate-300" size={40} />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-3 tracking-tight">{t('recommendations.comingSoon')}</h3>
            <p className="text-slate-500 font-medium text-lg mb-8 leading-relaxed">
              We are constantly analyzing opportunities. Keep your profile updated for the best matches.
            </p>
            <Link
              to="/services"
              className="bg-primary-600 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-primary-600/20 hover:bg-primary-700 hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
            >
              Browse All Services <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
