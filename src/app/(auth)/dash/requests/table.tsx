'use client';

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
import { useEffect, useState } from 'react';
import { DialogTrigger } from 'components/ui/dialog';
import { ViewRequest } from './view-request';

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
          href={`/dash/campaigns/${row.original.campaign}`}
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
    header: 'IP',
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          {row.original.ip.IPv4}
          <span
            className="text-xs text-black/40 truncate max-w-[10rem]"
            title={row.original.ip.org}
          >
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
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [hideImage, setHideImage] = useState(false);

      return !hideImage ? (
        <Image
          loader={flagApi}
          src={row.original.ip.country_code}
          width={32}
          height={32}
          alt="flag"
          onError={() => setHideImage(true)}
        />
      ) : (
        <span>{row.original.ip.country_code}</span>
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
    cell: ({ row }) => (
      <DialogTrigger>
        <Eye />
      </DialogTrigger>
    ),
  },
];

export const DataTableDemo = ({
  data: defaultData,
  fetchData,
}: {
  data: CampaignRequest[];
  fetchData: (p: number) => Promise<any[]>;
}) => {
  const [data, setData] = useState(defaultData);
  const [page, setPage] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  useEffect(() => {
    setPage(0);
    table.setPageIndex(0);
    setData(defaultData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultData]);

  return (
    <div className="w-full">
      <div className="rounded-sm border bg-background">
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
            {isFetching ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Pesquisando novas requisições...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  <ViewRequest request={row.original}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </ViewRequest>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Aguardando dados...
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
              const newPage = page + 1;
              if (data.length - page * 10 > 10) {
                setIsFetching(true);
                fetchData(newPage).then((d) => {
                  setData((prev) => [...prev, ...d]);
                  setPage(newPage);
                  setTimeout(() => {
                    setIsFetching(false);
                    table.setPageIndex(newPage);
                  }, 500);
                });
              } else table.nextPage();
            }}
            disabled={!table.getCanNextPage()}
          >
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
};
