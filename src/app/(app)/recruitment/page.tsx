'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, Search, MoreHorizontal, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
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
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import React from 'react';

const initialCandidates = [
  {
    name: 'Jean Dupont',
    position: 'Développeur Frontend',
    status: 'Entretien',
    appliedDate: '2023-10-26',
  },
  {
    name: 'Marie Curie',
    position: 'Chef de projet',
    status: 'Offre envoyée',
    appliedDate: '2023-10-22',
  },
  {
    name: 'Pierre Martin',
    position: 'Designer UI/UX',
    status: 'Nouveau',
    appliedDate: '2023-11-01',
  },
  {
    name: 'Sophie Lambert',
    position: 'Data Scientist',
    status: 'Rejeté',
    appliedDate: '2023-10-15',
  },
];

export default function RecruitmentPage() {
  const [candidates, setCandidates] = React.useState(initialCandidates);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const nameInputRef = React.useRef<HTMLInputElement>(null);
  const positionInputRef = React.useRef<HTMLInputElement>(null);

  const handleAddCandidate = (event: React.FormEvent) => {
    event.preventDefault();
    const newCandidate = {
      name: nameInputRef.current?.value || '',
      position: positionInputRef.current?.value || '',
      status: 'Nouveau',
      appliedDate: new Date().toISOString().split('T')[0],
    };
    if (newCandidate.name && newCandidate.position) {
      setCandidates([newCandidate, ...candidates]);
      setIsDialogOpen(false);
    }
  };

  const handleDeleteCandidate = (candidateName: string) => {
    setCandidates(candidates.filter((c) => c.name !== candidateName));
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'Offre envoyée':
        return 'default';
      case 'Entretien':
        return 'secondary';
      case 'Nouveau':
        return 'outline';
      case 'Rejeté':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Recrutement</CardTitle>
            <CardDescription>
              Gérez les candidats tout au long du processus de recrutement.
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter un Candidat
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleAddCandidate}>
                <DialogHeader>
                  <DialogTitle>Ajouter un nouveau candidat</DialogTitle>
                  <DialogDescription>
                    Remplissez les informations ci-dessous pour ajouter un
                    nouveau candidat.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nom
                    </Label>
                    <Input
                      id="name"
                      ref={nameInputRef}
                      placeholder="p. ex. Jean Dupont"
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="position" className="text-right">
                      Poste
                    </Label>
                    <Input
                      id="position"
                      ref={positionInputRef}
                      placeholder="p. ex. Développeur Frontend"
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
                  <Button type="submit">Sauvegarder</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="relative mt-4 w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher des candidats..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead className="hidden md:table-cell">Poste</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Date de Candidature
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.map((candidate) => (
                <TableRow key={candidate.name}>
                  <TableCell className="font-medium">
                    {candidate.name}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {candidate.position}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(candidate.status) as any}>
                      {candidate.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {candidate.appliedDate}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Modifier</DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Êtes-vous sûr ?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Cette action est irréversible. Le candidat sera
                                définitivement supprimé.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteCandidate(candidate.name)
                                }
                              >
                                Confirmer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
