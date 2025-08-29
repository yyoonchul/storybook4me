import { motion } from "framer-motion"
import { Card, CardContent } from "@/shared/components/ui/card"
import { CONTENT } from "@/shared/constants/content"
import { Star, Quote } from "lucide-react"

export const SocialProofSection = () => {
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
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            See the <span className="sparkle-text">Magic</span> Other Families Have Created
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real stories from real families who've discovered the joy of personalized storytelling.
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {CONTENT.testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md group">
                <CardContent className="p-6">
                  {/* Mock Book Cover */}
                  <motion.div
                    className="aspect-[3/4] bg-gradient-to-br from-magic-200 via-purple-200 to-pink-200 rounded-lg mb-6 relative overflow-hidden group-hover:shadow-md transition-shadow"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                    
                    {/* Character representation */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full mx-auto mb-2 border-2 border-white shadow-lg"></div>
                      <div className="text-center">
                        <div className="text-xs font-semibold text-gray-700 bg-white/80 rounded px-2 py-1">
                          {testimonial.id === 'astronaut-leo' && '🚀 Leo the Astronaut'}
                          {testimonial.id === 'tooth-hero' && '🦷 Ava the Tooth Hero'}
                          {testimonial.id === 'princess-adventure' && '👑 Princess Mia'}
                        </div>
                      </div>
                    </div>

                    {/* Sparkle effects */}
                    <motion.div
                      className="absolute top-3 right-3 text-yellow-400"
                      animate={{ 
                        rotate: [0, 180, 360],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      ✨
                    </motion.div>
                  </motion.div>

                  {/* Testimonial Content */}
                  <div className="space-y-4">
                    {/* Stars */}
                    <div className="flex justify-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.2, delay: 0.1 * i }}
                        >
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        </motion.div>
                      ))}
                    </div>

                    {/* Quote */}
                    <div className="relative">
                      <Quote className="w-6 h-6 text-magic-300 absolute -top-2 -left-2" />
                      <blockquote className="text-gray-700 italic text-center pl-4">
                        {testimonial.quote}
                      </blockquote>
                    </div>

                    {/* Author */}
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    </div>

                    {/* Story Prompt */}
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-xs font-medium text-magic-600 mb-1">Created from:</p>
                      <p className="text-sm text-gray-700 italic">"{testimonial.prompt}"</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          className="bg-gradient-to-r from-magic-500 to-purple-600 rounded-2xl p-8 text-white text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              className="space-y-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-4xl md:text-5xl font-bold">10,000+</div>
              <div className="text-purple-200">Stories Created</div>
            </motion.div>
            
            <motion.div
              className="space-y-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-4xl md:text-5xl font-bold">4.9⭐</div>
              <div className="text-purple-200">Average Rating</div>
            </motion.div>
            
            <motion.div
              className="space-y-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-4xl md:text-5xl font-bold">95%</div>
              <div className="text-purple-200">Happy Families</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p className="text-xl text-gray-600 mb-6">
            Join thousands of families creating magical memories every day.
          </p>
          <motion.div
            className="inline-flex items-center space-x-2 text-magic-600 font-semibold"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span>Your family's story is waiting</span>
            <span>→</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
