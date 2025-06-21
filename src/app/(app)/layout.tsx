'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Briefcase,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  Users,
  ArrowRightLeft,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';

const navItems = [
  { href: '/dashboard', label: 'Tableau de Bord', icon: LayoutDashboard },
  { href: '/recruitment', label: 'Recrutement', icon: Users },
  { href: '/personnel', label: 'Gestion du Personnel', icon: Briefcase },
  { href: '/mouvement', label: 'Mouvement', icon: ArrowRightLeft },
  { href: '/settings', label: 'Paramètres Généraux', icon: Settings },
  { href: '/admin', label: 'Panneau Admin', icon: Shield },
];

const pageTitles: { [key: string]: string } = {
  '/dashboard': 'Tableau de Bord',
  '/recruitment': 'Recrutement',
  '/personnel': 'Gestion du Personnel',
  '/mouvement': 'Mouvement',
  '/settings': 'Paramètres Généraux',
  '/admin': 'Panneau Admin',
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pageTitle = pageTitles[pathname] || 'Tableau de Bord';

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b">
          <h1 className="text-2xl font-semibold tracking-tight">RH Insights</h1>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2 border-t">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton variant="outline">
                <LogOut />
                <span>Déconnexion</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center justify-between border-b bg-card px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h2 className="text-xl font-semibold" id="currentTabTitle">
              {pageTitle}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  Changer le mot de passe
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Changer le mot de passe</DialogTitle>
                  <DialogDescription>
                    Mettez à jour votre mot de passe ici. Cliquez sur Enregistrer lorsque vous avez terminé.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="current-password"
                      className="text-right"
                    >
                      Actuel
                    </Label>
                    <Input
                      id="current-password"
                      type="password"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="new-password" className="text-right">
                      Nouveau
                    </Label>
                    <Input
                      id="new-password"
                      type="password"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Enregistrer</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="https://placehold.co/40x40.png"
                  alt="@user"
                  data-ai-hint="person"
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <span
                id="userDisplayName"
                className="text-sm font-medium hidden md:block"
              >
                Utilisateur
              </span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
