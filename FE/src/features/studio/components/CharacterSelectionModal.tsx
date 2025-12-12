import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../shared/components/ui/alert-dialog';
import { Button } from '../../../shared/components/ui/button';
import { Card, CardContent } from '../../../shared/components/ui/card';
import type { Character } from '../../family/types/character';
import { Check, X, User, Users } from 'lucide-react';

interface CharacterSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  myCharacters: Character[];
  presetCharacters: Character[];
  selectedCharacters: string[];
  isLoading: boolean;
  error: string | null;
  onToggleCharacter: (id: string) => void;
  onClearSelection: () => void;
  onSelectAll: () => void;
  onLoadCharacters: () => void;
}

export function CharacterSelectionModal({
  open,
  onOpenChange,
  myCharacters,
  presetCharacters,
  selectedCharacters,
  isLoading,
  error,
  onToggleCharacter,
  onClearSelection,
  onSelectAll,
  onLoadCharacters,
}: CharacterSelectionModalProps) {
  const isCharacterSelected = (characterId: string) => selectedCharacters.includes(characterId);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Select Characters</AlertDialogTitle>
          <AlertDialogDescription>
            Choose characters for your story. You can select from your characters or default families.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="max-h-[60vh] overflow-y-auto space-y-6">
          {/* Header with actions */}
          <div className="flex justify-between items-center">
            <h4 className="text-base font-semibold">Select Characters</h4>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onSelectAll}
                disabled={isLoading}
              >
                <Users className="w-4 h-4 mr-1" />
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onClearSelection}
                disabled={isLoading || selectedCharacters.length === 0}
              >
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Error state */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <X className="w-4 h-4 text-red-500" />
                <span className="text-red-700 text-sm">{error}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLoadCharacters}
                  className="ml-auto"
                >
                  Retry
                </Button>
              </div>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
              <span className="ml-2 text-sm text-muted-foreground">Loading characters...</span>
            </div>
          )}

          {/* My Characters */}
          {!isLoading && myCharacters.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                My Characters ({myCharacters.length})
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-1">
                {myCharacters
                  .sort((a, b) => {
                    const aSelected = isCharacterSelected(a.id);
                    const bSelected = isCharacterSelected(b.id);
                    if (aSelected && !bSelected) return -1;
                    if (!aSelected && bSelected) return 1;
                    return 0;
                  })
                  .map((character) => (
                    <CharacterCard
                      key={character.id}
                      character={character}
                      isSelected={isCharacterSelected(character.id)}
                      onToggle={() => onToggleCharacter(character.id)}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Preset Characters - Grouped by Family Sets */}
          {!isLoading && presetCharacters.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Default Character Families ({Math.ceil(presetCharacters.length / 4)} families)
              </h5>
              {(() => {
                const familyNames = ['The Starlings', 'The Novas', 'The Solis'];
                const familyGroups: Character[][] = [];
                for (let i = 0; i < presetCharacters.length; i += 4) {
                  familyGroups.push(presetCharacters.slice(i, i + 4));
                }
                
                return familyGroups.map((family, familyIndex) => (
                  <div key={familyIndex} className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-700">{familyIndex + 1}</span>
                      </div>
                      <h6 className="text-sm font-medium text-gray-600">
                        {familyNames[familyIndex] || `Family Set ${familyIndex + 1}`}
                      </h6>
                      <div className="flex-1 h-px bg-gray-200"></div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const familyIds = family.map(c => c.id);
                          const allSelected = familyIds.every(id => isCharacterSelected(id));
                          if (allSelected) {
                            familyIds.forEach(id => { if (isCharacterSelected(id)) onToggleCharacter(id); });
                          } else {
                            familyIds.forEach(id => { if (!isCharacterSelected(id)) onToggleCharacter(id); });
                          }
                        }}
                        className="text-xs px-2 py-1 h-6"
                      >
                        {family.every(c => isCharacterSelected(c.id)) ? 'Deselect All' : 'Select All'}
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-1">
                      {family
                        .sort((a, b) => {
                          const aSelected = isCharacterSelected(a.id);
                          const bSelected = isCharacterSelected(b.id);
                          if (aSelected && !bSelected) return -1;
                          if (!aSelected && bSelected) return 1;
                          return 0;
                        })
                        .map((character) => (
                          <CharacterCard
                            key={character.id}
                            character={character}
                            isSelected={isCharacterSelected(character.id)}
                            onToggle={() => onToggleCharacter(character.id)}
                          />
                        ))}
                    </div>
                  </div>
                ));
              })()}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && myCharacters.length === 0 && presetCharacters.length === 0 && (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">No characters available</p>
              <Button
                variant="outline"
                size="sm"
                onClick={onLoadCharacters}
                className="mt-2"
              >
                Refresh
              </Button>
            </div>
          )}

          {/* Selected count */}
          {selectedCharacters.length > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-700">
                  {selectedCharacters.length} character{selectedCharacters.length !== 1 ? 's' : ''} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearSelection}
                  className="text-purple-700 border-purple-300 hover:bg-purple-100"
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
          <AlertDialogAction onClick={() => onOpenChange(false)}>Done</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface CharacterCardProps {
  character: Character;
  isSelected: boolean;
  onToggle: () => void;
}

function CharacterCard({ character, isSelected, onToggle }: CharacterCardProps) {
  return (
    <Card 
      className={`relative overflow-visible cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected 
          ? 'border-2 border-purple-500 shadow-[0_0_0_3px_rgba(168,85,247,0.25)] bg-purple-50' 
          : 'hover:border-purple-300'
      }`}
      onClick={onToggle}
    >
      <CardContent className="p-3">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center overflow-hidden">
              {character.image_url ? (
                <img 
                  src={character.image_url} 
                  alt={character.character_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
            {isSelected && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center">
                <Check className="w-3 h-3" />
              </div>
            )}
          </div>
          
          <div className="w-full">
            <h6 className="text-sm font-medium text-gray-900 truncate">
              {character.character_name}
            </h6>
            {character.description && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {character.description}
              </p>
            )}
            {character.is_preset && (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                Default
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
