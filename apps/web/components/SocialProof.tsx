'use client';

import { useState, useEffect } from 'react';
import Card from './Card';

const testimonials = [
  {
    quote: "Sonata cut my admin from 6 hrs to 1!",
    author: "Rick B., RPT"
  },
  {
    quote: "The automated reminders have eliminated no-shows completely.",
    author: "Sarah M., Piano Teacher"
  },
  {
    quote: "Finally, a system that understands how music professionals work.",
    author: "David L., Guitar Technician"
  }
];

export default function SocialProof() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-20 tracking-tight">
          Trusted by music professionals nationwide
        </h2>
        
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="w-full flex-shrink-0 px-4"
              >
                <Card className="max-w-2xl mx-auto rounded-2xl shadow-xl p-10">
                  <div className="mb-6">
                    <svg className="w-12 h-12 text-blue-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                    <p className="text-2xl text-gray-900 italic leading-relaxed mb-6">
                      "{testimonial.quote}"
                    </p>
                    <p className="text-lg font-semibold text-gray-500">
                      — {testimonial.author}
                    </p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
          
          {/* Dots indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 