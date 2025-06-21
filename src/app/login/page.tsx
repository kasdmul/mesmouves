
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { store, notify, useStore, type User } from '@/lib/store';
import { useRouter } from 'next/navigation';
import React from 'react';

function CreateSuperAdmin() {
  const router = useRouter();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert('Veuillez remplir tous les champs.');
      return;
    }
    const newUser: User = {
      name,
      email,
      password,
      role: 'superadmin',
    };
    store.users.push(newUser);
    store.currentUser = newUser;
    notify();
    router.push('/dashboard');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Créer le Compte Super Administrateur</CardTitle>
        <CardDescription>
          Aucun utilisateur n'existe. Veuillez créer le premier compte pour commencer.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="superadmin-name">Nom complet</Label>
            <Input
              id="superadmin-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="superadmin-email">Email</Label>
            <Input
              id="superadmin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="superadmin-password">Mot de passe</Label>
            <Input
              id="superadmin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Créer le compte
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { users, currentUser } = useStore();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  React.useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (currentUser) {
      router.push('/dashboard');
    }
  }, [currentUser, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      store.currentUser = user;
      notify();
      router.push('/dashboard');
    } else {
      alert('Email ou mot de passe incorrect.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      {users.length === 0 ? (
        <CreateSuperAdmin />
      ) : (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Connexion</CardTitle>
            <CardDescription>
              Entrez votre email ci-dessous pour vous connecter à votre compte.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Se connecter
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
