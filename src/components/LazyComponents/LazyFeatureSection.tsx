import React from 'react';

interface Feature {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
}

interface LazyFeatureSectionProps {
  features: Feature[];
  currentFeature: number;
}

const LazyFeatureSection: React.FC<LazyFeatureSectionProps> = ({ features, currentFeature }) => {
  return (
    <section className="py-24 bg-dark-100/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-dark-900 mb-6">
            Everything You Need to Create
            <span className="block bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              Amazing Designs
            </span>
          </h2>
          <p className="text-xl text-dark-600 max-w-3xl mx-auto">
            Our AI understands design principles and creates cohesive, professional design systems 
            that would take hours to create manually.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative p-8 rounded-3xl border-2 transition-all duration-500 hover:shadow-2xl hover:scale-105 ${
                currentFeature === index
                  ? 'bg-gradient-to-br from-primary-500/10 to-primary-600/10 border-primary-500/50 shadow-xl'
                  : 'bg-dark-200/30 border-dark-300/30 hover:border-primary-500/50'
              }`}
            >
              <div className={`p-4 rounded-2xl mb-6 transition-all duration-300 ${
                currentFeature === index
                  ? 'bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg'
                  : 'bg-dark-300/50 group-hover:bg-primary-500/20'
              }`}>
                <feature.icon className={`w-8 h-8 transition-colors duration-300 ${
                  currentFeature === index ? 'text-white' : 'text-dark-600 group-hover:text-primary-500'
                }`} />
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-4">{feature.title}</h3>
              <p className="text-dark-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LazyFeatureSection;