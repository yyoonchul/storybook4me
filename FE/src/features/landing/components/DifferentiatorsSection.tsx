import { motion } from "framer-motion";
import { Card, CardContent } from "../../../shared/components/ui/card";
import { Eye, Heart, Shield, Check } from "lucide-react";

const differentiators = [
  {
    icon: Eye,
    title: "Unbroken Immersion",
    subtitle: "Character consistency guaranteed",
    description: "Unlike other AI tools that change how characters look on every page, your child stays perfectly recognizable throughout their entire adventure.",
    features: [
      "Same character appearance on every page",
      "Consistent clothing and features", 
      "Professional illustration quality"
    ],
    badge: "Consistency ✓"
  },
  {
    icon: Heart,
    title: "Truly Personal",
    subtitle: "Real personalization with family, places & memories",
    description: "Go beyond just inserting a name. Include family members, pets, favorite places, and real memories to create deeply meaningful stories.",
    features: [
      "Include family members & pets",
      "Feature familiar locations",
      "Incorporate personal memories"
    ],
    badge: "Personal ✓"
  },
  {
    icon: Shield,
    title: "Quality You Can Trust",
    subtitle: "Age-appropriate stories and high-quality illustrations",
    description: "Every story is carefully crafted to be educational, positive, and perfectly suited for your child's age and development stage.",
    features: [
      "Age-appropriate content",
      "Educational themes",
      "Professional artwork quality"
    ],
    badge: "Trusted ✓"
  }
];

const DifferentiatorsSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Why{" "}
            <span className="sparkle-text">Storybook4me</span>{" "}
            is So Special
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We've solved the problems that other AI tools can't...
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {differentiators.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="hover-lift hover-glow border-magic-200/50 h-full">
                <CardContent className="p-8">
                  
                  {/* Icon & Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-full bg-magic-200 flex items-center justify-center">
                      <item.icon className="h-6 w-6 text-magic-600" />
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-magic-100 text-magic-600">
                      {item.badge}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {item.title}
                  </h3>
                  
                  <p className="text-magic-500 font-medium mb-4">
                    {item.subtitle}
                  </p>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Feature Checklist */}
                  <div className="space-y-2">
                    {item.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-magic-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
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

export default DifferentiatorsSection;