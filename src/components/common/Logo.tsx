import React from 'react';
import { useStore } from '../../context/StoreContext';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  inverted?: boolean;
  customLogoUrl?: string;
  customName?: string;
  customHighlight?: string;
  customTagline?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  inverted = false,
  customLogoUrl,
  customName,
  customHighlight,
  customTagline,
}) => {
  const { settings } = useStore();

  const logoSrc = customLogoUrl || settings.logoUrl || '/logo.svg';
  const rawStoreName = customName || settings.storeName || 'Mansha Texo';
  const highlightWord = customHighlight !== undefined ? customHighlight : (settings.brandHighlightText || 'TEXO');
  const tagline = customTagline || settings.brandTagline || 'Home Textiles & Rugs';
  const shouldShowImage = settings.showLogoImage !== false;
  const shouldShowText = showText && settings.showLogoText !== false;

  // Compute primary word vs highlight
  let firstWord = rawStoreName;
  let hasHighlightInName = false;

  if (highlightWord && rawStoreName.toUpperCase().includes(highlightWord.toUpperCase())) {
    const regex = new RegExp(`(${highlightWord})`, 'gi');
    const parts = rawStoreName.split(regex);
    firstWord = parts[0].trim();
    hasHighlightInName = true;
  } else if (rawStoreName.includes(' ')) {
    const parts = rawStoreName.split(' ');
    firstWord = parts[0];
  }

  const sizeMap = {
    sm: 'h-8 w-8 sm:h-9 sm:w-9',
    md: 'h-10 w-10 sm:h-11 sm:w-11',
    lg: 'h-12 w-12 sm:h-14 sm:w-14',
    xl: 'h-16 w-16 sm:h-20 sm:w-20',
  };

  const textMap = {
    sm: 'text-base sm:text-lg',
    md: 'text-lg sm:text-xl',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-2xl sm:text-3xl',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Brand Logo Graphic Icon */}
      {shouldShowImage && (
        <div className={`relative flex-shrink-0 ${sizeMap[size]} transition-transform duration-300 hover:scale-105 rounded-xl overflow-hidden flex items-center justify-center`}>
          <img
            src={logoSrc}
            alt={`${rawStoreName} Logo`}
            className="w-full h-full object-contain"
            onError={(e) => {
              // Fallback to official logo if broken url
              (e.target as HTMLImageElement).src = '/logo.svg';
            }}
          />
        </div>
      )}

      {/* Brand Typography */}
      {shouldShowText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1">
            <span
              className={`font-serif font-bold tracking-tight uppercase ${
                textMap[size]
              } ${inverted ? 'text-white' : 'text-[#1E293B]'}`}
            >
              {hasHighlightInName ? (
                <>
                  {firstWord}{' '}
                  <span className="text-[#E87244]">{highlightWord}</span>
                </>
              ) : (
                <span>{rawStoreName}</span>
              )}
            </span>
            <span
              className={`text-[9px] sm:text-[10px] font-semibold border rounded-full px-1 leading-none ${
                inverted ? 'border-white/40 text-white/70' : 'border-gray-400 text-gray-500'
              }`}
            >
              ®
            </span>
          </div>
          <span
            className={`text-[9px] sm:text-[10px] tracking-[0.18em] font-medium uppercase -mt-0.5 truncate max-w-[200px] sm:max-w-[260px] ${
              inverted ? 'text-emerald-200/80' : 'text-[#257335]'
            }`}
          >
            {tagline}
          </span>
        </div>
      )}
    </div>
  );
};
