import React from 'react';
import { Star, Quote, User } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image?: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'UI/UX Designer',
    company: 'DesignCraft',
    content: 'AuraGen AI has completely transformed our design workflow. What used to take days now takes minutes, and the quality is consistently impressive. The AI understands design principles in a way I never expected.',
    rating: 5
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Product Manager',
    company: 'TechFlow',
    content: 'As someone who isn\'t a designer by trade, AuraGen AI has been a game-changer. I can quickly generate professional design systems that our developers love working with. The learning curve was minimal.',
    rating: 5
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'Creative Director',
    company: 'Innovate Studio',
    content: 'The color palettes and typography pairings that AuraGen creates are genuinely impressive. It\'s like having a senior designer on call 24/7. Worth every penny for our agency.',
    rating: 4
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'Frontend Developer',
    company: 'CodeCraft',
    content: 'I was skeptical about AI-generated design systems, but AuraGen has won me over. The code it generates is clean, accessible, and follows best practices. It\'s saved me countless hours of work.',
    rating: 5
  }
];

const LazyTestimonials: React.FC = () => {
  return (
    <section className="py-24 bg-dark-100/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-dark-900 mb-6">
            Loved by Designers
            <span className="block bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              Worldwide
            </span>
          </h2>
          <p className="text-xl text-dark-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what designers and developers are saying about AuraGen AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-dark-200/30 rounded-3xl p-8 border border-dark-300/30 hover:border-primary-500/50 transition-all duration-500 hover:shadow-2xl group"
            >
              <div className="flex items-center space-x-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-dark-400'}`} 
                  />
                ))}
              </div>
              
              <div className="relative mb-6">
                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary-500/20" />
                <p className="text-dark-700 leading-relaxed relative z-10">
                  {testimonial.content}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white">
                  {testimonial.image ? (
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-dark-900 group-hover:text-primary-600 transition-colors">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-dark-600">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-dark-600 mb-4">Join thousands of satisfied users creating amazing designs</p>
          <button className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Start Your Free Trial
          </button>
        </div>
      </div>
    </section>
  );
};

export default LazyTestimonials;