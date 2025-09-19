import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header, Footer } from '../../shared/components/layout';
import { Button } from '../../shared/components/ui/button';
import { Input } from '../../shared/components/ui/input';
import { Label } from '../../shared/components/ui/label';
import { Textarea } from '../../shared/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../shared/components/ui/card';
import { Upload, ArrowLeft } from 'lucide-react';

const CharacterFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null as File | null
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleSave = () => {
    // TODO: Connect to database
    console.log('Saving character:', formData);
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={handleCancel}
              className="mb-4 p-0 hover:bg-transparent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Family
            </Button>
            <h1 className="text-3xl font-bold text-foreground">
              {isNew ? 'Add New Character' : 'Edit Character'}
            </h1>
            <p className="text-muted-foreground mt-2">
              Create a magical character for your family stories
            </p>
          </div>

          {/* Form */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Character Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Character Photo */}
              <div className="space-y-2">
                <Label htmlFor="character-photo">Character Photo</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <input
                    id="character-photo"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label htmlFor="character-photo" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Click to upload a photo
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG up to 10MB
                    </p>
                    {formData.image && (
                      <p className="text-sm text-primary mt-2">
                        Selected: {formData.image.name}
                      </p>
                    )}
                  </label>
                </div>
              </div>

              {/* Character Name */}
              <div className="space-y-2">
                <Label htmlFor="character-name">Character Name</Label>
                <Input
                  id="character-name"
                  placeholder="Enter character name (e.g., Emma, Max, Luna)"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              {/* Magic Description */}
              <div className="space-y-2">
                <Label htmlFor="character-description">
                  Magic Description
                </Label>
                <Textarea
                  id="character-description"
                  placeholder="Describe your character's appearance and personality... (e.g., A brave 8-year-old with curly brown hair who loves adventures and has a pet dragon)"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  This helps create consistent character appearances in your stories
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button onClick={handleCancel} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave} 
                  className="flex-1 magic-gradient"
                  disabled={!formData.name.trim()}
                >
                  {isNew ? 'Create Character' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CharacterFormPage;