import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
      <div className="flex items-center gap-2">
        <Bot className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-semibold font-headline">RH Insights</h1>
      </div>
      <Avatar>
        <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="person avatar" alt="User Avatar" />
        <AvatarFallback>HR</AvatarFallback>
      </Avatar>
    </header>
  );
}
