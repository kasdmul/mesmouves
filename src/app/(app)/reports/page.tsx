
'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

const chartConfig = {
  Homme: {
    label: 'Hommes',
    color: 'hsl(var(--primary))',
  },
  Femme: {
    label: 'Femmes',
    color: 'hsl(var(--accent))',
  },
} satisfies ChartConfig;

const aggregateDataByDimension = (dimension: 'entite' | 'departement' | 'lieuTravail') => {
  const activeEmployees = store.employees.filter(e => e.status === 'Actif');
  
  const aggregation = activeEmployees.reduce((acc, employee) => {
    const key = employee[dimension];
    if (key && key !== 'N/A') {
      if (!acc[key]) {
        acc[key] = { name: key, Homme: 0, Femme: 0 };
      }
      if (employee.sexe === 'Homme') {
        acc[key].Homme += 1;
      } else if (employee.sexe === 'Femme') {
        acc[key].Femme += 1;
      }
    }
    return acc;
  }, {} as Record<string, { name: string; Homme: number; Femme: number }>);

  return Object.values(aggregation).sort((a,b) => a.name.localeCompare(b.name));
};

export default function ReportsPage() {
  useStore();

  const dataByEntity = React.useMemo(() => aggregateDataByDimension('entite'), [store.employees]);
  const dataByDepartment = React.useMemo(() => aggregateDataByDimension('departement'), [store.employees]);
  const dataByWorkLocation = React.useMemo(() => aggregateDataByDimension('lieuTravail'), [store.employees]);

  const renderChart = (data: typeof dataByEntity, title: string, description: string) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        {data.length > 0 ? (
          <div className="h-[350px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart data={data} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={80}
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
                  dataKey="Homme"
                  fill="var(--color-Homme)"
                  radius={[4, 4, 0, 0]}
                  stackId="a"
                />
                <Bar
                  dataKey="Femme"
                  fill="var(--color-Femme)"
                  radius={[4, 4, 0, 0]}
                  stackId="a"
                />
              </BarChart>
            </ChartContainer>
          </div>
        ) : (
          <div className="h-[350px] flex items-center justify-center">
            <p className="text-muted-foreground">Aucune donnée disponible pour ce rapport.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      {renderChart(dataByEntity, 'Répartition par Entité', 'Nombre d\'employés par entité, ventilé par sexe.')}
      {renderChart(dataByDepartment, 'Répartition par Département', 'Nombre d\'employés par département, ventilé par sexe.')}
      <div className="xl:col-span-2">
        {renderChart(dataByWorkLocation, 'Répartition par Lieu de Travail', 'Nombre d\'employés par lieu de travail, ventilé par sexe.')}
      </div>
    </div>
  );
}
