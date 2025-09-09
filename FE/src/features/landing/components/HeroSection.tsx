import { motion } from "framer-motion";
import { Button } from "../../../shared/components/ui/button";
import { Upload, Clock, Sparkles } from "lucide-react";
import heroImage from "../../../assets/hero-storybook.jpg";
import { useNavigate } from "react-router-dom";
import TypewriterText from "../../../shared/components/TypewriterText";

const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-soft-pastel overflow-hidden pt-16">
      {/* Floating gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 rounded-full bg-magic-300/20 blur-3xl"
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-magic-500/10 blur-3xl"
          animate={{ 
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Content */}
          <motion.div 
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-5xl lg:text-7xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              In{" "}
              <span className="sparkle-text">10 seconds</span>, watch your child become the{" "}
              <span className="sparkle-text">hero</span>{" "}
              of their very own storybook.
            </motion.h1>
            
            <motion.p 
              className="text-xl lg:text-2xl text-gray-700 mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              The most special gift for busy parents.
            </motion.p>
            
            <motion.p 
              className="text-lg text-gray-600 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Just upload a photo and a story idea. Let the magic begin.
            </motion.p>

            <motion.p
              className="text-xs text-gray-500 -mt-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              * Your personal data and photos are securely handled and deleted immediately after your storybook is created.
            </motion.p>

            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Button 
                size="lg" 
                className="magic-gradient hover-lift hover-glow text-lg px-8 py-6 h-auto font-semibold"
                onClick={() => navigate('/waitlist')}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Create Your Storybook For Free
              </Button>
              
              <p className="text-sm text-gray-500">
                *No signup required to start!
              </p>
            </motion.div>
          </motion.div>

          {/* Right Demo UI */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Magical storybook illustration showing a child as the hero of their own adventure"
                className="w-full rounded-3xl shadow-soft"
              />
              
              {/* Demo UI Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="glass-effect rounded-2xl p-6 max-w-sm mx-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-magic-500 flex items-center justify-center">
                        <Upload className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-medium">Photo uploaded ✓</span>
                    </div>
                    
                    <div className="bg-white/70 rounded-lg p-3">
                      <p className="text-sm text-gray-700">
                        <TypewriterText
                          text={[
                            '"My daughter Emma goes on a magical adventure..."',
                            '"Our son Leo explores a hidden jungle temple..."',
                            '"Twins Mia and Noah build a rocket to the moon!"'
                          ]}
                          typingSpeedMs={32}
                          deletingSpeedMs={20}
                          pauseBeforeDeleteMs={1200}
                          pauseBetweenWordsMs={300}
                          className=""
                          cursorClassName="inline-block w-[1px] h-4 bg-gray-700 ml-0.5 align-middle animate-pulse"
                        />
                      </p>
                    </div>
                    
                    <motion.div 
                      className="flex items-center gap-2 justify-center"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Clock className="h-4 w-4 text-magic-500" />
                      <span className="text-sm font-semibold sparkle-text">
                        Creating magic... 3s
                      </span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;