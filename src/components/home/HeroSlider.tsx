import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeroSliderProps {
  onNavigate: (path: string) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onNavigate }) => {
  const { heroSlides } = useStore();
  const activeSlides = heroSlides.filter((s) => s.isActive);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  if (!activeSlides.length) return null;

  const slide = activeSlides[currentSlide] || activeSlides[0];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#18231C]">
      <div className="relative min-h-[480px] sm:min-h-[540px] lg:min-h-[600px] flex items-center">
        {/* Background Image with Dark Vignette Gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center transition-all duration-1000 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111913]/90 via-[#111913]/70 to-black/30" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-2xl text-white space-y-5">
            {/* Subtitle / Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-[#E87244]" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-200">
                {slide.subtitle || 'Mansha Texo Handcrafted'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-md">
              {slide.title}
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-normal max-w-xl">
              {slide.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => onNavigate(slide.ctaLink || '/shop')}
                className="px-6 py-3.5 bg-[#257335] hover:bg-[#1E5C2B] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 group cursor-pointer"
              >
                <span>{slide.ctaText || 'Shop Collection'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('/categories')}
                className="px-6 py-3.5 bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl backdrop-blur-md border border-white/20 transition-all cursor-pointer"
              >
                Explore Categories
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {activeSlides.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Slide Indicator Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              {activeSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentSlide === idx ? 'w-8 bg-[#E87244]' : 'w-2 bg-white/50 hover:bg-white'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
