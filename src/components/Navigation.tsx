"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 sm:py-4",
      isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
    )}>
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blueumbrella-700 flex items-center justify-center">
            <span className="text-white text-lg sm:text-xl font-bold">B</span>
          </div>
          <span className="text-lg sm:text-xl font-bold text-blueumbrella-800">Blue Umbrella</span>
        </Link>
        
        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 -mr-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className={cn("h-6 w-6", isScrolled ? "text-blueumbrella-800" : "text-blueumbrella-800")} />
          ) : (
            <Menu className={cn("h-6 w-6", isScrolled ? "text-blueumbrella-800" : "text-blueumbrella-800")} />
          )}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link href="/#why-us" className="text-blueumbrella-800 hover:text-blueumbrella-600 transition-colors text-sm lg:text-base">
            Why Choose Us
          </Link>
          <Link href="/#how-it-works" className="text-blueumbrella-800 hover:text-blueumbrella-600 transition-colors text-sm lg:text-base">
            How It Works
          </Link>
          <Link href="/#testimonials" className="text-blueumbrella-800 hover:text-blueumbrella-600 transition-colors text-sm lg:text-base">
            Testimonials
          </Link>
          <Link href="/review">
            <Button 
              className="bg-blueumbrella-700 hover:bg-blueumbrella-800 text-white text-sm lg:text-base"
            >
              Get My Free AI Report
            </Button>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "fixed inset-0 bg-white/95 backdrop-blur-md z-50 transform transition-transform duration-300 ease-in-out md:hidden",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="flex flex-col items-center justify-center h-full space-y-6 sm:space-y-8">
            <button
              className="absolute top-4 right-4 p-2"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-6 w-6 text-blueumbrella-800" />
            </button>
            <Link 
              href="/#why-us" 
              className="text-lg sm:text-xl text-blueumbrella-800 hover:text-blueumbrella-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Why Choose Us
            </Link>
            <Link 
              href="/#how-it-works" 
              className="text-lg sm:text-xl text-blueumbrella-800 hover:text-blueumbrella-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              href="/#testimonials" 
              className="text-lg sm:text-xl text-blueumbrella-800 hover:text-blueumbrella-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Testimonials
            </Link>
            <Link 
              href="/review" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Button 
                className="bg-blueumbrella-700 hover:bg-blueumbrella-800 text-white mt-4"
              >
                Get My Free AI Report
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
