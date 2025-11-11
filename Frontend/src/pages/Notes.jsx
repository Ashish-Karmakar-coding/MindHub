import { useState, useEffect } from "react";
import { NoteCard } from "@/components/NoteCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const { toast } = useToast();

  useEffect(() => {
    // Placeholder for API call to fetch notes
    const fetchNotes = async () => {
      // Simulated data
      setNotes([
        { id: "1", title: "Meeting Notes", content: "Discuss project timeline and deliverables with the team." },
        { id: "2", title: "Ideas", content: "New feature ideas for the app dashboard." },
      ]);
    };

    fetchNotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editingNote) {
      // Update existing note
      setNotes(notes.map(note => 
        note.id === editingNote.id 
          ? { ...note, title: formData.title, content: formData.content }
          : note
      ));
      toast({ title: "Note updated successfully" });
    } else {
      // Create new note
      const newNote = {
        id: Date.now().toString(),
        title: formData.title,
        content: formData.content,
      };
      setNotes([newNote, ...notes]);
      toast({ title: "Note created successfully" });
    }

    setFormData({ title: "", content: "" });
    setEditingNote(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (id) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      setEditingNote(note);
      setFormData({ title: note.title, content: note.content });
      setIsDialogOpen(true);
    }
  };

  const handleDelete = (id) => {
    setNotes(notes.filter(note => note.id !== id));
    toast({ title: "Note deleted successfully" });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
          <p className="text-muted-foreground mt-2">
            Manage your notes and ideas.
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Note
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingNote ? "Edit Note" : "Create New Note"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Note title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Textarea
                  placeholder="Note content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows={5}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingNote ? "Update Note" : "Create Note"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No notes yet. Create your first note!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              {...note}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
