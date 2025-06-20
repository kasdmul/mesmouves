'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Briefcase, Building, UserMinus, UserPlus, Users } from 'lucide-react';
import { useStore, store } from '@/lib/store';

export default function DashboardPage() {
  useStore(); // Subscribe to store changes

  const totalEmployees = store.employees.length;

  const newHiresThisMonth = React.useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    return store.employees.filter(employee => {
      if (!employee.dateEmbauche) return false;
      try {
        const parts = employee.dateEmbauche.split('/');
        // Month is 1-based in the string, but 0-based in Date constructor
        const hireDate = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
        return !isNaN(hireDate.getTime()) && hireDate.getMonth() === currentMonth && hireDate.getFullYear() === currentYear;
      } catch (e) {
        return false;
      }
    }).length;
  }, [store.employees]);

  // As there is no employee departure tracking, we use rejected candidates this month as a proxy.
  const departuresThisMonth = React.useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    return store.candidates.filter(candidate => {
      if (candidate.status !== 'Rejeté' || !candidate.appliedDate) return false;
      try {
        // 'yyyy-MM-dd' format is directly parseable by new Date()
        const appliedDate = new Date(candidate.appliedDate);
        return !isNaN(appliedDate.getTime()) && appliedDate.getMonth() === currentMonth && appliedDate.getFullYear() === currentYear;
      } catch (e) {
        return false;
      }
    }).length;
  }, [store.candidates]);

  const openPositions = React.useMemo(() => {
    return store.candidates.filter(
      (c) => c.status === 'Nouveau' || c.status === 'Entretien'
    ).length;
  }, [store.candidates]);
  
  const totalDepartments = React.useMemo(() => {
    // Count unique, valid department names
    const departments = new Set(store.employees.map(e => e.departement).filter(d => d && d.trim() && d.trim() !== 'N/A'));
    return departments.size;
  }, [store.employees]);


  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Employés</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEmployees}</div>
          <p className="text-xs text-muted-foreground">Statistique globale</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nouvelles Recrues</CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{newHiresThisMonth}</div>
          <p className="text-xs text-muted-foreground">Ce mois-ci</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Départs</CardTitle>
          <UserMinus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">-{departuresThisMonth}</div>
          <p className="text-xs text-muted-foreground">Candidats rejetés ce mois-ci</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Postes Ouverts</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{openPositions}</div>
          <p className="text-xs text-muted-foreground">Recrutement en cours</p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Départements</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalDepartments}</div>
          <p className="text-xs text-muted-foreground">Nombre total</p>
        </CardContent>
      </Card>
    </div>
  );
}
