import { useState, useEffect } from "react";
import { LinkCard } from "@/components/LinkCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Links() {
  const [links, setLinks] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", url: "" });
  const { toast } = useToast();

  useEffect(() => {
    // Placeholder for API call to fetch links
    const fetchLinks = async () => {
      // Simulated data
      setLinks([
        { id: "1", title: "GitHub", url: "https://github.com" },
        { id: "2", title: "Documentation", url: "https://docs.example.com" },
      ]);
    };

    fetchLinks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newLink = {
      id: Date.now().toString(),
      title: formData.title,
      url: formData.url,
    };
    
    setLinks([newLink, ...links]);
    toast({ title: "Link added successfully" });
    setFormData({ title: "", url: "" });
    setIsDialogOpen(false);
  };

  const handleDelete = (id) => {
    setLinks(links.filter(link => link.id !== id));
    toast({ title: "Link deleted successfully" });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Links</h1>
          <p className="text-muted-foreground mt-2">
            Save and organize your important links.
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Link</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Link title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Add Link
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {links.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No links yet. Add your first link!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <LinkCard
              key={link.id}
              {...link}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
