import { motion } from "framer-motion"
import { Card, CardContent } from "@/shared/components/ui/card"
import { CONTENT } from "@/shared/constants/content"
import { Upload, Wand2, Sparkles } from "lucide-react"

const iconMap = {
  Upload,
  Wand2,
  Sparkles
} as const

const stepColors = [
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500", 
  "from-orange-500 to-yellow-500"
]

export const SolutionSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.span 
              className="sparkle-text inline-block"
              animate={{ 
                textShadow: [
                  "0 0 0 rgba(238, 76, 255, 0)",
                  "0 0 10px rgba(238, 76, 255, 0.3)",
                  "0 0 0 rgba(238, 76, 255, 0)"
                ]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {CONTENT.solution.title}
            </motion.span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            A simple, visually-driven 3-step guide that makes the process feel effortless and magical.
          </motion.p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Lines for Desktop */}
            <div className="hidden md:block absolute top-1/2 left-1/3 right-1/3 h-px bg-gradient-to-r from-magic-200 via-magic-400 to-magic-200 -translate-y-1/2 z-0"></div>
            
            {CONTENT.solution.steps.map((step, index) => {
              const IconComponent = iconMap[step.icon as keyof typeof iconMap]
              const gradientClass = stepColors[index]
              
              return (
                <motion.div
                  key={step.id}
                  className="relative z-10"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <motion.div
                    whileHover={{ y: -5, rotateY: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md group glass-effect hover-lift hover-glow">
                      <CardContent className="p-8 text-center">
                      {/* Step Number */}
                      <motion.div
                        className="relative mb-6"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${gradientClass} rounded-full flex items-center justify-center relative overflow-hidden group-hover:shadow-lg transition-shadow`}>
                          <IconComponent className="w-10 h-10 text-white relative z-10" />
                          <motion.div
                            className="absolute inset-0 bg-white/20 rounded-full"
                            initial={{ scale: 0 }}
                            whileHover={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        
                        {/* Step Number Badge */}
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-magic-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                      </motion.div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        {step.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {step.description}
                      </p>

                      {/* Example/Demo */}
                      <motion.div
                        className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-200 group-hover:border-magic-300 transition-colors"
                        whileHover={{ backgroundColor: "#fef7ff" }}
                      >
                        {index === 0 && (
                          <div className="text-sm text-gray-500">
                            <div className="w-8 h-8 accent-character rounded mx-auto mb-2 flex items-center justify-center shadow-sm">
                              📸
                            </div>
                            Drop photo here
                          </div>
                        )}
                        
                        {index === 1 && (
                          <div className="text-sm">
                            <p className="text-gray-500 mb-1">Example prompt:</p>
                            <p className="text-gray-800 italic font-medium">
                              {step.example}
                            </p>
                          </div>
                        )}
                        
                        {index === 2 && (
                          <div className="text-sm">
                            <motion.div
                              className="w-12 h-8 magic-gradient rounded mx-auto mb-2 flex items-center justify-center shadow-lg"
                              animate={{ 
                                boxShadow: [
                                  "0 0 0 0 rgba(238, 76, 255, 0.7)",
                                  "0 0 0 10px rgba(238, 76, 255, 0)",
                                  "0 0 0 0 rgba(238, 76, 255, 0.7)"
                                ]
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              📚
                            </motion.div>
                            <p className="text-gray-500">Your magical storybook</p>
                          </div>
                        )}
                      </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>

          {/* Magic Emphasis */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center space-x-3 glass-effect-soft px-8 py-4 rounded-full hover-glow"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Sparkles className="w-6 h-6 text-primary-gradient animate-sparkle" />
              <span className="text-xl font-semibold sparkle-text">
                It really is that simple!
              </span>
              <Sparkles className="w-6 h-6 text-primary-gradient animate-sparkle" style={{ animationDelay: '0.5s' }} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
