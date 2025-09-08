import { motion } from "framer-motion"
import { Card, CardContent } from "@/shared/components/ui/card"
import { CONTENT } from "@/shared/constants/content"
import { Shield, Users, Award, CheckCircle } from "lucide-react"

const iconMap = {
  Shield,
  Users,
  Award
} as const

export const DifferentiatorsSection = () => {
  return (
    <section className="py-20 bg-soft-pastel">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why <span className="sparkle-text">Sparkbook</span> is So Special
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We've solved the problems that other AI tools can't. Here's what makes us different.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto space-y-12">
          {CONTENT.differentiators.map((differentiator, index) => {
            const IconComponent = iconMap[differentiator.icon as keyof typeof iconMap]
            const isEven = index % 2 === 0
            
            return (
              <motion.div
                key={differentiator.id}
                className={`grid lg:grid-cols-2 gap-12 items-center ${isEven ? '' : 'lg:grid-flow-col-dense'}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                {/* Content Side */}
                <div className={isEven ? '' : 'lg:col-start-2'}>
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 glass-effect hover-lift hover-glow">
                    <CardContent className="p-8">
                      <div className="flex items-start space-x-4 mb-6">
                        <motion.div
                          className="flex-shrink-0 w-16 h-16 bg-soft-pastel rounded-xl flex items-center justify-center border-2 border-magic-200/30 shadow-lg"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <IconComponent className="w-8 h-8 text-primary-gradient" />
                        </motion.div>
                        
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            {differentiator.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed text-lg">
                            {differentiator.description}
                          </p>
                        </div>
                      </div>

                      {/* Quality Indicators */}
                      {differentiator.id === 'quality-trust' && (
                        <motion.div 
                          className="mt-6 space-y-3"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: 0.3 }}
                        >
                          {[
                            "Age-appropriate content guaranteed",
                            "Professional illustration quality",
                            "Safe, family-friendly stories"
                          ].map((feature, idx) => (
                            <motion.div
                              key={idx}
                              className="flex items-center space-x-3"
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.4, delay: 0.1 * idx }}
                            >
                              <CheckCircle className="w-5 h-5 text-trust flex-shrink-0 drop-shadow-sm" />
                              <span className="text-gray-700">{feature}</span>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Visual Side */}
                <motion.div 
                  className={`${isEven ? '' : 'lg:col-start-1 lg:row-start-1'}`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {differentiator.id === 'consistent-character' && (
                    <div className="glass-effect rounded-2xl p-6 shadow-lg hover-glow">
                      <h4 className="text-sm font-semibold text-gray-500 mb-4 text-center">
                        Character Consistency Example
                      </h4>
                      <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map((page) => (
                          <motion.div
                            key={page}
                            className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center relative overflow-hidden"
                            whileHover={{ y: -5 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full"></div>
                            <div className="absolute bottom-2 left-2 right-2 text-xs text-gray-600 text-center">
                              Page {page}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      <p className="text-xs text-center text-gray-500 mt-3">
                        Same character, every page ✨
                      </p>
                    </div>
                  )}

                  {differentiator.id === 'truly-personal' && (
                    <div className="glass-effect rounded-2xl p-6 shadow-lg hover-glow">
                      <h4 className="text-sm font-semibold text-gray-500 mb-4 text-center">
                        Personal Story Elements
                      </h4>
                      <div className="space-y-3">
                        {[
                          { label: "Family pet", example: "...their dog, Rusty, wagged his tail..." },
                          { label: "Favorite place", example: "...at Grandma's cozy house..." },
                          { label: "Real memory", example: "...like that day at the beach..." }
                        ].map((item, idx) => (
                          <motion.div
                            key={idx}
                            className="bg-gray-50 rounded-lg p-3"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.1 * idx }}
                          >
                            <div className="text-xs font-medium text-primary-gradient mb-1">
                              {item.label}
                            </div>
                            <div className="text-sm text-gray-700 italic">
                              {item.example}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {differentiator.id === 'quality-trust' && (
                    <div className="glass-effect rounded-2xl p-6 shadow-lg text-center hover-glow">
                      <motion.div
                        className="w-20 h-20 accent-green rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg"
                        animate={{ 
                          boxShadow: [
                            "0 0 0 0 rgba(34, 197, 94, 0.7)",
                            "0 0 0 20px rgba(34, 197, 94, 0)",
                            "0 0 0 0 rgba(34, 197, 94, 0.7)"
                          ]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <Award className="w-10 h-10 text-white" />
                      </motion.div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Quality Guaranteed
                      </h4>
                      <p className="text-sm text-gray-600">
                        Every story meets our high standards for safety, creativity, and age-appropriateness.
                      </p>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
