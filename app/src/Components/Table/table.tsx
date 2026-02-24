// components/Table/Table.tsx
"use client";
import React, { useState, useRef, useEffect, ReactNode } from 'react';
import NoDataComponent from '../Empty/Nodata';

interface Column<T> {
  header: string;
  accessor?: keyof T | string;
  width?: number | string;
  cellPadding?: string;
  headerClassName?: string;
  cellClassName?: string | ((row: T, rowIndex: number, colIndex: number) => string);
  render?: (row: T, rowIndex: number) => ReactNode;
  sortable?: boolean;
  sortType?: 'string' | 'number' | 'date'; // not used in server-side, but kept for future
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  height?: string;
  loading?: boolean;
  loadingComponent?: ReactNode;

  // Expandable features
  expandedRows?: Record<string | number, boolean>;
  onRowExpand?: (row: T, rowIndex: number) => void;
  expandable?: boolean;
  expandableColumnIndex?: number;
  renderExpandContent?: (row: T, rowIndex: number) => ReactNode;

  rowClassName?: string | ((row: T, rowIndex: number, isExpanded: boolean) => string);

  clickableRows?: boolean;
  highlightSelectedRow?: boolean;
  selectedRowId?: string | number | null;
  onRowSelect?: (row: T | null, rowIndex: number | null) => void;

  modalRender?: (row: T, onClose: () => void) => ReactNode;

  headerZIndex?: string;

  // Controlled sorting props (required for server-side)
  sortBy?: string | null;
  sortDirection?: 'asc' | 'desc' | null;
  onSortChange?: (sort: { key: string; direction: 'asc' | 'desc' } | null) => void;
}

const Table = <T extends Record<string, any>>({
  data,
  columns: initialColumns,
  height = '12rem',
  loading = false,
  loadingComponent = null,

  expandedRows = {},
  onRowExpand,
  expandable = false,
  expandableColumnIndex = 0,
  renderExpandContent,

  rowClassName = '',
  headerZIndex = 'z-20',

  clickableRows = false,
  highlightSelectedRow = true,
  selectedRowId = null,
  onRowSelect,

  modalRender,

  // Controlled sorting
  sortBy = null,
  sortDirection = null,
  onSortChange,
}: TableProps<T>) => {

  const tableData = Array.isArray(data) ? data : [];
  const hasData = tableData.length > 0 && !loading;

  // Column width setup (unchanged)
  const [columns, setColumns] = useState<Column<T>[]>(
    initialColumns.map((col, index) => {
      const isLastColumn = index === initialColumns.length - 1;
      const width = isLastColumn && !col.width ? 'auto' : (col.width || 150);
      return {
        ...col,
        width,
        cellPadding: col.cellPadding || 'p-3'
      };
    })
  );

  // Resizing logic (unchanged)
  const [resizing, setResizing] = useState<{ colIndex: number; startX: number; startWidth: number } | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizing) return;
      const diff = e.clientX - resizing.startX;
      const newWidth = Math.max(50, resizing.startWidth + diff);

      setColumns(prev => {
        const newCols = [...prev];
        newCols[resizing.colIndex] = { ...newCols[resizing.colIndex], width: newWidth };
        return newCols;
      });
    };

    const handleMouseUp = () => {
      setResizing(null);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (resizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [resizing]);

  const startResize = (e: React.MouseEvent<HTMLDivElement>, colIndex: number) => {
    e.preventDefault();
    const startX = e.clientX;
    const currentWidth = columns[colIndex].width;
    const startWidth = typeof currentWidth === 'number' ? currentWidth : parseInt(currentWidth as string) || 150;
    setResizing({ colIndex, startX, startWidth });
  };

  const handleRowClick = (row: T, rowIndex: number) => {
    if (expandable && onRowExpand) {
      onRowExpand(row, rowIndex);
    }
    if (clickableRows && onRowSelect) {
      onRowSelect(row, rowIndex);
    }
  };

  const getRowId = (row: T, rowIndex: number): string | number => {
    return (row as any).id ?? (row as any)._id ?? (row as any).user_id ?? (row as any).guest_id ?? rowIndex;
  };

  return (
    <div
      className="relative overflow-x-auto rounded-lg text-sm mx-auto custom-scrollbar"
      style={{ height: `calc(100vh - ${height})` }}
      ref={tableRef}
    >
      <div className="w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {columns.map((column, index) => {
                const isLastColumn = index === columns.length - 1;
                const isAutoWidth = column.width === 'auto';
                const showResizeHandle = !isLastColumn;
                const width = column.width || 150;
                const canSort = !!column.sortable && !!column.accessor;
                const isSorted = sortBy === (column.accessor as string | undefined);
                const currentDirection = isSorted ? sortDirection : null;

                return (
                  <th
                    key={index}
                    className={`
                      ${column.cellPadding || 'p-3'}
                      text-left sticky text-white top-0 ${headerZIndex}
                      text-sm bg-[#E11D48] uppercase tracking-wider
                      relative group
                      ${canSort ? 'cursor-pointer hover:bg-rose-600/90 transition-colors' : ''}
                      ${column.headerClassName || ''}
                    `}
                    style={{
                      width: isAutoWidth ? 'auto' : width,
                      minWidth: isAutoWidth ? 'auto' : width,
                      maxWidth: isAutoWidth ? 'none' : width,
                    }}
                    onClick={
                      canSort
                        ? () => {
                          const key = column.accessor as string;

                          let newDirection: 'asc' | 'desc' = 'asc';

                          if (sortBy === key) {
                            if (sortDirection === 'asc') {
                              newDirection = 'desc';
                            } else {
                              // third click → clear sort
                              onSortChange?.(null);
                              return;
                            }
                          }

                          onSortChange?.({ key, direction: newDirection });
                        }
                        : undefined
                    }
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate">{column.header}</span>

                      {canSort && (
                        <span className="text-xs font-bold opacity-70 group-hover:opacity-100 transition-opacity min-w-[1.2rem] text-center">
                          {isSorted ? (
                            currentDirection === 'asc' ? '▲' : '▼'
                          ) : (
                            '↕'
                          )}
                        </span>
                      )}
                    </div>

                    {showResizeHandle && (
                      <div
                        className={`absolute right-0 top-1/2 transform -translate-y-1/2 h-[2rem] w-[2px] cursor-col-resize rounded transition-all duration-200 ${resizing?.colIndex === index
                          ? 'bg-blue-500 scale-110'
                          : 'bg-white/70 hover:bg-blue-400 hover:scale-105 hover:w-[4px]'
                          }`}
                        onMouseDown={(e) => startResize(e, index)}
                        title="Drag to resize"
                      />
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="p-3 h-[15rem] text-center text-sm">
                  {loadingComponent || <div>Loading...</div>}
                </td>
              </tr>
            ) : !hasData ? (
              <tr>
                <td colSpan={columns.length} className="p-3 text-center text-sm">
                  <NoDataComponent />
                </td>
              </tr>
            ) : (
              tableData.map((row, rowIndex) => {   // ← Use tableData (server provides already sorted data)
                const rowId = getRowId(row, rowIndex);
                const isExpanded = !!expandedRows[rowId];
                const isSelected = highlightSelectedRow && selectedRowId === rowId;

                const rowClass = typeof rowClassName === 'function'
                  ? rowClassName(row, rowIndex, isExpanded)
                  : rowClassName;

                return (
                  <React.Fragment key={rowId}>
                    <tr
                      className={`
                                  transition-all duration-150 ease-in-out
                                  ${clickableRows ? 'cursor-pointer' : 'cursor-default'}
                                  ${clickableRows ? 'hover:bg-rose-50/90 hover:shadow-sm' : ''}
                                  ${isSelected ? 'bg-rose-100/90 border-l-4 border-l-rose-600' : ''}
                                  ${isExpanded ? 'bg-blue-50/60 border-l-4 border-l-blue-500' : ''}
                                  ${rowClass}
                                `}
                      onClick={(e) => {
                        if (!clickableRows) return;

                        const target = e.target as HTMLElement;

                        //  Prevent row click if clicking interactive elements
                        if (
                          target.closest('button') ||
                          target.closest('a') ||
                          target.closest('svg') ||
                          target.closest('[role="button"]') ||
                          target.closest('input')
                        ) {
                          return;
                        }

                        handleRowClick(row, rowIndex);
                      }}
                    >

                      {columns.map((column, colIndex) => {
                        let cellClassName = `${column.cellPadding || 'p-3'} text-left text-sm align-top`;

                        if (column.cellClassName) {
                          if (typeof column.cellClassName === 'function') {
                            cellClassName += ` ${column.cellClassName(row, rowIndex, colIndex)}`;
                          } else {
                            cellClassName += ` ${column.cellClassName}`;
                          }
                        }

                        const cellContent = column.render
                          ? column.render(row, rowIndex)
                          : row[column.accessor as keyof T] ?? '';

                        const isAutoWidth = column.width === 'auto';
                        const width = column.width || 150;

                        return (
                          <td
                            key={colIndex}
                            className={cellClassName}
                            style={{
                              width: isAutoWidth ? 'auto' : width,
                              minWidth: isAutoWidth ? 'auto' : width,
                              maxWidth: isAutoWidth ? 'none' : width,
                            }}
                            title={typeof cellContent === 'string' ? cellContent : undefined}
                          >
                            {cellContent}
                          </td>
                        );
                      })}
                    </tr>

                    {expandable && isExpanded && renderExpandContent && (
                      <tr className="bg-gray-50/80">
                        <td colSpan={columns.length} className="p-0">
                          <div className="px-4 py-3 border-t border-gray-200 animate-fadeIn">
                            {renderExpandContent(row, rowIndex)}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;