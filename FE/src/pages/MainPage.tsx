import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../shared/components/ui/button";
import { Card, CardContent } from "../shared/components/ui/card";
import { Separator } from "../shared/components/ui/separator";
import { Input } from "../shared/components/ui/input";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../shared/components/ui/accordion";
import { SignedIn, SignedOut, useUser, useClerk } from "@/features/auth";
import { BookshelfSection } from "@/features/storybook/components/BookshelfSection";
import { useSession } from "@clerk/clerk-react";
import { storybookApi } from "@/features/storybook";
import { ArrowRight, ArrowRightCircle } from "lucide-react";
import Header from "../shared/components/layout/Header";
import Footer from "../shared/components/layout/Footer";
import { FamilySection } from "@/features/family";
import { ExploreSection } from "@/features/explore/components";
// Clerk is the source of truth for auth state; remove legacy auth usage

// Family section is encapsulated in features/family/FamilySection

// presets are fetched via PresetCharactersSection

type BookshelfItem = { id: string; title: string; cover: string; isPublic: boolean };

const MainPage = () => {
  const [storyPrompt, setStoryPrompt] = useState("");
  const [bookshelfData, setBookshelfData] = useState<BookshelfItem[]>([]);
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  
  // Typewriter placeholder state
  const typewriterExamples = [
    'My daughter Emma goes on a magical adventure...',
    'Our son Leo explores a hidden jungle temple...',
    'Twins Mia and Noah build a rocket to the moon...',
    'A shy dragon learns to make new friends at school...',
    'Superhero Hana saves her town with kindness...',
    'Baby Joon discovers a tiny world in the backyard...',
    'Pirate Ava searches for the Rainbow Treasure...',
    'Chef Minji opens a cookie shop for forest animals...',
    'Detective Liam solves the case of the missing stars...',
    'Robot Aria learns how to paint a sunrise...',
  ];
  const [twIndex, setTwIndex] = useState(0);
  const [twChar, setTwChar] = useState(0);
  const [twDeleting, setTwDeleting] = useState(false);
  const [twText, setTwText] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const samplePrompts = [
    "A brave princess saves her kingdom",
    "A dinosaur adventure in the city",
    "Space explorer twins discover a comet",
    "A friendly dragon learns to cook",
    "Pirate cat searching for hidden treasure",
  ];

  // Handle route-and-scroll when navigated with state or hash
  useEffect(() => {
    const performScroll = (id: string) => {
      const el = document.getElementById(id);
      if (el) {
        // Allow layout to paint before scrolling
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    };

    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      performScroll(state.scrollTo);
      // clear state so back/forward doesn't re-scroll unexpectedly
      navigate(location.pathname, { replace: true });
      return;
    }

    if (location.hash) {
      const id = location.hash.replace('#', '');
      if (id) performScroll(id);
    }
  }, [location, navigate]);

  // Animate typewriter when input is empty
  useEffect(() => {
    if (storyPrompt) return; // pause when user is typing
    const phrases = typewriterExamples;
    const current = phrases[twIndex % phrases.length];
    const atEnd = twChar === current.length;
    const atStart = twChar === 0;

    let delay = twDeleting ? 30 : 60;
    if (!twDeleting && atEnd) delay = 1200; // pause at full line
    if (twDeleting && atStart) delay = 1600; // longer pause to show default placeholder

    const timer = setTimeout(() => {
      if (!twDeleting) {
        if (twChar < current.length) {
          setTwText(current.slice(0, twChar + 1));
          setTwChar((c) => c + 1);
        } else {
          setTwDeleting(true);
        }
      } else {
        if (twChar > 0) {
          setTwText(current.slice(0, twChar - 1));
          setTwChar((c) => c - 1);
        } else {
          setTwDeleting(false);
          setTwIndex((i) => (i + 1) % phrases.length);
        }
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [storyPrompt, twIndex, twChar, twDeleting]);

  // My Bookshelf is now handled by BookshelfSection component

  const { session } = useSession();

  const handleCreateStory = async () => {
    if (!isSignedIn) {
      openSignIn?.();
      return;
    }
    const token = await session?.getToken({ template: 'storybook4me' });
    try {
      await storybookApi.create({ title: storyPrompt || '', characterIds: [], theme: '', style: '', pageCount: 0, prompt: '' }, token || undefined);
      navigate('/studio?mode=settings');
    } catch (_) {
      // noop
    }
  };

  // Family handlers are encapsulated inside FamilySection

  // Bookshelf management moved to storybook feature (to be implemented there)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 relative">
        {/* Fixed viewport gradient background */}
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(90%_90%_at_50%_80%,#a855f7_0%,#a855f7_25%,#ec4899_55%,#f472b6_70%,white_85%)]" />
        {/* Hero Section */}
        <section className="min-h-[72vh] flex items-center justify-center px-4 relative overflow-hidden">
          {/* Floating gradient orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-20 left-20 w-96 h-96 rounded-full bg-white/10 blur-3xl"
              animate={{ 
                x: [0, 50, 0],
                y: [0, -30, 0],
              }}
              transition={{ 
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl"
              animate={{ 
                x: [0, -60, 0],
                y: [0, 40, 0],
              }}
              transition={{ 
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="-translate-y-2 md:-translate-y-4">
              <motion.h1 
                className="text-3xl md:text-6xl font-bold mb-4 text-black"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Storybook Only for Your Child
              </motion.h1>
              
              <motion.p 
                className="text-[1.125rem] md:text-[1.35rem] text-black mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Transform your ideas into a personalized storybook in 10 seconds. <br />Even busy parents can gift a magical moment.
              </motion.p>
            </div>

            {/* Story Input */}
            <motion.div 
              className="max-w-5xl mx-auto mb-0 -mt-4 md:-mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="glass-effect rounded-[2rem] p-8 md:p-10 shadow-2xl bg-white/70">
                <div className="flex items-center gap-3">
                  <Input
                    placeholder={twText || "Ask storybook4me to create a story about..."}
                    value={storyPrompt}
                    onChange={(e) => setStoryPrompt(e.target.value)}
                    className="text-lg md:text-xl py-5 px-6 border border-transparent bg-transparent flex-1 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-transparent focus-visible:border-transparent focus-visible:ring-offset-0"
                  />
                  <Button 
                    onClick={handleCreateStory}
                    size="sm"
                    className="w-12 h-12 p-0 bg-gray-800 hover:bg-gray-900 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
                {/* sample chips attached under floating box */}
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {samplePrompts.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setStoryPrompt(item)}
                      className="px-3 py-2 rounded-full bg-white/80 text-gray-700 text-xs md:text-sm border border-black/5 hover:bg-white transition"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Combined Content Section */}
        <section className="pt-10 pb-16 px-4" id="bookshelf">
          <div className="mx-auto w-[98%] max-w-7xl glass-effect rounded-3xl p-8 md:p-12 bg-white/70">
            <div className="space-y-12">
              {/* Bookshelf Section - Only if logged in */}
              <SignedIn>
                <BookshelfSection />
              </SignedIn>

              <SignedIn>
                <Separator className="my-8 opacity-30" />
              </SignedIn>

              {/* Family Section - encapsulated */}
              <FamilySection />

              <SignedIn>
                <Separator className="my-8 opacity-30" />
              </SignedIn>

              {/* Explore Section */}
              <ExploreSection 
                title="Explore"
                showFilters={false}
                showMoreStories={true}
                limit={6}
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Storybook management dialogs moved to storybook feature */}
    </div>
  );
};

export default MainPage;