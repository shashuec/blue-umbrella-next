import React from 'react';
import { Button } from '@/components/ui/button';

const CTA: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-blueumbrella-800 to-blueumbrella-950 text-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            Ready to see your compounding path?
          </h2>
          
          <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 text-blueumbrella-100">
            Join families who&apos;ve trusted us with their financial future
          </p>
          
          <div className="flex flex-col gap-4 sm:gap-6 justify-center">
            <Button 
              className="bg-white text-blueumbrella-800 hover:bg-gray-100 px-4 sm:px-6 py-4 sm:py-5 text-base sm:text-lg rounded-xl w-full md:w-auto font-semibold max-w-xs mx-auto whitespace-normal break-words"
            >
              <a href="/review" className="block w-full h-full">
                Start My Free AI Portfolio Analysis
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
