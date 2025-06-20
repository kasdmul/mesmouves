
'use client';

import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  typeContrat: string;
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

type ContractChange = {
  date: string;
  matricule: string;
  noms: string;
  ancienneValeur: string;
  nouvelleValeur: string;
  motif: string;
};

const initialEmployees: Employee[] = [
  { matricule: '21072', noms: 'John TSHIAMALA', departement: 'Ventes', salaire: 3000, poste: 'Manager', typeContrat: 'CDI' },
  { matricule: 'E001', noms: 'Alice Bernard', departement: 'Marketing', salaire: 2800, poste: 'Spécialiste Marketing', typeContrat: 'CDI' },
  { matricule: 'E002', noms: 'Bob Leclerc', departement: 'Ingénierie', salaire: 3500, poste: 'Développeur Senior', typeContrat: 'CDI' },
  { matricule: '20055', noms: 'Trish KALOMBOLA', departement: 'Finance', salaire: 4500, poste: 'Directeur Financier', typeContrat: 'CDI' },
  { matricule: '22105', noms: 'Bernard BEYA', departement: 'Finance', salaire: 4000, poste: 'Comptable', typeContrat: 'CDI' },
];

const initialSalaryHistory: SalaryChange[] = [
  { date: '20/06/2025', matricule: '21072', noms: 'John TSHIAMALA', ancienneValeur: 3000, nouvelleValeur: 3500, motif: 'ajustement salaire' },
];

const initialFunctionHistory: FunctionChange[] = [
  { date: '20/06/2025', matricule: '20055', noms: 'Trish KALOMBOLA', ancienneValeur: 'Directeur Financier', nouvelleValeur: 'chief driver', motif: 'promotion' },
];

const initialContractHistory: ContractChange[] = [
  { date: '20/06/2025', matricule: '22105', noms: 'Bernard BEYA', ancienneValeur: 'CDI', nouvelleValeur: 'CDD', motif: 'pas de motif (Département de "Finance" vers "Comm' },
];

function SalaryChangeContent() {
  const [employees, setEmployees] = React.useState<Employee[]>(initialEmployees);
  const [history, setHistory] = React.useState<SalaryChange[]>(initialSalaryHistory);
  const [selectedMatricule, setSelectedMatricule] = React.useState<string | undefined>();
  
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [newSalary, setNewSalary] = React.useState('');
  const [reason, setReason] = React.useState('');
  const [newDepartment, setNewDepartment] = React.useState('');

  const selectedEmployee = employees.find(e => e.matricule === selectedMatricule);

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
    setHistory(prev => [newChange, ...prev]);

    setEmployees(prev =>
      prev.map(emp =>
        emp.matricule === selectedEmployee.matricule
          ? { ...emp, salaire: newSalaryValue, departement: newDepartment || emp.departement }
          : emp
      )
    );

    // Réinitialiser les champs
    setSelectedMatricule(undefined);
    setDate(new Date());
    setNewSalary('');
    setReason('');
    setNewDepartment('');
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
          <CardTitle>Historique des Changements de Salaire</CardTitle>
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
  
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [newFunction, setNewFunction] = React.useState('');
  const [reason, setReason] = React.useState('');
  const [newDepartment, setNewDepartment] = React.useState('');

  const selectedEmployee = employees.find(e => e.matricule === selectedMatricule);

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
    setHistory(prev => [newChange, ...prev]);

    setEmployees(prev =>
      prev.map(emp =>
        emp.matricule === selectedEmployee.matricule
          ? { ...emp, poste: newFunction, departement: newDepartment || emp.departement }
          : emp
      )
    );

    // Réinitialiser les champs
    setSelectedMatricule(undefined);
    setDate(new Date());
    setNewFunction('');
    setReason('');
    setNewDepartment('');
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
          <CardTitle>Historique des Changements de Fonction</CardTitle>
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

function ContractChangeContent() {
  const [employees, setEmployees] = React.useState<Employee[]>(initialEmployees);
  const [history, setHistory] = React.useState<ContractChange[]>(initialContractHistory);
  const [selectedMatricule, setSelectedMatricule] = React.useState<string | undefined>();
  
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [newContractType, setNewContractType] = React.useState<string | undefined>();
  const [reason, setReason] = React.useState('');
  const [newDepartment, setNewDepartment] = React.useState('');

  const selectedEmployee = employees.find(e => e.matricule === selectedMatricule);

  const handleApplyChange = () => {
    if (!selectedEmployee || !newContractType || !reason || !date) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    let finalMotif = reason;
    if (newDepartment && newDepartment !== selectedEmployee.departement) {
        finalMotif += ` (Département de "${selectedEmployee.departement}" vers "${newDepartment}")`;
    }

    const newChange: ContractChange = {
      date: format(date, 'dd/MM/yyyy'),
      matricule: selectedEmployee.matricule,
      noms: selectedEmployee.noms,
      ancienneValeur: selectedEmployee.typeContrat,
      nouvelleValeur: newContractType,
      motif: finalMotif,
    };
    
    setHistory(prev => [newChange, ...prev]);

    setEmployees(prev =>
      prev.map(emp =>
        emp.matricule === selectedEmployee.matricule
          ? { ...emp, typeContrat: newContractType, departement: newDepartment || emp.departement }
          : emp
      )
    );

    // Réinitialiser les champs
    setSelectedMatricule(undefined);
    setDate(new Date());
    setNewContractType(undefined);
    setReason('');
    setNewDepartment('');
  };

  return (
    <div className="space-y-8 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            <span>Changement de Contrat</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <h3 className="text-lg font-medium">Appliquer un Changement</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="employee-select-contract">Sélectionner Employé</Label>
              <Select value={selectedMatricule} onValueChange={setSelectedMatricule}>
                <SelectTrigger id="employee-select-contract">
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
              <Label htmlFor="noms-contract">Noms</Label>
              <Input id="noms-contract" value={selectedEmployee?.noms || ''} className="bg-gray-100" readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="change-date-contract">Date de l'application du changement</Label>
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
              <Label htmlFor="current-contract">Type de Contrat Actuel</Label>
              <Input id="current-contract" value={selectedEmployee?.typeContrat || ''} className="bg-gray-100" readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-contract-type">Nouveau Type de Contrat</Label>
              <Select value={newContractType} onValueChange={setNewContractType}>
                <SelectTrigger id="new-contract-type">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CDI">CDI</SelectItem>
                  <SelectItem value="CDD">CDD</SelectItem>
                  <SelectItem value="Stage">Stage</SelectItem>
                  <SelectItem value="Alternance">Alternance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason-contract">Motif du Changement</Label>
              <Input id="reason-contract" placeholder="Motif du Changement" value={reason} onChange={e => setReason(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-department-contract">Nouveau Département (si applicable)</Label>
              <Input id="new-department-contract" placeholder={selectedEmployee?.departement || ''} value={newDepartment} onChange={e => setNewDepartment(e.target.value)} />
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

type GlobalHistoryItem = {
  date: string;
  matricule: string;
  noms: string;
  type: string;
  ancienneValeur: string | number;
  nouvelleValeur: string | number;
  motif: string;
};

function GlobalHistoryContent() {
  const [history, setHistory] = React.useState<GlobalHistoryItem[]>([]);

  React.useEffect(() => {
    const salaryHistory = initialSalaryHistory.map(item => ({
      ...item,
      type: 'Changement de Salaire',
    }));

    const functionHistory = initialFunctionHistory.map(item => ({
      ...item,
      type: 'Changement de Fonction',
    }));

    const contractHistory = initialContractHistory.map(item => ({
      ...item,
      type: 'Changement de Contrat',
    }));
    
    const allHistory = [...salaryHistory, ...functionHistory, ...contractHistory]
      .sort((a, b) => {
        const dateA = new Date(a.date.split('/').reverse().join('-')).getTime();
        const dateB = new Date(b.date.split('/').reverse().join('-')).getTime();
        return dateB - dateA;
      });

    setHistory(allHistory as GlobalHistoryItem[]);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value) + ' $US';
  }

  const formatValue = (value: string | number, type: string) => {
    if (type === 'Changement de Salaire' && typeof value === 'number') {
      return formatCurrency(value);
    }
    return value;
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Historique Global des Mouvements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>DATE</TableHead>
                <TableHead>MATRICULE</TableHead>
                <TableHead>NOMS</TableHead>
                <TableHead>TYPE DE MOUVEMENT</TableHead>
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
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{formatValue(item.ancienneValeur, item.type)}</TableCell>
                  <TableCell>{formatValue(item.nouvelleValeur, item.type)}</TableCell>
                  <TableCell>{item.motif}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}


export default function SalaryPageContainer() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/recruitment">
            <Plus className="mr-2 h-4 w-4" />
            Recrutement
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="historique" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="salaire">
            <Landmark className="mr-2 h-4 w-4" />
            Salaire
          </TabsTrigger>
          <TabsTrigger value="fonction">
            <Briefcase className="mr-2 h-4 w-4" />
            Fonction
          </TabsTrigger>
          <TabsTrigger value="contrat">
            <FileText className="mr-2 h-4 w-4" />
            Contrat
          </TabsTrigger>
          <TabsTrigger value="historique">
            <History className="mr-2 h-4 w-4" />
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
          <ContractChangeContent />
        </TabsContent>
        <TabsContent value="historique">
          <GlobalHistoryContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
