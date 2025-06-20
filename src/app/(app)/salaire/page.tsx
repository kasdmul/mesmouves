'use client';

import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, DollarSign, Plus, Briefcase, FileText, History, Landmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type Employee = {
  matricule: string;
  noms: string;
  departement: string;
  salaire: number;
  poste: string;
};

type SalaryChange = {
  date: string;
  matricule: string;
  noms: string;
  ancienneValeur: number;
  nouvelleValeur: number;
  motif: string;
};

type FunctionChange = {
  date: string;
  matricule: string;
  noms: string;
  ancienneValeur: string;
  nouvelleValeur: string;
  motif: string;
};

const initialEmployees: Employee[] = [
  { matricule: '21072', noms: 'John TSHIAMALA', departement: 'Ventes', salaire: 3000, poste: 'Manager' },
  { matricule: 'E001', noms: 'Alice Bernard', departement: 'Marketing', salaire: 2800, poste: 'Spécialiste Marketing' },
  { matricule: 'E002', noms: 'Bob Leclerc', departement: 'Ingénierie', salaire: 3500, poste: 'Développeur Senior' },
  { matricule: '20055', noms: 'Trish KALOMBOLA', departement: 'Finance', salaire: 4500, poste: 'Directeur Financier' },
];

const initialSalaryHistory: SalaryChange[] = [
  { date: '20/06/2025', matricule: '21072', noms: 'John TSHIAMALA', ancienneValeur: 3000, nouvelleValeur: 3500, motif: 'ajustement salaire' },
];

const initialFunctionHistory: FunctionChange[] = [
  { date: '20/06/2025', matricule: '20055', noms: 'Trish KALOMBOLA', ancienneValeur: 'Directeur Financier', nouvelleValeur: 'chief driver', motif: 'promotion' },
];

function SalaryChangeContent() {
  const [employees, setEmployees] = React.useState<Employee[]>(initialEmployees);
  const [history, setHistory] = React.useState<SalaryChange[]>(initialSalaryHistory);
  const [selectedMatricule, setSelectedMatricule] = React.useState<string | undefined>();
  
  const [date, setDate] = React.useState<Date | undefined>(new Date('2025-06-20T00:00:00'));
  const [newSalary, setNewSalary] = React.useState('3500');
  const [reason, setReason] = React.useState('ajustement salaire');
  const [newDepartment, setNewDepartment] = React.useState('');

  const selectedEmployee = employees.find(e => e.matricule === selectedMatricule);

  React.useEffect(() => {
    if (initialSalaryHistory.length > 0) {
      const firstHistoryItem = initialSalaryHistory[0];
      setSelectedMatricule(firstHistoryItem.matricule);
    }
  }, []);

  const handleApplyChange = () => {
    if (!selectedEmployee || !newSalary || !reason || !date) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const newSalaryValue = parseFloat(newSalary);
    if (isNaN(newSalaryValue)) {
      alert('Le nouveau salaire doit être un nombre.');
      return;
    }

    const newChange: SalaryChange = {
      date: format(date, 'dd/MM/yyyy'),
      matricule: selectedEmployee.matricule,
      noms: selectedEmployee.noms,
      ancienneValeur: selectedEmployee.salaire,
      nouvelleValeur: newSalaryValue,
      motif: reason,
    };
    setHistory(prev => [newChange, ...prev.filter(h => h.nouvelleValeur !== newChange.nouvelleValeur)]);

    setEmployees(prev =>
      prev.map(emp =>
        emp.matricule === selectedEmployee.matricule
          ? { ...emp, salaire: newSalaryValue, departement: newDepartment || emp.departement }
          : emp
      )
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value) + ' $US';
  }

  return (
    <div className="space-y-8 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-6 w-6" />
            <span>Changement de Salaire</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <h3 className="text-lg font-medium">Appliquer un Changement</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="employee-select-salary">Sélectionner Employé</Label>
              <Select value={selectedMatricule} onValueChange={setSelectedMatricule}>
                <SelectTrigger id="employee-select-salary">
                  <SelectValue placeholder="Choisir un employé" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(employee => (
                    <SelectItem key={employee.matricule} value={employee.matricule}>
                      {employee.noms}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="noms-salary">Noms</Label>
              <Input id="noms-salary" value={selectedEmployee?.noms || ''} className="bg-gray-100" readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="change-date-salary">Date de l'application du changement</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd/MM/yyyy") : <span>Choisir une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="current-salary">Salaire Actuel</Label>
              <Input id="current-salary" value={selectedEmployee ? formatCurrency(selectedEmployee.salaire) : ''} className="bg-gray-100" readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-salary">Nouveau Salaire</Label>
              <Input id="new-salary" placeholder="Nouveau Salaire" value={newSalary} onChange={e => setNewSalary(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason-salary">Motif du Changement</Label>
              <Input id="reason-salary" placeholder="Motif du Changement" value={reason} onChange={e => setReason(e.target.value)} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="new-department-salary">Nouveau Département (si applicable)</Label>
              <Input id="new-department-salary" placeholder={selectedEmployee?.departement || ''} value={newDepartment} onChange={e => setNewDepartment(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleApplyChange}>Appliquer le Changement</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Historique des Changements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>DATE</TableHead>
                  <TableHead>MATRICULE</TableHead>
                  <TableHead>NOMS</TableHead>
                  <TableHead>ANCIENNE VALEUR</TableHead>
                  <TableHead>NOUVELLE VALEUR</TableHead>
                  <TableHead>MOTIF</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.matricule}</TableCell>
                    <TableCell>{item.noms}</TableCell>
                    <TableCell>{formatCurrency(item.ancienneValeur)}</TableCell>
                    <TableCell>{formatCurrency(item.nouvelleValeur)}</TableCell>
                    <TableCell>{item.motif}</TableCell>
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

function FunctionChangeContent() {
  const [employees, setEmployees] = React.useState<Employee[]>(initialEmployees);
  const [history, setHistory] = React.useState<FunctionChange[]>(initialFunctionHistory);
  const [selectedMatricule, setSelectedMatricule] = React.useState<string | undefined>();
  
  const [date, setDate] = React.useState<Date | undefined>(new Date('2025-06-20T00:00:00'));
  const [newFunction, setNewFunction] = React.useState('chief driver');
  const [reason, setReason] = React.useState('promotion');
  const [newDepartment, setNewDepartment] = React.useState('');

  const selectedEmployee = employees.find(e => e.matricule === selectedMatricule);

  React.useEffect(() => {
    if (initialFunctionHistory.length > 0) {
      const firstHistoryItem = initialFunctionHistory[0];
      setSelectedMatricule(firstHistoryItem.matricule);
    }
  }, []);

  const handleApplyChange = () => {
    if (!selectedEmployee || !newFunction || !reason || !date) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const newChange: FunctionChange = {
      date: format(date, 'dd/MM/yyyy'),
      matricule: selectedEmployee.matricule,
      noms: selectedEmployee.noms,
      ancienneValeur: selectedEmployee.poste,
      nouvelleValeur: newFunction,
      motif: reason,
    };
    setHistory(prev => [newChange, ...prev.filter(h => h.nouvelleValeur !== newChange.nouvelleValeur)]);

    setEmployees(prev =>
      prev.map(emp =>
        emp.matricule === selectedEmployee.matricule
          ? { ...emp, poste: newFunction, departement: newDepartment || emp.departement }
          : emp
      )
    );
  };

  return (
    <div className="space-y-8 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-6 w-6" />
            <span>Changement de Fonction</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <h3 className="text-lg font-medium">Appliquer un Changement</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="employee-select-function">Sélectionner Employé</Label>
              <Select value={selectedMatricule} onValueChange={setSelectedMatricule}>
                <SelectTrigger id="employee-select-function">
                  <SelectValue placeholder="Choisir un employé" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(employee => (
                    <SelectItem key={employee.matricule} value={employee.matricule}>
                      {employee.noms}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="noms-function">Noms</Label>
              <Input id="noms-function" value={selectedEmployee?.noms || ''} className="bg-gray-100" readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="change-date-function">Date de l'application du changement</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd/MM/yyyy") : <span>Choisir une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="current-function">Fonction Actuelle</Label>
              <Input id="current-function" value={selectedEmployee?.poste || ''} className="bg-gray-100" readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-function">Nouvelle Fonction</Label>
              <Input id="new-function" placeholder="Nouvelle Fonction" value={newFunction} onChange={e => setNewFunction(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason-function">Motif du Changement</Label>
              <Input id="reason-function" placeholder="Motif du Changement" value={reason} onChange={e => setReason(e.target.value)} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="new-department-function">Nouveau Département (si applicable)</Label>
              <Input id="new-department-function" placeholder={selectedEmployee?.departement || ''} value={newDepartment} onChange={e => setNewDepartment(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleApplyChange}>Appliquer le Changement</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Historique des Changements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>DATE</TableHead>
                  <TableHead>MATRICULE</TableHead>
                  <TableHead>NOMS</TableHead>
                  <TableHead>ANCIENNE VALEUR</TableHead>
                  <TableHead>NOUVELLE VALEUR</TableHead>
                  <TableHead>MOTIF</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.matricule}</TableCell>
                    <TableCell>{item.noms}</TableCell>
                    <TableCell>{item.ancienneValeur}</TableCell>
                    <TableCell>{item.nouvelleValeur}</TableCell>
                    <TableCell>{item.motif}</TableCell>
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

export default function SalaryPageContainer() {
  return (
    <div>
        <div className="flex items-center border-b">
            <Button variant="ghost" asChild className="text-primary hover:text-primary">
                <Link href="/recruitment">
                    <Plus className="h-4 w-4 mr-2" />
                    Recrutement
                </Link>
            </Button>
            <Tabs defaultValue="fonction" className="w-full">
                <TabsList className="ml-4 bg-transparent p-0 border-b-0 rounded-none">
                    <TabsTrigger value="salaire" className="data-[state=active]:border-b-primary data-[state=active]:shadow-none rounded-none border-b-2 border-transparent">
                        <Landmark className="h-4 w-4 mr-2" />
                        Salaire
                    </TabsTrigger>
                    <TabsTrigger value="fonction" className="data-[state=active]:border-b-primary data-[state=active]:shadow-none rounded-none border-b-2 border-transparent">
                        <Briefcase className="h-4 w-4 mr-2" />
                        Fonction
                    </TabsTrigger>
                    <TabsTrigger value="contrat" disabled className="data-[state=active]:border-b-primary data-[state=active]:shadow-none rounded-none border-b-2 border-transparent">
                        <FileText className="h-4 w-4 mr-2" />
                        Contrat
                    </TabsTrigger>
                    <TabsTrigger value="historique" disabled className="data-[state=active]:border-b-primary data-[state=active]:shadow-none rounded-none border-b-2 border-transparent">
                        <History className="h-4 w-4 mr-2" />
                        Historique Global
                    </TabsTrigger>
                </TabsList>
                 <TabsContent value="salaire">
                    <SalaryChangeContent />
                </TabsContent>
                <TabsContent value="fonction">
                    <FunctionChangeContent />
                </TabsContent>
                <TabsContent value="contrat">
                    <div className="p-6">Contenu de la page Contrat à venir.</div>
                </TabsContent>
                <TabsContent value="historique">
                    <div className="p-6">Contenu de la page Historique Global à venir.</div>
                </TabsContent>
            </Tabs>
        </div>
    </div>
  )
}
