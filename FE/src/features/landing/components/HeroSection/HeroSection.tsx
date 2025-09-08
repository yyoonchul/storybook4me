import { motion } from "framer-motion"
import { Button } from "@/shared/components/ui/button"
import { CONTENT } from "@/shared/constants/content"
import { Sparkles, Play } from "lucide-react"

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-soft-pastel">
      {/* Enhanced Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-magic-200/20 to-transparent rounded-full animate-float"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-magic-300/20 to-transparent rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        {/* Additional floating elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-4 h-4 accent-yellow rounded-full opacity-60"
          animate={{ 
            y: [0, -20, 0],
            x: [0, 10, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-6 h-6 accent-character rounded-full opacity-60"
          animate={{ 
            y: [0, -15, 0],
            x: [0, -15, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div 
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.span 
                className="sparkle-text inline-block"
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                In 10 seconds
              </motion.span>, watch your child become the{" "}
              <span className="relative">
                <motion.span
                  className="relative z-10"
                  animate={{ 
                    textShadow: [
                      "0 0 0 rgba(238, 76, 255, 0)",
                      "0 0 20px rgba(238, 76, 255, 0.5)",
                      "0 0 0 rgba(238, 76, 255, 0)"
                    ]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: 1
                  }}
                >
                  hero
                </motion.span>
                <motion.div
                  className="absolute -inset-1 bg-magic-200/30 rounded-lg -skew-x-12"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                />
              </span>{" "}
              of their very own storybook.
            </motion.h1>

            <motion.div 
              className="text-xl md:text-2xl text-gray-600 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {CONTENT.hero.subheadline}
            </motion.div>

            <motion.p 
              className="text-lg text-gray-500 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {CONTENT.hero.description}
            </motion.p>

            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Button 
                  variant="magic" 
                  size="xl"
                  className="w-full sm:w-auto group relative overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                  </motion.div>
                  {CONTENT.hero.cta}
                  <motion.div
                    animate={{ rotate: [0, -360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-5 h-5 ml-2" />
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 rounded-lg"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.8 }}
                  />
                </Button>
              </motion.div>
              
              <p className="text-sm text-gray-400 text-center sm:text-left">
                {CONTENT.hero.ctaSubtext}
              </p>
            </motion.div>
          </motion.div>

          {/* Right Column - Visual Demo */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative rounded-3xl shadow-2xl p-8 glass-effect hover-glow">
              {/* Mock Phone Interface */}
              <div className="bg-gray-900 rounded-2xl p-4 mb-6">
                <div className="bg-white rounded-xl p-6 space-y-4">
                  {/* Photo Upload Area */}
                  <motion.div 
                    className="border-2 border-dashed border-magic-300 rounded-lg p-8 text-center hover:border-magic-500 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-16 h-16 bg-soft-pastel rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-magic-200/30">
                      <Sparkles className="w-8 h-8 text-primary-gradient" />
                    </div>
                    <p className="text-sm text-gray-600">Upload your child's photo</p>
                  </motion.div>

                  {/* Story Input */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-2">Story idea:</p>
                    <motion.p 
                      className="text-gray-800 italic"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 2, delay: 1.5 }}
                    >
                      "Chloe the brave knight who befriends a dragon"
                    </motion.p>
                  </div>

                  {/* Magic Button */}
                  <motion.button 
                    className="w-full bg-magic-500 text-white rounded-lg py-3 font-semibold flex items-center justify-center space-x-2 hover:bg-magic-600 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Play className="w-4 h-4" />
                    <span>Create Magic</span>
                  </motion.button>
                </div>
              </div>

              {/* Magic Timer */}
              <motion.div 
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 2 }}
              >
                <div className="text-6xl font-bold sparkle-text mb-2">
                  <motion.span
                    key="timer"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    10
                  </motion.span>
                </div>
                <p className="text-gray-500">seconds to magic</p>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-8 h-8 accent-yellow rounded-full shadow-lg"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 180, 360] 
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-6 h-6 accent-character rounded-full shadow-lg"
                animate={{ 
                  y: [0, -15, 0],
                  x: [0, 10, 0] 
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
