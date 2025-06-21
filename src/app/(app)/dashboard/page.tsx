
'use client';

import React from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Briefcase,
  Building,
  UserMinus,
  UserPlus,
  Users,
  Percent,
} from 'lucide-react';
import { useStore, store } from '@/lib/store';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';

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

const chartConfig = {
  Entrées: {
    label: 'Entrées',
    color: 'hsl(var(--primary))',
  },
  Sorties: {
    label: 'Sorties',
    color: 'hsl(var(--destructive))',
  },
} satisfies ChartConfig;

export default function DashboardPage() {
  useStore(); // Subscribe to store changes

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const totalEmployees = store.employees.filter(
    (e) => e.status === 'Actif'
  ).length;

  const newHiresThisYear = React.useMemo(() => {
    return store.employees.filter((employee) => {
      const hireDate = parseFlexibleDate(employee.dateEmbauche);
      if (!hireDate) return false;
      return hireDate.getFullYear() === currentYear;
    }).length;
  }, [store.employees, currentYear]);

  const departuresThisYear = React.useMemo(() => {
    return store.employees.filter((employee) => {
      if (employee.status !== 'Parti') return false;
      const departureDate = parseFlexibleDate(employee.dateDepart || '');
      if (!departureDate) return false;
      return departureDate.getFullYear() === currentYear;
    }).length;
  }, [store.employees, currentYear]);

  const employeesAtStartOfYear =
    totalEmployees - newHiresThisYear + departuresThisYear;
  const averageEmployeesYear = (employeesAtStartOfYear + totalEmployees) / 2;
  const turnoverRateYearly =
    averageEmployeesYear > 0
      ? (departuresThisYear / averageEmployeesYear) * 100
      : 0;

  const newHiresThisMonth = React.useMemo(() => {
    return store.employees.filter((employee) => {
      const hireDate = parseFlexibleDate(employee.dateEmbauche);
      if (!hireDate) return false;
      return (
        hireDate.getFullYear() === currentYear &&
        hireDate.getMonth() === currentMonth
      );
    }).length;
  }, [store.employees, currentYear, currentMonth]);

  const departuresThisMonth = React.useMemo(() => {
    return store.employees.filter((employee) => {
      if (employee.status !== 'Parti') return false;
      const departureDate = parseFlexibleDate(employee.dateDepart || '');
      if (!departureDate) return false;
      return (
        departureDate.getFullYear() === currentYear &&
        departureDate.getMonth() === currentMonth
      );
    }).length;
  }, [store.employees, currentYear, currentMonth]);

  const employeesAtStartOfMonth =
    totalEmployees - newHiresThisMonth + departuresThisMonth;
  const averageEmployeesMonth = (employeesAtStartOfMonth + totalEmployees) / 2;
  const turnoverRateMonthly =
    averageEmployeesMonth > 0
      ? (departuresThisMonth / averageEmployeesMonth) * 100
      : 0;

  const openPositions = React.useMemo(() => {
    return store.candidates.filter(
      (c) => c.status === 'Nouveau' || c.status === 'Entretien'
    ).length;
  }, [store.candidates]);

  const totalDepartments = React.useMemo(() => {
    const departments = new Set(
      store.employees
        .filter((e) => e.status === 'Actif')
        .map((e) => e.departement)
        .filter((d) => d && d.trim() && d.trim() !== 'N/A')
    );
    return departments.size;
  }, [store.employees]);

  const monthlyMovements = React.useMemo(() => {
    const monthNames = [
      'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
      'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc',
    ];

    const data = monthNames.map((month) => ({
      name: month,
      Entrées: 0,
      Sorties: 0,
    }));

    store.employees.forEach((employee) => {
      const hireDate = parseFlexibleDate(employee.dateEmbauche);
      if (hireDate && hireDate.getFullYear() === currentYear) {
        const monthIndex = hireDate.getMonth();
        if (data[monthIndex]) {
          data[monthIndex]['Entrées'] += 1;
        }
      }

      if (employee.status === 'Parti') {
        const departureDate = parseFlexibleDate(employee.dateDepart || '');
        if (departureDate && departureDate.getFullYear() === currentYear) {
          const monthIndex = departureDate.getMonth();
          if (data[monthIndex]) {
            data[monthIndex]['Sorties'] += 1;
          }
        }
      }
    });

    return data.slice(0, today.getMonth() + 1);
  }, [store.employees, currentYear]);

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
        <Link href="/recruitment">
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Postes Ouverts
              </CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openPositions}</div>
              <p className="text-xs text-muted-foreground">
                Cliquez pour voir les recrutements
              </p>
            </CardContent>
          </Card>
        </Link>
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
              Taux de Rotation (Annuel)
            </CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {turnoverRateYearly.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Basé sur les départs de cette année
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taux de Rotation (Mensuel)
            </CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {turnoverRateMonthly.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">Pour le mois en cours</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mouvements de Personnel (Cette Année)</CardTitle>
            <CardDescription>
              Graphique des entrées et sorties mensuelles.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="h-[300px]">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <BarChart data={monthlyMovements} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    allowDecimals={false}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Legend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="Entrées"
                    fill="var(--color-Entrées)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="Sorties"
                    fill="var(--color-Sorties)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
