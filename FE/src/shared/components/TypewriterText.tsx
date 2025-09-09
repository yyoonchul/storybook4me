import { useEffect, useMemo, useRef, useState } from "react";

type TypewriterTextProps = {
  text: string | string[];
  typingSpeedMs?: number;
  deletingSpeedMs?: number;
  pauseBeforeDeleteMs?: number;
  pauseBetweenWordsMs?: number;
  loop?: boolean;
  className?: string;
  cursorClassName?: string;
  showCursor?: boolean;
  active?: boolean; // when false, typing is paused and not started yet
};

/**
 * Simple, dependency-free typewriter effect suitable for inline text.
 * Supports a list of strings and optional looping.
 */
export default function TypewriterText({
  text,
  typingSpeedMs = 40,
  deletingSpeedMs = 25,
  pauseBeforeDeleteMs = 1200,
  pauseBetweenWordsMs = 400,
  loop = true,
  className,
  cursorClassName,
  showCursor = true,
  active = true,
}: TypewriterTextProps) {
  const texts: string[] = useMemo(
    () => (Array.isArray(text) ? text : [text]),
    [text]
  );

  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting" | "done">("typing");
  const timeoutRef = useRef<number | null>(null);

  // Precompute widest text to reserve space and avoid layout shift
  const widest = useMemo(() => {
    return texts.reduce((longest, current) => (current.length > longest.length ? current : longest), "");
  }, [texts]);

  // Reset when re-activating (e.g., when it scrolls into view)
  useEffect(() => {
    if (!active) return;
    setDisplayed("");
    setIndex(0);
    setPhase("typing");
  }, [active]);

  useEffect(() => {
    if (!active) {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      return;
    }
    const current = texts[index] ?? "";

    function schedule(nextTimeout: number, fn: () => void) {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(fn, nextTimeout);
    }

    if (phase === "typing") {
      if (displayed.length < current.length) {
        schedule(typingSpeedMs, () => setDisplayed(current.slice(0, displayed.length + 1)));
      } else {
        setPhase("pausing");
      }
      return;
    }

    if (phase === "pausing") {
      // If we're on the last item and not looping, stop after typing
      if (!loop && index === texts.length - 1) {
        setPhase("done");
        return;
      }
      schedule(pauseBeforeDeleteMs, () => setPhase("deleting"));
      return;
    }

    if (phase === "deleting") {
      if (displayed.length > 0) {
        schedule(deletingSpeedMs, () => setDisplayed(current.slice(0, displayed.length - 1)));
      } else {
        if (index < texts.length - 1) {
          schedule(pauseBetweenWordsMs, () => {
            setIndex(index + 1);
            setPhase("typing");
          });
        } else if (loop) {
          schedule(pauseBetweenWordsMs, () => {
            setIndex(0);
            setPhase("typing");
          });
        }
      }
    }

    if (phase === "done") {
      return;
    }

    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [active, texts, index, displayed, phase, typingSpeedMs, deletingSpeedMs, pauseBeforeDeleteMs, pauseBetweenWordsMs, loop]);

  return (
    <span className={className}>
      {/* Invisible sizer to fix container width/height to the final text size */}
      <span className="invisible whitespace-pre select-none block">{widest}</span>
      <span className="-mt-[1em] block">
        {displayed}
        {showCursor && (
          <span className={cursorClassName ?? "inline-block w-[1px] bg-gray-800 ml-0.5 align-middle animate-pulse"}>
            {"\u00A0"}
          </span>
        )}
      </span>
    </span>
  );
}


