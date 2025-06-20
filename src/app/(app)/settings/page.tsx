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

export default function SettingsPage() {
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
              <Label htmlFor="work-week-mode">Mode de Comptage de la Semaine de Travail</Label>
              <Select defaultValue="monday-sunday">
                <SelectTrigger id="work-week-mode">
                  <SelectValue placeholder="Sélectionner un mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday-sunday">Lundi - Dimanche</SelectItem>
                  <SelectItem value="sunday-saturday">Dimanche - Samedi</SelectItem>
                  <SelectItem value="saturday-friday">Samedi - Vendredi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Enregistrer</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
