'use client';

import { useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import type { CsvRow, ParsedCsv } from '@/types/csv';

interface PreviewTableProps {
  data: ParsedCsv;
}

const columnHelper = createColumnHelper<CsvRow>();

export function PreviewTable({ data }: PreviewTableProps): JSX.Element {
  const columns = useMemo<ColumnDef<CsvRow, string>[]>(
    () =>
      data.headers.map((header) =>
        columnHelper.accessor((row) => row[header] ?? '', {
          id: header,
          header: () => header,
          cell: (info) => info.getValue(),
        }),
      ),
    [data.headers],
  );

  const table = useReactTable({
    data: data.rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="dashboard-card overflow-hidden">
      <div className="border-b border-subtle px-5 py-4">
        <p className="text-sm font-medium text-body">Data preview</p>
        <p className="text-xs text-muted">Showing all parsed rows from your upload</p>
      </div>
      <div className="max-h-[28rem] overflow-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 bg-surface-muted backdrop-blur">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} scope="col" className="table-header">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="table-row-interactive">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="table-cell">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
