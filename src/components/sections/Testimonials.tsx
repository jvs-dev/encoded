import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import { SectionTitle } from '../ui/SectionTitle';

interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

/**
 * Testimonials Section
 * Block: testimonials
 * Element: testimonials__grid, testimonials__card, testimonials__stars, testimonials__user
 */
export function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section id="depoimentos" className="testimonials py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle align="center">
          O que dizem sobre nós
        </SectionTitle>
        
        <div className="testimonials__grid grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="testimonials__card bg-zinc-950 border border-white/10 p-8 flex flex-col"
            >
              <div className="testimonials__stars flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-white text-white" />
                ))}
              </div>
              <p className="text-gray-300 mb-8 flex-grow leading-relaxed">
                "{testimonial.content}"
              </p>
              <div className="testimonials__user flex items-center gap-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full grayscale border border-white/20 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <p className="font-bold text-white">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
