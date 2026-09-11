import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import { ServiceCard } from '../../components/ui/ServiceCard';
import { SkeletonCard } from '../../components/ui/SkeletonCard';

export const RecommendedForYou = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'ai_ranked' | 'deterministic'>('ai_ranked');
  const { t } = useTranslation();

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const res = await api.get('/recommendations');
        if (res.data?.status === 'success' && res.data.data) {
          setRecommendations(res.data.data);
          setMode(res.data.mode || 'ai_ranked');
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
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t('recommendations.title')}</h2>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-slate-500 font-medium text-sm">{t('recommendations.subtitle')}</p>
              {!loading && recommendations.length > 0 && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${mode === 'ai_ranked' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                  {mode === 'ai_ranked' ? t('recommendations.aiRanked') : t('recommendations.standardMatch')}
                </span>
              )}
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
                className="flex flex-col"
              >
                <ServiceCard service={service} />
                <div className="mt-2 bg-orange-50 text-orange-800 text-xs font-medium px-4 py-2 rounded-lg flex items-start gap-2 border border-orange-100 shadow-sm">
                  <Sparkles size={14} className="text-orange-500 shrink-0 mt-0.5" />
                  <span>{service.matchReason}</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 mb-6 border border-slate-100">
               <BookOpen className="text-slate-300" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{t('recommendations.comingSoon')}</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              We are constantly analyzing opportunities. Keep your profile updated for the best matches.
            </p>
            <Link 
              to="/services"
              className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-md hover:bg-primary-700 transition-all inline-block"
            >
              Browse All Services
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
