
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Briefcase,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  Users,
  ArrowRightLeft,
  PieChart,
  PanelLeft,
} from 'lucide-react';
import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useStore, notify } from '@/lib/store';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Tableau de Bord', icon: LayoutDashboard },
  { href: '/recruitment', label: 'Recrutement', icon: Users },
  { href: '/personnel', label: 'Gestion du Personnel', icon: Briefcase },
  { href: '/mouvement', label: 'Mouvement', icon: ArrowRightLeft },
  { href: '/reports', label: 'Rapports', icon: PieChart },
  { href: '/settings', label: 'Paramètres Généraux', icon: Settings, roles: ['superadmin', 'admin'] },
  { href: '/admin', label: 'Panneau Admin', icon: Shield, roles: ['superadmin', 'admin'] },
];

const pageTitles: { [key: string]: string } = {
  '/dashboard': 'Tableau de Bord',
  '/recruitment': 'Recrutement',
  '/personnel': 'Gestion du Personnel',
  '/mouvement': 'Mouvement',
  '/reports': 'Rapports',
  '/settings': 'Paramètres Généraux',
  '/admin': 'Panneau Admin',
};

function NavContent({ currentUser, onLogout }: { currentUser: any, onLogout: () => void }) {
  const pathname = usePathname();

  const accessibleNavItems = navItems.filter(item => {
    if (!item.roles) return true;
    if (!currentUser) return false;
    return item.roles.includes(currentUser.role);
  });

  return (
    <>
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Briefcase className="h-6 w-6" />
            <span>Gestion Carrière</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {accessibleNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  pathname.startsWith(item.href) && "bg-muted text-primary"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4 border-t">
            <Button variant="outline" className="w-full" onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
            </Button>
        </div>
      </div>
    </>
  );
}


export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { store, isLoaded } = useStore();
  const { currentUser } = store;
  const pageTitle = pageTitles[pathname] || 'Tableau de Bord';
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  React.useEffect(() => {
    if (isLoaded && !currentUser) {
      router.push('/login');
    }
  }, [isLoaded, currentUser, router]);

  const handleLogout = () => {
    store.currentUser = null;
    notify();
  };
  
  React.useEffect(() => {
    // Close sheet on navigation
    setIsSheetOpen(false);
  }, [pathname]);

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
            <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg text-muted-foreground">Chargement des données...</p>
        </div>
      </div>
    );
  }
  
  if (!currentUser) {
    return null;
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <NavContent currentUser={currentUser} onLogout={handleLogout} />
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
              <NavContent currentUser={currentUser} onLogout={handleLogout} />
            </SheetContent>
          </Sheet>
          
          <div className="w-full flex-1">
             <h1 className="text-xl font-semibold">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="https://placehold.co/40x40.png"
                  alt="@user"
                  data-ai-hint="person"
                />
                <AvatarFallback>{currentUser?.name.charAt(0) ?? 'U'}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden md:block">
                {currentUser?.name ?? 'Utilisateur'}
              </span>
            </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
