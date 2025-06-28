import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Github } from 'lucide-react';

export interface SocialIconProps {
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'github';
  url: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  className?: string;
}

export interface SocialIconsProps {
  icons: Omit<SocialIconProps, 'className'>[];
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  className?: string;
}

const platformIcons = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  github: Github
};

const platformColors = {
  facebook: 'text-blue-600 hover:bg-blue-600',
  twitter: 'text-sky-500 hover:bg-sky-500',
  instagram: 'text-pink-600 hover:bg-pink-600',
  linkedin: 'text-blue-700 hover:bg-blue-700',
  youtube: 'text-red-600 hover:bg-red-600',
  github: 'text-gray-800 hover:bg-gray-800'
};

const sizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12'
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6'
};

export const SocialIcon: React.FC<SocialIconProps> = ({
  platform,
  url,
  size = 'md',
  variant = 'default',
  className = ''
}) => {
  const IconComponent = platformIcons[platform];
  const colorClasses = platformColors[platform];

  const getVariantClasses = () => {
    switch (variant) {
      case 'filled':
        return `${colorClasses.split(' ')[1]} text-white hover:opacity-80`;
      case 'outlined':
        return `border-2 border-current ${colorClasses.split(' ')[0]} hover:bg-current hover:text-white`;
      default:
        return colorClasses.split(' ')[0] + ' hover:scale-110';
    }
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        inline-flex items-center justify-center rounded-full
        transition-all duration-300 transform
        ${sizes[size]}
        ${getVariantClasses()}
        ${className}
      `}
    >
      <IconComponent className={iconSizes[size]} />
    </a>
  );
};

export const SocialIcons: React.FC<SocialIconsProps> = ({
  icons,
  size = 'md',
  variant = 'default',
  className = ''
}) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {icons.map((icon, index) => (
        <SocialIcon
          key={index}
          {...icon}
          size={size}
          variant={variant}
        />
      ))}
    </div>
  );
};