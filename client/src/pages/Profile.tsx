import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, Loader2, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, checkAuth } = useAuth();
  const { t, i18n } = useTranslation();
  
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    age: '',
    state: '',
    district: '',
    educationLevel: '',
    employmentStatus: '',
    annualIncomeRange: '',
    socialCategory: '',
    gender: '',
    preferredLanguage: 'en',
    disabilityStatus: 'none',
    userInterests: [] as string[]
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/profile');
        const data = response.data.data;
        setProfile(data);
        setFormData({
          age: data.age || '',
          state: data.state || '',
          district: data.district || '',
          educationLevel: data.educationLevel || '',
          employmentStatus: data.employmentStatus || '',
          annualIncomeRange: data.annualIncomeRange || '',
          socialCategory: data.socialCategory || '',
          gender: data.gender || '',
          preferredLanguage: data.preferredLanguage || 'en',
          disabilityStatus: data.disabilityStatus || 'none',
          userInterests: data.userInterests || []
        });
      } catch (error) {
        console.error('Error fetching profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const response = await api.patch('/users/profile', formData);
      setProfile(response.data.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      // Refresh global auth context
      await checkAuth();
      
      setTimeout(() => setMessage(null), 5000);
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update profile' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50 pt-20">
        <Loader2 className="animate-spin text-[#f05c19]" size={48} />
      </div>
    );
  }

  const completeness = profile?.completeness?.percentage || 0;

  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-3xl shrink-0 border border-blue-100">
            {profile?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-slate-900">{profile?.name}</h1>
            <p className="text-slate-500 mt-1">{profile?.email}</p>
            <div className="mt-3 flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                <User size={14} /> {profile?.role === 'admin' ? 'Administrator' : 'Citizen'}
              </span>
              {profile?.onboardingCompleted && (
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium border border-emerald-200">
                  <CheckCircle2 size={14} /> Onboarded
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
            {profile?.role === 'admin' && (
              <Link to="/admin" className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-medium text-center hover:bg-slate-800 transition shadow-sm">
                Admin Dashboard
              </Link>
            )}
            <button onClick={handleLogout} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition shadow-sm">
              <LogOut size={18} /> {t('navigation.logout')}
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Completeness Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800">{t('profile.completeness')}</h2>
              <span className="text-lg font-extrabold text-[#f05c19]">{completeness}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 mb-4 overflow-hidden">
              <div 
                className="bg-[#f05c19] h-3 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${completeness}%` }}
              ></div>
            </div>
            {profile?.completeness?.missingFields?.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                <span className="font-semibold flex items-center gap-2 mb-1">
                  <AlertCircle size={16} /> 
                  Missing fields preventing better recommendations:
                </span>
                <span className="ml-6 text-amber-700">
                  {profile.completeness.missingFields.join(', ')}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Basic Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-5">
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                <input 
                  type="number" 
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full border-slate-300 rounded-xl shadow-sm focus:border-[#f05c19] focus:ring-[#f05c19]" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange}
                  className="w-full border-slate-300 rounded-xl shadow-sm focus:border-[#f05c19] focus:ring-[#f05c19]"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="transgender">Transgender</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                <input 
                  type="text" 
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full border-slate-300 rounded-xl shadow-sm focus:border-[#f05c19] focus:ring-[#f05c19]" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">District</label>
                <input 
                  type="text" 
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full border-slate-300 rounded-xl shadow-sm focus:border-[#f05c19] focus:ring-[#f05c19]" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Language</label>
                <select 
                  name="preferredLanguage" 
                  value={formData.preferredLanguage} 
                  onChange={handleChange}
                  className="w-full border-slate-300 rounded-xl shadow-sm focus:border-[#f05c19] focus:ring-[#f05c19]"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="gu">Gujarati</option>
                </select>
              </div>
            </div>

            {/* Eligibility Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-5">
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Education & Eligibility</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Education Level</label>
                <select 
                  name="educationLevel" 
                  value={formData.educationLevel} 
                  onChange={handleChange}
                  className="w-full border-slate-300 rounded-xl shadow-sm focus:border-[#f05c19] focus:ring-[#f05c19]"
                >
                  <option value="">Select Education</option>
                  <option value="10th Pass">10th Pass</option>
                  <option value="12th Pass">12th Pass</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                  <option value="Diploma">Diploma / ITI</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Employment Status</label>
                <select 
                  name="employmentStatus" 
                  value={formData.employmentStatus} 
                  onChange={handleChange}
                  className="w-full border-slate-300 rounded-xl shadow-sm focus:border-[#f05c19] focus:ring-[#f05c19]"
                >
                  <option value="">Select Status</option>
                  <option value="student">Student</option>
                  <option value="employed">Employed</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="self-employed">Self Employed</option>
                  <option value="retired">Retired</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Social Category</label>
                <select 
                  name="socialCategory" 
                  value={formData.socialCategory} 
                  onChange={handleChange}
                  className="w-full border-slate-300 rounded-xl shadow-sm focus:border-[#f05c19] focus:ring-[#f05c19]"
                >
                  <option value="">Select Category</option>
                  <option value="general">General</option>
                  <option value="obc">OBC</option>
                  <option value="sc">SC</option>
                  <option value="st">ST</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Annual Income</label>
                <select 
                  name="annualIncomeRange" 
                  value={formData.annualIncomeRange} 
                  onChange={handleChange}
                  className="w-full border-slate-300 rounded-xl shadow-sm focus:border-[#f05c19] focus:ring-[#f05c19]"
                >
                  <option value="">Select Income Range</option>
                  <option value="0-2.5L">Less than ₹2.5 Lakhs</option>
                  <option value="2.5L-5L">₹2.5L - ₹5 Lakhs</option>
                  <option value="5L-8L">₹5L - ₹8 Lakhs</option>
                  <option value="8L+">Above ₹8 Lakhs</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Disability Status</label>
                <select 
                  name="disabilityStatus" 
                  value={formData.disabilityStatus} 
                  onChange={handleChange}
                  className="w-full border-slate-300 rounded-xl shadow-sm focus:border-[#f05c19] focus:ring-[#f05c19]"
                >
                  <option value="none">None</option>
                  <option value="physical">Physical Disability</option>
                  <option value="visual">Visual Impairment</option>
                  <option value="hearing">Hearing Impairment</option>
                  <option value="other">Other</option>
                </select>
              </div>

            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 border border-slate-200 rounded-2xl shadow-sm sticky bottom-6 z-10">
            <div className="flex-1">
              {message && (
                <div className={`text-sm font-medium flex items-center gap-2 ${message.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  {message.text}
                </div>
              )}
            </div>
            <button 
              type="submit" 
              disabled={saving}
              className="w-full sm:w-auto bg-[#f05c19] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-[#e04c09] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
              {t('profile.saveChanges')}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default Profile;
