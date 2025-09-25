import { useEffect, useState } from 'react';
import { SignedIn } from '@/features/auth';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { Plus } from 'lucide-react';
import CharacterModal from '@/features/family/components/CharacterModal';
import { PresetCharactersSection } from './PresetCharactersSection';
import { CharacterCard } from './CharacterCard';
import { useCreateCharacter } from '../hooks/useCreateCharacter';
import { familyApi } from '../api';
import { useSession } from '@clerk/clerk-react';
import { CreateCharacterRequest, UpdateCharacterRequest } from '../types';

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
  const [selectedInitialData, setSelectedInitialData] = useState<Partial<{ name: string; description?: string; appearance?: string; image?: string }>>();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { session, isLoaded } = useSession();

  useEffect(() => {
    if (!isLoaded || !session) return;
    let mounted = true;
    const load = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const token = await session.getToken({ template: 'storybook4me' });
        const res = await familyApi.getCharacters({}, token || undefined);
        if (!mounted) return;
        const mapped: FamilyMember[] = res.characters.map((c) => ({
          id: c.id,
          name: c.character_name,
          description: c.description,
          appearance: c.visual_features,
          avatar: c.image_url || '/cover.png',
        }));
        setFamilyMembers(mapped);
      } catch (e) {
        if (!mounted) return;
        const msg = e instanceof Error ? e.message : 'Failed to load characters';
        setLoadError(msg);
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [isLoaded, session]);

  const handleAddCharacter = () => {
    setSelectedCharacterId(undefined);
    setCharacterModalOpen(true);
  };

  const handleEditCharacter = async (characterId: string) => {
    const member = familyMembers.find(m => m.id === characterId);
    if (member) {
      setSelectedInitialData({
        name: member.name,
        description: member.description,
        appearance: member.appearance,
        image: member.avatar,
      });
    } else {
      setSelectedInitialData(undefined);
    }
    setSelectedCharacterId(characterId);
    setCharacterModalOpen(true);
  };

  const handleSaveCharacter = async (character: any) => {
    if (character.id) {
      // Update via API
      const update: UpdateCharacterRequest = {
        character_name: character.name,
        description: character.description,
        visual_features: character.appearance,
        image_url: character.image,
      };
      try {
        const res = await familyApi.updateCharacter(character.id, update);
        const c = res.character;
        setFamilyMembers(prev => prev.map(member => member.id === c.id ? {
          id: c.id,
          name: c.character_name,
          description: c.description,
          appearance: c.visual_features,
          avatar: c.image_url || '/cover.png',
        } : member));
      } catch (e) {
        // ignore for now or attach toast
      }
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

  const handleDeleteCharacter = async (characterId: string) => {
    try {
      await familyApi.deleteCharacter(characterId);
      setFamilyMembers(prev => prev.filter(member => member.id !== characterId));
    } catch (e) {
      // ignore for now or attach toast
    }
  };

  return (
    <SignedIn>
      <div id="family" className="scroll-mt-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">My Family</h2>
          <Button variant="ghost" size="sm" className="hover:bg-purple-100" onClick={handleAddCharacter}>
            <Plus className="w-4 h-4 mr-2" />
            Add Character
          </Button>
        </div>

        {loadError && (
          <div className="text-sm text-red-600 mb-2">{loadError}</div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isLoading && familyMembers.length === 0 ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={`skeleton-${i}`}>
                <CardContent className="h-48 animate-pulse bg-muted" />
              </Card>
            ))
          ) : (
            familyMembers.map((member) => (
              <CharacterCard
                key={member.id}
                id={member.id}
                name={member.name}
                description={member.description}
                imageUrl={member.avatar}
                onClick={handleEditCharacter}
              />
            ))
          )}
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
          initialData={selectedInitialData}
        />
      </div>
    </SignedIn>
  );
};


