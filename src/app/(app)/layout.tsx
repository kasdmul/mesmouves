
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
  PieChart,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { useStore } from '@/lib/store';

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

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { currentUser } = useStore();
  const pageTitle = pageTitles[pathname] || 'Tableau de Bord';

  const accessibleNavItems = navItems.filter(item => {
    if (!item.roles) return true; // public item
    if (!currentUser) return false; // if no user, hide role-based item
    return item.roles.includes(currentUser.role);
  });

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b">
          <h1 className="text-2xl font-semibold tracking-tight">RH Insights</h1>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {accessibleNavItems.map((item) => (
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
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="https://placehold.co/40x40.png"
                  alt="@user"
                  data-ai-hint="person"
                />
                <AvatarFallback>{currentUser?.name.charAt(0) ?? 'U'}</AvatarFallback>
              </Avatar>
              <span
                id="userDisplayName"
                className="text-sm font-medium hidden md:block"
              >
                {currentUser?.name ?? 'Utilisateur'}
              </span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
