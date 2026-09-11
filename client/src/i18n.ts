import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation files structured with namespaces
const resources = {
  en: {
    translation: {
      common: {
        loading: "Loading...",
        error: "An error occurred",
        save: "Save",
        saved: "Saved",
        remove: "Remove",
        viewDetails: "View Details",
        searchPlaceholder: "Search for schemes, jobs, services...",
        applyNow: "Apply Now"
      },
      navigation: {
        home: "Home",
        services: "Services",
        saved: "Saved Resources",
        profile: "Profile",
        login: "Login",
        signUp: "Sign Up",
        logout: "Logout",
        heroTitle: "Find the Right Government Service for You"
      },
      discovery: {
        findSchemes: "Find Schemes for You",
        jobsExams: "Jobs & Exams",
        scholarships: "Scholarships",
        agriculture: "Agriculture Services",
        documentsHelp: "Documents Help",
        helplines: "Helpline Numbers",
        filters: "Filters",
        clearFilters: "Clear Filters",
        noResults: "No resources found matching your criteria."
      },
      profile: {
        title: "Your Profile",
        completeness: "Profile Completeness",
        editProfile: "Edit Profile",
        saveChanges: "Save Changes",
        onboardingTitle: "Tell us about yourself",
        onboardingSubtitle: "Get personalized recommendations based on your profile"
      },
      resource: {
        eligibility: "Eligibility",
        benefits: "Benefits",
        documents: "Documents Required",
        applicationProcess: "Application Process",
        officialSources: "Official Sources",
        eligible: "Eligible",
        ineligible: "Ineligible",
        unknown: "Unknown / Missing Info"
      },
      chatbot: {
        title: "OneGuide AI",
        subtitle: "Government Guidance Assistant",
        inputPlaceholder: "Ask a question...",
        verified: "Verified",
        insufficientData: "Insufficient Data",
        officialSources: "Official Sources",
        aiDisclaimer: "AI can make mistakes. Verify critical information on official portals."
      },
      recommendations: {
        title: "Recommended For You",
        subtitle: "Personalized matches based on your profile and goals.",
        aiRanked: "AI Ranked",
        standardMatch: "Standard Match",
        comingSoon: "More recommendations coming soon"
      }
    }
  },
  hi: {
    translation: {
      common: {
        loading: "लोड हो रहा है...",
        error: "एक त्रुटि हुई",
        save: "सहेजें",
        saved: "सहेजा गया",
        remove: "हटाएं",
        viewDetails: "विवरण देखें",
        searchPlaceholder: "योजनाएं, नौकरियां, सेवाएं खोजें...",
        applyNow: "अभी आवेदन करें"
      },
      navigation: {
        home: "होम",
        services: "सेवाएं",
        saved: "सहेजे गए संसाधन",
        profile: "प्रोफ़ाइल",
        login: "लॉग इन करें",
        signUp: "साइन अप करें",
        logout: "लॉग आउट करें",
        heroTitle: "अपने लिए सही सरकारी सेवा खोजें"
      },
      discovery: {
        findSchemes: "योजनाएं खोजें",
        jobsExams: "नौकरियां और परीक्षाएं",
        scholarships: "छात्रवृत्ति",
        agriculture: "कृषि सेवाएं",
        documentsHelp: "दस्तावेज़ सहायता",
        helplines: "हेल्पलाइन नंबर",
        filters: "फ़िल्टर",
        clearFilters: "फ़िल्टर हटाएं",
        noResults: "आपके मानदंडों से मेल खाने वाला कोई संसाधन नहीं मिला।"
      },
      profile: {
        title: "आपकी प्रोफ़ाइल",
        completeness: "प्रोफ़ाइल पूर्णता",
        editProfile: "प्रोफ़ाइल संपादित करें",
        saveChanges: "परिवर्तन सहेजें",
        onboardingTitle: "अपने बारे में बताएं",
        onboardingSubtitle: "अपनी प्रोफ़ाइल के आधार पर व्यक्तिगत सुझाव प्राप्त करें"
      },
      resource: {
        eligibility: "पात्रता",
        benefits: "लाभ",
        documents: "आवश्यक दस्तावेज़",
        applicationProcess: "आवेदन प्रक्रिया",
        officialSources: "आधिकारिक स्रोत",
        eligible: "पात्र",
        ineligible: "अपात्र",
        unknown: "अज्ञात / जानकारी गायब"
      },
      chatbot: {
        title: "वनगाइड एआई",
        subtitle: "सरकारी मार्गदर्शन सहायक",
        inputPlaceholder: "एक प्रश्न पूछें...",
        verified: "सत्यापित",
        insufficientData: "अपर्याप्त डेटा",
        officialSources: "आधिकारिक स्रोत",
        aiDisclaimer: "एआई गलतियाँ कर सकता है। आधिकारिक पोर्टलों पर महत्वपूर्ण जानकारी सत्यापित करें।"
      },
      recommendations: {
        title: "आपके लिए अनुशंसित",
        subtitle: "आपकी प्रोफ़ाइल और लक्ष्यों के आधार पर व्यक्तिगत सुझाव।",
        aiRanked: "एआई रैंक",
        standardMatch: "मानक मिलान",
        comingSoon: "अधिक सुझाव जल्द ही आ रहे हैं"
      }
    }
  },
  gu: {
    translation: {
      common: {
        loading: "લોડ થઈ રહ્યું છે...",
        error: "ભૂલ આવી",
        save: "સાચવો",
        saved: "સાચવેલ",
        remove: "દૂર કરો",
        viewDetails: "વિગતો જુઓ",
        searchPlaceholder: "યોજનાઓ, નોકરીઓ, સેવાઓ શોધો...",
        applyNow: "હવે અરજી કરો"
      },
      navigation: {
        home: "મુખ્યપૃષ્ઠ",
        services: "સેવાઓ",
        saved: "સાચવેલ સંસાધનો",
        profile: "પ્રોફાઇલ",
        login: "લોગિન કરો",
        signUp: "સાઇન અપ કરો",
        logout: "લૉગ આઉટ કરો",
        heroTitle: "તમારા માટે યોગ્ય સરકારી સેવા શોધો"
      },
      discovery: {
        findSchemes: "તમારા માટે યોજનાઓ શોધો",
        jobsExams: "નોકરીઓ અને પરીક્ષાઓ",
        scholarships: "શિષ્યવૃત્તિ",
        agriculture: "કૃષિ સેવાઓ",
        documentsHelp: "દસ્તાવેજ સહાય",
        helplines: "હેલ્પલાઇન નંબરો",
        filters: "ફિલ્ટર્સ",
        clearFilters: "ફિલ્ટર્સ સાફ કરો",
        noResults: "તમારા માપદંડો સાથે મેળ ખાતા કોઈ સંસાધનો મળ્યા નથી."
      },
      profile: {
        title: "તમારી પ્રોફાઇલ",
        completeness: "પ્રોફાઇલ પૂર્ણતા",
        editProfile: "પ્રોફાઇલ સંપાદિત કરો",
        saveChanges: "ફેરફારો સાચવો",
        onboardingTitle: "તમારા વિશે જણાવો",
        onboardingSubtitle: "તમારી પ્રોફાઇલના આધારે વ્યક્તિગત ભલામણો મેળવો"
      },
      resource: {
        eligibility: "પાત્રતા",
        benefits: "લાભો",
        documents: "જરૂરી દસ્તાવેજો",
        applicationProcess: "અરજી પ્રક્રિયા",
        officialSources: "સત્તાવાર સ્ત્રોતો",
        eligible: "પાત્ર",
        ineligible: "અપાત્ર",
        unknown: "અજ્ઞાત / માહિતી ખૂટે છે"
      },
      chatbot: {
        title: "વનગાઈડ એઆઈ",
        subtitle: "સરકારી માર્ગદર્શન સહાયક",
        inputPlaceholder: "એક પ્રશ્ન પૂછો...",
        verified: "ચકાસાયેલ",
        insufficientData: "અપૂરતો ડેટા",
        officialSources: "સત્તાવાર સ્ત્રોતો",
        aiDisclaimer: "AI ભૂલો કરી શકે છે. સત્તાવાર પોર્ટલ પર મહત્વપૂર્ણ માહિતી ચકાસો."
      },
      recommendations: {
        title: "તમારા માટે ભલામણ કરેલ",
        subtitle: "તમારી પ્રોફાઇલ અને લક્ષ્યોના આધારે વ્યક્તિગત ભલામણો.",
        aiRanked: "AI ક્રમાંકિત",
        standardMatch: "માનક મેચ",
        comingSoon: "વધુ ભલામણો ટૂંક સમયમાં આવી રહી છે"
      }
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
