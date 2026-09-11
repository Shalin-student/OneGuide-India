import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2, Target, MapPin, Landmark, HeartHandshake, GraduationCap as GradIcon, Briefcase, Award, BookOpen, Sprout, FileText, Phone } from 'lucide-react';
import { INDIA_STATES, INDIA_STATES_AND_DISTRICTS } from '../data/indiaData';
import { useTranslation } from 'react-i18next';

const INTEREST_OPTIONS = [
  { id: 'Government Schemes & Yojanas', label: 'Government Schemes', icon: <Landmark size={24} /> },
  { id: 'Government Jobs & Exams', label: 'Government Jobs', icon: <Briefcase size={24} /> },
  { id: 'Scholarships', label: 'Scholarships', icon: <Award size={24} /> },
  { id: 'Internships', label: 'Internships', icon: <BookOpen size={24} /> },
  { id: 'Agriculture Services', label: 'Agriculture', icon: <Sprout size={24} /> },
  { id: 'Government Documents & Certificates', label: 'Documents', icon: <FileText size={24} /> },
  { id: 'Emergency Helplines', label: 'Helplines', icon: <Phone size={24} /> }
];

const LANGUAGE_OPTIONS = [
  { id: 'en', label: 'English', native: 'English' },
  { id: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { id: 'gu', label: 'Gujarati', native: 'ગુજરાતી' }
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    age: '',
    state: '',
    district: '',
    currentStatus: '',
    educationLevel: '',
    annualIncomeRange: '',
    socialCategory: '',
    gender: '',
    userInterests: [] as string[],
    preferredLanguage: 'en'
  });

  const availableDistricts = formData.state ? INDIA_STATES_AND_DISTRICTS[formData.state] || [] : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'state') {
      setFormData({ ...formData, state: value, district: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      userInterests: prev.userInterests.includes(interest) 
        ? prev.userInterests.filter(i => i !== interest)
        : [...prev.userInterests, interest]
    }));
  };

  const handleNext = () => setStep(s => Math.min(s + 1, 5));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await api.post('/auth/onboarding', {
        ...formData,
        employmentStatus: formData.currentStatus, // map for backend compatibility if needed
        age: formData.age ? parseInt(formData.age) : undefined
      });
      
      if (res.data.status === 'success') {
        window.location.href = '/'; 
      }
    } catch (err) {
      console.error('Onboarding failed', err);
      alert('Failed to save preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-64 bg-slate-900 shadow-xl" />
      
      <div className="relative z-10 max-w-3xl w-full mx-auto">
        <div className="text-center mb-10 text-white">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">{t('profile.onboardingTitle')}</h1>
          <p className="text-slate-300 text-lg max-w-xl mx-auto">
            {t('profile.onboardingSubtitle')}
          </p>
        </div>

        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-100">
          <div className="bg-slate-100 h-2 w-full">
            <motion.div 
              className="h-full bg-emerald-500" 
              initial={{ width: '20%' }}
              animate={{ width: `${(step / 5) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          <div className="p-8 sm:p-12">
            <div className="flex items-center justify-between mb-8">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Step {step} of 5</span>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><MapPin size={24} /></div>
                    <h2 className="text-2xl font-bold text-slate-800">Basic Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Age</label>
                      <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="E.g., 24" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">State</label>
                      <select name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none">
                        <option value="">Select State</option>
                        {INDIA_STATES.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">District</label>
                    <select name="district" value={formData.district} onChange={handleChange} disabled={!formData.state || formData.state === 'All India'} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none disabled:opacity-50">
                      <option value="">Select District</option>
                      {availableDistricts.map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><GradIcon size={24} /></div>
                    <h2 className="text-2xl font-bold text-slate-800">Education & Career</h2>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">What best describes you?</label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {['Student', 'Employed', 'Unemployed', 'Self-employed', 'Farmer', 'Business owner', 'Other'].map(status => (
                        <div 
                          key={status} 
                          onClick={() => setFormData({...formData, currentStatus: status, educationLevel: status !== 'Student' ? formData.educationLevel : '' })}
                          className={`cursor-pointer px-4 py-3 rounded-xl border text-center font-medium transition-all ${formData.currentStatus === status ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                        >
                          {status}
                        </div>
                      ))}
                    </div>
                  </div>

                  {formData.currentStatus === 'Student' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-4">
                      <label className="block text-sm font-bold text-slate-700 mb-2">What is your current education level?</label>
                      <select name="educationLevel" value={formData.educationLevel} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none">
                        <option value="">Select Level</option>
                        <option value="Below 10th">Below 10th</option>
                        <option value="10th Pass">10th Pass</option>
                        <option value="12th Pass">12th Pass</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Undergraduate">Undergraduate</option>
                        <option value="Postgraduate">Postgraduate</option>
                        <option value="PhD">PhD</option>
                        <option value="Other">Other</option>
                      </select>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Landmark size={24} /></div>
                    <h2 className="text-2xl font-bold text-slate-800">Financial & Eligibility</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Annual Family Income</label>
                      <select name="annualIncomeRange" value={formData.annualIncomeRange} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none">
                        <option value="">Select Range</option>
                        <option value="Below 1 Lakh">Below ₹1 Lakh</option>
                        <option value="1L - 2.5L">₹1L - ₹2.5L</option>
                        <option value="2.5L - 5L">₹2.5L - ₹5L</option>
                        <option value="5L - 8L">₹5L - ₹8L</option>
                        <option value="Above 8 Lakh">Above ₹8 Lakh</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Social Category</label>
                      <select name="socialCategory" value={formData.socialCategory} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none">
                        <option value="">Select Category (Optional)</option>
                        <option value="General">General</option>
                        <option value="OBC">OBC</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Gender</label>
                      <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none">
                        <option value="">Select Gender (Optional)</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Transgender / Other</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><HeartHandshake size={24} /></div>
                    <h2 className="text-2xl font-bold text-slate-800">What are you looking for?</h2>
                  </div>
                  
                  <p className="text-slate-500 mb-4">Select all the areas you are interested in.</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {INTEREST_OPTIONS.map(interest => (
                      <div 
                        key={interest.id} 
                        onClick={() => toggleInterest(interest.id)}
                        className={`cursor-pointer p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${formData.userInterests.includes(interest.id) ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-slate-100 text-slate-700 hover:border-slate-300 hover:bg-slate-50'}`}
                      >
                        <div className={`p-3 rounded-full ${formData.userInterests.includes(interest.id) ? 'bg-slate-800 text-emerald-400' : 'bg-slate-100 text-slate-500'}`}>
                          {interest.icon}
                        </div>
                        <span className="font-bold text-center text-sm">{interest.label}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Target size={24} /></div>
                    <h2 className="text-2xl font-bold text-slate-800">Language Preference</h2>
                  </div>

                  <p className="text-slate-500 mb-6 text-lg">Which language do you prefer for OneGuide?</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {LANGUAGE_OPTIONS.map(lang => {
                      const isSelected = formData.preferredLanguage === lang.id;
                      return (
                        <div 
                          key={lang.id}
                          onClick={() => setFormData(prev => ({ ...prev, preferredLanguage: lang.id }))}
                          className={`cursor-pointer p-6 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${isSelected ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-md' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}
                        >
                          <span className="text-3xl font-bold text-slate-800">{lang.native}</span>
                          <span className="text-sm font-medium">{lang.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-12 flex items-center justify-between pt-6 border-t border-slate-100">
              <button 
                onClick={handleBack}
                disabled={step === 1 || loading}
                className="px-6 py-3 font-bold text-slate-500 hover:text-slate-700 disabled:opacity-0 transition-colors flex items-center gap-2"
              >
                <ArrowLeft size={18} /> Back
              </button>
              
              {step < 5 ? (
                <button 
                  onClick={handleNext}
                  className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-lg flex items-center gap-2"
                >
                  Next Step <ArrowRight size={18} />
                </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
                >
                  {loading ? <><Loader2 className="animate-spin" size={18}/> Saving...</> : <><CheckCircle2 size={18} /> Complete Setup</>}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
