"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, LayoutDashboard, Users, Briefcase, Settings, Shield, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', label: 'Tableau de Bord', icon: LayoutDashboard },
  { href: '/dashboard/recruitment', label: 'Recrutement', icon: Users },
  { href: '/dashboard/personnel', label: 'Gestion du Personnel', icon: Briefcase },
  { href: '/dashboard/settings', label: 'Paramètres', icon: Settings },
  { href: '/dashboard/admin', label: 'Panneau Admin', icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r bg-card sm:flex">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Bot className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-semibold font-headline">RH Insights</h1>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navItems.map((item) => (
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
         <Button variant="ghost" className="w-full justify-start gap-3">
            <LogOut className="h-4 w-4" />
            Déconnexion
         </Button>
      </div>
    </aside>
  );
}
