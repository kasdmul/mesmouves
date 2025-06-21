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

/**
 * Parses a date string from various common formats.
 * @param dateString The date string to parse.
 * @returns A Date object or null if parsing fails.
 */
function parseFlexibleDate(dateString: string): Date | null {
  if (!dateString) return null;

  try {
    // Try dd/MM/yyyy format first
    const parts = dateString.split('/');
    if (parts.length === 3) {
      // Note: month is 0-indexed in JS Date
      const d = new Date(
        parseInt(parts[2], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[0], 10)
      );
      if (!isNaN(d.getTime())) {
        // Check if the parsed date is valid for the given parts
        if (d.getFullYear() === parseInt(parts[2], 10) && d.getMonth() === parseInt(parts[1], 10) - 1 && d.getDate() === parseInt(parts[0], 10)) {
           return d;
        }
      }
    }
  } catch (e) {
    /* ignore parse error */
  }

  try {
    // Fallback for other formats like yyyy-MM-dd or native Date strings
    const d = new Date(dateString);
    if (!isNaN(d.getTime())) {
      return d;
    }
  } catch (e) {
    /* ignore parse error */
  }

  return null;
}

export default function DashboardPage() {
  useStore(); // Subscribe to store changes

  const totalEmployees = store.employees.filter(
    (e) => e.status === 'Actif'
  ).length;

  const newHiresThisMonth = React.useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    return store.employees.filter((employee) => {
      const hireDate = parseFlexibleDate(employee.dateEmbauche);
      if (!hireDate) return false;

      return (
        hireDate.getMonth() === currentMonth &&
        hireDate.getFullYear() === currentYear
      );
    }).length;
  }, [store.employees]);

  const departuresThisMonth = React.useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    return store.employees.filter((employee) => {
      if (employee.status !== 'Parti') return false;

      const departureDate = parseFlexibleDate(employee.dateDepart || '');
      if (!departureDate) return false;

      return (
        departureDate.getMonth() === currentMonth &&
        departureDate.getFullYear() === currentYear
      );
    }).length;
  }, [store.employees]);

  const openPositions = React.useMemo(() => {
    return store.candidates.filter(
      (c) => c.status === 'Nouveau' || c.status === 'Entretien'
    ).length;
  }, [store.candidates]);

  const totalDepartments = React.useMemo(() => {
    // Count unique, valid department names from active employees
    const departments = new Set(
      store.employees
        .filter((e) => e.status === 'Actif')
        .map((e) => e.departement)
        .filter((d) => d && d.trim() && d.trim() !== 'N/A')
    );
    return departments.size;
  }, [store.employees]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Employés Actifs
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEmployees}</div>
          <p className="text-xs text-muted-foreground">Statistique globale</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Nouvelles Recrues
          </CardTitle>
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
          <p className="text-xs text-muted-foreground">Ce mois-ci</p>
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
