import { Mastercard } from 'assets/svgs/logos/mastercard';
import { VISA } from 'assets/svgs/logos/visa';
import {
  type CellContext,
  type ColumnDef,
  flexRender,
  useReactTable,
  getCoreRowModel,
} from '@tanstack/react-table';
import { Button } from 'components/ui/button';
import { Receipt, Trash, XCircle } from 'lucide-react';
import {
  Table as TableRoot,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'components/ui/table';
import { format } from 'date-fns';
import { cn } from 'utils/cn';

type Payment = {
  id: string;
  date: Date;
  last_four_digits: string;
  desc: string;
  value: number;
  status: 'payed' | 'refused';
};
const payments_mock: Payment[] = [
  {
    id: '1',
    date: new Date(),
    last_four_digits: '2222',
    desc: 'Sucesso',
    value: 100,
    status: 'payed',
  },
  {
    id: '2',
    date: new Date(),
    last_four_digits: '1111',
    desc: 'Saldo insuficiente',
    value: 100,
    status: 'refused',
  },
];

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'date',
    header: 'Data',
    cell: (props) => {
      const v = props.getValue() as Date;
      return <span>{format(v, 'dd/MM/yyyy, hh:mm:ss')}</span>;
    },
  },
  {
    accessorKey: 'last_four_digits',
    header: 'Últimos 4 dígitos',
    cell: (props) => {
      const v = props.getValue() as string;
      return <span>**** **** **** {v}</span>;
    },
  },
  {
    accessorKey: 'desc',
    header: 'Descrição',
  },
  {
    accessorKey: 'value',
    header: 'Valor',
    cell: (props) => {
      const v = props.getValue() as number;
      return <span>R$ {`${v.toFixed(2)}`.replace('.', ',')}</span>;
    },
  },
  {
    accessorKey: 'status',
    enableHiding: false,
    cell: (props) => {
      const v = props.getValue() as 'payed' | 'refused';
      return (
        <div
          className={cn('p-2 rounded-lg flex space-x-4 items-center w-36', {
            'bg-green-200 text-green-500': v === 'payed',
            'bg-red-200 text-destructive': v === 'refused',
          })}
        >
          {v === 'payed' ? (
            <Receipt className="w-6 h-6" />
          ) : (
            <XCircle className="w-6 h-6" />
          )}
          <p>{v === 'payed' ? 'Pago' : 'Recusado'}</p>
        </div>
      );
    },
  },
];

export const Table = () => {
  const table = useReactTable({
    data: payments_mock,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border px-2">
      <TableRoot>
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
                    {flexRender(cell.column.columnDef.cell, {
                      ...cell.getContext(),
                      length: table.getRowModel().rows.length,
                    })}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Nenhum Cartão adicionado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </TableRoot>
    </div>
  );
};
