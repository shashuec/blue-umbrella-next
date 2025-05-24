import React from 'react';
import { Star, UserRound } from 'lucide-react';

interface TestimonialProps {
  quote: string;
  name: string;
  location: string;
  age: string;
  index: number;
}

const testimonials = [
  {
    quote: "Idle ₹25 L became ₹43 L in seven years. Zero stress.",
    name: "Meera & Rajat",
    location: "Gurugram",
    age: "42 & 45"
  },
  {
    quote: "Blue Umbrella's 2020 exit call saved us lakhs.",
    name: "Dr. A. Sharma",
    location: "Noida",
    age: "51"
  },
  {
    quote: "Perfect for us later-stage professionals preparing for retirement.",
    name: "Sudhir K.",
    location: "Delhi",
    age: "57"
  }
];

const TestimonialCard: React.FC<TestimonialProps> = ({ quote, name, location, age, index }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-100 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      <div className="mb-3 sm:mb-4 flex">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-gold-400 fill-gold-400" />
        ))}
      </div>
      <p className="text-base sm:text-lg mb-3 sm:mb-4 text-gray-700 italic">&quot;{quote}&quot;</p>
      <div className="flex items-center">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blueumbrella-100 flex items-center justify-center text-blueumbrella-700 font-bold">
          <UserRound className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div className="ml-3">
          <p className="font-medium text-blueumbrella-800 text-sm sm:text-base">{name}</p>
          <p className="text-xs sm:text-sm text-gray-500">{location} | Age {age}</p>
        </div>
      </div>
    </div>
  );
};

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blueumbrella-900 mb-3 sm:mb-4">
            Voices of Investors
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">
            Hear from mature investors who&apos;ve experienced the Blue Umbrella difference.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index}
              quote={testimonial.quote}
              name={testimonial.name}
              location={testimonial.location}
              age={testimonial.age}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
