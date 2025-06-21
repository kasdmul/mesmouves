
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
import {
  PlusCircle,
  Search,
  MoreHorizontal,
  Trash2,
  Calendar as CalendarIcon,
} from 'lucide-react';
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
import { store, notify, useStore, type Employee } from '@/lib/store';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function PersonnelPage() {
  useStore();

  const [searchTerm, setSearchTerm] = React.useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [editingEmployee, setEditingEmployee] = React.useState<Employee | null>(
    null
  );

  // Refs for Add Dialog
  const matriculeInputRef = React.useRef<HTMLInputElement>(null);
  const nomsInputRef = React.useRef<HTMLInputElement>(null);
  const emailInputRef = React.useRef<HTMLInputElement>(null);
  const entiteInputRef = React.useRef<HTMLInputElement>(null);
  const departementInputRef = React.useRef<HTMLInputElement>(null);
  const posteInputRef = React.useRef<HTMLInputElement>(null);
  const periodeEssaiInputRef = React.useRef<HTMLInputElement>(null);
  const [hireDate, setHireDate] = React.useState<Date | undefined>();

  // State for Edit Dialog
  const [editingHireDate, setEditingHireDate] = React.useState<
    Date | undefined
  >();
  const [editingDepartureDate, setEditingDepartureDate] = React.useState<
    Date | undefined
  >();
  const [editingStatus, setEditingStatus] = React.useState<
    Employee['status'] | undefined
  >();

  const parseDate = (dateString?: string): Date | undefined => {
    if (!dateString) return undefined;
    try {
      const parts = dateString.split('/');
      const date = new Date(
        parseInt(parts[2], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[0], 10)
      );
      return isNaN(date.getTime()) ? undefined : date;
    } catch (e) {
      return undefined;
    }
  };

  React.useEffect(() => {
    if (editingEmployee) {
      setEditingHireDate(parseDate(editingEmployee.dateEmbauche));
      setEditingDepartureDate(parseDate(editingEmployee.dateDepart));
      setEditingStatus(editingEmployee.status);
    } else {
      setEditingHireDate(undefined);
      setEditingDepartureDate(undefined);
      setEditingStatus(undefined);
    }
  }, [editingEmployee]);

  React.useEffect(() => {
    const handleCsvImport = (event: Event) => {
      if (
        !(event instanceof CustomEvent) ||
        !window.location.pathname.includes('/personnel')
      ) {
        return;
      }

      const importedData = event.detail;
      if (!importedData || !Array.isArray(importedData)) {
        console.error('Invalid CSV data received');
        return;
      }

      const newEmployees: Employee[] = importedData
        .map((row: any): Employee | null => {
          if (!row.Matricule || !row.Noms || !row.Poste) {
            return null;
          }
          return {
            matricule: row.Matricule,
            noms: row.Noms,
            email:
              row.Email ||
              `${row.Noms.toLowerCase().replace(/\s/g, '.')}@example.com`,
            entite: row.Entité || 'N/A',
            departement: row.Département || 'N/A',
            poste: row.Poste,
            salaire: parseFloat(row['Salaire de Base']) || 0,
            typeContrat: row['Type de Contrat'] || 'N/A',
            dateEmbauche:
              row['Date de Début'] ||
              row["Date d'embauche"] ||
              format(new Date(), 'dd/MM/yyyy'),
            periodeEssai:
              parseInt(
                row["Période d'essai (mois)"] ||
                  row["Période d'essai (jours)"] ||
                  row["Période d'essai"] ||
                  '0',
                10
              ) || 0,
            status: row.Statut === 'Parti' ? 'Parti' : 'Actif',
            dateDepart: row['Date de départ'],
          };
        })
        .filter((e): e is Employee => e !== null);

      const existingMatricules = new Set(
        store.employees.map((e) => e.matricule)
      );
      const uniqueNewEmployees = newEmployees.filter(
        (ne) => !existingMatricules.has(ne.matricule)
      );

      store.employees.push(...uniqueNewEmployees);
      notify();

      if (uniqueNewEmployees.length > 0) {
        alert(
          `${uniqueNewEmployees.length} employé(s) importé(s) avec succès !`
        );
      } else {
        alert(
          'Aucun nouvel employé à importer ou les données sont invalides/dupliquées.'
        );
      }
    };

    window.addEventListener('csvDataLoaded', handleCsvImport);

    return () => {
      window.removeEventListener('csvDataLoaded', handleCsvImport);
    };
  }, []);

  const handleAddEmployee = (event: React.FormEvent) => {
    event.preventDefault();
    const newEmployee: Employee = {
      matricule:
        matriculeInputRef.current?.value ||
        `E${Math.floor(Math.random() * 1000)}`,
      noms: nomsInputRef.current?.value || '',
      email: emailInputRef.current?.value || '',
      entite: entiteInputRef.current?.value || 'N/A',
      departement: departementInputRef.current?.value || '',
      poste: posteInputRef.current?.value || '',
      salaire: 0,
      typeContrat: 'N/A',
      dateEmbauche: hireDate ? format(hireDate, 'dd/MM/yyyy') : '',
      periodeEssai: parseInt(periodeEssaiInputRef.current?.value || '0', 10),
      status: 'Actif',
    };
    if (newEmployee.noms && newEmployee.email && newEmployee.matricule) {
      store.employees.push(newEmployee);
      notify();
      setIsAddDialogOpen(false);
      // Reset fields
      if (matriculeInputRef.current) matriculeInputRef.current.value = '';
      if (nomsInputRef.current) nomsInputRef.current.value = '';
      if (emailInputRef.current) emailInputRef.current.value = '';
      if (entiteInputRef.current) entiteInputRef.current.value = '';
      if (departementInputRef.current) departementInputRef.current.value = '';
      if (posteInputRef.current) posteInputRef.current.value = '';
      if (periodeEssaiInputRef.current)
        periodeEssaiInputRef.current.value = '';
      setHireDate(undefined);
    }
  };

  const handleUpdateEmployee = (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingEmployee || !editingStatus) return;

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    let finalDepartureDate = editingDepartureDate;
    if (editingStatus === 'Parti' && !finalDepartureDate) {
      finalDepartureDate = new Date();
    }

    const updatedEmployee: Employee = {
      ...editingEmployee,
      noms: formData.get('noms-edit') as string,
      email: formData.get('email-edit') as string,
      entite: formData.get('entite-edit') as string,
      departement: formData.get('departement-edit') as string,
      poste: formData.get('poste-edit') as string,
      dateEmbauche: editingHireDate
        ? format(editingHireDate, 'dd/MM/yyyy')
        : editingEmployee.dateEmbauche,
      periodeEssai: parseInt(
        (formData.get('periodeEssai-edit') as string) || '0',
        10
      ),
      status: editingStatus,
      dateDepart:
        editingStatus === 'Parti' && finalDepartureDate
          ? format(finalDepartureDate, 'dd/MM/yyyy')
          : undefined,
    };

    store.employees = store.employees.map((e) =>
      e.matricule === editingEmployee.matricule ? updatedEmployee : e
    );
    notify();
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = (matricule: string) => {
    store.employees = store.employees.filter((e) => e.matricule !== matricule);
    notify();
  };

  const handleDeleteAllEmployees = () => {
    store.employees = [];
    store.salaryHistory = [];
    store.functionHistory = [];
    store.contractHistory = [];
    notify();
  };

  const getStatusBadgeVariant = (status: Employee['status']) => {
    switch (status) {
      case 'Actif':
        return 'secondary';
      case 'Parti':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const filteredEmployees = store.employees.filter(
    (employee) =>
      employee.noms.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.entite.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.departement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.poste.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Gestion du Personnel</CardTitle>
              <CardDescription>
                Gérez les informations des employés.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter un employé
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <form onSubmit={handleAddEmployee}>
                    <DialogHeader>
                      <DialogTitle>Ajouter un nouvel employé</DialogTitle>
                      <DialogDescription>
                        Remplissez les informations ci-dessous pour ajouter un
                        nouvel employé.
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
                        <Label htmlFor="entity" className="text-right">
                          Entité
                        </Label>
                        <Input
                          id="entity"
                          ref={entiteInputRef}
                          placeholder="p. ex. Siège Social"
                          className="col-span-3"
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
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="hire-date" className="text-right">
                          Date d'embauche
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'col-span-3 justify-start text-left font-normal',
                                !hireDate && 'text-muted-foreground'
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {hireDate ? (
                                format(hireDate, 'dd/MM/yyyy')
                              ) : (
                                <span>Choisir une date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={hireDate}
                              onSelect={setHireDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="trial-period" className="text-right">
                          Période d'essai (mois)
                        </Label>
                        <Input
                          id="trial-period"
                          type="number"
                          ref={periodeEssaiInputRef}
                          placeholder="p. ex. 3"
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Tout supprimer
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Êtes-vous absolutely sûr ?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible. Cela supprimera
                      définitivement tous les employés et leur historique
                      associé.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAllEmployees}>
                      Confirmer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
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
                  <TableHead className="hidden md:table-cell">Entité</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Département
                  </TableHead>
                  <TableHead>Poste</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Date de Début
                  </TableHead>
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
                    <TableCell className="hidden md:table-cell">{employee.entite}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {employee.departement}
                    </TableCell>
                    <TableCell>{employee.poste}</TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(employee.status) as any}
                      >
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {employee.dateEmbauche}
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
                          <DropdownMenuItem
                            onClick={() => setEditingEmployee(employee)}
                          >
                            Modifier
                          </DropdownMenuItem>
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
                                  Cette action est irréversible. L'employé sera
                                  définitivement supprimé.
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
      <Dialog
        open={!!editingEmployee}
        onOpenChange={(isOpen) => !isOpen && setEditingEmployee(null)}
      >
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleUpdateEmployee}>
            <DialogHeader>
              <DialogTitle>Modifier l'employé</DialogTitle>
              <DialogDescription>
                Mettez à jour les informations ci-dessous. Le matricule ne peut
                pas être modifié.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="matricule-edit" className="text-right">
                  Matricule
                </Label>
                <Input
                  id="matricule-edit"
                  name="matricule-edit"
                  defaultValue={editingEmployee?.matricule}
                  className="col-span-3"
                  readOnly
                  disabled
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="noms-edit" className="text-right">
                  Nom
                </Label>
                <Input
                  id="noms-edit"
                  name="noms-edit"
                  defaultValue={editingEmployee?.noms}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email-edit" className="text-right">
                  Email
                </Label>
                <Input
                  id="email-edit"
                  name="email-edit"
                  type="email"
                  defaultValue={editingEmployee?.email}
                  className="col-span-3"
                  required
                />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="entite-edit" className="text-right">
                  Entité
                </Label>
                <Input
                  id="entite-edit"
                  name="entite-edit"
                  defaultValue={editingEmployee?.entite}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="departement-edit" className="text-right">
                  Département
                </Label>
                <Input
                  id="departement-edit"
                  name="departement-edit"
                  defaultValue={editingEmployee?.departement}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="poste-edit" className="text-right">
                  Poste
                </Label>
                <Input
                  id="poste-edit"
                  name="poste-edit"
                  defaultValue={editingEmployee?.poste}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status-edit" className="text-right">
                  Statut
                </Label>
                <Select
                  name="status-edit"
                  value={editingStatus}
                  onValueChange={(value: Employee['status']) =>
                    setEditingStatus(value)
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Actif">Actif</SelectItem>
                    <SelectItem value="Parti">Parti</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="hire-date-edit" className="text-right">
                  Date d'embauche
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'col-span-3 justify-start text-left font-normal',
                        !editingHireDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editingHireDate ? (
                        format(editingHireDate, 'dd/MM/yyyy')
                      ) : (
                        <span>Choisir une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={editingHireDate}
                      onSelect={setEditingHireDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {editingStatus === 'Parti' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="departure-date-edit" className="text-right">
                    Date de départ
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'col-span-3 justify-start text-left font-normal',
                          !editingDepartureDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editingDepartureDate ? (
                          format(editingDepartureDate, 'dd/MM/yyyy')
                        ) : (
                          <span>Choisir une date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={editingDepartureDate}
                        onSelect={setEditingDepartureDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="periodeEssai-edit" className="text-right">
                  Période d'essai (mois)
                </Label>
                <Input
                  id="periodeEssai-edit"
                  name="periodeEssai-edit"
                  type="number"
                  defaultValue={editingEmployee?.periodeEssai}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditingEmployee(null)}
              >
                Annuler
              </Button>
              <Button type="submit">Sauvegarder</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
