import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-end border-b bg-card px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm">Changer le mot de passe</Button>
        <span className="text-sm text-muted-foreground hidden sm:inline">
          Utilisateur Démo
        </span>
        <Avatar>
          <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="person avatar" alt="User Avatar" />
          <AvatarFallback>HR</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
