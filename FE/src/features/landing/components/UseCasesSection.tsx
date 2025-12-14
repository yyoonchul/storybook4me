import { motion } from "framer-motion";
import { Card, CardContent } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import { Sword, Heart, Camera, ArrowRight } from "lucide-react";
import landingExample1 from "../../../assets/landing_example1.png";
import landingExample2 from "../../../assets/landing_example2.png";
import landingExample3 from "../../../assets/landing_example3.png";
import { useNavigate } from "react-router-dom";
import TypewriterText from "../../../shared/components/TypewriterText";
import { useEffect, useRef, useState } from "react";

const useCases = [
  {
    icon: Sword,
    title: "Fantasy Adventures",
    description: "Transform your child into the hero of epic adventures",
    example: "Emma becomes a brave princess who saves her magical kingdom from an evil dragon",
    detail: "From brave knights to magical princesses, let their imagination soar through enchanted worlds. Watch as your child discovers they have the power to overcome any challenge.",
    color: "magic",
    image: landingExample1,
    imageAlt: "Child as a brave princess in a magical castle"
  },
  {
    icon: Heart,
    title: "Overcoming Fears",
    description: "Help your child process emotions and build confidence",
    example: "Lily becomes a brave night guardian who protects children from bad dreams",
    detail: "Create a safe space for your child to face their fears through storytelling. See them gain real-world confidence as they overcome challenges in their personalized stories.",
    color: "rose",
    image: landingExample2,
    imageAlt: "Child as a night guardian protecting others from nightmares"
  },
  {
    icon: Camera,
    title: "Family Memories",
    description: "Turn precious family moments into lasting storybooks",
    example: "The Johnson family's camping adventure with hidden treasures and campfire stories",
    detail: "Relive your favorite family vacations, celebrations, and special days through magical storytelling. Create keepsakes that your family will treasure forever.",
    color: "amber",
    image: landingExample3,
    imageAlt: "Family camping together under the stars"
  }
];

const UseCasesSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsActive(true);
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  
  return (
    <section id="examples" className="py-24 bg-white" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            What Kind of{" "}
            <span className="sparkle-text">Story</span>{" "}
            Will You Create?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every story is unique, just like your child. Here are some ways families use our platform to create meaningful moments.
          </p>
        </motion.div>

        <div className="space-y-24">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              {/* Content */}
              <div className={`${index === 1 ? 'lg:col-start-2' : ''}`}>
                <div className="flex items-center mb-6">
                  <div className={`w-16 h-16 rounded-full ${
                    useCase.color === 'magic' ? 'bg-magic-200' :
                    useCase.color === 'rose' ? 'bg-rose-200' : 'bg-amber-200'
                  } flex items-center justify-center mr-4`}>
                    <useCase.icon className={`h-8 w-8 ${
                      useCase.color === 'magic' ? 'text-magic-600' :
                      useCase.color === 'rose' ? 'text-rose-600' : 'text-amber-600'
                    }`} />
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-gray-900">
                    {useCase.title}
                  </h3>
                </div>
                
                <p className={`text-xl font-medium mb-6 ${
                  useCase.color === 'magic' ? 'text-magic-600' :
                  useCase.color === 'rose' ? 'text-rose-600' : 'text-amber-600'
                }`}>
                  {useCase.description}
                </p>
                
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  {useCase.detail}
                </p>

                {/* CTA Button */}
                <Button 
                  size="sm" 
                  variant="outline"
                  className={`${
                    useCase.color === 'magic' ? 'border-magic-300 text-magic-600 hover:bg-magic-50 hover:border-magic-400' :
                    useCase.color === 'rose' ? 'border-rose-300 text-rose-600 hover:bg-rose-50 hover:border-rose-400' :
                    'border-amber-300 text-amber-600 hover:bg-amber-50 hover:border-amber-400'
                  } text-sm px-4 py-2 h-auto font-medium`}
                  onClick={() => navigate('/')}
                >
                  <ArrowRight className="mr-1 h-4 w-4" />
                  Create {useCase.title} Story
                </Button>
              </div>

              {/* Example Image */}
              <div className={`${index === 1 ? 'lg:col-start-1' : ''}`}>
                <div className="aspect-video rounded-3xl overflow-hidden shadow-soft hover-lift relative">
                  <img 
                    src={useCase.image} 
                    alt={useCase.imageAlt}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Prompt Input Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6">
                    <div className="glass-effect rounded-xl p-3 sm:p-4 mx-2 sm:mx-4">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="bg-white/80 rounded-lg p-2 sm:p-3 border border-gray-200/50">
                            <p className="text-xs sm:text-sm text-gray-800 leading-relaxed inline">
                              <TypewriterText
                                text={useCase.example}
                                typingSpeedMs={32}
                                deletingSpeedMs={20}
                                pauseBeforeDeleteMs={1800}
                                pauseBetweenWordsMs={400}
                                loop={true}
                                cursorClassName="inline-block w-[1px] h-3 sm:h-4 bg-gray-700 ml-0.5 align-middle animate-pulse"
                                active={isActive}
                              />
                            </p>
                          </div>
                          <p className="text-xs text-white/80 mt-1 sm:mt-2 font-medium">
                            Creating your story...
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center mt-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-xl text-gray-600">
            The possibilities are endless. What story will your child star in today?
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default UseCasesSection;
