import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, Search, Menu, X, BookOpen, Briefcase, GraduationCap, Sprout, FileText, Bookmark } from 'lucide-react';
import WebsiteLogo from '../../assets/website-logo.png';
import AshokaChakra from '../../assets/ashoka-chakra-png-46987.png';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';

export const Header = () => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const changeLanguage = async (lng: string) => {
    i18n.changeLanguage(lng);
    if (user) {
      try {
        await api.patch('/users/profile', { preferredLanguage: lng });
      } catch (error) {
        console.error('Failed to save language preference', error);
      }
    }
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-lg border-b border-slate-200/50 shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">

          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 sm:gap-4 group" aria-label="OneGuide India Home">
              <div className="flex items-center gap-2 sm:gap-3 group-hover:scale-[1.02] transition-transform duration-300">
                <img src={WebsiteLogo} alt="OneGuide India logo" className="h-11 w-11 sm:h-14 sm:w-14 object-contain rounded-full" />
                <span className="font-extrabold text-xl sm:text-[1.7rem] tracking-tight text-slate-800 transition-colors">
                  OneGuide <span className="text-orange-500">In</span><span className="text-slate-800">d</span><span className="text-primary-600">ia</span>
                </span>
                <div className="hidden sm:block h-8 w-[1px] bg-slate-300/60 mx-1"></div>
                <img src={AshokaChakra} alt="Ashoka Chakra" className="h-10 w-10 sm:h-12 sm:w-12 object-contain hidden sm:block" />
              </div>
            </Link>
          </div>



          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative hidden sm:flex items-center" onMouseLeave={() => setIsLangOpen(false)}>
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f05c19] text-white shrink-0 shadow-sm hover:shadow-md hover:scale-105 transition-all outline-none"
              >
                <div className="flex items-center gap-[3px] font-bold">
                  <span className="text-[11px] leading-none mb-[1px]">A</span>
                  <div className="w-[1px] h-3 bg-white/50"></div>
                  <span className="text-[12px] leading-none">अ</span>
                </div>
              </button>
              
              {isLangOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 py-2 w-32 flex flex-col z-50">
                  <button onClick={() => { changeLanguage('en'); setIsLangOpen(false); }} className={`text-left px-4 py-2 text-sm font-semibold hover:bg-slate-50 transition-colors ${i18n.language === 'en' ? 'text-[#f05c19]' : 'text-slate-700'}`}>English</button>
                  <button onClick={() => { changeLanguage('hi'); setIsLangOpen(false); }} className={`text-left px-4 py-2 text-sm font-semibold hover:bg-slate-50 transition-colors ${i18n.language === 'hi' ? 'text-[#f05c19]' : 'text-slate-700'}`}>हिन्दी</button>
                  <button onClick={() => { changeLanguage('gu'); setIsLangOpen(false); }} className={`text-left px-4 py-2 text-sm font-semibold hover:bg-slate-50 transition-colors ${i18n.language === 'gu' ? 'text-[#f05c19]' : 'text-slate-700'}`}>ગુજરાતી</button>
                </div>
              )}
            </div>
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <>
                  <Link to="/saved" className="text-slate-500 hover:text-[#f05c19] px-3 py-2 transition-colors flex items-center gap-1.5 font-medium" aria-label="Saved Resources">
                    <Bookmark size={20} />
                  </Link>
                  <Link to="/profile" className="flex items-center gap-2 text-slate-700 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden xl:block">{user.name}</span>
                  </Link>
                  <button onClick={logout} className="text-slate-500 hover:text-rose-600 px-3 py-2 font-medium transition-colors">
                    {t('navigation.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-slate-600 hover:text-slate-900 px-4 py-2.5 font-semibold transition-all">{t('navigation.login')}</Link>
                  <Link to="/register" className="bg-primary-600 text-white px-6 py-2.5 rounded-full font-semibold shadow-md hover:bg-primary-700 transition-all">{t('navigation.signUp')}</Link>
                </>
              )}
            </div>
            <button className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {/* Desktop Search (Repositioned) */}
      <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-full -translate-y-1/2 w-full max-w-lg z-50">
        <div onClick={() => window.location.href = '/services'} className="w-full flex items-center bg-white border border-slate-200 h-14 rounded-full shadow-sm hover:border-blue-500 focus-within:border-green-500 transition-all duration-300 ease-in-out group cursor-pointer">
          <div className="pl-5 pr-3">
            <Search className="w-5 h-5 text-slate-400 group-hover:text-blue-500 group-focus-within:text-green-500 transition-all duration-300 ease-in-out" />
          </div>
          <input type="text" readOnly placeholder={t('common.searchPlaceholder')} className="flex-1 bg-transparent border-none outline-none text-slate-700 text-[15px] font-medium placeholder:text-slate-400 cursor-pointer h-full rounded-r-full" />
        </div>
      </div>
    </header>
  );
};
