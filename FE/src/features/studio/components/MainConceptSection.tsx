import React from 'react';
import { Textarea } from '../../../shared/components/ui/textarea';

type MainConceptSectionProps = {
  prompt?: string | null;
  onChange?: (value: string) => void;
};

export function MainConceptSection({ prompt, onChange }: MainConceptSectionProps) {
  return (
    <section>
      <h4 className="text-base font-semibold mb-2">Main Concept</h4>
      <Textarea
        defaultValue={prompt || 'A brave young explorer discovers magical worlds beyond the stars'}
        className="min-h-[100px] resize-none w-full max-w-full"
        placeholder="Enter your main story concept..."
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      />
    </section>
  );
}
