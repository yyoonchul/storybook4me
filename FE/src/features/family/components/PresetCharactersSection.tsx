import { useMemo, useState } from 'react';
import { usePresetCharacters } from '../hooks/usePresetCharacters';
import { CharacterCard } from './CharacterCard';
import CharacterModal from './CharacterModal';
import { Card, CardContent } from '@/shared/components/ui/card';

export const PresetCharactersSection = () => {
  const { presets, isLoading, error } = usePresetCharacters();
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<{ name: string; description?: string; image?: string; appearance?: string } | null>(null);

  // Group presets by family sets (4 per row) using names
  const grouped = useMemo(() => {
    const nameToPreset = new Map(presets.map(p => [p.character_name, p] as const));
    const pick = (names: string[]) => names
      .map(n => nameToPreset.get(n))
      .filter(Boolean) as typeof presets;
    return [
      {
        title: 'The Starlings',
        members: pick(['Leo', 'Clara', 'Maya', 'Sam'])
      },
      {
        title: 'The Novas',
        members: pick(['Jin', 'Lena', 'Ren', 'Yuna'])
      },
      {
        title: 'The Solis',
        members: pick(['Mateo', 'Isabela', 'Sofia', 'Lucas'])
      },
    ];
  }, [presets]);

  if (isLoading) {
    const loadingGroups = [
      { title: 'The Starlings' },
      { title: 'The Novas' },
      { title: 'The Solis' },
    ];
    return (
      <section className="mt-12">
        {loadingGroups.map((group) => (
          <div key={group.title} className="mb-10">
            <h3 className="text-xl font-semibold mb-4">{group.title}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={`preset-skel-${group.title}-${i}`}>
                  <CardContent className="p-0">
                    <div className="h-48 w-full bg-muted animate-pulse" />
                    <div className="p-3 space-y-2">
                      <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-12">
        <p className="text-destructive">{error}</p>
      </section>
    );
  }

  if (!presets.length) {
    return null;
  }

  return (
    <section className="mt-12">
      {grouped.map((group) => (
        <div key={group.title} className="mb-10">
          <h3 className="text-xl font-semibold mb-4">{group.title}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {group.members.map((character) => (
              <CharacterCard
                key={character.id}
                id={character.id}
                name={character.character_name}
                description={character.description}
                imageUrl={character.image_url || '/cover.png'}
                onClick={() => {
                  setSelected({
                    name: character.character_name,
                    description: character.description,
                    image: character.image_url || '/cover.png',
                    appearance: (character as any).visual_features || '',
                  });
                  setModalOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      ))}
      <CharacterModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={() => {}}
        readOnly
        initialData={selected || undefined}
      />
    </section>
  );
};


