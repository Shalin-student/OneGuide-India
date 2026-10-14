import { 
  Sprout, Landmark, Briefcase, GraduationCap, HeartPulse, Home, Scale, 
  Microscope, Users, Medal, Bus, Plane, Wrench, Baby, FileText, Component
} from 'lucide-react';

export const getCategoryIcon = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('agriculture')) return { icon: Sprout, color: 'text-emerald-600', bg: 'bg-emerald-50' };
  if (t.includes('banking') || t.includes('finance')) return { icon: Landmark, color: 'text-amber-600', bg: 'bg-amber-50' };
  if (t.includes('business')) return { icon: Briefcase, color: 'text-slate-600', bg: 'bg-slate-100' };
  if (t.includes('education') || t.includes('learning')) return { icon: GraduationCap, color: 'text-red-500', bg: 'bg-red-50' };
  if (t.includes('health') || t.includes('wellness')) return { icon: HeartPulse, color: 'text-teal-500', bg: 'bg-teal-50' };
  if (t.includes('housing') || t.includes('shelter')) return { icon: Home, color: 'text-blue-600', bg: 'bg-blue-50' };
  if (t.includes('safety') || t.includes('justice')) return { icon: Scale, color: 'text-orange-700', bg: 'bg-orange-50' };
  if (t.includes('science') || t.includes('it')) return { icon: Microscope, color: 'text-slate-500', bg: 'bg-slate-100' };
  if (t.includes('skills') || t.includes('employment')) return { icon: Users, color: 'text-amber-500', bg: 'bg-amber-50' };
  if (t.includes('welfare') || t.includes('empowerment')) return { icon: Users, color: 'text-orange-500', bg: 'bg-orange-50' };
  if (t.includes('sports') || t.includes('culture')) return { icon: Medal, color: 'text-green-500', bg: 'bg-green-50' };
  if (t.includes('transport')) return { icon: Bus, color: 'text-yellow-600', bg: 'bg-yellow-50' };
  if (t.includes('travel') || t.includes('tourism')) return { icon: Plane, color: 'text-pink-600', bg: 'bg-pink-50' };
  if (t.includes('utility') || t.includes('sanitation')) return { icon: Wrench, color: 'text-purple-600', bg: 'bg-purple-50' };
  if (t.includes('women') || t.includes('child')) return { icon: Baby, color: 'text-blue-700', bg: 'bg-blue-50' };
  
  return { icon: Component, color: 'text-slate-500', bg: 'bg-slate-100' };
};

export const getMinistryIcon = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('agriculture')) return Sprout;
  if (t.includes('ayush') || t.includes('health')) return HeartPulse;
  if (t.includes('chemicals') || t.includes('science')) return Microscope;
  if (t.includes('commerce') || t.includes('corporate')) return Briefcase;
  if (t.includes('consumer') || t.includes('housing')) return Home;
  if (t.includes('culture') || t.includes('sports')) return Medal;
  if (t.includes('defence')) return Scale;
  if (t.includes('education')) return GraduationCap;
  if (t.includes('environment')) return Sprout;
  if (t.includes('tourism') || t.includes('region')) return Plane;
  return FileText;
};

export const CENTRAL_MINISTRIES = [
  { title: 'Comptroller And Auditor General Of India' },
  { title: 'Ministry Of Agriculture and Farmers Welfare' },
  { title: 'Ministry Of Ayush' },
  { title: 'Ministry Of Chemicals And Fertilizers' },
  { title: 'Ministry Of Commerce And Industry' },
  { title: 'Ministry Of Communication' },
  { title: 'Ministry Of Consumer Affairs, Food And Public Distribution' },
  { title: 'Ministry Of Corporate Affairs' },
  { title: 'Ministry Of Culture' },
  { title: 'Ministry Of Defence' },
  { title: 'Ministry Of Development Of North Eastern Region' },
  { title: 'Ministry Of Earth Sciences' },
  { title: 'Ministry Of Education' },
  { title: 'Ministry Of Electronics and Information Technology' },
  { title: 'Ministry Of Environment, forests and climate change' }
];


export const STATE_LANDMARKS: Record<string, string> = {
  "Andaman and Nicobar Islands": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Cellular_Jail_Andaman.jpg/320px-Cellular_Jail_Andaman.jpg",
  "Andhra Pradesh": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Tirumala_Venkateswara_Temple.jpg/320px-Tirumala_Venkateswara_Temple.jpg",
  "Arunachal Pradesh": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Tawang_Monastery.jpg/320px-Tawang_Monastery.jpg",
  "Assam": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Kaziranga_National_Park.jpg/320px-Kaziranga_National_Park.jpg",
  "Bihar": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Mahabodhi_Temple_Complex_at_Bodh_Gaya.jpg/320px-Mahabodhi_Temple_Complex_at_Bodh_Gaya.jpg",
  "Chandigarh": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Rock_Garden_Chandigarh.jpg/320px-Rock_Garden_Chandigarh.jpg",
  "Chhattisgarh": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Chitrakoot_Waterfalls.jpg/320px-Chitrakoot_Waterfalls.jpg",
  "Delhi": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/India_Gate_in_New_Delhi_03-2016.jpg/320px-India_Gate_in_New_Delhi_03-2016.jpg",
  "Goa": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Basilica_of_Bom_Jesus_Goa.jpg/320px-Basilica_of_Bom_Jesus_Goa.jpg",
  "Gujarat": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Lal_Darwaza_Ahmedabad.jpg/320px-Lal_Darwaza_Ahmedabad.jpg",
  "Haryana": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Brahma_Sarovar_Kurukshetra.jpg/320px-Brahma_Sarovar_Kurukshetra.jpg",
  "Himachal Pradesh": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Shimla_Ridge_Himachal.jpg/320px-Shimla_Ridge_Himachal.jpg",
  "Jammu and Kashmir": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Dal_Lake_Srinagar.jpg/320px-Dal_Lake_Srinagar.jpg",
  "Jharkhand": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Baidyanath_Temple_Deoghar.jpg/320px-Baidyanath_Temple_Deoghar.jpg",
  "Karnataka": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Mysore_Palace_Karnataka.jpg/320px-Mysore_Palace_Karnataka.jpg",
  "Kerala": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Kerala_Backwaters.jpg/320px-Kerala_Backwaters.jpg",
  "Madhya Pradesh": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Sanchi_Stupa.jpg/320px-Sanchi_Stupa.jpg",
  "Maharashtra": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Gateway_of_India_Mumbai.jpg/320px-Gateway_of_India_Mumbai.jpg",
  "Manipur": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Kangla_Fort_Manipur.jpg/320px-Kangla_Fort_Manipur.jpg",
  "Meghalaya": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Living_Root_Bridge_Meghalaya.jpg/320px-Living_Root_Bridge_Meghalaya.jpg",
  "Mizoram": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Aizawl_Mizoram.jpg/320px-Aizawl_Mizoram.jpg",
  "Nagaland": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Kohima_Nagaland.jpg/320px-Kohima_Nagaland.jpg",
  "Odisha": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Konark_Sun_Temple.jpg/320px-Konark_Sun_Temple.jpg",
  "Punjab": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Golden_Temple_Amritsar.jpg/320px-Golden_Temple_Amritsar.jpg",
  "Rajasthan": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Hawa_Mahal_Jaipur.jpg/320px-Hawa_Mahal_Jaipur.jpg",
  "Sikkim": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Rumtek_Monastery_Sikkim.jpg/320px-Rumtek_Monastery_Sikkim.jpg",
  "Tamil Nadu": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meenakshi_Amman_Temple.jpg/320px-Meenakshi_Amman_Temple.jpg",
  "Telangana": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Charminar_Hyderabad.jpg/320px-Charminar_Hyderabad.jpg",
  "Tripura": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Ujjayanta_Palace_Tripura.jpg/320px-Ujjayanta_Palace_Tripura.jpg",
  "Uttar Pradesh": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal.jpg/320px-Taj_Mahal.jpg",
  "Uttarakhand": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Kedarnath_Temple.jpg/320px-Kedarnath_Temple.jpg",
  "West Bengal": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Victoria_Memorial_Kolkata.jpg/320px-Victoria_Memorial_Kolkata.jpg"
};

export const getStateLandmark = (stateName: string) => {
  return STATE_LANDMARKS[stateName] || "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Map_pin_icon.svg/320px-Map_pin_icon.svg.png";
};
