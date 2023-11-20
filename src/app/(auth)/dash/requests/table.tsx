'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Button } from 'components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'components/ui/table';
import Link from 'next/link';
import Image from 'next/image';
import { flagApi } from 'utils/flag-api';
import { Eye } from 'lucide-react';

const data = [
  {
    id: '1',
    created_at: '1 dia',
    status: true,
    campanha: 'Nome Campanha 1',
    pagina_destino: 'https://pagina.com.br',
    ip: '111.111.1.1',
    dispositivo: 'smartphone',
    pais: 'BR',
    dominio: 'pagina.com.br',
    provedor: 'Provedor',
    sistema: 'iOS',
  },
  {
    id: '2',
    created_at: '1 dia',
    status: true,
    campanha: 'Nome Campanha 2',
    pagina_destino: 'https://pagina.com.br',
    ip: '111.111.1.1',
    dispositivo: 'smartphone',
    pais: 'BR',
    dominio: 'pagina.com.br',
    provedor: 'Provedor',
    sistema: 'iOS',
  },
  {
    id: '3',
    created_at: '1 dia',
    status: true,
    campanha: 'Nome Campanha 3',
    pagina_destino: 'https://pagina.com.br',
    ip: '111.111.1.1',
    dispositivo: 'smartphone',
    pais: 'BR',
    dominio: 'pagina.com.br',
    provedor: 'Provedor',
    sistema: 'iOS',
  },
  {
    id: '4',
    created_at: '1 dia',
    status: false,
    campanha: 'Nome Campanha 4',
    pagina_destino: 'https://pagina.com.br',
    ip: '111.111.1.1',
    dispositivo: 'smartphone',
    pais: 'BR',
    dominio: 'pagina.com.br',
    provedor: 'Provedor',
    sistema: 'iOS',
  },
  {
    id: '5',
    created_at: '1 dia',
    status: false,
    campanha: 'Nome Campanha 5',
    pagina_destino: 'https://pagina.com.br',
    ip: '111.111.1.1',
    dispositivo: 'smartphone',
    pais: 'BR',
    dominio: 'pagina.com.br',
    provedor: 'Provedor',
    sistema: 'iOS',
  },
];

export type Payment = {
  id: string;
  created_at: string;
  status: boolean;
  campanha: string;
  pagina_destino: string;
  ip: string;
  dispositivo: string;
  pais: string;
  dominio: string;
  provedor: string;
  sistema: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'created_at',
    header: 'Criado à',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status');
      if (status) {
        return (
          <div className="flex items-center gap-1 text-green-500 text-sm">
            <span className="w-4 h-4 border border-green-500 rounded-full flex justify-center items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
            </span>
            Sucesso
          </div>
        );
      }
      return (
        <div className="flex items-center gap-1 text-destructive text-sm">
          <span className="w-4 h-4 border border-destructive rounded-full flex justify-center items-center">
            <span className="w-2 h-2 bg-destructive rounded-full" />
          </span>
          Bloqueado
        </div>
      );
    },
  },
  {
    accessorKey: 'campanha',
    header: 'Campanha',
    cell: ({ row }) => {
      return (
        <Link
          href={`/home/campanhas/${row.original.id}`}
          className="text-blue-400 underline decoration-solid"
        >
          {row.getValue('campanha')}
        </Link>
      );
    },
  },
  {
    accessorKey: 'pagina_destino',
    header: 'Página Destino',
  },
  {
    accessorKey: 'ip',
    header: 'Ip',
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          {row.getValue('ip')}
          <span className="text-xs text-black/40">{row.original.provedor}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'dispositivo',
    header: 'Dispositivo',
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          {row.getValue('dispositivo')}
          <span className="text-xs text-black/40">{row.original.sistema}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'pais',
    header: 'País',
    cell: ({ row }) => {
      return (
        <Image
          loader={flagApi}
          src={row.getValue('pais')}
          width={32}
          height={32}
          alt="flag"
        />
      );
    },
  },
  {
    accessorKey: 'dominio',
    header: 'Domínio',
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <Eye />,
  },
];

export const DataTableDemo = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="rounded-sm border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
