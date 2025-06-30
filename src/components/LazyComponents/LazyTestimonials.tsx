import React from 'react';
import { Star, Quote } from 'lucide-react';

const LazyTestimonials: React.FC = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "UI/UX Designer",
      company: "DesignCraft",
      quote: "AuraGen AI has completely transformed my workflow. What used to take me days now takes minutes, and the results are consistently impressive.",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Frontend Developer",
      company: "TechSolutions",
      quote: "As a developer, I was skeptical about AI-generated design systems, but AuraGen produces code that's clean, accessible, and easy to implement.",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
      rating: 5
    },
    {
      name: "Emma Rodriguez",
      role: "Creative Director",
      company: "Innovate Studio",
      quote: "The color palettes and typography pairings are spot on. It's like having a senior designer on call 24/7 for a fraction of the cost.",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
      rating: 4
    }
  ];

  return (
    <section className="py-24 bg-dark-100/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-dark-900 mb-6">
            What Our Users Say
          </h2>
          <p className="text-xl text-dark-600 max-w-3xl mx-auto">
            Join thousands of satisfied designers and developers who've transformed their workflow with AuraGen AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-dark-200/30 backdrop-blur-xl rounded-3xl border-2 border-dark-300/30 p-8 hover:border-primary-500/30 transition-all duration-300 hover:shadow-2xl"
            >
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
                {[...Array(5 - testimonial.rating)].map((_, i) => (
                  <Star key={i + testimonial.rating} className="w-5 h-5 text-dark-400" />
                ))}
              </div>
              
              <div className="mb-6">
                <Quote className="w-8 h-8 text-primary-500/30" />
                <p className="text-dark-700 leading-relaxed mt-2">
                  "{testimonial.quote}"
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <h4 className="font-bold text-dark-900">{testimonial.name}</h4>
                  <p className="text-sm text-dark-600">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LazyTestimonials;