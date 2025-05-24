import React from 'react';
import { FileText, Upload, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  {
    title: 'Request Your Report',
    description: 'Upload broad numbers; we draft a personalised 7-page plan.',
    icon: FileText,
  },
  {
    title: 'Onboard in 10 min',
    description: 'e-KYC, digital signatures, zero paperwork.',
    icon: Upload,
  },
  {
    title: 'Track, Re-balance, Relax',
    description: 'We handle entry / exit signals while you follow progress in the app—or ignore it.',
    icon: BarChart3,
  },
];

const HowItWorks = () => {
  const [visibleItems, setVisibleItems] = React.useState<number[]>([]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setVisibleItems((prev) => prev.includes(index) ? prev : [...prev, index]);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.step-item').forEach((item, idx) => {
      item.setAttribute('data-index', idx.toString());
      observer.observe(item);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section id="how-it-works" className="py-8 sm:py-12 md:py-20 bg-blueumbrella-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blueumbrella-900 mb-3 sm:mb-4">
            How It Works
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">
            A simple, streamlined process designed for busy professionals.
          </p>
        </div>
        <div className="flex flex-col items-center space-y-8">
          {steps.map((step, idx) => (
            <div
              key={step.title}
              className={cn(
                'step-item flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 w-full md:w-3/4',
                visibleItems.includes(idx) ? 'animate-fade-in' : 'opacity-0'
              )}
              data-index={idx}
            >
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blueumbrella-700 flex items-center justify-center shadow-md mb-2 md:mb-0">
                <step.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-lg sm:text-xl font-semibold text-blueumbrella-900 mb-1">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
