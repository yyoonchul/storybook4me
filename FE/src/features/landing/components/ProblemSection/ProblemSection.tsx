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
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Sound <span className="sparkle-text">Familiar?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We understand the challenges busy parents face when trying to create special moments with their children.
          </p>
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
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:shadow-xl group">
                  <CardContent className="p-8 text-center">
                    <motion.div
                      className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors"
                      whileHover={{ scale: 1.1 }}
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
          <p className="text-2xl text-gray-700 font-medium max-w-3xl mx-auto">
            You're not alone. Every parent wants to create{" "}
            <span className="sparkle-text font-semibold">magical moments</span>{" "}
            with their children, but finding the time and energy can be challenging.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
