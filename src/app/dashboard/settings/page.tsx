'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
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
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase/client';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useAuth } from '@/context/auth-context';
import { Loader2 } from 'lucide-react';

type AppSettings = {
  workWeekMode: 'sunday_first' | 'monday_first';
};

export default function SettingsPage() {
  const { toast } = useToast();
  const { userData } = useAuth();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    const settingsDocRef = doc(db, 'appSettings', 'config');
    const unsubscribe = onSnapshot(settingsDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as AppSettings);
      } else {
        // Default settings if document doesn't exist
        setSettings({ workWeekMode: 'monday_first' });
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching settings:", error);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les paramètres.' });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const handleModeChange = async (newMode: 'sunday_first' | 'monday_first') => {
    if (userData?.role !== 'superadmin') {
      toast({ variant: 'destructive', title: 'Permission refusée' });
      return;
    }
    if (!db) return;

    try {
      const settingsDocRef = doc(db, 'appSettings', 'config');
      await setDoc(settingsDocRef, { workWeekMode: newMode }, { merge: true });
      toast({ title: 'Succès', description: 'Le paramètre a été mis à jour.' });
    } catch (e) {
      console.error("Error updating settings: ", e);
      toast({ variant: 'destructive', title: 'Erreur', description: 'La mise à jour a échoué.' });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Paramètres Généraux</h1>
      <Card>
        <CardHeader>
          <CardTitle>Paramètres de l'Application</CardTitle>
          <CardDescription>
            Configurez les paramètres généraux de l'application. Cette section est réservée aux super-administrateurs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="max-w-md space-y-4">
               <div className="flex items-center justify-between">
                 <Label htmlFor="work-week-mode" className="font-medium">
                   Mode de Comptage de la Semaine de Travail
                 </Label>
                 <Select
                   value={settings?.workWeekMode || 'monday_first'}
                   onValueChange={(value: 'sunday_first' | 'monday_first') => handleModeChange(value)}
                   disabled={userData?.role !== 'superadmin'}
                 >
                   <SelectTrigger id="work-week-mode" className="w-[200px]">
                     <SelectValue placeholder="Sélectionner le mode" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="monday_first">Lundi-Dimanche</SelectItem>
                     <SelectItem value="sunday_first">Dimanche-Samedi</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
