import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function PersonnelPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gestion du Personnel</h1>
      <Card>
        <CardHeader>
          <CardTitle>Employés Actuels</CardTitle>
          <CardDescription>
            Gérez les informations et les rôles des employés.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-8 text-center text-muted-foreground">
            Le tableau de gestion du personnel apparaîtra ici.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
