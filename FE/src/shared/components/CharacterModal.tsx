import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Upload, Trash2 } from "lucide-react";

interface Character {
  id?: string;
  name: string;
  description: string;
  appearance: string;
  image?: string;
}

interface CharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  characterId?: string;
  onSave: (character: Character) => void;
  onDelete?: (id: string) => void;
}

const CharacterModal = ({ isOpen, onClose, characterId, onSave, onDelete }: CharacterModalProps) => {
  const [imagePreview, setImagePreview] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const isEditing = !!characterId;

  const form = useForm<Character>({
    defaultValues: {
      name: "",
      description: "",
      appearance: "",
      image: ""
    }
  });

  // Mock data for editing - replace with real API call
  useEffect(() => {
    if (isEditing && characterId) {
      // Mock character data
      const mockCharacters: Record<string, Character> = {
        "1": {
          id: "1",
          name: "Emma",
          description: "A brave 8-year-old with curly brown hair who loves adventures",
          appearance: "Curly brown hair, bright green eyes, always wearing her favorite red cape",
          image: "/cover.png"
        },
        "2": {
          id: "2",
          name: "Max",
          description: "A curious 6-year-old boy who dreams of being a space explorer",
          appearance: "Short blonde hair, blue eyes, usually in his astronaut costume",
          image: "/cover.png"
        }
      };

      const character = mockCharacters[characterId];
      if (character) {
        form.reset(character);
        setImagePreview(character.image || "");
      }
    } else {
      form.reset({
        name: "",
        description: "",
        appearance: "",
        image: ""
      });
      setImagePreview("");
    }
  }, [isEditing, characterId, form]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        form.setValue("image", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: Character) => {
    onSave({ ...data, id: characterId });
    onClose();
  };

  const handleDelete = () => {
    if (characterId && onDelete) {
      onDelete(characterId);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isEditing ? "Edit Character" : "Add New Character"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Character Image */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Character Photo</label>
              <div className="flex items-center gap-4">
                <Card className="w-24 h-24 p-2">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Character preview" 
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </Card>
                <div>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button type="button" variant="outline" size="sm" asChild>
                      <span>Choose Photo</span>
                    </Button>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                </div>
              </div>
            </div>

            {/* Character Name */}
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Character name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Character Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter character name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Character Description */}
            <FormField
              control={form.control}
              name="description"
              rules={{ required: "Character description is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Character Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your character's personality and traits"
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Character Appearance */}
            <FormField
              control={form.control}
              name="appearance"
              rules={{ required: "Character appearance is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Physical Appearance</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe how your character looks (hair color, eyes, clothing, etc.)"
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
              <div>
                {isEditing && onDelete && (
                  <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button 
                        type="button" 
                        variant="destructive" 
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Character
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the character from your family.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" className="magic-gradient">
                  {isEditing ? "Save Changes" : "Create Character"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CharacterModal;