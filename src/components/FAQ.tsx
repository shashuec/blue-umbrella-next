import React, { useEffect, useState } from 'react';

const FAQ: React.FC = () => {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    import('../data/faqs.json')
      .then((module) => setFaqs(module.default))
      .catch(() => setFaqs([]));
  }, []);

  return (
    <section id="faqs" className="py-12 sm:py-16 md:py-20 bg-blueumbrella-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blueumbrella-900 mb-3 sm:mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">
            Straight answers to your most common questions.
          </p>
        </div>
        <div className="space-y-4 max-w-2xl mx-auto">
          {faqs.map((faq, idx) => (
            <details key={idx} className="faq-item bg-white rounded-xl shadow-sm p-4 cursor-pointer">
              <summary className="font-semibold text-blueumbrella-800 text-base sm:text-lg focus:outline-none">
                {faq.question}
              </summary>
              <div className="mt-2 text-gray-700 text-sm sm:text-base">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
