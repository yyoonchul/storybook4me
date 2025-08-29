import { motion } from "framer-motion"
import { Button } from "@/shared/components/ui/button"
import { CONTENT } from "@/shared/constants/content"
import { Sparkles, Heart, Clock } from "lucide-react"

export const FinalCTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-magic-600 via-purple-700 to-pink-600 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-white/10 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-white/10 rounded-full"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Content */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {CONTENT.finalCTA.headline}
            </motion.h2>
            
            <motion.p 
              className="text-xl md:text-2xl text-purple-100 mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {CONTENT.finalCTA.subheadline}
            </motion.p>
          </motion.div>

          {/* Value Props */}
          <motion.div
            className="grid md:grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Clock className="w-8 h-8 mx-auto mb-3 text-yellow-300" />
              <h3 className="font-semibold mb-2">Just 10 Seconds</h3>
              <p className="text-purple-100 text-sm">From idea to magical storybook</p>
            </motion.div>

            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Heart className="w-8 h-8 mx-auto mb-3 text-pink-300" />
              <h3 className="font-semibold mb-2">Unforgettable Memories</h3>
              <p className="text-purple-100 text-sm">Stories your child will treasure forever</p>
            </motion.div>

            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Sparkles className="w-8 h-8 mx-auto mb-3 text-blue-300" />
              <h3 className="font-semibold mb-2">Pure Magic</h3>
              <p className="text-purple-100 text-sm">Watch their face light up with wonder</p>
            </motion.div>
          </motion.div>

          {/* Final CTA Button */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Button 
                variant="magic" 
                size="xl"
                className="bg-white text-magic-600 hover:bg-gray-100 text-xl px-12 py-6 font-bold shadow-2xl border-0 relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-magic-200 to-pink-200 opacity-0 group-hover:opacity-20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                <Sparkles className="w-6 h-6 mr-3 group-hover:animate-spin" />
                {CONTENT.finalCTA.cta}
                <Sparkles className="w-6 h-6 ml-3 group-hover:animate-spin" />
              </Button>
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <p className="text-purple-200 text-sm">
                ✅ No signup required • ✅ Start creating immediately • ✅ Cancel anytime
              </p>
              <p className="text-purple-300 text-xs">
                Join 10,000+ families creating magical memories
              </p>
            </motion.div>
          </motion.div>

          {/* Urgency Elements */}
          <motion.div
            className="mt-12 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <motion.div
              className="flex items-center justify-center space-x-3 text-yellow-300"
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">
                Tonight could be the night your child becomes the hero of their own story
              </span>
              <Sparkles className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
