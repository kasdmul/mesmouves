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
} from 'lucide-react';
import { useRef, type ChangeEvent } from 'react';
import Papa from 'papaparse';

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
  { href: '/settings', label: 'Paramètres Généraux', icon: Settings },
  { href: '/admin', label: 'Panneau Admin', icon: Shield },
];

const pageTitles: { [key: string]: string } = {
  '/dashboard': 'Tableau de Bord',
  '/recruitment': 'Recrutement',
  '/personnel': 'Gestion du Personnel',
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
  const csvInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    csvInputRef.current?.click();
  };

  const handleFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          console.log(`Données CSV importées pour ${pathname}:`, results.data);
          if (pathname.includes('/recruitment')) {
            alert(`Importation de ${results.data.length} candidats réussie (voir console).`);
            // In a real app, you would pass this data to the recruitment page state.
          } else if (pathname.includes('/personnel')) {
            alert(`Importation de ${results.data.length} employés réussie (voir console).`);
            // In a real app, you would pass this data to the personnel page state.
          } else {
            alert("L'importation CSV n'est disponible que sur les pages Recrutement et Personnel.");
          }
        },
        error: (error) => {
          console.error("Erreur d'analyse CSV:", error);
          alert("Une erreur est survenue lors de l'analyse du fichier CSV.");
        }
      });
    }
  };

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
                <Link href={item.href} passHref legacyBehavior>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href)}
                  >
                    <a>
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
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
            <Button
              size="sm"
              className="hidden sm:flex"
              onClick={handleImportClick}
            >
              Importer CSV
            </Button>
            <input
              type="file"
              id="csvFileInput"
              ref={csvInputRef}
              accept=".csv"
              onChange={handleFileSelected}
              className="hidden"
            />
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
