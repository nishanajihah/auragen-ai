import React from 'react';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface FooterProps {
  variant?: 'simple' | 'complex';
  logo?: React.ReactNode;
  sections?: FooterSection[];
  socialIcons?: React.ReactNode;
  copyright?: string;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({
  variant = 'simple',
  logo,
  sections = [],
  socialIcons,
  copyright,
  className = ''
}) => {
  const currentYear = new Date().getFullYear();
  const formattedCopyright = copyright ? copyright.replace(/\d{4}/, currentYear.toString()) : `© ${currentYear} All rights reserved.`;

  if (variant === 'simple') {
    return (
      <footer className={`bg-dark-100/80 backdrop-blur-2xl border-t border-dark-200/30 py-8 ${className}`}>
        <div className="container-responsive">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {logo && (
              <div className="flex-shrink-0">
                {logo}
              </div>
            )}
            
            <div className="text-center md:text-right">
              {copyright && (
                <p className="text-dark-600 text-sm">{formattedCopyright}</p>
              )}
              {socialIcons && (
                <div className="mt-2">
                  {socialIcons}
                </div>
              )}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className={`bg-dark-100/80 backdrop-blur-2xl border-t border-dark-200/30 ${className}`}>
      <div className="container-responsive py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            {logo && (
              <div className="mb-4">
                {logo}
              </div>
            )}
            <p className="text-dark-600 text-sm leading-relaxed">
              Building the future of design with AI-powered creativity and innovation.
            </p>
            {socialIcons && (
              <div className="mt-6">
                {socialIcons}
              </div>
            )}
          </div>

          {/* Footer Sections */}
          {sections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-dark-900 mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-dark-600 hover:text-primary-600 transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        {copyright && (
          <div className="border-t border-dark-200/30 mt-8 pt-8 text-center">
            <p className="text-dark-600 text-sm">{formattedCopyright}</p>
          </div>
        )}
      </div>
    </footer>
  );
};