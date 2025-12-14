import { motion } from "framer-motion";
import { Button } from "../../../shared/components/ui/button";
import { Sparkles, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FinalCTASection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-24 bg-dreamy relative overflow-hidden">
      
      {/* Floating gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 rounded-full bg-magic-300/30 blur-2xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-magic-500/20 blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            Create an{" "}
            <span className="sparkle-text">unforgettable memory</span>{" "}
            for your child tonight.
          </h2>
          
          <p className="text-xl lg:text-2xl text-gray-600 mb-12">
            That magical moment of connection is just{" "}
            <span className="text-magic-500 font-semibold">10 seconds</span>{" "}
            away.
          </p>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button 
                size="lg" 
                className="magic-gradient hover-lift hover-glow text-xl px-12 py-8 h-auto font-bold rounded-2xl shadow-soft"
                onClick={() => navigate('/')}
              >
                <Sparkles className="mr-3 h-6 w-6" />
                Make My Child's Storybook in 10 Seconds
              </Button>
            </motion.div>
            
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Takes only 10 seconds</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-300" />
              <span>No signup required</span>
              <div className="w-1 h-1 rounded-full bg-gray-300" />
              <span>Free to start</span>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default FinalCTASection;