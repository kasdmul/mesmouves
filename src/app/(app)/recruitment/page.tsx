import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function RecruitmentPage() {
  const candidates = [
    {
      name: 'Jean Dupont',
      position: 'Développeur Frontend',
      status: 'Entretien',
      appliedDate: '2023-10-26',
    },
    {
      name: 'Marie Curie',
      position: 'Chef de projet',
      status: 'Offre envoyée',
      appliedDate: '2023-10-22',
    },
    {
      name: 'Pierre Martin',
      position: 'Designer UI/UX',
      status: 'Nouveau',
      appliedDate: '2023-11-01',
    },
    {
      name: 'Sophie Lambert',
      position: 'Data Scientist',
      status: 'Rejeté',
      appliedDate: '2023-10-15',
    },
  ];

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'Offre envoyée':
        return 'default';
      case 'Entretien':
        return 'secondary';
      case 'Nouveau':
        return 'outline';
      case 'Rejeté':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Recrutement</CardTitle>
            <CardDescription>
              Gérez les candidats tout au long du processus de recrutement.
            </CardDescription>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter un Candidat
          </Button>
        </div>
        <div className="relative mt-4 w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher des candidats..." className="pl-8" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead className="hidden md:table-cell">Poste</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="hidden sm:table-cell">Date de Candidature</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.map((candidate) => (
                <TableRow key={candidate.name}>
                  <TableCell className="font-medium">{candidate.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{candidate.position}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(candidate.status)}>
                      {candidate.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{candidate.appliedDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
