import React, { createContext, useContext, useState, useEffect } from 'react';

interface GoogleFont {
  family: string;
  variants: string[];
  subsets: string[];
  category: string;
  popularity?: number;
}

interface GoogleFontsContextType {
  fonts: GoogleFont[];
  loadedFonts: Set<string>;
  loadFont: (fontFamily: string, weights?: string[]) => Promise<void>;
  searchFonts: (query: string, category?: string) => GoogleFont[];
  isLoading: boolean;
}

const GoogleFontsContext = createContext<GoogleFontsContextType | undefined>(undefined);

// Popular Google Fonts with proper metadata
const POPULAR_FONTS: GoogleFont[] = [
  { family: 'Inter', variants: ['300', '400', '500', '600', '700'], subsets: ['latin'], category: 'sans-serif', popularity: 100 },
  { family: 'Poppins', variants: ['300', '400', '500', '600', '700'], subsets: ['latin'], category: 'sans-serif', popularity: 95 },
  { family: 'Montserrat', variants: ['300', '400', '500', '600', '700'], subsets: ['latin'], category: 'sans-serif', popularity: 90 },
  { family: 'Source Sans Pro', variants: ['300', '400', '600', '700'], subsets: ['latin'], category: 'sans-serif', popularity: 85 },
  { family: 'Open Sans', variants: ['300', '400', '600', '700'], subsets: ['latin'], category: 'sans-serif', popularity: 80 },
  { family: 'Lato', variants: ['300', '400', '700'], subsets: ['latin'], category: 'sans-serif', popularity: 75 },
  { family: 'Nunito', variants: ['300', '400', '600', '700'], subsets: ['latin'], category: 'sans-serif', popularity: 70 },
  { family: 'Roboto', variants: ['300', '400', '500', '700'], subsets: ['latin'], category: 'sans-serif', popularity: 65 },
  { family: 'Work Sans', variants: ['300', '400', '500', '600'], subsets: ['latin'], category: 'sans-serif', popularity: 60 },
  { family: 'DM Sans', variants: ['400', '500', '700'], subsets: ['latin'], category: 'sans-serif', popularity: 55 },
  
  // Serif fonts
  { family: 'Playfair Display', variants: ['400', '500', '600', '700'], subsets: ['latin'], category: 'serif', popularity: 85 },
  { family: 'Merriweather', variants: ['300', '400', '700'], subsets: ['latin'], category: 'serif', popularity: 80 },
  { family: 'Crimson Text', variants: ['400', '600'], subsets: ['latin'], category: 'serif', popularity: 70 },
  { family: 'Libre Baskerville', variants: ['400', '700'], subsets: ['latin'], category: 'serif', popularity: 65 },
  { family: 'Lora', variants: ['400', '500', '600', '700'], subsets: ['latin'], category: 'serif', popularity: 75 },
  { family: 'Cormorant Garamond', variants: ['300', '400', '500', '600', '700'], subsets: ['latin'], category: 'serif', popularity: 60 },
  { family: 'Source Serif Pro', variants: ['400', '600', '700'], subsets: ['latin'], category: 'serif', popularity: 55 },
  
  // Display fonts
  { family: 'Oswald', variants: ['300', '400', '500', '600', '700'], subsets: ['latin'], category: 'display', popularity: 75 },
  { family: 'Bebas Neue', variants: ['400'], subsets: ['latin'], category: 'display', popularity: 70 },
  { family: 'Righteous', variants: ['400'], subsets: ['latin'], category: 'display', popularity: 60 },
  { family: 'Fredoka One', variants: ['400'], subsets: ['latin'], category: 'display', popularity: 55 },
  { family: 'Orbitron', variants: ['400', '500', '700'], subsets: ['latin'], category: 'display', popularity: 50 },
  { family: 'Bungee', variants: ['400'], subsets: ['latin'], category: 'display', popularity: 45 },
  { family: 'Space Grotesk', variants: ['300', '400', '500', '600', '700'], subsets: ['latin'], category: 'display', popularity: 65 },
  
  // Monospace fonts
  { family: 'JetBrains Mono', variants: ['300', '400', '500', '600', '700'], subsets: ['latin'], category: 'monospace', popularity: 80 },
  { family: 'Fira Code', variants: ['300', '400', '500', '600', '700'], subsets: ['latin'], category: 'monospace', popularity: 75 },
  { family: 'Source Code Pro', variants: ['300', '400', '500', '600', '700'], subsets: ['latin'], category: 'monospace', popularity: 70 },
  { family: 'Space Mono', variants: ['400', '700'], subsets: ['latin'], category: 'monospace', popularity: 60 },
  { family: 'Inconsolata', variants: ['400', '700'], subsets: ['latin'], category: 'monospace', popularity: 55 }
];

export const GoogleFontsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fonts] = useState<GoogleFont[]>(POPULAR_FONTS);
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const loadFont = async (fontFamily: string, weights: string[] = ['400']) => {
    if (loadedFonts.has(fontFamily)) {
      return;
    }

    setIsLoading(true);
    
    try {
      const weightsParam = weights.join(',');
      const fontUrl = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@${weightsParam}&display=swap`;
      
      // Check if font is already loaded
      const existingLink = document.querySelector(`link[href*="${fontFamily.replace(/\s+/g, '+')}"]`);
      if (existingLink) {
        setLoadedFonts(prev => new Set([...prev, fontFamily]));
        return;
      }

      const link = document.createElement('link');
      link.href = fontUrl;
      link.rel = 'stylesheet';
      link.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
      });

      setLoadedFonts(prev => new Set([...prev, fontFamily]));
    } catch (error) {
      console.error(`Failed to load font ${fontFamily}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchFonts = (query: string, category?: string): GoogleFont[] => {
    let filtered = fonts;

    if (category && category !== 'all') {
      filtered = filtered.filter(font => font.category === category);
    }

    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(font => 
        font.family.toLowerCase().includes(searchTerm)
      );
    }

    return filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  };

  // Preload popular fonts
  useEffect(() => {
    const popularFonts = ['Inter', 'Poppins', 'Montserrat', 'Playfair Display'];
    popularFonts.forEach(font => {
      loadFont(font, ['400', '500', '600', '700']);
    });
  }, []);

  const value: GoogleFontsContextType = {
    fonts,
    loadedFonts,
    loadFont,
    searchFonts,
    isLoading
  };

  return (
    <GoogleFontsContext.Provider value={value}>
      {children}
    </GoogleFontsContext.Provider>
  );
};

export const useGoogleFonts = () => {
  const context = useContext(GoogleFontsContext);
  if (context === undefined) {
    throw new Error('useGoogleFonts must be used within a GoogleFontsProvider');
  }
  return context;
};

// Helper function to generate Google Fonts URL
export const generateGoogleFontUrl = (fontFamily: string, weights: string[] = ['400']): string => {
  const weightsParam = weights.join(',');
  return `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@${weightsParam}&display=swap`;
};

// Helper function to get font fallbacks
export const getFontFallback = (category: string): string => {
  switch (category) {
    case 'serif':
      return 'serif';
    case 'monospace':
      return 'monospace';
    case 'display':
      return 'cursive';
    default:
      return 'sans-serif';
  }
};