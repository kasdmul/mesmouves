import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Paramètres Généraux</h1>
      <Card>
        <CardHeader>
          <CardTitle>Paramètres de l'Application</CardTitle>
          <CardDescription>
            Configurez les paramètres généraux de l'application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-8 text-center text-muted-foreground">
            Les options de paramètres apparaîtront ici.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
