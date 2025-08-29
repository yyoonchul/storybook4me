export const CONTENT = {
  hero: {
    headline: "In 10 seconds, watch your child become the hero of their very own storybook.",
    subheadline: "The most special gift for busy parents.",
    description: "Just upload a photo and a story idea. Let the magic begin.",
    cta: "✨ Create Your Storybook For Free",
    ctaSubtext: "*No signup required to start!"
  },
  
  problems: [
    {
      id: "content-fatigue",
      title: "Content Fatigue",
      description: "My child is bored with the same old books. We need something new and exciting for story time.",
      icon: "BookOpen"
    },
    {
      id: "lack-of-time",
      title: "Lack of Time", 
      description: "I want to create special moments, but I'm exhausted from the daily grind.",
      icon: "Clock"
    },
    {
      id: "screen-time-guilt",
      title: "Screen Time Guilt",
      description: "I want to connect with my child, not just hand them a screen.",
      icon: "Heart"
    }
  ],

  solution: {
    title: "How Our 10-Second Magic Works",
    steps: [
      {
        id: "create-character",
        title: "Create Your Character",
        description: "Upload one photo of your child to create their unique storybook character.",
        icon: "Upload",
        example: "photo-upload.jpg"
      },
      {
        id: "imagine-story",
        title: "Imagine Your Story", 
        description: 'Tell us any story idea. It can be as simple as "Our dog, Buddy, goes to space."',
        icon: "Wand2",
        example: '"Our dog, Buddy, goes to space."'
      },
      {
        id: "book-appears", 
        title: "Your Book Appears in a Flash!",
        description: "Instantly, a one-of-a-kind storybook comes to life, ready to read and cherish.",
        icon: "Sparkles",
        example: "magic-book.jpg"
      }
    ]
  },

  differentiators: [
    {
      id: "consistent-character",
      title: "Unbroken Immersion: The Hero Stays the Hero",
      description: "Unlike other AI tools, your child's character stays consistent from the first page to the last. The magic is never broken.",
      icon: "Shield",
      visual: "character-consistency.jpg"
    },
    {
      id: "truly-personal",
      title: "Truly Personal: More Than Just a Name", 
      description: "Weave your family, pets, favorite places, and real memories into the story. This isn't just a fairytale; it's your family's story.",
      icon: "Users",
      visual: "personal-story.jpg"
    },
    {
      id: "quality-trust",
      title: "Quality You Can Trust: Beyond \"AI Slop\"",
      description: "We guarantee heartwarming illustrations and age-appropriate stories you can feel good about sharing. In a world of low-quality AI, we deliver peace of mind.",
      icon: "Award", 
      visual: "quality-badge.jpg"
    }
  ],

  testimonials: [
    {
      id: "astronaut-leo",
      quote: "He honestly thinks he's a real astronaut now! ❤️",
      author: "Sarah M.",
      prompt: "Leo's big adventure to the moon",
      cover: "leo-astronaut.jpg"
    },
    {
      id: "tooth-hero",
      quote: "Brushing teeth was a battle. This book about the 'Tooth Hero' is a game-changer!",
      author: "Mike D.",
      prompt: "How Ava the Tooth Hero saved the city from the Cavity Creeps", 
      cover: "ava-tooth-hero.jpg"
    },
    {
      id: "princess-adventure",
      quote: "She reads it every night and asks for new adventures!",
      author: "Emma L.",
      prompt: "Princess Mia and the enchanted garden",
      cover: "mia-princess.jpg"
    }
  ],

  finalCTA: {
    headline: "Create an unforgettable memory for your child tonight.",
    subheadline: "That magical moment of connection is just 10 seconds away.",
    cta: "✨ Make My Child's Storybook in 10 Seconds"
  }
} as const
