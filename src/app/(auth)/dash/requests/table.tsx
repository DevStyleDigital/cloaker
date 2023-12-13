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
import { format } from 'date-fns';
import { CampaignRequest } from 'types/campaign';

export const columns: ColumnDef<CampaignRequest>[] = [
  {
    accessorKey: 'created_at',
    header: 'Criado à',
    cell: ({ row }) => (
      <span>{format(new Date(row.original.created_at), 'dd/MM/yyyy - HH:mm:ss')}</span>
    ),
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
    accessorKey: 'campaign_name',
    header: 'Campanha',
    cell: ({ row }) => {
      return (
        <Link
          href={`/home/campanhas/${row.original.campaign}`}
          className="text-blue-400 underline decoration-solid"
        >
          {row.original.campaign_name}
        </Link>
      );
    },
  },
  {
    accessorKey: 'redirect',
    header: 'Página Destino',
  },
  {
    accessorKey: 'ip',
    header: 'Ip',
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          {row.original.ip.IPv4}
          <span className="text-xs text-black/40 truncate max-w-[8rem]">
            {row.original.ip.org}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'device',
    header: 'Dispositivo',
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          {row.original.device}
          <span className="text-xs text-black/40">{row.original.system}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'country',
    header: 'País',
    cell: ({ row }) => {
      return (
        <Image
          loader={flagApi}
          src={row.original.ip.country_code}
          width={32}
          height={32}
          alt="flag"
        />
      );
    },
  },
  {
    accessorKey: 'origin',
    header: 'Domínio',
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <Eye />,
  },
];

export const DataTableDemo = ({
  data,
  page,
  fetchData,
  disableNext,
}: {
  data: CampaignRequest[];
  page: number;
  fetchData: (p: number) => Promise<void>;
  disableNext: boolean;
}) => {
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
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchData(page + 1);
              table.nextPage();
            }}
            disabled={disableNext}
          >
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
};
