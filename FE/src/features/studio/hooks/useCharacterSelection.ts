import { useState, useEffect } from 'react';
import { useSession } from '@clerk/clerk-react';
import { familyApi } from '../../family/api';
import { Character } from '../../family/types/character';

export function useCharacterSelection() {
  const { session } = useSession();
  const [myCharacters, setMyCharacters] = useState<Character[]>([]);
  const [presetCharacters, setPresetCharacters] = useState<Character[]>([]);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load characters on mount
  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = await session?.getToken({ template: 'storybook4me' });
      
      // Load user's characters
      const myCharactersResponse = await familyApi.getCharacters({ include_presets: false }, token);
      setMyCharacters(myCharactersResponse.characters);
      
      // Load preset characters
      const presetResponse = await familyApi.getPresetCharacters();
      setPresetCharacters(presetResponse.presets);
    } catch (err: any) {
      setError(err.message || 'Failed to load characters');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCharacter = (characterId: string) => {
    setSelectedCharacters(prev => {
      if (prev.includes(characterId)) {
        return prev.filter(id => id !== characterId);
      } else {
        return [...prev, characterId];
      }
    });
  };

  const isCharacterSelected = (characterId: string) => {
    return selectedCharacters.includes(characterId);
  };

  const clearSelection = () => {
    setSelectedCharacters([]);
  };

  const selectAll = () => {
    const allCharacterIds = [
      ...myCharacters.map(c => c.id),
      ...presetCharacters.map(c => c.id)
    ];
    setSelectedCharacters(allCharacterIds);
  };

  return {
    myCharacters,
    presetCharacters,
    selectedCharacters,
    isLoading,
    error,
    toggleCharacter,
    isCharacterSelected,
    clearSelection,
    selectAll,
    loadCharacters
  };
}
