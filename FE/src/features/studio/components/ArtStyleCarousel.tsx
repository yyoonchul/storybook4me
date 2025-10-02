import React, { useRef, useState } from 'react';
import { Button } from '../../../shared/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const STYLES = [
  { title: 'Watercolor Fantasy', desc: 'Soft, dreamy illustrations', gradient: 'from-purple-200 to-pink-200' },
  { title: 'Digital Cartoon', desc: 'Bright, colorful style', gradient: 'from-blue-200 to-green-200' },
  { title: 'Realistic Art', desc: 'Detailed, lifelike images', gradient: 'from-gray-200 to-gray-300' },
  { title: 'Minimalist', desc: 'Simple, clean designs', gradient: 'from-gray-100 to-gray-200' },
];

export function ArtStyleCarousel() {
  const [index, setIndex] = useState(0);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const scrollTo = (i: number) => {
    setIndex(i);
    const el = viewportRef.current;
    if (el) {
      const child = el.querySelectorAll('button[data-slide]')[i] as HTMLElement | undefined;
      child?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    }
  };

  return (
    <section>
      <h4 className="text-base font-semibold mb-2">Art Style</h4>
      <div className="relative">
        <div ref={viewportRef} className="overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth">
          <div className="flex gap-3 pr-4">
            {STYLES.map((s, idx) => (
              <button
                key={s.title}
                data-slide
                className={`snap-start shrink-0 w-full sm:w-[calc(50%-0.375rem)] relative p-3 border rounded-lg text-left hover:border-gray-400 overflow-hidden group ${idx === 0 ? 'border-purple-500 bg-purple-50' : ''}`}
                onClick={() => scrollTo(idx)}
                aria-current={index === idx}
              >
                <div className="flex items-center gap-4">
                  <div className={`aspect-video bg-gradient-to-br ${s.gradient} rounded overflow-hidden w-1/2`}>
                    <img src="/placeholder.svg" alt={s.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{s.title}</div>
                    <div className="text-xs text-muted-foreground">{s.desc}</div>
                  </div>
                </div>
                {index === idx && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 hidden sm:flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => scrollTo(Math.max(0, index - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 hidden sm:flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => scrollTo(Math.min(STYLES.length - 1, index + 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-center gap-2 mt-3">
          {STYLES.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`h-2 w-2 rounded-full ${index === i ? 'bg-purple-600' : 'bg-gray-300'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
