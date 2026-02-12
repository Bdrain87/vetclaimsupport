import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, Award } from 'lucide-react';

const testimonials = [
  {
    quote: "I went from 30% to 70% after using this app to prepare my supplemental claim. The secondary condition finder alone was worth every penny.",
    name: "Michael T.",
    branch: "Army",
    years: "2008-2016",
    rating: "70%",
    ratingColor: "bg-[#D6B25E]"
  },
  {
    quote: "Filed my BDD claim 90 days before separation. Had my first check waiting when I got home. This app showed me exactly what evidence I needed.",
    name: "Sarah M.",
    branch: "Air Force",
    years: "2015-2023",
    rating: "80%",
    ratingColor: "bg-emerald-500"
  },
  {
    quote: "After 15 years of being told my back pain wasn't service-connected, I finally had the evidence package to prove it. Went from 0% to 40%.",
    name: "James R.",
    branch: "Marine Corps",
    years: "1998-2006",
    rating: "40%",
    ratingColor: "bg-[#D6B25E]"
  }
];

export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 sm:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          className="text-center mb-16 sm:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#000000] mb-4">
            Veterans Winning Their Claims
          </h2>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto">
            Real results from real veterans.
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="relative bg-gray-50 rounded-2xl p-8 border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Rating badge */}
              <div className={`absolute -top-4 right-6 ${testimonial.ratingColor} text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-1.5`}>
                <Award className="w-4 h-4" />
                {testimonial.rating}
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#F6E4AA] text-[#F6E4AA]" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-gray-700 leading-relaxed mb-6">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="border-t border-gray-200 pt-4">
                <p className="font-semibold text-[#000000]">{testimonial.name}</p>
                <p className="text-sm text-gray-500">
                  {testimonial.branch} • {testimonial.years}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
