
'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Loader2 } from "lucide-react";

export function EmployeeForm({ onFinished }: { onFinished?: () => void }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const position = formData.get("position") as string;
    const department = formData.get("department") as string;

    if (!name || !email || !position || !department) {
        toast({
            variant: "destructive",
            title: "Erreur",
            description: "Veuillez remplir tous les champs.",
        });
        setIsLoading(false);
        return;
    }

    try {
        await addDoc(collection(db, "employees"), {
            name,
            email,
            position,
            department,
            createdAt: serverTimestamp(),
        });
        toast({
          title: "Succès",
          description: "L'employé a été ajouté.",
        });
        if (onFinished) onFinished();
    } catch (e) {
        console.error("Error adding document: ", e);
        toast({
            variant: "destructive",
            title: "Erreur",
            description: "L'ajout de l'employé a échoué.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Ajouter un Employé</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Nom
          </Label>
          <Input id="name" name="name" className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            Email
          </Label>
          <Input id="email" name="email" type="email" className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="position" className="text-right">
            Poste
          </Label>
          <Input id="position" name="position" className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="department" className="text-right">
            Département
          </Label>
          <Input id="department" name="department" className="col-span-3" required />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
            <Button type="button" variant="secondary" disabled={isLoading}>
                Annuler
            </Button>
        </DialogClose>
        <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Ajouter
        </Button>
      </DialogFooter>
    </form>
  );
}
