import { motion } from "framer-motion";
import { Card, CardContent } from "../../../shared/components/ui/card";
import { Star, Users, BookOpen, Heart } from "lucide-react";

const testimonials = [
  {
    rating: 5,
    quote: "Emma was absolutely thrilled to see herself as a princess in her own castle! The character looked exactly like her, and the story kept her engaged from start to finish.",
    author: "Sarah M.",
    prompt: "Emma becomes a brave princess"
  },
  {
    rating: 5,
    quote: "Finally, a bedtime story that my son actually wants to hear again and again. Seeing himself as the hero boosted his confidence so much!",
    author: "Michael R.", 
    prompt: "Alex saves the forest animals"
  },
  {
    rating: 5,
    quote: "As a busy single mom, this is a lifesaver. Quality time with my daughter in just minutes, and she loves every story we create together.",
    author: "Jennifer L.",
    prompt: "Sophia's magical garden adventure"
  }
];

const stats = [
  { 
    icon: BookOpen,
    number: "50,000+",
    label: "Stories Created"
  },
  {
    icon: Star,
    number: "4.9/5",
    label: "Average Rating" 
  },
  {
    icon: Users,
    number: "15,000+",
    label: "Happy Families"
  }
];

const SocialProofSection = () => {
  return (
    <section className="py-24 bg-soft-pastel">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            See the{" "}
            <span className="sparkle-text">Magic</span>{" "}
            Other Families Have Created
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real testimonials from parents who've discovered the joy of personalized storytelling.
          </p>
        </motion.div>

        {/* Testimonials */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="glass-effect hover-lift border-0 h-full">
                <CardContent className="p-8">
                  
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-magic-400 text-magic-400" />
                    ))}
                  </div>
                  
                  {/* Quote */}
                  <p className="text-gray-700 mb-6 leading-relaxed italic">
                    "{testimonial.quote}"
                  </p>
                  
                  {/* Author */}
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">
                      {testimonial.author}
                    </span>
                  </div>
                  
                  {/* Original Prompt */}
                  <div className="mt-4 p-3 bg-magic-100 rounded-lg">
                    <p className="text-sm text-magic-600">
                      Story prompt: "{testimonial.prompt}"
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats Banner */}
        <motion.div
          className="glass-effect rounded-3xl p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-magic-200 flex items-center justify-center mb-3">
                  <stat.icon className="h-6 w-6 text-magic-600" />
                </div>
                <div className="text-3xl font-bold sparkle-text mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-lg text-gray-600">
            <Heart className="inline h-5 w-5 text-magic-500 mr-2" />
            Join thousands of families creating magical memories every day.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProofSection;