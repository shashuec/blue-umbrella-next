import React from 'react';
import { Button } from '@/components/ui/button';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center bg-gradient-to-b from-blueumbrella-50 to-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -right-36 w-64 sm:w-72 md:w-96 h-64 sm:h-72 md:h-96 rounded-full bg-blueumbrella-100 blur-3xl opacity-50"></div>
        <div className="absolute bottom-20 -left-36 w-64 sm:w-72 md:w-96 h-64 sm:h-72 md:h-96 rounded-full bg-gold-100 blur-3xl opacity-50"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 pt-20 sm:pt-24 md:pt-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="animate-fade-in text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-blueumbrella-900 leading-tight mb-4 sm:mb-6">
            Expert Mutual Fund Management for Your Financial Growth
          </h1>
          
          <p className="animate-fade-in animate-delay-200 text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8">
            Grow your wealth into tomorrow&apos;s dreams with our professional mutual fund portfolio management—hands-off, worry-free.
          </p>
          
          <a
            href="https://wa.me/918076018082?text=Hi%2C%20I%20would%20like%20a%20free%20portfolio%20review%20from%20Blue%20Umbrella."
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full sm:w-auto"
          >
            <Button className="animate-fade-in animate-delay-300 bg-blueumbrella-700 hover:bg-blueumbrella-800 text-white px-4 sm:px-6 py-3 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg rounded-xl w-full sm:w-auto max-w-xs mx-auto whitespace-normal break-words flex items-center justify-center">
              Start My Free Portfolio Review
            </Button>
          </a>
          
          <div className="animate-fade-in animate-delay-400 mt-10 sm:mt-12 md:mt-16 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 text-center">
            <div className="p-2 sm:p-3 md:p-4 flex flex-col items-center">
              <span className="text-blueumbrella-700 font-bold text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2">20+</span>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base">years of experience</p>
            </div>
            
            <div className="p-2 sm:p-3 md:p-4 flex flex-col items-center">
              <span className="text-blueumbrella-700 font-bold text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2">150+</span>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base">families served</p>
            </div>
            
            <div className="p-2 sm:p-3 md:p-4 flex flex-col items-center">
              <span className="text-blueumbrella-700 font-bold text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2">15</span>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base">top fund houses</p>
            </div>
            
            <div className="p-2 sm:p-3 md:p-4 flex flex-col items-center">
              <span className="text-blueumbrella-700 font-bold text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2">📈</span>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base">Track your investments daily</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;