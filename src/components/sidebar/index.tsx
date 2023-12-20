import {
  BookOpen,
  CreditCard,
  FolderOpen,
  PieChart,
  Rocket,
  UserSquare,
} from 'lucide-react';
import { AvatarPopover } from './avatar';
import { SidebarLink } from './sidebar-link';

export const Sidebar = () => {
  return (
    <aside className="min-w-64 border-r border-input px-4 py-8 space-y-6 h-screen sticky top-0">
      <AvatarPopover />

      <section>
        <h2 className="text-base text-muted-foreground px-4 py-2">Dashboards</h2>
        <nav>
          <SidebarLink href="/dash">
            <PieChart className="inline mr-4" />
            Início
          </SidebarLink>
          <SidebarLink href="/dash/campaigns">
            <FolderOpen className="inline mr-4" />
            Campanhas
          </SidebarLink>
          <SidebarLink href="/dash/requests">
            <Rocket className="inline mr-4" />
            Requisições
          </SidebarLink>
          <SidebarLink href="/docs">
            <BookOpen className="inline mr-4" />
            Documentação
          </SidebarLink>
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
