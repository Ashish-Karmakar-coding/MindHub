import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Trash2 } from "lucide-react";

export function LinkCard({ id, title, url, onDelete }) {
  return (
    <Card className="transition-all hover:shadow-lg duration-300 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          {url}
          <ExternalLink className="h-3 w-3" />
        </a>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(id)}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
