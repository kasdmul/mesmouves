'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Briefcase,
  Building,
  UserMinus,
  UserPlus,
  Users,
  TrendingDown,
} from 'lucide-react';
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
        if (
          d.getFullYear() === parseInt(parts[2], 10) &&
          d.getMonth() === parseInt(parts[1], 10) - 1 &&
          d.getDate() === parseInt(parts[0], 10)
        ) {
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

  const newHiresThisYear = React.useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();

    return store.employees.filter((employee) => {
      const hireDate = parseFlexibleDate(employee.dateEmbauche);
      if (!hireDate) return false;

      return hireDate.getFullYear() === currentYear;
    }).length;
  }, [store.employees]);

  const departuresThisYear = React.useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();

    return store.employees.filter((employee) => {
      if (employee.status !== 'Parti') return false;

      const departureDate = parseFlexibleDate(employee.dateDepart || '');
      if (!departureDate) return false;

      return departureDate.getFullYear() === currentYear;
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

  const { monthlyRate, yearlyRate } = React.useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    // Yearly calcs
    const activeEmployeesToday = store.employees.filter(
      (e) => e.status === 'Actif'
    ).length;

    const hiresThisYear = store.employees.filter((employee) => {
      const hireDate = parseFlexibleDate(employee.dateEmbauche);
      return hireDate && hireDate.getFullYear() === currentYear;
    }).length;

    const departuresThisYear = store.employees.filter((employee) => {
      if (employee.status !== 'Parti') return false;
      const departureDate = parseFlexibleDate(employee.dateDepart || '');
      return departureDate && departureDate.getFullYear() === currentYear;
    }).length;

    const employeesAtStartOfYear =
      activeEmployeesToday - hiresThisYear + departuresThisYear;
    const avgEmployeesYear =
      (employeesAtStartOfYear + activeEmployeesToday) / 2;
    const yearlyRate =
      avgEmployeesYear > 0 ? (departuresThisYear / avgEmployeesYear) * 100 : 0;

    // Monthly calcs
    const hiresThisMonth = store.employees.filter((employee) => {
      const hireDate = parseFlexibleDate(employee.dateEmbauche);
      return (
        hireDate &&
        hireDate.getFullYear() === currentYear &&
        hireDate.getMonth() === currentMonth
      );
    }).length;

    const departuresThisMonth = store.employees.filter((employee) => {
      if (employee.status !== 'Parti') return false;
      const departureDate = parseFlexibleDate(employee.dateDepart || '');
      return (
        departureDate &&
        departureDate.getFullYear() === currentYear &&
        departureDate.getMonth() === currentMonth
      );
    }).length;

    const employeesAtStartOfMonth =
      activeEmployeesToday - hiresThisMonth + departuresThisMonth;
    const avgEmployeesMonth =
      (employeesAtStartOfMonth + activeEmployeesToday) / 2;
    const monthlyRate =
      avgEmployeesMonth > 0
        ? (departuresThisMonth / avgEmployeesMonth) * 100
        : 0;

    return {
      monthlyRate: monthlyRate.toFixed(2),
      yearlyRate: yearlyRate.toFixed(2),
    };
  }, [store.employees]);

  return (
    <div className="flex flex-col gap-6">
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
            <div className="text-2xl font-bold">+{newHiresThisYear}</div>
            <p className="text-xs text-muted-foreground">Cette année</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Départs</CardTitle>
            <UserMinus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-{departuresThisYear}</div>
            <p className="text-xs text-muted-foreground">Cette année</p>
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

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taux de Rotation
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyRate}%</div>
            <p className="text-xs text-muted-foreground">Ce mois-ci</p>
            <div className="mt-4 text-2xl font-bold">{yearlyRate}%</div>
            <p className="text-xs text-muted-foreground">Cette année</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taux d'Attrition
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyRate}%</div>
            <p className="text-xs text-muted-foreground">Ce mois-ci</p>
            <div className="mt-4 text-2xl font-bold">{yearlyRate}%</div>
            <p className="text-xs text-muted-foreground">Cette année</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
