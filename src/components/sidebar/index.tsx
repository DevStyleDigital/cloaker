'use client';
import {
  BookOpen,
  FolderOpen,
  PieChart,
  Rocket,
  ShieldHalf,
  UserSquare,
} from 'lucide-react';
import { SidebarLink } from './sidebar-link';
import { useAuth } from 'context/auth';
import { GhostLogo } from 'assets/svgs/logos/ghost';

export const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-background border-r border-input px-4 py-8 space-y-4 h-screen fixed top-0 left-0">
      <div className="flex items-end gap-2">
        <GhostLogo className="w-24 h-auto" />
        <span className="sr-only">Ghost</span>
      </div>

      <section>
        <h2 className="text-base text-muted-foreground px-4 py-2">Dashboards</h2>
        <nav className={!user?.subscription ? 'cursor-not-allowed' : undefined}>
          <SidebarLink disabled={!user?.subscription} href="/dash">
            <PieChart className="inline mr-4" />
            Início
          </SidebarLink>
          <SidebarLink disabled={!user?.subscription} href="/dash/campaigns">
            <FolderOpen className="inline mr-4" />
            Campanhas
          </SidebarLink>
          <SidebarLink disabled={!user?.subscription} href="/dash/requests">
            <Rocket className="inline mr-4" />
            Requisições
          </SidebarLink>
          <SidebarLink disabled={!user?.subscription} href="/docs">
            <BookOpen className="inline mr-4" />
            Documentação
          </SidebarLink>
          {user?.subscription === process.env.NEXT_PUBLIC_ADMIN_ROLE ? (
            <SidebarLink href="/dash/admin">
              <ShieldHalf className="inline mr-4" />
              Admin
            </SidebarLink>
          ) : null}
        </nav>
      </section>
      <section>
        <h2 className="text-base text-muted-foreground px-4 py-2">Usuário</h2>
        <nav>
          <SidebarLink href="/dash/account">
            <UserSquare className="inline mr-4" />
            Perfil
          </SidebarLink>
        </nav>
      </section>
    </aside>
  );
};
