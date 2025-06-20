"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bot, LayoutDashboard, Users, Briefcase, Settings, Shield, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';

const navItems = [
  { href: '/dashboard', label: 'Tableau de Bord', icon: LayoutDashboard, roles: ['user', 'admin', 'superadmin'] },
  { href: '/dashboard/recruitment', label: 'Recrutement', icon: Users, roles: ['user', 'admin', 'superadmin'] },
  { href: '/dashboard/personnel', label: 'Gestion du Personnel', icon: Briefcase, roles: ['admin', 'superadmin'] },
  { href: '/dashboard/settings', label: 'Paramètres', icon: Settings, roles: ['superadmin'] },
  { href: '/dashboard/admin', label: 'Panneau Admin', icon: Shield, roles: ['superadmin'] },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { userData, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
      toast({
        title: 'Déconnexion réussie',
        description: 'Vous avez été déconnecté.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de se déconnecter. Veuillez réessayer.',
      });
    }
  };
  
  const userRole = userData?.role || 'user';

  return (
    <aside className="hidden w-64 flex-col border-r bg-card sm:flex">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Bot className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-semibold font-headline">RH Insights</h1>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navItems.filter(item => item.roles.includes(userRole)).map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              (pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))) && "bg-accent text-accent-foreground hover:text-accent-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto p-4">
         <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            Déconnexion
         </Button>
      </div>
    </aside>
  );
}
