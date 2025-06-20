"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartTooltipContent, ChartContainer, ChartTooltip } from '@/components/ui/chart';

const chartData = [
  { stage: 'Applied', count: 1250 },
  { stage: 'Screening', count: 620 },
  { stage: 'Interview', count: 310 },
  { stage: 'Offer', count: 95 },
  { stage: 'Hired', count: 32 },
];

const chartConfig = {
  count: {
    label: "Candidates",
    color: "hsl(var(--primary))",
  },
};

export function RecruitmentPipeline() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Recruitment Pipeline</CardTitle>
        <CardDescription>Current state of all active candidates.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart accessibilityLayer data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="stage" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} fontSize={12} />
              <ChartTooltip
                cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}
                content={<ChartTooltipContent />}
              />
              <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
