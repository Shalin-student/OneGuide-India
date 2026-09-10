import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation files
const resources = {
  en: {
    translation: {
      "home": "Home",
      "services": "Services",
      "find_schemes": "Find Schemes for You",
      "jobs_exams": "Jobs & Exams",
      "scholarships": "Scholarships",
      "agriculture": "Agriculture Services",
      "documents_help": "Documents Help",
      "helplines": "Helpline Numbers",
      "sign_up": "Sign up",
      "login": "Login",
      "profile": "Profile",
      "hero_title": "Find the Right Government Service for You",
      "search_placeholder": "What government service are you looking for?"
    }
  },
  hi: {
    translation: {
      "home": "होम",
      "services": "सेवाएं",
      "find_schemes": "योजनाएं खोजें",
      "jobs_exams": "नौकरियां और परीक्षाएं",
      "scholarships": "छात्रवृत्ति",
      "agriculture": "कृषि सेवाएं",
      "documents_help": "दस्तावेज़ सहायता",
      "helplines": "हेल्पलाइन नंबर",
      "sign_up": "साइन अप करें",
      "login": "लॉग इन करें",
      "profile": "प्रोफ़ाइल",
      "hero_title": "अपने लिए सही सरकारी सेवा खोजें",
      "search_placeholder": "आप किस सरकारी सेवा की तलाश कर रहे हैं?"
    }
  },
  gu: {
    translation: {
      "home": "મુખ્યપૃષ્ઠ",
      "services": "સેવાઓ",
      "find_schemes": "તમારા માટે યોજનાઓ શોધો",
      "jobs_exams": "નોકરીઓ અને પરીક્ષાઓ",
      "scholarships": "શિષ્યવૃત્તિ",
      "agriculture": "કૃષિ સેવાઓ",
      "documents_help": "દસ્તાવેજ સહાય",
      "helplines": "હેલ્પલાઇન નંબરો",
      "sign_up": "સાઇન અપ કરો",
      "login": "લોગિન કરો",
      "profile": "પ્રોફાઇલ",
      "hero_title": "તમારા માટે યોગ્ય સરકારી સેવા શોધો",
      "search_placeholder": "તમે કઈ સરકારી સેવા શોધી રહ્યા છો?"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
