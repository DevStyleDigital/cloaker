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
import { Trash } from 'lucide-react';
import {
  Table as TableRoot,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'components/ui/table';
import { toast } from 'react-toastify';
import { useAuth } from 'context/auth';

type Card = {
  id: string;
  last_four_digits: string;
  priority: 'primary' | 'secondary';
  company: string;
};

export const columns: ColumnDef<Card>[] = [
  {
    accessorKey: 'company',
    header: 'Marca',
    cell: (props) => {
      const v = props.getValue() as string;
      return (
        <span>
          {v === 'visa' ? (
            <VISA className="w-10 h-10" />
          ) : (
            <Mastercard className="w-10 h-10" />
          )}
        </span>
      );
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
    accessorKey: 'priority',
    header: 'Prioridade',
    cell: (props) => {
      const v = props.getValue() as string;
      return <span>{v === 'primary' ? 'Principal' : 'Secundário'}</span>;
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: (props: CellContext<Card, unknown> & { length?: number }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { user } = useAuth();

      return (
        <Button
          variant="destructive"
          disabled={(props.length || 0) < 2}
          onClick={() => {
            fetch('/api/cards', {
              method: 'DELETE',
              body: JSON.stringify({ id: props.row.original.id, cid: user?.id }),
            })
              .then(() => toast.success('Cartão deletado!'))
              .catch(() =>
                toast.error('Ocorreu um erro ao deletar seu cartão. Tente novamente!'),
              );
          }}
        >
          Excluir <Trash className="w-4 h-4 ml-4" />
        </Button>
      );
    },
  },
];

export const Table = ({ data }: { data: any }) => {
  const table = useReactTable({
    data,
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
                  <TableCell
                    key={cell.id}
                    className={
                      cell.column.id === 'actions' ? 'justify-end flex' : undefined
                    }
                  >
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
