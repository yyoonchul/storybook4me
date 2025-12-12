import React, { useRef, useState } from 'react';
import { Button } from '../../../shared/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const STYLES = [
  { title: 'Watercolor Fantasy', desc: 'Soft, dreamy illustrations', gradient: 'from-purple-200 to-pink-200' },
  { title: 'Digital Cartoon', desc: 'Bright, colorful style', gradient: 'from-blue-200 to-green-200' },
  { title: 'Realistic Art', desc: 'Detailed, lifelike images', gradient: 'from-gray-200 to-gray-300' },
  { title: 'Minimalist', desc: 'Simple, clean designs', gradient: 'from-gray-100 to-gray-200' },
];

interface ArtStyleCarouselProps {
  isHighlighted?: boolean;
  readOnly?: boolean;
  selectedIndex?: number;
  onIndexChange?: (index: number) => void;
}

export function ArtStyleCarousel({ isHighlighted = false, readOnly = false, selectedIndex, onIndexChange }: ArtStyleCarouselProps) {
  const [internalIndex, setInternalIndex] = useState(0);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  // Use controlled index if provided, otherwise use internal state
  const index = selectedIndex !== undefined ? selectedIndex : internalIndex;
  const setIndex = onIndexChange || setInternalIndex;

  const scrollTo = (i: number) => {
    if (readOnly) return; // Prevent scrolling in read-only mode
    
    // 무한 캐러셀: 범위를 벗어나면 순환
    const totalCards = STYLES.length;
    let newIndex = i;
    
    if (i < 0) {
      newIndex = totalCards - 1;
    } else if (i >= totalCards) {
      newIndex = 0;
    }
    
    setIndex(newIndex);
    const el = viewportRef.current;
    if (el) {
      const child = el.querySelectorAll('button[data-slide]')[newIndex] as HTMLElement | undefined;
      child?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    }
  };

  return (
    <section className={`relative ${isHighlighted ? 'ring-2 ring-purple-400 ring-opacity-50 rounded-lg p-4' : ''}`}>
      <h4 className="text-base font-semibold mb-2">Art Style</h4>
      <div className="relative py-6">
        {/* 레이어드 카드 컨테이너 */}
        <div className="relative h-[280px] sm:h-[240px]">
          <div className="relative w-full h-full flex items-center justify-center px-12">
            {STYLES.map((s, idx) => {
              const isSelected = index === idx;
              let offset = idx - index;
              
              // 순환 레이어링: 반대편 끝 카드가 보이도록 offset 조정
              const totalCards = STYLES.length;
              if (offset > totalCards / 2) {
                offset = offset - totalCards;
              } else if (offset < -totalCards / 2) {
                offset = offset + totalCards;
              }
              
              const absOffset = Math.abs(offset);
              const isVisible = absOffset <= 2;
              
              // 양쪽으로 카드가 자연스럽게 레이어드되도록 위치 계산
              let translateXValue = 0;
              let scaleValue = 1;
              let opacityValue = 1;
              let translateYValue = 0;
              let widthPercent = '60%';
              let maxWidthValue = '350px';
              
              if (offset === 0) {
                // 메인 카드
                translateXValue = 0;
                scaleValue = 1;
                opacityValue = 1;
                translateYValue = 0;
                widthPercent = '60%';
                maxWidthValue = '350px';
              } else if (absOffset === 1) {
                // 바로 옆 카드
                translateXValue = offset * 45;
                scaleValue = 0.88;
                opacityValue = 0.75;
                translateYValue = 12;
                widthPercent = '52%';
                maxWidthValue = '300px';
              } else if (absOffset === 2) {
                // 옆옆 카드
                translateXValue = offset * 70;
                scaleValue = 0.76;
                opacityValue = 0.5;
                translateYValue = 20;
                widthPercent = '45%';
                maxWidthValue = '250px';
              } else {
                // 그 외의 카드는 더 멀리
                translateXValue = offset * 100;
                scaleValue = 0.6;
                opacityValue = 0;
                translateYValue = 30;
                widthPercent = '40%';
                maxWidthValue = '220px';
              }
              
              return (
                <button
                  key={s.title}
                  data-slide
                  className={`absolute transition-all duration-500 ease-out rounded-lg text-left overflow-hidden ${
                    isSelected 
                      ? 'border-2 border-purple-500 shadow-2xl' 
                      : absOffset === 1
                      ? 'border border-gray-300 shadow-lg hover:shadow-xl'
                      : 'border border-gray-200 shadow-md hover:shadow-lg'
                  } ${readOnly ? 'cursor-default' : ''}`}
                  onClick={() => !readOnly && scrollTo(idx)}
                  aria-current={isSelected}
                  disabled={readOnly}
                  style={{
                    width: widthPercent,
                    maxWidth: maxWidthValue,
                    zIndex: isVisible ? 50 - absOffset : 0,
                    transform: `
                      translateX(${translateXValue}%)
                      translateY(${translateYValue}px)
                      scale(${scaleValue})
                    `,
                    opacity: opacityValue,
                    pointerEvents: isVisible ? 'auto' : 'none',
                  }}
                >
                  <div className={`aspect-video bg-gradient-to-br ${s.gradient} rounded overflow-hidden relative`}>
                    <img src="/placeholder.svg" alt={s.title} className="w-full h-full object-cover" />
                    {/* 불투명한 레이어와 설명 텍스트 */}
                    <div className={`absolute bottom-0 left-0 right-0 backdrop-blur-sm p-3 transition-all duration-300 ${
                      isSelected ? 'bg-black/60' : 'bg-black/50'
                    }`}>
                      <div className="font-medium text-sm text-white">{s.title}</div>
                      <div className="text-xs text-white/80">{s.desc}</div>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center shadow-lg animate-in fade-in zoom-in duration-200">
                      <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 네비게이션 버튼 */}
        {!readOnly && (
          <>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-[60]">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 bg-white shadow-md hover:shadow-lg"
                onClick={() => scrollTo(index - 1)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-[60]">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 bg-white shadow-md hover:shadow-lg"
                onClick={() => scrollTo(index + 1)}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </>
        )}

        {/* 인디케이터 */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {STYLES.map((_, i) => (
            <button
              key={i}
              onClick={() => !readOnly && scrollTo(i)}
              disabled={readOnly}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                index === i ? 'bg-purple-600 w-6' : 'bg-gray-300 hover:bg-gray-400'
              } ${readOnly ? 'cursor-default' : ''}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 준비중 오버레이 */}
      <div className="absolute inset-0 rounded-lg bg-black/50 backdrop-blur-sm z-[80] flex flex-col items-center justify-center text-white text-sm font-semibold">
        <div>Image style selection is coming soon</div>
        <div className="text-xs text-white/80 mt-1">This feature is in progress</div>
      </div>
    </section>
  );
}
