import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/shared/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Upload, Trash2 } from "lucide-react";
import { familyApi } from "../api";
import { toast } from "sonner";

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
  readOnly?: boolean;
  initialData?: Partial<Character>;
}

const CharacterModal = ({ isOpen, onClose, characterId, onSave, onDelete, readOnly, initialData }: CharacterModalProps) => {
  const [imagePreview, setImagePreview] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const isEditing = !!characterId;
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<Character>({
    defaultValues: { name: "", description: "", appearance: "", image: "" }
  });

  useEffect(() => {
    if (initialData) {
      const preset = {
        name: initialData.name || "",
        description: initialData.description || "",
        appearance: initialData.appearance || "",
        image: initialData.image || "",
      };
      form.reset(preset);
      setImagePreview(preset.image || "");
    } else if (isEditing && characterId) {
      // Fallback: fetch character details if no initialData was provided
      setIsLoading(true);
      familyApi.getCharacter(characterId)
        .then((res) => {
          const c = res.character;
          const mapped: Character = {
            id: c.id,
            name: c.character_name || "",
            description: c.description || "",
            appearance: (c as any).visual_features || "",
            image: c.image_url || "",
          };
          form.reset(mapped);
          setImagePreview(mapped.image || "");
        })
        .finally(() => setIsLoading(false));
    } else {
      form.reset({ name: "", description: "", appearance: "", image: "" });
      setImagePreview("");
    }
  }, [isEditing, characterId, initialData, form]);

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
    <Dialog
      open={isOpen}
      // 사용자가 ESC나 바깥 클릭 등으로 모달을 닫을 때만 onClose를 호출하고,
      // 부모가 isOpen을 true로 설정하는 경우에는 다시 닫히지 않도록 보호한다.
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{readOnly ? "Character" : isEditing ? "Edit Character" : "Add New Character"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Character Photo</label>
              <div className="flex items-center gap-4">
                <Card className="w-24 h-24 p-2">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Character preview" className="w-full h-full object-cover rounded" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </Card>
                {!readOnly ? (
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toast("Image upload coming soon", {
                          description: "You'll be able to upload custom character images in a future update.",
                          duration: 4000,
                        })
                      }
                    >
                      Choose Photo
                    </Button>
                    <p className="text-xs text-gray-500 mt-1">Image upload will be available soon.</p>
                  </div>
                ) : null}
              </div>
            </div>

            <FormField control={form.control} name="name" rules={!readOnly ? { required: "Character name is required" } : undefined} render={({ field }) => (
              <FormItem>
                <FormLabel>Character Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter character name" {...field} disabled={!!readOnly} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="description" rules={!readOnly ? { required: "Character description is required" } : undefined} render={({ field }) => (
              <FormItem>
                <FormLabel>Character Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe your character's personality and traits" className="min-h-[100px]" {...field} disabled={!!readOnly} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="appearance" rules={!readOnly ? { required: "Character appearance is required" } : undefined} render={({ field }) => (
              <FormItem>
                <FormLabel>Physical Appearance</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe how your character looks (hair color, eyes, clothing, etc.)" className="min-h-[100px]" {...field} disabled={!!readOnly} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex justify-between pt-4">
              <div>
                {!readOnly && isEditing && onDelete && (
                  <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button type="button" variant="destructive" className="flex items-center gap-2">
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
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-red-600 focus-visible:ring-red-300 transition-colors">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onClose}>Close</Button>
                {!readOnly ? (
                  <Button type="submit" className="magic-gradient" disabled={isLoading}>{isEditing ? "Save Changes" : "Create Character"}</Button>
                ) : null}
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CharacterModal;


