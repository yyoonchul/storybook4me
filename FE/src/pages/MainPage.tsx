import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../shared/components/ui/button";
import { Card, CardContent } from "../shared/components/ui/card";
import { Separator } from "../shared/components/ui/separator";
import { Input } from "../shared/components/ui/input";
import { Sparkles, Plus, ArrowRight } from "lucide-react";
import Header from "../shared/components/layout/Header";
import Footer from "../shared/components/layout/Footer";
import CharacterModal from "../shared/components/CharacterModal";
import { useAuth } from "../shared/lib/auth";

// Mock data - replace with real data later
const mockExploreBooks = [
  { id: 1, title: "The Brave Knight", cover: "/cover.png" },
  { id: 2, title: "Space Adventure", cover: "/cover.png" },
  { id: 3, title: "Magic Forest", cover: "/cover.png" },
  { id: 4, title: "Ocean Quest", cover: "/cover.png" },
  { id: 5, title: "Dragon Friend", cover: "/cover.png" },
  { id: 6, title: "Princess Castle", cover: "/cover.png" },
];

const mockFamilyMembers = [
  { 
    id: "1", 
    name: "Emma", 
    avatar: "/cover.png",
    description: "A brave 8-year-old with curly brown hair who loves adventures",
    appearance: "Curly brown hair, bright green eyes, always wearing her favorite red cape"
  },
  { 
    id: "2", 
    name: "Max", 
    avatar: "/cover.png",
    description: "A curious 6-year-old boy who dreams of being a space explorer",
    appearance: "Short blonde hair, blue eyes, usually in his astronaut costume"
  },
];

const mockBookshelf = [
  { id: 1, title: "Chloe's Space Adventure", cover: "/cover.png" },
  { id: 2, title: "Jihoon and the Dragon", cover: "/cover.png" },
  { id: 3, title: "Magic Forest Quest", cover: "/cover.png" },
];

const MainPage = () => {
  const [storyPrompt, setStoryPrompt] = useState("");
  const [characterModalOpen, setCharacterModalOpen] = useState(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | undefined>();
  const [familyMembers, setFamilyMembers] = useState(mockFamilyMembers);
  const { isLoggedIn } = useAuth();
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

  const handleCreateStory = () => {
    if (!isLoggedIn) {
      // Open login modal - for now just alert
      alert("Login required!");
      return;
    }
    
    if (!storyPrompt.trim()) {
      alert("Please enter a story idea!");
      return;
    }
    
    // Navigate to studio with prompt
    navigate(`/studio?prompt=${encodeURIComponent(storyPrompt)}`);
  };

  const handleAddCharacter = () => {
    setSelectedCharacterId(undefined);
    setCharacterModalOpen(true);
  };

  const handleEditCharacter = (characterId: string) => {
    setSelectedCharacterId(characterId);
    setCharacterModalOpen(true);
  };

  const handleSaveCharacter = (character: any) => {
    if (character.id) {
      // Edit existing character
      setFamilyMembers(prev => 
        prev.map(member => 
          member.id === character.id 
            ? { ...member, ...character, avatar: character.image || member.avatar }
            : member
        )
      );
    } else {
      // Add new character
      const newCharacter = {
        ...character,
        id: Date.now().toString(),
        avatar: character.image || "/cover.png"
      };
      setFamilyMembers(prev => [...prev, newCharacter]);
    }
  };

  const handleDeleteCharacter = (characterId: string) => {
    setFamilyMembers(prev => prev.filter(member => member.id !== characterId));
  };

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
              {isLoggedIn && (
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">My Bookshelf</h2>
                    <Button variant="outline" size="sm" onClick={() => navigate("/studio?mode=settings")}>
                      Create New
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {mockBookshelf.map((book) => (
                      <Card key={book.id} className="hover-lift cursor-pointer" onClick={() => navigate(`/book/${book.id}`)}>
                        <CardContent className="p-0">
                          <div className="aspect-[3/4] bg-gray-200 rounded-t-lg overflow-hidden">
                            <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="p-3">
                            <p className="text-sm font-medium line-clamp-2">{book.title}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {isLoggedIn && <Separator className="my-8 opacity-30" />}

              {/* Family Section - Only if logged in */}
              {isLoggedIn && (
                <div id="family" className="scroll-mt-20">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">My Family</h2>
                    <Button variant="outline" size="sm" onClick={handleAddCharacter}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Character
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {familyMembers.map((member) => (
                      <Card 
                        key={member.id} 
                        className="hover-lift cursor-pointer" 
                        onClick={() => handleEditCharacter(member.id)}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-200 overflow-hidden">
                            <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                          </div>
                          <p className="font-medium">{member.name}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {isLoggedIn && <Separator className="my-8 opacity-30" />}

              {/* Explore Section */}
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold">Explore</h2>
                  <Button variant="outline" size="sm" onClick={() => navigate("/explore")}>
                    More Stories
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {mockExploreBooks.map((book) => (
                    <Card key={book.id} className="hover-lift cursor-pointer" onClick={() => navigate(`/book/${book.id}`)}>
                      <CardContent className="p-0">
                        <div className="aspect-[3/4] bg-gray-200 rounded-t-lg overflow-hidden">
                          <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-medium line-clamp-2">{book.title}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Character Modal */}
      <CharacterModal
        isOpen={characterModalOpen}
        onClose={() => setCharacterModalOpen(false)}
        characterId={selectedCharacterId}
        onSave={handleSaveCharacter}
        onDelete={handleDeleteCharacter}
      />
    </div>
  );
};

export default MainPage;