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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import React from 'react';

type Employee = {
  matricule: string;
  noms: string;
  email: string;
  departement: string;
  poste: string;
};

const initialEmployees: Employee[] = [
  {
    matricule: 'E001',
    noms: 'Alice Bernard',
    email: 'alice.b@example.com',
    departement: 'Marketing',
    poste: 'Manager',
  },
  {
    matricule: 'E002',
    noms: 'Bob Leclerc',
    email: 'bob.l@example.com',
    departement: 'Ingénierie',
    poste: 'Développeur Senior',
  },
  {
    matricule: 'E003',
    noms: 'Chloé Dubois',
    email: 'chloe.d@example.com',
    departement: 'Ventes',
    poste: 'Commercial',
  },
];

export default function PersonnelPage() {
  const [employees, setEmployees] = React.useState<Employee[]>(initialEmployees);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const matriculeInputRef = React.useRef<HTMLInputElement>(null);
  const nomsInputRef = React.useRef<HTMLInputElement>(null);
  const emailInputRef = React.useRef<HTMLInputElement>(null);
  const departementInputRef = React.useRef<HTMLInputElement>(null);
  const posteInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const handleCsvImport = (event: Event) => {
      // Ensure this is a custom event and we are on the personnel page
      if (!(event instanceof CustomEvent) || !window.location.pathname.includes('/personnel')) {
        return;
      }

      const importedData = event.detail;
      if (!importedData || !Array.isArray(importedData)) {
        console.error('Invalid CSV data received');
        return;
      }
      
      const newEmployees: Employee[] = importedData
        .map((row: any) => {
          // Validate that essential columns exist
          if (!row.Matricule || !row.Noms || !row.Poste) {
            return null;
          }
          return {
            matricule: row.Matricule,
            noms: row.Noms,
            // Generate a dummy email if not present, as it's part of the UI
            email: row.Email || `${row.Noms.toLowerCase().replace(/\s/g, '.')}@example.com`,
            departement: row.Département || 'N/A',
            poste: row.Poste,
          };
        })
        .filter((e): e is Employee => e !== null);
      
      // Add new employees, preventing duplicates based on matricule
      setEmployees((prevEmployees) => {
        const existingMatricules = new Set(prevEmployees.map(e => e.matricule));
        const uniqueNewEmployees = newEmployees.filter(ne => !existingMatricules.has(ne.matricule));
        return [...prevEmployees, ...uniqueNewEmployees];
      });
      
      if (newEmployees.length > 0) {
        alert(`${newEmployees.length} employé(s) importé(s) avec succès !`);
      } else {
         alert("Aucun nouvel employé à importer ou les données sont invalides.");
      }
    };

    window.addEventListener('csvDataLoaded', handleCsvImport);

    return () => {
      window.removeEventListener('csvDataLoaded', handleCsvImport);
    };
  }, []); // Empty dependency array means this runs once on mount


  const handleAddEmployee = (event: React.FormEvent) => {
    event.preventDefault();
    const newEmployee: Employee = {
      matricule: matriculeInputRef.current?.value || `E${Math.floor(Math.random() * 1000)}`,
      noms: nomsInputRef.current?.value || '',
      email: emailInputRef.current?.value || '',
      departement: departementInputRef.current?.value || '',
      poste: posteInputRef.current?.value || '',
    };
    if (newEmployee.noms && newEmployee.email && newEmployee.matricule) {
      setEmployees([...employees, newEmployee]);
      setIsDialogOpen(false);
    }
  };

  const handleDeleteEmployee = (matricule: string) => {
    setEmployees(employees.filter((e) => e.matricule !== matricule));
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.noms.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.departement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.poste.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Gestion du Personnel</CardTitle>
            <CardDescription>
              Gérez les informations des employés.
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter un employé
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleAddEmployee}>
                <DialogHeader>
                  <DialogTitle>Ajouter un nouvel employé</DialogTitle>
                  <DialogDescription>
                    Remplissez les informations ci-dessous pour ajouter un nouvel
                    employé.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="matricule" className="text-right">
                      Matricule
                    </Label>
                    <Input
                      id="matricule"
                      ref={matriculeInputRef}
                      placeholder="p. ex. E123"
                      className="col-span-3"
                      required
                    />
                  </div>
                   <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nom
                    </Label>
                    <Input
                      id="name"
                      ref={nomsInputRef}
                      placeholder="p. ex. Alice Bernard"
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      ref={emailInputRef}
                      placeholder="p. ex. alice.b@example.com"
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="department" className="text-right">
                      Département
                    </Label>
                    <Input
                      id="department"
                      ref={departementInputRef}
                      placeholder="p. ex. Marketing"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      Poste
                    </Label>
                    <Input
                      id="role"
                      ref={posteInputRef}
                      placeholder="p. ex. Manager"
                      className="col-span-3"
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
            placeholder="Rechercher des employés..."
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
                <TableHead>Employé</TableHead>
                <TableHead className="hidden md:table-cell">
                  Département
                </TableHead>
                <TableHead>Poste</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.matricule}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={`https://placehold.co/40x40.png`}
                          alt="Avatar"
                          data-ai-hint="person"
                        />
                        <AvatarFallback>
                          {employee.noms.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid gap-0.5">
                        <p className="font-medium">{employee.noms}</p>
                        <p className="text-sm text-muted-foreground">
                          {employee.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {employee.departement}
                  </TableCell>
                  <TableCell>{employee.poste}</TableCell>
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
                              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Cette action est irréversible. L'employé sera définitivement supprimé.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteEmployee(employee.matricule)
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
