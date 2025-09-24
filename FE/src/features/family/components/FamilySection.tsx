import { useState } from 'react';
import { SignedIn } from '@/features/auth';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { Plus } from 'lucide-react';
import CharacterModal from '@/features/family/components/CharacterModal';
import { PresetCharactersSection } from './PresetCharactersSection';
import { CharacterCard } from './CharacterCard';
import { useCreateCharacter } from '../hooks/useCreateCharacter';
import { CreateCharacterRequest } from '../types';

type FamilyMember = {
  id: string;
  name: string;
  avatar: string;
  description?: string;
  appearance?: string;
};

export const FamilySection = () => {
  const { createCharacter } = useCreateCharacter();
  const [characterModalOpen, setCharacterModalOpen] = useState(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | undefined>();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { id: '1', name: 'Emma', avatar: '/cover.png', description: 'A brave 8-year-old with curly brown hair who loves adventures', appearance: 'Curly brown hair, bright green eyes, always wearing her favorite red cape' },
    { id: '2', name: 'Max', avatar: '/cover.png', description: 'A curious 6-year-old boy who dreams of being a space explorer', appearance: 'Short blonde hair, blue eyes, usually in his astronaut costume' },
  ]);

  const handleAddCharacter = () => {
    setSelectedCharacterId(undefined);
    setCharacterModalOpen(true);
  };

  const handleEditCharacter = (characterId: string) => {
    setSelectedCharacterId(characterId);
    setCharacterModalOpen(true);
  };

  const handleSaveCharacter = async (character: any) => {
    if (character.id) {
      setFamilyMembers(prev => prev.map(member => member.id === character.id ? { ...member, ...character, avatar: character.image || member.avatar } : member));
    } else {
      const payload: CreateCharacterRequest = {
        character_name: character.name,
        description: character.description,
        visual_features: character.appearance,
        image_url: character.image,
      };
      const res = await createCharacter(payload);
      if (res?.character) {
        const created = res.character;
        const newMember: FamilyMember = {
          id: created.id,
          name: created.character_name,
          description: created.description,
          appearance: created.visual_features,
          avatar: created.image_url || '/cover.png',
        };
        setFamilyMembers(prev => [...prev, newMember]);
      }
    }
  };

  const handleDeleteCharacter = (characterId: string) => {
    setFamilyMembers(prev => prev.filter(member => member.id !== characterId));
  };

  return (
    <SignedIn>
      <div id="family" className="scroll-mt-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">My Family</h2>
          <Button variant="outline" size="sm" onClick={handleAddCharacter}>
            <Plus className="w-4 h-4 mr-2" />
            Add Character
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {familyMembers.map((member) => (
            <CharacterCard
              key={member.id}
              id={member.id}
              name={member.name}
              description={member.description}
              imageUrl={member.avatar}
              onClick={handleEditCharacter}
            />
          ))}
        </div>

        <div className="mt-6">
          <Accordion type="single" collapsible>
            <AccordionItem value="preset-family" className="border-b-0">
              <AccordionTrigger className="no-underline hover:no-underline [&>svg]:hidden [&[data-state=open]_.rotor]:rotate-90">
                <div className="text-xl font-semibold flex items-center gap-2">
                  <span className="leading-none">Storybook4me Friends</span>
                  <svg className="rotor transition-transform duration-200 opacity-70" width="16" height="16" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="4,2 9,6 4,10" />
                  </svg>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <PresetCharactersSection />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <CharacterModal
          isOpen={characterModalOpen}
          onClose={() => setCharacterModalOpen(false)}
          characterId={selectedCharacterId}
          onSave={handleSaveCharacter}
          onDelete={handleDeleteCharacter}
          readOnly={false}
        />
      </div>
    </SignedIn>
  );
};


