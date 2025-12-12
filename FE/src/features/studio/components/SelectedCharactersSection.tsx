import React from 'react';
import { Button } from '../../../shared/components/ui/button';
import { User } from 'lucide-react';
import type { Character } from '../../family/types/character';

type SelectedCharactersSectionProps = {
  myCharacters: Character[];
  presetCharacters: Character[];
  selectedCharacters: string[];
  onOpenModal: () => void;
  isHighlighted?: boolean;
  readOnly?: boolean;
};

export function SelectedCharactersSection({ myCharacters, presetCharacters, selectedCharacters, onOpenModal, isHighlighted = false, readOnly = false }: SelectedCharactersSectionProps) {
  const all = [...(myCharacters || []), ...(presetCharacters || [])];
  const byId = new Map(all.map(c => [c.id, c] as const));
  const selected = selectedCharacters.map(id => byId.get(id)).filter(Boolean) as Character[];

  return (
    <section className={`${isHighlighted ? 'ring-2 ring-purple-400 ring-opacity-50 rounded-lg p-4' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-base font-semibold">Characters</h4>
        {!readOnly && (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenModal}
            className="text-purple-700 border-purple-300 hover:bg-purple-100"
          >
            + Add Characters
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {selected.length === 0 ? (
          <div className="col-span-full text-sm text-muted-foreground">
            No characters selected. Click "+ Add Characters" to choose.
          </div>
        ) : (
          selected.map((character) => (
            <div key={character.id} className="relative bg-white rounded-lg p-3 border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 overflow-hidden flex items-center justify-center">
                  {character.image_url ? (
                    <img src={character.image_url} alt={character.character_name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium">{character.character_name}</div>
                  {character.description && (
                    <div className="text-xs text-muted-foreground line-clamp-2">{character.description}</div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
