import { motion } from "framer-motion";
import { Card, CardContent } from "../../../shared/components/ui/card";
import { Star, Heart } from "lucide-react";

const testimonials = [
  {
    rating: 5,
    quote: "Emma was absolutely thrilled to see herself as a princess in her own castle! The character looked exactly like her, and the story kept her engaged from start to finish.",
    author: "Sarah M.",
    prompt: "Emma becomes a brave princess"
  },
  {
    rating: 5,
    quote: "My 4-year-old was terrified of the dark after a scary dream. We created a story where she became a brave night guardian who protects other children from bad dreams. Now she actually looks forward to bedtime!",
    author: "Michael R.", 
    prompt: "Lily becomes a brave night guardian"
  },
  {
    rating: 5,
    quote: "We created a story about our family camping trip last summer. My kids love seeing themselves in the tent, roasting marshmallows, and finding the 'treasure' we hid. It's become our favorite bedtime story.",
    author: "Jennifer L.",
    prompt: "The Johnson family's camping adventure"
  }
];


const SocialProofSection = () => {
  return (
    <section id="testimonials" className="py-24 bg-soft-pastel">
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