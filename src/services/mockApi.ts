import { AuraGenResponse, ColorPalette, ComponentSuggestion, VisualInspiration } from '../types';

// Enhanced mock responses with better prompting
const mockResponses = [
  {
    message: "🎨 **Welcome to AuraGen AI!** I'm excited to help you create an amazing design system!\n\nI can work in two ways:\n\n**🎲 Surprise Mode**: Let me create something unique and innovative based on minimal input\n\n**🎯 Guided Mode**: Answer a few questions so I can craft the perfect design for your specific needs\n\n**Which approach sounds better to you?** Just say \"surprise me\" or \"guide me\" to get started!",
    isComplete: false
  },
  {
    message: "Perfect! Let's create something amazing together. I have a few quick questions to nail down your perfect design:\n\n**1. What type of interface are you building?**\n• 👥 User-facing app/website (consumer-friendly)\n• 🏢 Business/corporate application (professional)\n• ⚙️ Admin dashboard (data-heavy, functional)\n• 🌐 Multi-purpose (needs to work everywhere)\n\n**2. Do you need multiple color palettes?**\n• Single versatile palette\n• Separate palettes (user + admin, light + dark, etc.)\n\n**3. Any specific vibes or colors in mind?**\n(Or just say \"surprise me\" for this part!)",
    isComplete: false
  },
  {
    message: "Excellent choices! 🚀 Now I'm generating your complete design system...\n\n✨ **Creating your moodboard with:**\n• Multiple color palettes tailored to your needs\n• Professional typography system with Google Fonts\n• Interactive component library with all states\n• Real design mockups using your colors\n• Complete style guide and design principles\n\nThis will be amazing! Give me just a moment...",
    moodboard: {
      vibeSummary: "Modern Professional Design System",
      colorPalettes: [
        {
          name: "Primary Interface",
          purpose: "Main user interface colors",
          colors: [
            { 
              name: "Electric Blue", 
              hex: "#3B82F6", 
              rgb: "rgb(59, 130, 246)",
              hsl: "hsl(217, 91%, 60%)",
              description: "Vibrant blue that conveys trust, professionalism, and modern technology",
              usage: "Primary buttons, active states, brand accent, links"
            },
            { 
              name: "Pure White", 
              hex: "#FFFFFF", 
              rgb: "rgb(255, 255, 255)",
              hsl: "hsl(0, 0%, 100%)",
              description: "Clean, crisp white for maximum contrast and modern aesthetics",
              usage: "Main background, card backgrounds, modal overlays"
            },
            { 
              name: "Soft Gray", 
              hex: "#F8FAFC", 
              rgb: "rgb(248, 250, 252)",
              hsl: "hsl(210, 40%, 98%)",
              description: "Subtle gray background that provides gentle contrast without harshness",
              usage: "Secondary backgrounds, input fields, disabled states"
            },
            { 
              name: "Charcoal", 
              hex: "#1E293B", 
              rgb: "rgb(30, 41, 59)",
              hsl: "hsl(222, 33%, 17%)",
              description: "Deep, sophisticated dark color for strong contrast and readability",
              usage: "Primary text, headers, navigation elements, icons"
            },
            { 
              name: "Success Green", 
              hex: "#10B981", 
              rgb: "rgb(16, 185, 129)",
              hsl: "hsl(158, 84%, 39%)",
              description: "Fresh green that communicates success, growth, and positive actions",
              usage: "Success states, confirmations, positive feedback, checkmarks"
            }
          ]
        }
      ],
      fontPairing: {
        heading: {
          name: "Inter",
          googleFont: "Inter:wght@400;500;600;700;800;900",
          fallback: "sans-serif",
          category: "sans-serif",
          weights: [400, 500, 600, 700, 800, 900],
          sizes: {
            h1: "3.75rem", // 60px
            h2: "3rem", // 48px
            h3: "2.25rem", // 36px
            h4: "1.875rem", // 30px
            h5: "1.5rem", // 24px
            h6: "1.25rem" // 20px
          }
        },
        body: {
          name: "Inter",
          googleFont: "Inter:wght@300;400;500;600",
          fallback: "sans-serif",
          category: "sans-serif",
          weights: [300, 400, 500, 600],
          sizes: {
            large: "1.125rem", // 18px
            regular: "1rem", // 16px
            small: "0.875rem", // 14px
            caption: "0.75rem" // 12px
          }
        }
      },
      visualInspiration: [
        {
          title: "Modern SaaS Dashboard",
          description: "Clean, data-focused interface with clear hierarchy and intuitive navigation patterns.",
          mood: "Professional and efficient",
          colors: ["#3B82F6", "#FFFFFF", "#F8FAFC"],
          elements: ["Clean data tables", "Card-based layout", "Minimal icons", "Clear typography"],
          useCases: ["Dashboard design", "Data visualization", "Admin panels", "Analytics interfaces"],
          prompt: "modern SaaS dashboard, clean data visualization, professional interface, blue and white color scheme, minimal design"
        },
        {
          title: "Contemporary Web Application",
          description: "User-friendly interface with smooth interactions and modern design patterns.",
          mood: "Approachable and trustworthy",
          colors: ["#3B82F6", "#10B981", "#FFFFFF"],
          elements: ["Rounded corners", "Subtle shadows", "Interactive elements", "Responsive design"],
          useCases: ["Web applications", "User portals", "Mobile apps", "Landing pages"],
          prompt: "contemporary web application, user-friendly interface, modern design patterns, blue and green accents"
        },
        {
          title: "Professional Business Interface",
          description: "Corporate-grade design with emphasis on clarity, trust, and professional appearance.",
          mood: "Trustworthy and authoritative",
          colors: ["#1E40AF", "#64748B", "#F1F5F9"],
          elements: ["Structured layouts", "Professional typography", "Consistent spacing", "Clear hierarchy"],
          useCases: ["Business applications", "Enterprise software", "Corporate websites", "Professional tools"],
          prompt: "professional business interface, corporate design, structured layout, navy blue and gray color scheme"
        }
      ],
      componentSuggestions: [
        {
          component: "Primary Button",
          description: "Modern button with smooth hover effects and clear call-to-action styling",
          styling: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl",
          category: "interactive",
          states: {
            default: "bg-blue-600 text-white shadow-lg",
            hover: "bg-blue-700 shadow-xl transform scale-105",
            focus: "ring-4 ring-blue-200 ring-opacity-50",
            active: "bg-blue-800 transform scale-95",
            disabled: "bg-gray-300 text-gray-500 cursor-not-allowed transform-none"
          }
        },
        {
          component: "Input Field",
          description: "Clean input with focus states and modern styling",
          styling: "border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200",
          category: "forms",
          states: {
            default: "border-gray-300 bg-white",
            hover: "border-gray-400",
            focus: "border-blue-500 ring-4 ring-blue-100",
            active: "border-blue-600",
            disabled: "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
          }
        },
        {
          component: "Success Alert",
          description: "Success feedback with green styling and clear messaging",
          styling: "bg-green-50 border-2 border-green-200 text-green-800 rounded-lg p-4 flex items-center space-x-3",
          category: "feedback",
          states: {
            default: "bg-green-50 border-green-200 text-green-800",
            hover: "bg-green-100",
            focus: "ring-4 ring-green-100"
          }
        },
        {
          component: "Warning Alert",
          description: "Warning feedback with orange styling for important notices",
          styling: "bg-orange-50 border-2 border-orange-200 text-orange-800 rounded-lg p-4 flex items-center space-x-3",
          category: "feedback",
          states: {
            default: "bg-orange-50 border-orange-200 text-orange-800",
            hover: "bg-orange-100",
            focus: "ring-4 ring-orange-100"
          }
        },
        {
          component: "Error Alert",
          description: "Error feedback with red styling for critical messages",
          styling: "bg-red-50 border-2 border-red-200 text-red-800 rounded-lg p-4 flex items-center space-x-3",
          category: "feedback",
          states: {
            default: "bg-red-50 border-red-200 text-red-800",
            hover: "bg-red-100",
            focus: "ring-4 ring-red-100"
          }
        },
        {
          component: "Card Container",
          description: "Modern card with subtle shadow and hover effects",
          styling: "bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100",
          category: "layout",
          states: {
            default: "shadow-lg border-gray-100",
            hover: "shadow-xl transform -translate-y-1",
            focus: "ring-4 ring-blue-100",
            active: "shadow-md"
          }
        },
        {
          component: "Navigation Item",
          description: "Clean navigation with active states and smooth transitions",
          styling: "px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-blue-50 hover:text-blue-600",
          category: "navigation",
          states: {
            default: "text-gray-600 hover:bg-blue-50 hover:text-blue-600",
            active: "bg-blue-100 text-blue-700 font-semibold",
            hover: "bg-blue-50 text-blue-600",
            focus: "ring-2 ring-blue-200"
          }
        },
        {
          component: "Modal Dialog",
          description: "Centered modal with backdrop and smooth animations",
          styling: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm",
          category: "interactive",
          states: {
            default: "bg-black bg-opacity-50 backdrop-blur-sm",
            hover: "bg-black bg-opacity-60"
          }
        }
      ],
      designPrinciples: {
        spacing: "4px base unit with consistent scaling (4, 8, 12, 16, 24, 32, 48, 64px)",
        borderRadius: "Modern curves: 6px for small elements, 12px for cards, 16px for large containers",
        shadows: "Subtle, layered shadows: 0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)",
        animations: "Smooth 200ms ease-in-out transitions with subtle scale and translate effects"
      }
    },
    isComplete: true
  }
];

// Surprise mode responses
const surpriseResponses = [
  {
    message: "🎲 **Surprise Mode Activated!** \n\nI'm creating something unique and innovative for you... Let me craft a design system that combines unexpected elements with beautiful functionality!\n\n✨ **Generating:**\n• Bold color combinations you haven't seen before\n• Innovative typography pairings\n• Creative component designs\n• Unique visual inspiration\n\nGet ready to be amazed! 🚀",
    moodboard: {
      vibeSummary: "Cosmic Innovation Hub",
      colorPalettes: [
        {
          name: "Cosmic Primary",
          purpose: "Main interface with cosmic energy",
          colors: [
            { 
              name: "Nebula Purple", 
              hex: "#8B5CF6", 
              rgb: "rgb(139, 92, 246)",
              hsl: "hsl(258, 90%, 66%)",
              description: "Deep cosmic purple that evokes mystery, creativity, and infinite possibilities",
              usage: "Primary actions, brand elements, creative highlights"
            },
            { 
              name: "Stardust White", 
              hex: "#FEFEFE", 
              rgb: "rgb(254, 254, 254)",
              hsl: "hsl(0, 0%, 99%)",
              description: "Pure, luminous white like distant starlight",
              usage: "Main backgrounds, text on dark surfaces, clean spaces"
            },
            { 
              name: "Galaxy Gray", 
              hex: "#F1F3F7", 
              rgb: "rgb(241, 243, 247)",
              hsl: "hsl(220, 25%, 96%)",
              description: "Soft gray reminiscent of distant galaxies and cosmic dust",
              usage: "Secondary backgrounds, subtle dividers, input fields"
            },
            { 
              name: "Void Black", 
              hex: "#0F0F23", 
              rgb: "rgb(15, 15, 35)",
              hsl: "hsl(240, 40%, 10%)",
              description: "Deep space black with subtle blue undertones",
              usage: "Primary text, headers, strong contrast elements"
            },
            { 
              name: "Aurora Cyan", 
              hex: "#06B6D4", 
              rgb: "rgb(6, 182, 212)",
              hsl: "hsl(188, 94%, 43%)",
              description: "Electric cyan like aurora borealis dancing across the sky",
              usage: "Success states, interactive elements, energy accents"
            }
          ]
        }
      ],
      fontPairing: {
        heading: {
          name: "Space Grotesk",
          googleFont: "Space+Grotesk:wght@400;500;600;700",
          fallback: "sans-serif",
          category: "sans-serif",
          weights: [400, 500, 600, 700],
          sizes: {
            h1: "4rem", // 64px
            h2: "3.25rem", // 52px
            h3: "2.5rem", // 40px
            h4: "2rem", // 32px
            h5: "1.625rem", // 26px
            h6: "1.375rem" // 22px
          }
        },
        body: {
          name: "Inter",
          googleFont: "Inter:wght@300;400;500;600",
          fallback: "sans-serif",
          category: "sans-serif",
          weights: [300, 400, 500, 600],
          sizes: {
            large: "1.25rem", // 20px
            regular: "1rem", // 16px
            small: "0.875rem", // 14px
            caption: "0.75rem" // 12px
          }
        }
      },
      visualInspiration: [
        {
          title: "Cosmic Command Center",
          description: "Futuristic interface inspired by space exploration and scientific discovery.",
          mood: "Innovative and exploratory",
          colors: ["#8B5CF6", "#06B6D4", "#0F0F23"],
          elements: ["Holographic effects", "Floating panels", "Particle animations", "Cosmic gradients"],
          useCases: ["Dashboards", "Analytics", "Creative tools", "Tech platforms"],
          prompt: "cosmic command center, futuristic interface, space exploration, holographic effects, purple and cyan"
        }
      ],
      componentSuggestions: [
        {
          component: "Cosmic Button",
          description: "Futuristic button with glow effects and smooth animations",
          styling: "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25",
          category: "interactive",
          states: {
            default: "bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg",
            hover: "from-purple-700 to-purple-800 shadow-purple-500/25 transform scale-105",
            focus: "ring-4 ring-purple-300 ring-opacity-50",
            active: "from-purple-800 to-purple-900 transform scale-95",
            disabled: "bg-gray-400 cursor-not-allowed transform-none"
          }
        }
      ],
      designPrinciples: {
        spacing: "8px cosmic unit with exponential scaling (8, 16, 24, 40, 64, 104px)",
        borderRadius: "Organic curves: 12px for elements, 24px for cards, 40px for containers",
        shadows: "Cosmic glows: 0 8px 32px rgba(139, 92, 246, 0.15), 0 4px 16px rgba(6, 182, 212, 0.1)",
        animations: "Smooth 300ms ease-out with subtle glow and scale effects"
      }
    },
    isComplete: true
  }
];

// Enhanced regeneration responses
const regenerationResponses: { [key: string]: any } = {
  colors: {
    colorPalettes: [
      {
        name: "Ocean Breeze",
        purpose: "Main interface with oceanic theme",
        colors: [
          { 
            name: "Misty Blue", 
            hex: "#B8D4E3", 
            rgb: "rgb(184, 212, 227)",
            hsl: "hsl(201, 42%, 81%)",
            description: "Soft, ethereal blue reminiscent of morning mist over calm waters",
            usage: "Primary buttons, active navigation, brand elements"
          },
          { 
            name: "Pearl White", 
            hex: "#F8F9FA", 
            rgb: "rgb(248, 249, 250)",
            hsl: "hsl(210, 17%, 98%)",
            description: "Pure, clean white with subtle cool undertones for pristine backgrounds",
            usage: "Main backgrounds, card surfaces, modal overlays"
          },
          { 
            name: "Driftwood", 
            hex: "#A89B8C", 
            rgb: "rgb(168, 155, 140)",
            hsl: "hsl(32, 14%, 60%)",
            description: "Weathered wood tone that grounds the palette with natural warmth",
            usage: "Secondary buttons, borders, inactive states"
          },
          { 
            name: "Storm Navy", 
            hex: "#2C3E50", 
            rgb: "rgb(44, 62, 80)",
            hsl: "hsl(210, 29%, 24%)",
            description: "Deep, sophisticated navy for strong contrast and professional depth",
            usage: "Headers, primary text, navigation elements"
          },
          { 
            name: "Sunset Peach", 
            hex: "#FFB5A7", 
            rgb: "rgb(255, 181, 167)",
            hsl: "hsl(10, 100%, 83%)",
            description: "Warm coral accent that adds gentle energy and human warmth",
            usage: "Success indicators, highlights, warm accents"
          }
        ]
      }
    ]
  },
  'dark palette': {
    colorPalettes: [
      {
        name: "Primary Interface",
        purpose: "Main user interface colors",
        colors: [
          { 
            name: "Electric Blue", 
            hex: "#3B82F6", 
            rgb: "rgb(59, 130, 246)",
            hsl: "hsl(217, 91%, 60%)",
            description: "Vibrant blue that conveys trust, professionalism, and modern technology",
            usage: "Primary buttons, active states, brand accent, links"
          },
          { 
            name: "Pure White", 
            hex: "#FFFFFF", 
            rgb: "rgb(255, 255, 255)",
            hsl: "hsl(0, 0%, 100%)",
            description: "Clean, crisp white for maximum contrast and modern aesthetics",
            usage: "Main background, card backgrounds, modal overlays"
          },
          { 
            name: "Soft Gray", 
            hex: "#F8FAFC", 
            rgb: "rgb(248, 250, 252)",
            hsl: "hsl(210, 40%, 98%)",
            description: "Subtle gray background that provides gentle contrast without harshness",
            usage: "Secondary backgrounds, input fields, disabled states"
          },
          { 
            name: "Charcoal", 
            hex: "#1E293B", 
            rgb: "rgb(30, 41, 59)",
            hsl: "hsl(222, 33%, 17%)",
            description: "Deep, sophisticated dark color for strong contrast and readability",
            usage: "Primary text, headers, navigation elements, icons"
          },
          { 
            name: "Success Green", 
            hex: "#10B981", 
            rgb: "rgb(16, 185, 129)",
            hsl: "hsl(158, 84%, 39%)",
            description: "Fresh green that communicates success, growth, and positive actions",
            usage: "Success states, confirmations, positive feedback, checkmarks"
          }
        ]
      },
      {
        name: "Dark Mode",
        purpose: "Dark theme interface colors",
        colors: [
          { 
            name: "Midnight Blue", 
            hex: "#1E40AF", 
            rgb: "rgb(30, 64, 175)",
            hsl: "hsl(224, 71%, 40%)",
            description: "Deep blue for dark mode primary actions and brand elements",
            usage: "Primary buttons in dark mode, active navigation, brand accents"
          },
          { 
            name: "Dark Surface", 
            hex: "#0F172A", 
            rgb: "rgb(15, 23, 42)",
            hsl: "hsl(222, 47%, 11%)",
            description: "Rich dark background that reduces eye strain in low light",
            usage: "Main dark backgrounds, card surfaces, modal backgrounds"
          },
          { 
            name: "Slate Gray", 
            hex: "#334155", 
            rgb: "rgb(51, 65, 85)",
            hsl: "hsl(215, 25%, 27%)",
            description: "Medium gray for secondary backgrounds and subtle divisions",
            usage: "Secondary backgrounds, input fields, borders"
          },
          { 
            name: "Light Text", 
            hex: "#F1F5F9", 
            rgb: "rgb(241, 245, 249)",
            hsl: "hsl(210, 40%, 96%)",
            description: "Soft white for readable text on dark backgrounds",
            usage: "Primary text on dark surfaces, headers, important content"
          },
          { 
            name: "Emerald Accent", 
            hex: "#059669", 
            rgb: "rgb(5, 150, 105)",
            hsl: "hsl(158, 94%, 30%)",
            description: "Vibrant emerald for success states and positive actions in dark mode",
            usage: "Success indicators, confirmations, positive feedback"
          }
        ]
      }
    ]
  },
  fonts: {
    fontPairing: {
      heading: {
        name: "Poppins",
        googleFont: "Poppins:wght@400;500;600;700;800;900",
        fallback: "sans-serif",
        category: "sans-serif",
        weights: [400, 500, 600, 700, 800, 900],
        sizes: {
          h1: "4rem", // 64px
          h2: "3.25rem", // 52px
          h3: "2.5rem", // 40px
          h4: "2rem", // 32px
          h5: "1.625rem", // 26px
          h6: "1.375rem" // 22px
        }
      },
      body: {
        name: "Inter",
        googleFont: "Inter:wght@300;400;500;600",
        fallback: "sans-serif",
        category: "sans-serif",
        weights: [300, 400, 500, 600],
        sizes: {
          large: "1.25rem", // 20px
          regular: "1rem", // 16px
          small: "0.875rem", // 14px
          caption: "0.75rem" // 12px
        }
      }
    }
  }
};

let responseIndex = 0;
let isSurpriseMode = false;

export const generateAuraResponse = async (message: string): Promise<AuraGenResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
  
  const lowerMessage = message.toLowerCase();
  
  // Check for surprise mode
  if (lowerMessage.includes('surprise') && responseIndex === 0) {
    isSurpriseMode = true;
    return surpriseResponses[0];
  }
  
  // Check if this is a regeneration request
  if (lowerMessage.includes('regenerate')) {
    if (lowerMessage.includes('color')) {
      return {
        message: "🎨 **Fresh Colors Generated!** I've created a new 'Ocean Breeze' palette with cooler, more oceanic tones. This palette brings a sense of calm and natural flow while maintaining excellent usability and contrast ratios.",
        moodboard: {
          ...mockResponses[2].moodboard!,
          ...regenerationResponses.colors
        },
        isComplete: true
      };
    } else if (lowerMessage.includes('dark palette')) {
      return {
        message: "🌙 **Dark Palette Created!** I've generated a complementary dark mode palette that works beautifully with your existing design. This dark theme reduces eye strain while maintaining all the visual hierarchy and brand consistency of your light mode.",
        moodboard: {
          ...mockResponses[2].moodboard!,
          ...regenerationResponses['dark palette']
        },
        isComplete: true
      };
    } else if (lowerMessage.includes('font')) {
      return {
        message: "✍️ **Typography Updated!** I've switched to Poppins for headings to give your design more personality and warmth, while keeping Inter for body text to ensure excellent readability. This combination creates a perfect balance of character and functionality.",
        moodboard: {
          ...mockResponses[2].moodboard!,
          ...regenerationResponses.fonts
        },
        isComplete: true
      };
    } else if (lowerMessage.includes('mockup')) {
      return {
        message: "📱 **Device Mockups Refreshed!** I've updated the mockups with better proportions and more realistic content layouts. The desktop, tablet, and mobile views now show clearer hierarchy and better use of your color palette.",
        moodboard: {
          ...mockResponses[2].moodboard!
        },
        isComplete: true
      };
    } else if (lowerMessage.includes('component')) {
      return {
        message: "🧩 **Components Enhanced!** I've expanded the component library with more interactive elements, better state management, and additional variations. Each component now includes comprehensive styling options and quick color access.",
        moodboard: {
          ...mockResponses[2].moodboard!
        },
        isComplete: true
      };
    } else if (lowerMessage.includes('visual inspiration')) {
      return {
        message: "🎨 **Visual Inspiration Renewed!** I've created fresh visual concepts that better capture your design aesthetic. These new inspirations include updated color schemes and more detailed implementation guidance.",
        moodboard: {
          ...mockResponses[2].moodboard!
        },
        isComplete: true
      };
    } else if (lowerMessage.includes('entire moodboard') || lowerMessage.includes('all')) {
      return {
        message: "🚀 **Complete Moodboard Regenerated!** I've created a fresh new design system with updated colors, typography, and components. This new version maintains the professional feel while adding more personality and modern touches.",
        moodboard: {
          ...mockResponses[2].moodboard!,
          vibeSummary: "Refreshed Modern Professional System",
          ...regenerationResponses.colors,
          ...regenerationResponses.fonts
        },
        isComplete: true
      };
    }
  }

  // Check for font change requests
  if (lowerMessage.includes('change') && lowerMessage.includes('font')) {
    return {
      message: "🔤 **Font System Updated!** I've refreshed your typography with a new pairing that offers better visual hierarchy and improved readability. The new fonts work beautifully together and will make your interface feel more polished and professional.",
      moodboard: {
        ...mockResponses[2].moodboard!,
        ...regenerationResponses.fonts
      },
      isComplete: true
    };
  }

  // Handle guided vs surprise mode
  if (isSurpriseMode) {
    return surpriseResponses[0];
  }
  
  const response = mockResponses[Math.min(responseIndex, mockResponses.length - 1)];
  responseIndex++;
  
  return response;
};

// Reset for new conversations
export const resetConversation = () => {
  responseIndex = 0;
  isSurpriseMode = false;
};