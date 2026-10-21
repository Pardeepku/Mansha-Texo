import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

interface HeroSliderProps {
  onNavigate: (path: string) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onNavigate }) => {
  const { heroSlides } = useStore();
  const activeSlides = heroSlides.filter((s) => s.isActive);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  return (
    <section
      className="relative w-full max-w-full overflow-hidden bg-[#18231C]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative min-h-[380px] sm:min-h-[500px] lg:min-h-[580px] flex items-center">
        {/* Background Image with Dark Vignette Gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center transition-all duration-1000 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111913]/95 via-[#111913]/75 to-black/35" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 w-full">
          <div className="max-w-2xl text-white space-y-3 sm:space-y-5">
            {/* Subtitle / Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-white/15 backdrop-blur-md rounded-full border border-white/20">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#E87244]" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-200">
                {slide.subtitle || 'Mansha Texo Handcrafted'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-md">
              {slide.title}
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-base text-gray-200 leading-relaxed font-normal max-w-xl line-clamp-2 sm:line-clamp-none">
              {slide.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-2.5 pt-2 sm:pt-3">
              <button
                onClick={() => onNavigate(slide.ctaLink || '/shop')}
                className="px-5 py-3 sm:px-6 sm:py-3.5 bg-[#257335] active:bg-[#1E5C2B] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl shadow-xl transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>{slide.ctaText || 'Shop Collection'}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('/categories')}
                className="px-4 py-3 sm:px-6 sm:py-3.5 bg-white/15 active:bg-white/25 text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl backdrop-blur-md border border-white/20 transition-all cursor-pointer"
              >
                Categories
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Arrows */}
        {activeSlides.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white items-center justify-center backdrop-blur-md transition-all cursor-pointer"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white items-center justify-center backdrop-blur-md transition-all cursor-pointer"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Slide Indicators */}
        {activeSlides.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all rounded-full cursor-pointer ${
                  currentSlide === idx ? 'w-5 h-1.5 bg-emerald-400' : 'w-1.5 h-1.5 bg-white/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
