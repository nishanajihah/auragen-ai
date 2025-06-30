import React from 'react';

// Custom icons to avoid importing the entire Lucide library
const Sparkles = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 3l1.88 5.76a1 1 0 0 0 .95.69h6.08a1 1 0 0 1 .59 1.8l-4.93 3.58a1 1 0 0 0-.36 1.12l1.88 5.76a1 1 0 0 1-1.54 1.12l-4.93-3.58a1 1 0 0 0-1.18 0l-4.93 3.58a1 1 0 0 1-1.54-1.12l1.88-5.76a1 1 0 0 0-.36-1.12l-4.93-3.58a1 1 0 0 1 .59-1.8h6.08a1 1 0 0 0 .95-.69L12 3z" />
  </svg>
);

const Wand2 = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z" />
    <path d="m14 7 3 3" />
    <path d="M5 6v4" />
    <path d="M19 14v4" />
    <path d="M10 2v2" />
    <path d="M7 8H3" />
    <path d="M21 16h-4" />
    <path d="M11 3h2" />
  </svg>
);

const ArrowRight = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const LazyHowItWorks: React.FC = () => {
  return (
    <section className="py-24 content-visibility-auto">
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
            <div key={index} className="text-center group transform-gpu">
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