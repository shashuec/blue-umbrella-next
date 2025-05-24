"use client";

import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <Link href="/" className="flex items-center justify-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-blueumbrella-700 flex items-center justify-center">
                <span className="text-white text-sm font-bold">B</span>
              </div>
              <span className="text-lg font-bold text-blueumbrella-800">Blue Umbrella</span>
            </Link>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-8">
              <Link href="/#why-us" className="text-gray-600 hover:text-blueumbrella-700 transition-colors text-sm">
                Why Choose Us
              </Link>
              <Link href="/#how-it-works" className="text-gray-600 hover:text-blueumbrella-700 transition-colors text-sm">
                How It Works
              </Link>
              <Link href="/#testimonials" className="text-gray-600 hover:text-blueumbrella-700 transition-colors text-sm">
                Testimonials
              </Link>
              <Link href="/#faqs" className="text-gray-600 hover:text-blueumbrella-700 transition-colors text-sm">
                FAQs
              </Link>
            </div>
            {/* Contact info for mobile */}
            <div className="flex flex-col items-center gap-2 text-sm text-gray-500 mb-8">
              <span>Whatsapp: <a href="tel:+918076018082" className="underline">+91 8076 018 082</a></span>
              <span>Prateek: <a href="tel:+919818278054" className="underline">+91 98182 78054</a></span>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <p className="text-center text-sm text-gray-500 mb-4">
              Mutual-fund investments are subject to market risks. Past performance is not a guarantee of future results. 
              Please read scheme information documents carefully before investing.
            </p>
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center text-gray-500 text-sm">
                Blue Umbrella — SEBI-Registered MF Distributor.<br />
                ARN -151593 BELONGS TO PRATEEK
              </div>
              <div className="text-center text-gray-400 text-xs mt-2">
                © 2025 Blue Umbrella. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
