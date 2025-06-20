import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function RecruitmentPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Recrutement</h1>
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Candidats</CardTitle>
          <CardDescription>
            Ajoutez, recherchez et gérez les candidats ici.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher des candidats..." className="pl-8" />
            </div>
            <Button>Ajouter un Candidat</Button>
          </div>
          <div className="border rounded-lg p-8 text-center text-muted-foreground">
            Le tableau des candidats apparaîtra ici.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
