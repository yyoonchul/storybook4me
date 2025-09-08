import { motion } from "framer-motion";
import { Card, CardContent } from "../../../shared/components/ui/card";
import { BookOpen, Clock, Smartphone } from "lucide-react";

const problems = [
  {
    icon: BookOpen,
    title: "Content Fatigue",
    description: "My child is bored with the same old books...",
    detail: "You've read every book in the house three times. Your child craves new adventures, but finding fresh, engaging content that captures their imagination feels impossible."
  },
  {
    icon: Clock,
    title: "Lack of Time",  
    description: "I want to create special moments, but I'm exhausted...",
    detail: "Between work, household tasks, and daily routines, finding time to create meaningful experiences with your child feels like another impossible task on your endless to-do list."
  },
  {
    icon: Smartphone,
    title: "Screen Time Guilt",
    description: "I want to connect with my child, not just hand them a screen.",
    detail: "You know too much screen time isn't ideal, but you're tired and need a moment. You want something that brings you together instead of creating distance."
  }
];

const ProblemSection = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Sound Familiar?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We understand the challenges busy parents face when trying to create special moments with their children.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="glass-effect hover-lift border-0 h-full">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-magic-200 flex items-center justify-center mx-auto mb-6">
                      <problem.icon className="h-8 w-8 text-magic-600" />
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">
                      {problem.title}
                    </h3>
                    
                    <p className="text-magic-500 font-medium mb-4 italic">
                      "{problem.description}"
                    </p>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {problem.detail}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;