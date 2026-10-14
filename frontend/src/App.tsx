import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { RootLayout } from './components/layout/RootLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ServiceDetail from './pages/ServiceDetail';
import ServiceList from './pages/ServiceList';
import PersonalDiscoveryPage from './pages/PersonalDiscoveryPage';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Onboarding from './pages/Onboarding';
import SavedResources from './pages/SavedResources';
import About from './pages/About';
import Contact from './pages/Contact';
import ForgotPassword from './pages/ForgotPassword';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { OnboardingRoute } from './components/layout/OnboardingRoute';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  // App routing
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Protected Routes with Header/Footer */}
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="terms" element={<Terms />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          
          <Route path="services" element={<ServiceList />} />
          <Route path="services/personalized" element={<PersonalDiscoveryPage />} />
          <Route path="services/category/:categoryName" element={<ServiceList />} />
          <Route path="services/view/:slug" element={<ServiceDetail />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="saved" element={<SavedResources />} />
            <Route path="profile" element={<Profile />} />
            <Route path="admin" element={<Admin />} />
          </Route>
        </Route>

        {/* Auth routes without Header/Footer */}
        <Route element={<OnboardingRoute />}>
          <Route path="/onboarding" element={<Onboarding />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

