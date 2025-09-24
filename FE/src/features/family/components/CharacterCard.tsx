import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

type CharacterCardProps = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  onClick?: (id: string) => void;
};

export const CharacterCard = ({ id, name, description, imageUrl, onClick }: CharacterCardProps) => {
  return (
    <Card className="glass-effect hover-lift cursor-pointer" onClick={() => onClick?.(id)}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-center">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="w-[70%] aspect-square object-cover" />
          ) : null}
        </div>
        {description ? (
          <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
        ) : null}
      </CardContent>
    </Card>
  );
};


