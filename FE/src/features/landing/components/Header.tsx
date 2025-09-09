import { motion } from "framer-motion";
import { Button } from "../../../shared/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: "How It Works", href: "#how-it-works" },
    { name: "Examples", href: "#examples" },
    { name: "Testimonials", href: "#testimonials" }
  ];

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <img 
                src="/logo.png" 
                alt="StoryBook Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl font-semibold text-gray-900">
              storybook<span className="sparkle-text">4me</span>
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav 
            className="hidden md:flex items-center space-x-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavClick(item.href)}
                className="text-gray-600 hover:text-magic-600 font-normal transition-colors duration-200"
              >
                {item.name}
              </button>
            ))}
          </motion.nav>

          {/* Desktop CTA Button */}
          <motion.div 
            className="hidden md:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button 
              className="magic-gradient hover-lift hover-glow"
              onClick={() => navigate('/waitlist')}
            >
              Create Your Story
            </Button>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          className={`md:hidden overflow-hidden ${isMenuOpen ? 'max-h-96' : 'max-h-0'}`}
          initial={false}
          animate={{ 
            maxHeight: isMenuOpen ? 384 : 0,
            opacity: isMenuOpen ? 1 : 0
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="py-4 space-y-4 border-t border-gray-200/50">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavClick(item.href)}
                className="block text-gray-600 hover:text-magic-600 font-normal transition-colors duration-200 text-left w-full"
              >
                {item.name}
              </button>
            ))}
            <div className="pt-4">
              <Button 
                className="magic-gradient hover-lift hover-glow w-full"
                onClick={() => navigate('/waitlist')}
              >
                Create Your Story
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
