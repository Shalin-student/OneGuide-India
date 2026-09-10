import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Real-time Validation States
  const [passwordStrength, setPasswordStrength] = useState({
    hasLength: false,
    hasUpper: false,
    hasNumber: false,
  });
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);

  useEffect(() => {
    const p = formData.password;
    setPasswordStrength({
      hasLength: p.length >= 8,
      hasUpper: /[A-Z]/.test(p),
      hasNumber: /[0-9]/.test(p)
    });
    
    if (formData.confirmPassword.length > 0) {
      setPasswordsMatch(p === formData.confirmPassword && p.length > 0);
    } else {
      setPasswordsMatch(null);
    }
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleAuth = async (credentialResponse: any) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/google', { token: credentialResponse.credential });
      if (res.data.status === 'success') {
        setUser(res.data.data);
        if (res.data.data.onboardingCompleted === false) {
          navigate('/onboarding');
        } else {
          navigate('/');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isPasswordValid = passwordStrength.hasLength && passwordStrength.hasUpper && passwordStrength.hasNumber;
  const isFormValid = formData.name.trim() !== '' && formData.email.trim() !== '' && isPasswordValid && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isFormValid) {
      setError('Please resolve all validation errors before proceeding.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };
      
      const res = await api.post('/auth/register', payload);
      if (res.data.status === 'success' || res.status === 201 || res.status === 200) {
        setUser(res.data.data);
        navigate('/onboarding');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. This email might already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-5/12 relative bg-slate-900 overflow-hidden items-center justify-center">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop')] mix-blend-overlay opacity-20 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/90 to-blue-900/40" />
        
        <div className="relative z-10 p-12 lg:p-16 flex flex-col justify-center h-full max-w-xl">
          <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mb-8 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
            <ShieldCheck size={28} strokeWidth={2} />
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Join <span className="text-emerald-400">OneGuide</span> India
          </h1>
          <p className="text-slate-300 text-lg font-medium leading-relaxed mb-12">
            Create an account to track your eligibility, apply for government services, and get a personalized guidance experience.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-slate-200">
              <div className="bg-white/10 p-2.5 rounded-full backdrop-blur-sm border border-white/5"><CheckCircle2 size={18} className="text-emerald-400" /></div>
              <span className="font-medium">Secure & Encrypted Platform</span>
            </div>
            <div className="flex items-center gap-4 text-slate-200">
              <div className="bg-white/10 p-2.5 rounded-full backdrop-blur-sm border border-white/5"><CheckCircle2 size={18} className="text-blue-400" /></div>
              <span className="font-medium">Tailored Scheme Recommendations</span>
            </div>
            <div className="flex items-center gap-4 text-slate-200">
              <div className="bg-white/10 p-2.5 rounded-full backdrop-blur-sm border border-white/5"><CheckCircle2 size={18} className="text-amber-400" /></div>
              <span className="font-medium">Multilingual Access Across India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-7/12 flex flex-col justify-center p-6 sm:p-10 lg:p-16 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-[480px] w-full mx-auto"
        >
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Create Your OneGuide Account
            </h2>
            <p className="text-base text-slate-500 font-medium leading-relaxed">
              Create an account to get a more personalized government guidance experience.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-sm font-medium"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-sm font-medium"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full pl-11 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-sm font-medium"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {/* Password Requirements Validation */}
              <AnimatePresence>
                {formData.password.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 flex gap-4 text-xs font-medium"
                  >
                    <span className={`flex items-center gap-1.5 transition-colors ${passwordStrength.hasLength ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {passwordStrength.hasLength ? <CheckCircle2 size={14} /> : <XCircle size={14} />} 8+ characters
                    </span>
                    <span className={`flex items-center gap-1.5 transition-colors ${passwordStrength.hasUpper ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {passwordStrength.hasUpper ? <CheckCircle2 size={14} /> : <XCircle size={14} />} Uppercase
                    </span>
                    <span className={`flex items-center gap-1.5 transition-colors ${passwordStrength.hasNumber ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {passwordStrength.hasNumber ? <CheckCircle2 size={14} /> : <XCircle size={14} />} Number
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold text-slate-700 mb-2">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  className={`block w-full pl-11 pr-4 py-3.5 bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all shadow-sm font-medium ${
                    passwordsMatch === false 
                      ? 'border-rose-300 focus:ring-rose-500/50 focus:border-rose-500' 
                      : passwordsMatch === true 
                        ? 'border-emerald-300 focus:ring-emerald-500/50 focus:border-emerald-500' 
                        : 'border-slate-200 focus:ring-emerald-500/50 focus:border-emerald-500'
                  }`}
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <AnimatePresence>
                {passwordsMatch === false && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                    className="text-rose-500 text-xs font-semibold mt-2 flex items-center gap-1.5"
                  >
                    <XCircle size={14} /> Passwords do not match
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* API Error State */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-rose-50 text-rose-700 text-sm font-semibold p-4 rounded-xl border border-rose-100 flex items-start gap-3"
                >
                  <XCircle size={20} className="shrink-0 mt-0.5" />
                  <p>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Primary Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || (formData.password.length > 0 && !isFormValid)}
                className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-base font-bold rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-600/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-50 text-slate-400 font-medium">Or continue with</span>
              </div>
            </div>

            {/* Google Auth Button */}
            <div className="flex justify-center transition-all hover:scale-[1.01]">
              <GoogleLogin
                onSuccess={handleGoogleAuth}
                onError={() => setError('Google Login failed. Please try again.')}
                useOneTap
                use_fedcm_for_prompt={false}
                theme="outline"
                size="large"
                shape="rectangular"
                text="continue_with"
                width="320"
              />
            </div>
          </form>
          
          <p className="mt-8 text-center text-sm font-medium text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline transition-all">
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
