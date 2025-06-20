
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast';
import { useRealtimeData } from '@/hooks/use-realtime-data';
import { useAuth } from '@/context/auth-context';
import type { UserData } from '@/context/auth-context';
import { db } from '@/lib/firebase/client';
import { doc, updateDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

type UserProfile = UserData & { id: string; };

export default function AdminPage() {
  const { toast } = useToast();
  const { user, userData: currentUserData } = useAuth();
  const { data: users, loading, error } = useRealtimeData<UserProfile>('users');

  const handleRoleChange = async (userId: string, newRole: 'user' | 'admin' | 'superadmin') => {
    if (!currentUserData || currentUserData.role !== 'superadmin') {
      toast({ variant: 'destructive', title: 'Permission refusée' });
      return;
    }

    if (userId === user?.uid) {
        toast({ variant: 'destructive', title: 'Action non autorisée', description: "Vous ne pouvez pas modifier votre propre rôle." });
        return;
    }
    
    const targetUser = users.find(u => u.id === userId);
    if (targetUser?.role === 'superadmin') {
        toast({ variant: 'destructive', title: 'Action non autorisée', description: "Le rôle d'un superadmin ne peut pas être modifié." });
        return;
    }

    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, { role: newRole });
      toast({ title: 'Succès', description: "Le rôle de l'utilisateur a été mis à jour." });
    } catch (e) {
      console.error("Error updating user role: ", e);
      toast({ variant: 'destructive', title: 'Erreur', description: "La mise à jour du rôle a échoué." });
    }
  };


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
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      <div className="flex justify-center items-center p-4">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                   <TableRow>
                        <TableCell colSpan={3} className="text-center text-destructive">
                            Erreur de chargement des données.
                        </TableCell>
                    </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      Aucun utilisateur trouvé.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>{u.displayName}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <Select
                          value={u.role}
                          onValueChange={(newRole: 'user' | 'admin' | 'superadmin') => handleRoleChange(u.id, newRole)}
                          disabled={currentUserData?.role !== 'superadmin' || u.id === user?.uid || u.role === 'superadmin'}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Changer le rôle" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">Utilisateur</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="superadmin">Superadmin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
