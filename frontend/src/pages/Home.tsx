import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { HeroSlider } from '../features/home/components/HeroSlider';
import { PlatformStats } from '../features/home/components/PlatformStats';
import { ExploreServices } from '../features/home/components/ExploreServices';
import { PersonalizedDiscovery } from '../features/home/components/PersonalizedDiscovery';
import { HowItWorks } from '../features/home/components/HowItWorks';
import { DocumentServices } from '../features/home/components/DocumentServices';
import { AgricultureSupport } from '../features/home/components/AgricultureSupport';
import { WhyOneGuide } from '../features/home/components/WhyOneGuide';
import { FaqSection } from '../features/home/components/faq-section';
import { TrustSection } from '../features/home/components/TrustSection';
import { MeetTheTeam } from '../features/home/components/MeetTheTeam';
import { RecommendedForYou } from '../features/recommendations/RecommendedForYou';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();
  const onboardingCompleted = user?.onboardingCompleted || false;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white">
      <HeroSlider />
      {onboardingCompleted ? <RecommendedForYou /> : <PersonalizedDiscovery />}
      <PlatformStats />
      <ExploreServices />

      <HowItWorks />
      <DocumentServices />
      <AgricultureSupport />
      <WhyOneGuide />
      <FaqSection />
      <TrustSection />
      <MeetTheTeam />
    </div>
  );
};

export default HomePage;
