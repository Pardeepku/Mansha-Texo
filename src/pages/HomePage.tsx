import React from 'react';
import { HeroSlider } from '../components/home/HeroSlider';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { FeaturedSection } from '../components/home/FeaturedSection';
import { WhyChooseSection } from '../components/home/WhyChooseSection';
import { BestSellersSection } from '../components/home/BestSellersSection';
import { PromoBannerSection } from '../components/home/PromoBannerSection';
import { NewArrivalsSection } from '../components/home/NewArrivalsSection';
import { CustomerReviewsSection } from '../components/home/CustomerReviewsSection';
import { MobileCategoryStories } from '../components/home/MobileCategoryStories';
import { PWAInstallBanner } from '../components/common/PWAInstallBanner';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full">
      {/* Mobile App Install Banner */}
      <PWAInstallBanner />

      {/* Mobile Quick Category Story Rings */}
      <MobileCategoryStories onNavigate={onNavigate} />

      {/* 1. Hero Banner Slider */}
      <HeroSlider onNavigate={onNavigate} />

      {/* 2. Shop By Category */}
      <CategoryGrid onNavigate={onNavigate} />

      {/* 3. Featured Collection */}
      <FeaturedSection onNavigate={onNavigate} />

      {/* 4. Why Choose Mansha Texo */}
      <WhyChooseSection />

      {/* 5. Best Sellers */}
      <BestSellersSection onNavigate={onNavigate} />

      {/* 6. Promotional Banner */}
      <PromoBannerSection onNavigate={onNavigate} />

      {/* 7. New Arrivals */}
      <NewArrivalsSection onNavigate={onNavigate} />

      {/* 8. Verified Customer Testimonials */}
      <CustomerReviewsSection />
    </div>
  );
};
