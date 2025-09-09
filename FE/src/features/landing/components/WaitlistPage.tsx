import { motion } from "framer-motion";
import { Button } from "../../../shared/components/ui/button";
import { Input } from "../../../shared/components/ui/input";
import { Card, CardContent } from "../../../shared/components/ui/card";
import { Sparkles, Gift, Clock, CheckCircle, ArrowLeft } from "lucide-react";
import { useState } from "react";

const WaitlistPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const benefits = [
    "Create unlimited personalized storybooks",
    "High-quality AI-generated illustrations", 
    "Multiple story themes and genres",
    "Download PDF versions of your stories",
    "Priority customer support"
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-magic-50 via-white to-rose-50 flex items-center justify-center p-6">
        <motion.div
          className="max-w-md w-full text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to the Waitlist! 🎉
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Thank you for joining! We'll notify you as soon as storybook4me launches. 
            Don't forget - you'll get <strong>3 months completely free</strong> when we go live!
          </p>
          
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-magic-50 via-white to-rose-50">
      {/* Floating gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 rounded-full bg-magic-300/20 blur-3xl"
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-rose-300/20 blur-3xl"
          animate={{ 
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="max-w-4xl w-full">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <img 
                src="/logo.png" 
                alt="storybook4me Logo" 
                className="w-12 h-12 rounded-lg"
              />
              <span className="text-2xl font-semibold text-gray-900">
                storybook<span className="sparkle-text">4me</span>
              </span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Join the{" "}
              <span className="sparkle-text">Waitlist</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Be among the first to create magical, personalized storybooks for your children.
              We're launching soon!
            </p>

          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Email Signup Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="glass-effect border-0 shadow-soft">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Reserve Your Spot
                    </h2>
                    <p className="text-gray-600">
                      Enter your email to join the waitlist and secure your 3-month free trial.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-lg py-6"
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit"
                      className="w-full magic-gradient hover-lift hover-glow text-lg py-6 font-semibold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Joining Waitlist...
                        </div>
                      ) : (
                        "Join Waitlist - Get 3 Months FREE"
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>No spam, unsubscribe anytime</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Benefits List */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  What You'll Get Free for 3 Months:
                </h3>
                
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    >
                      <div className="w-6 h-6 rounded-full bg-magic-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-4 w-4 text-magic-600" />
                      </div>
                      <span className="text-gray-700 text-lg">{benefit}</span>
                    </motion.div>
                  ))}
                </div>

              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitlistPage;
