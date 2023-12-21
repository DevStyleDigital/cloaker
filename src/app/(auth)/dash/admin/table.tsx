'use client';

import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  flexRender,
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
import { useEffect, useState } from 'react';
import { AuthUser } from 'context/auth';
import { User } from 'components/user';

const columns: ColumnDef<AuthUser>[] = [
  {
    header: 'Usuário',
    accessorKey: 'user',
    cell: ({ row }) => {
      return <User user={row.original} enableCopyEmail />;
    },
  },
  {
    header: 'Telefone',
    accessorKey: 'phone',
  },
  {
    header: 'Assinatura',
    accessorKey: 'subscription',
  },
];

export const DataTableDemo = ({
  data: defaultData,
  fetchData,
}: {
  data: AuthUser[];
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
