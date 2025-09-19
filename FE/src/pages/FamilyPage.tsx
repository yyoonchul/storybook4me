import { Link } from 'react-router-dom';
import Header from "../shared/components/layout/Header";
import Footer from "../shared/components/layout/Footer";
import { Button } from "../shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../shared/components/ui/card";
import { Plus, Edit } from 'lucide-react';

// Mock family characters (replace with real API integration later)
const mockCharacters = [
  {
    id: '1',
    name: 'Emma',
    description: 'A brave 8-year-old with curly brown hair who loves adventures',
    image: '/cover.png'
  },
  {
    id: '2', 
    name: 'Max',
    description: 'A curious 6-year-old boy who dreams of being a space explorer',
    image: '/cover.png'
  }
];

const FamilyPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Family</h1>
              <p className="text-muted-foreground">Create and manage your family characters for personalized stories</p>
            </div>
            <Link to="/family/character/new">
              <Button className="magic-gradient">
                <Plus className="h-4 w-4 mr-2" />
                Add Character
              </Button>
            </Link>
          </div>

          {/* Characters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCharacters.map((character) => (
              <Card key={character.id} className="glass-effect hover-lift">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{character.name}</CardTitle>
                    <Link to={`/family/character/${character.id}`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-gradient-to-br from-magic-200 to-magic-300 rounded-lg mb-4 flex items-center justify-center">
                    <img 
                      src={character.image} 
                      alt={character.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {character.description}
                  </p>
                </CardContent>
              </Card>
            ))}

            {/* Add New Character Card */}
            <Link to="/family/character/new">
              <Card className="glass-effect hover-lift border-dashed border-2 h-full min-h-[280px] flex items-center justify-center cursor-pointer">
                <div className="text-center">
                  <Plus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground font-medium">Add New Character</p>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FamilyPage;