'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type VisibilityState,
} from '@tanstack/react-table';
import type { CrmRecord } from '@/types/csv';
import { enrichCrmRecords, formatStatusLabel, type EnrichedCrmRecord } from '@/lib/crm-display';
import { RecordDetailsDrawer } from '@/components/dashboard/RecordDetailsDrawer';

interface CrmRecordsTableProps {
  records: CrmRecord[];
  onRefresh?: () => void;
}

const columnHelper = createColumnHelper<EnrichedCrmRecord>();

const PAGE_SIZE = 10;

const statusStyles: Record<string, string> = {
  GOOD_LEAD_FOLLOW_UP: 'bg-emerald-50 text-emerald-700 ring-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-500/20',
  SALE_DONE: 'bg-brand-50 text-brand-700 ring-brand-200/60 dark:bg-brand-950/40 dark:text-brand-400 dark:ring-brand-500/20',
  DID_NOT_CONNECT: 'bg-amber-50 text-amber-700 ring-amber-200/60 dark:bg-amber-950/40 dark:text-amber-400 dark:ring-amber-500/20',
  BAD_LEAD: 'bg-rose-50 text-rose-700 ring-rose-200/60 dark:bg-rose-950/40 dark:text-rose-400 dark:ring-rose-500/20',
};

const renderText = (value: string): JSX.Element => (
  <span className={value ? 'text-body' : 'text-subtle'}>{value || '—'}</span>
);

const COLUMN_LABELS: Record<string, string> = {
  name: 'Name',
  email: 'Email',
  mobile: 'Mobile',
  company: 'Company',
  city: 'City',
  state: 'State',
  country: 'Country',
  status: 'CRM Status',
  source: 'Source',
  date: 'Date',
  crm_note: 'CRM Note',
};

export function CrmRecordsTable({ records, onRefresh }: CrmRecordsTableProps): JSX.Element {
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    source: false,
    date: false,
    crm_note: false,
  });
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<EnrichedCrmRecord | null>(null);

  const data = useMemo(() => enrichCrmRecords(records), [records]);

  const columns = useMemo<ColumnDef<EnrichedCrmRecord, string>[]>(
    () => [
      columnHelper.accessor('name', { header: () => 'Name', cell: (info) => renderText(info.getValue()) }),
      columnHelper.accessor('email', { header: () => 'Email', cell: (info) => renderText(info.getValue()) }),
      columnHelper.accessor('mobile', { header: () => 'Mobile', cell: (info) => renderText(info.getValue()) }),
      columnHelper.accessor('company', { header: () => 'Company', cell: (info) => renderText(info.getValue()) }),
      columnHelper.accessor('city', { header: () => 'City', cell: (info) => renderText(info.getValue()) }),
      columnHelper.accessor('state', { header: () => 'State', cell: (info) => renderText(info.getValue()) }),
      columnHelper.accessor('country', { header: () => 'Country', cell: (info) => renderText(info.getValue()) }),
      columnHelper.accessor('status', {
        header: () => 'CRM Status',
        cell: (info) => {
          const value = info.getValue();
          if (!value) return renderText('');
          return (
            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusStyles[value] ?? 'bg-surface-muted text-muted ring-subtle'}`}>
              {formatStatusLabel(value)}
            </span>
          );
        },
      }),
      columnHelper.accessor('source', { header: () => 'Source', cell: (info) => renderText(info.getValue()) }),
      columnHelper.accessor('date', { header: () => 'Date', cell: (info) => renderText(info.getValue()) }),
      columnHelper.accessor('crm_note', { header: () => 'CRM Note', cell: (info) => renderText(info.getValue()) }),
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, columnVisibility },
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: PAGE_SIZE } },
  });

  const handleRowClick = useCallback((record: EnrichedCrmRecord): void => {
    setSelectedRecord(record);
  }, []);

  if (records.length === 0) {
    return (
      <div className="dashboard-card flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="icon-box-muted h-16 w-16 rounded-2xl">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
          </svg>
        </div>
        <h3 className="font-display mt-5 text-lg font-bold text-body">No CRM records yet</h3>
        <p className="mt-2 max-w-sm text-sm text-muted">
          Once AI extraction completes, your structured CRM records will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="dashboard-card overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-subtle px-4 py-4 sm:px-6 sm:py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative min-w-0 flex-1">
            <label htmlFor="crm-search" className="sr-only">
              Search CRM records
            </label>
            <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              id="crm-search"
              type="search"
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              placeholder="Search records..."
              className="dashboard-input max-w-md pl-10"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowColumnMenu((value) => !value)}
                className="btn-secondary px-3.5 py-2.5 text-sm"
                aria-expanded={showColumnMenu}
              >
                Columns
              </button>
              {showColumnMenu && (
                <div className="absolute right-0 z-20 mt-2 w-52 rounded-xl border border-subtle bg-surface-elevated p-2 shadow-card dark:shadow-card-dark">
                  {table.getAllLeafColumns().map((column) => (
                    <label key={column.id} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-body hover:bg-surface-muted">
                      <input
                        type="checkbox"
                        checked={column.getIsVisible()}
                        onChange={column.getToggleVisibilityHandler()}
                        className="rounded border-subtle text-brand-600 focus:ring-brand-500"
                      />
                      {COLUMN_LABELS[column.id] ?? column.id}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {onRefresh && (
              <button type="button" onClick={onRefresh} className="btn-secondary px-3.5 py-2.5 text-sm">
                Refresh
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 z-10 bg-surface-muted backdrop-blur">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} scope="col" className="table-header">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => handleRowClick(row.original)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleRowClick(row.original);
                    }
                  }}
                  tabIndex={0}
                  className="table-row-interactive"
                >
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

        <div className="flex flex-col gap-3 border-t border-subtle px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-muted">
            Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
            {table.getFilteredRowModel().rows.length.toLocaleString()} records
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="btn-secondary px-3 py-1.5 text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-2 text-sm text-muted">
              {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
            </span>
            <button
              type="button"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="btn-secondary px-3 py-1.5 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <RecordDetailsDrawer record={selectedRecord} onClose={() => setSelectedRecord(null)} />
    </>
  );
}
