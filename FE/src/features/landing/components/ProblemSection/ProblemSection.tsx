import { motion } from "framer-motion"
import { Card, CardContent } from "@/shared/components/ui/card"
import { CONTENT } from "@/shared/constants/content"
import { BookOpen, Clock, Heart } from "lucide-react"

const iconMap = {
  BookOpen,
  Clock,
  Heart
} as const

export const ProblemSection = () => {
  return (
    <section className="py-20 bg-dreamy">
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
            Sound <motion.span 
              className="sparkle-text inline-block"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Familiar?
            </motion.span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            We understand the challenges busy parents face when trying to create special moments with their children.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {CONTENT.problems.map((problem, index) => {
            const IconComponent = iconMap[problem.icon as keyof typeof iconMap]
            
            return (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:shadow-xl group glass-effect-soft hover-lift">
                    <CardContent className="p-8 text-center">
                      <motion.div
                        className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center group-hover:from-red-200 group-hover:to-red-300 transition-all duration-300 shadow-lg border-2 border-red-200/30"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <IconComponent className="w-8 h-8 text-red-600" />
                      </motion.div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        {problem.title}
                      </h3>
                      
                      <blockquote className="text-gray-600 italic leading-relaxed">
                        "{problem.description}"
                      </blockquote>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* Empathy Statement */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="glass-effect-soft rounded-2xl p-8 max-w-4xl mx-auto">
            <p className="text-2xl text-gray-700 font-medium">
              You're not alone. Every parent wants to create{" "}
              <span className="sparkle-text font-semibold">magical moments</span>{" "}
              with their children, but finding the time and energy can be challenging.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
