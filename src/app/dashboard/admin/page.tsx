import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Panneau Admin</h1>
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Utilisateurs</CardTitle>
          <CardDescription>
            Gérez les comptes utilisateurs et les permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-8 text-center text-muted-foreground">
            Le panneau de gestion des utilisateurs apparaîtra ici.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
