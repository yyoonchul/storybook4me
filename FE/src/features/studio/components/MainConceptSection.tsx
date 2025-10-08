import React, { useState, useEffect } from 'react';
import { Textarea } from '../../../shared/components/ui/textarea';

type MainConceptSectionProps = {
  prompt?: string | null;
  onChange?: (value: string) => void;
  isHighlighted?: boolean;
};

export function MainConceptSection({ prompt, onChange, isHighlighted = false }: MainConceptSectionProps) {
  const [value, setValue] = useState(prompt || '');
  
  // 프롬프트가 변경될 때 값 업데이트
  useEffect(() => {
    if (prompt) {
      setValue(prompt);
    }
  }, [prompt]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <section className={`${isHighlighted ? 'ring-2 ring-purple-400 ring-opacity-50 rounded-lg p-4' : ''}`}>
      <h4 className="text-base font-semibold mb-2">Main Concept</h4>
      <Textarea
        value={value}
        className="min-h-[100px] resize-none w-full max-w-full"
        placeholder="Enter your main story concept..."
        onChange={handleChange}
      />
    </section>
  );
}
