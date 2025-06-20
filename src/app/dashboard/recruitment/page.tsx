'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Trash2 } from 'lucide-react';
import { CandidateForm } from '@/components/dashboard/candidate-form';
import { useToast } from '@/hooks/use-toast';

const candidates = [
  { id: 1, name: 'Jean Dupont', email: 'jean.d@example.com', position: 'Senior Frontend Engineer' },
  { id: 2, name: 'Marie Curie', email: 'marie.c@example.com', position: 'Product Manager' },
  { id: 3, name: 'Pierre Martin', email: 'pierre.m@example.com', position: 'UX/UI Designer' },
];

export default function RecruitmentPage() {
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    // Logic to delete candidate would go here
    console.log(`Deleting candidate with id: ${id}`);
    toast({
      title: "Succès",
      description: "Le candidat a été supprimé.",
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Recrutement</h1>
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Candidats</CardTitle>
          <CardDescription>
            Ajoutez, recherchez et gérez les candidats ici.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher des candidats..." className="pl-8" />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Ajouter un Candidat</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <CandidateForm />
              </DialogContent>
            </Dialog>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Poste</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>{candidate.name}</TableCell>
                    <TableCell>{candidate.email}</TableCell>
                    <TableCell>{candidate.position}</TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action ne peut pas être annulée. Cela supprimera définitivement le candidat.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(candidate.id)}>
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
