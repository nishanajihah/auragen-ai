import React from 'react';

const LazyTestimonials: React.FC = () => {
  const testimonials = [
    {
      quote: "AuraGen AI transformed our design workflow. What used to take days now takes minutes, and the results are consistently impressive.",
      author: "Sarah Johnson",
      role: "Lead Designer, TechFlow",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      quote: "As a solo developer, I never had the budget for professional design. AuraGen AI changed that completely - now I can create beautiful interfaces myself.",
      author: "Michael Chen",
      role: "Indie Developer",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      quote: "The color palettes and typography pairings are spot on. It's like having a professional designer on call 24/7.",
      author: "Emma Rodriguez",
      role: "UX Researcher, DesignHub",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150"
    }
  ];

  return (
    <section className="py-24 bg-dark-200/30 content-visibility-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-dark-900 mb-4">What Our Users Say</h2>
          <p className="text-xl text-dark-600 max-w-3xl mx-auto">
            Join thousands of designers and developers who've transformed their workflow with AuraGen AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-dark-100/80 backdrop-blur-xl rounded-2xl p-6 border border-dark-200/30 shadow-xl hover:shadow-2xl transition-all duration-300 transform-gpu hover:scale-105"
            >
              <div className="flex items-center mb-6">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                  width="48"
                  height="48"
                  loading="lazy"
                />
                <div>
                  <h3 className="font-bold text-dark-900">{testimonial.author}</h3>
                  <p className="text-sm text-dark-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-dark-700 leading-relaxed italic">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LazyTestimonials;