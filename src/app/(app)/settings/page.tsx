'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import React from 'react';

export default function SettingsPage() {
  const [workWeekMode, setWorkWeekMode] = React.useState('monday-sunday');

  const handleSave = () => {
    // In a real app, this would save to a database.
    console.log('Paramètres sauvegardés:', { workWeekMode });
    alert(`Mode de semaine de travail sauvegardé : ${workWeekMode}`);
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres Généraux</CardTitle>
          <CardDescription>
            Gérez les paramètres généraux de l'application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="work-week-mode">
                Mode de Comptage de la Semaine de Travail
              </Label>
              <Select
                value={workWeekMode}
                onValueChange={setWorkWeekMode}
              >
                <SelectTrigger id="work-week-mode">
                  <SelectValue placeholder="Sélectionner un mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday-sunday">Lundi - Dimanche</SelectItem>
                  <SelectItem value="sunday-saturday">
                    Dimanche - Samedi
                  </SelectItem>
                  <SelectItem value="saturday-friday">
                    Samedi - Vendredi
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button onClick={handleSave}>Enregistrer</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
