import React from 'react';
import { Sparkles, Wand2, ArrowRight } from 'lucide-react';

const LazyHowItWorks: React.FC = () => {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-dark-900 mb-6">
            How It Works
          </h2>
          <p className="text-xl text-dark-600 max-w-3xl mx-auto">
            Creating professional design systems has never been easier. 
            Just describe your vision and watch the magic happen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              step: "01",
              title: "Describe Your Vision",
              description: "Tell our AI about your project, brand, or the feeling you want to create. Be as specific or as general as you like.",
              icon: Sparkles
            },
            {
              step: "02",
              title: "AI Creates Your System",
              description: "Our AI generates a complete design system including colors, typography, components, and visual inspiration.",
              icon: Wand2
            },
            {
              step: "03",
              title: "Export & Implement",
              description: "Download your design system as CSS, JSON, or Figma tokens. Ready to use in your projects immediately.",
              icon: ArrowRight
            }
          ].map((item, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                  <item.icon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-dark-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {item.step}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-dark-900 mb-4">{item.title}</h3>
              <p className="text-dark-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LazyHowItWorks;