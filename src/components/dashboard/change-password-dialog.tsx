'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export function ChangePasswordDialog() {
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Logic to change password would go here.
    toast({
      title: "Succès",
      description: "Votre mot de passe a été changé.",
    });
    // Need to close the dialog programmatically here.
    // For now, we'll rely on the user clicking the 'x' or a cancel button.
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Changer le mot de passe</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Changer le mot de passe</DialogTitle>
            <DialogDescription>
              Entrez votre nouveau mot de passe ci-dessous.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="current-password" className="text-right">
                Actuel
              </Label>
              <Input
                id="current-password"
                type="password"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-password" className="text-right">
                Nouveau
              </Label>
              <Input
                id="new-password"
                type="password"
                className="col-span-3"
                required
              />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="confirm-password" className="text-right">
                Confirmer
              </Label>
              <Input
                id="confirm-password"
                type="password"
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Sauvegarder les changements</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
