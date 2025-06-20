
'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";


export function ChangePasswordDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  // In a real app, this would handle re-authentication and password update with Firebase.
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // For this prototype, we'll just show a success message.
    toast({
      title: "Fonctionnalité à venir",
      description: "La logique de changement de mot de passe sera implémentée ici.",
    });
    setOpen(false); // Close the dialog
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
             <DialogClose asChild>
                <Button type="button" variant="secondary">
                    Annuler
                </Button>
            </DialogClose>
            <Button type="submit">Sauvegarder les changements</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
