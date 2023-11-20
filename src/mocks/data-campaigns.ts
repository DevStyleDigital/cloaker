import { Facebook } from 'assets/svgs/logos/facebook';
import { Google } from 'assets/svgs/logos/google';
import { Instragram } from 'assets/svgs/logos/instagram';
import { FolderOpen, Rocket, TrendingUp } from 'lucide-react';

export const campaignsMonthlyDetails = [
  {
    id: '1',
    title: 'Total de Campanhas',
    label: '3',
    icon: FolderOpen,
  },
  {
    id: '2',
    title: 'Campanhas Ativas',
    label: '2',
    icon: TrendingUp,
  },
  {
    id: '3',
    title: 'Média Requisições por Campanha',
    label: '156mil',
    icon: Rocket,
  },
];

export const campaigns = [
  {
    id: '1',
    status: 'active',
    name: 'Nome da Campanha',
    created_at: new Date(),
    icon: Google,
    request_total: '10mil',
  },
  {
    id: '2',
    status: 'active',
    name: 'Nome da Campanha',
    created_at: new Date(),
    icon: Instragram,
    request_total: '10mil',
  },
  {
    id: '3',
    status: 'inactive',
    name: 'Nome da Campanha',
    created_at: new Date(),
    icon: Facebook,
    request_total: '10mil',
  },
];
