import { motion } from "framer-motion";
import { Card, CardContent } from "../../../shared/components/ui/card";
import { Upload, Lightbulb, BookOpen } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: Upload,
    title: "Create Your Character",
    description: "Upload one photo → unique character",
    detail: "Simply upload a photo of your child, and our AI instantly creates a consistent, beautiful character that looks just like them - ready for any adventure.",
    demoText: "Upload Emma's photo"
  },
  {
    number: 2,
    icon: Lightbulb,
    title: "Imagine Your Story",
    description: "Enter a simple idea",
    detail: "Type any story idea, no matter how simple. Our AI understands and transforms your concept into an engaging, age-appropriate adventure.",
    demoText: "\"Emma discovers a magical garden\""
  },
  {
    number: 3,
    icon: BookOpen,
    title: "Your Book Appears in a Flash!",
    description: "Instantly generate a personalized storybook",
    detail: "Watch as your personalized storybook comes to life in seconds, with beautiful illustrations and a captivating story featuring your child as the hero.",
    demoText: "✨ Your storybook is ready!"
  }
];

const SolutionSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-dreamy">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            How Our{" "}
            <span className="sparkle-text">10-Second Magic</span>{" "}
            Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A simple, visually-driven process that transforms your ideas into magical storybooks in moments.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-magic-300 via-magic-400 to-magic-500 transform -translate-y-1/2 z-0" />
          
          <div className="grid lg:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                {/* Step Number Circle */}
                <motion.div 
                  className="w-16 h-16 rounded-full magic-gradient flex items-center justify-center mx-auto mb-6 relative z-20 shadow-soft"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-white font-bold text-xl">
                    {step.number}
                  </span>
                </motion.div>

                <Card className="glass-effect hover-lift border-0">
                  <CardContent className="p-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-magic-200 flex items-center justify-center mx-auto mb-4">
                      <step.icon className="h-6 w-6 text-magic-600" />
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      {step.title}
                    </h3>
                    
                    <p className="text-magic-500 font-medium mb-4">
                      {step.description}
                    </p>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {step.detail}
                    </p>

                    {/* Demo Example */}
                    <div className="bg-white/60 rounded-lg p-3 border border-magic-200/50">
                      <p className="text-sm text-gray-700 font-medium">
                        {step.demoText}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;