import { useEffect, useState } from "react";
import { Wand2, Sparkles, BookOpen } from "lucide-react";

type ThinkingType = "initial" | "edit" | "question";

type ThinkingMessageProps = {
  type?: ThinkingType;
};

const INITIAL_MESSAGES = [
  "Your storyteller is thinking...",
  "Analyzing your request...",
  "Understanding your needs...",
  "Processing your message...",
  "Preparing a response...",
];

const EDIT_MESSAGES = [
  "Crafting your story changes...",
  "Weaving new magic into pages...",
  "Reimagining the narrative...",
  "Polishing the storyline...",
  "Transforming your tale...",
];

const QUESTION_MESSAGES = [
  "Exploring the story details...",
  "Finding the perfect answer...",
  "Diving into the narrative...",
  "Searching through the pages...",
  "Uncovering story insights...",
];

const getMessages = (type: ThinkingType) => {
  switch (type) {
    case "edit":
      return EDIT_MESSAGES;
    case "question":
      return QUESTION_MESSAGES;
    default:
      return INITIAL_MESSAGES;
  }
};

const getIcon = (type: ThinkingType, index: number) => {
  const icons = [
    <Wand2 key="wand" className="w-4 h-4 text-purple-500" />,
    <Sparkles key="sparkles" className="w-4 h-4 text-pink-500" />,
    <BookOpen key="book" className="w-4 h-4 text-blue-500" />,
    <Wand2 key="wand2" className="w-4 h-4 text-indigo-500" />,
    <Sparkles key="sparkles2" className="w-4 h-4 text-violet-500" />,
  ];
  return icons[index % icons.length];
};

export function ThinkingMessage({ type = "initial" }: ThinkingMessageProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = getMessages(type);

  useEffect(() => {
    // Reset index when type changes
    setMessageIndex(0);
  }, [type]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 4000); // Change message every 4 seconds

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="flex justify-start">
      <div className="bg-white border rounded-lg p-3 shadow-sm">
        <div className="flex items-center gap-2">
          {/* Animated icon with rotation and scale */}
          <div className="relative">
            <div className="animate-spin-slow">
              {getIcon(type, messageIndex)}
            </div>
            {/* Pulsing ring effect */}
            <div className="absolute inset-0 rounded-full animate-ping-slow opacity-20 bg-purple-400" />
          </div>

          {/* Message with fade transition */}
          <div className="relative overflow-hidden">
            <span
              key={messageIndex}
              className="text-sm inline-block animate-fade-in"
            >
              {messages[messageIndex]}
            </span>
          </div>

          {/* Animated dots */}
          <div className="flex gap-1 ml-1">
            <div
              className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"
              style={{ animationDelay: "0ms", animationDuration: "1s" }}
            />
            <div
              className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce"
              style={{ animationDelay: "200ms", animationDuration: "1s" }}
            />
            <div
              className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "400ms", animationDuration: "1s" }}
            />
          </div>
        </div>

        {/* Progress bar animation */}
        <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-progress"
            style={{
              animation: "progress 4s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </div>
  );
}

