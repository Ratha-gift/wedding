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
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  height?: string;
  loading?: boolean;
  loadingComponent?: ReactNode;

  // Expandable features (your original)
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

  // Optional: fully custom modal content renderer
  modalRender?: (row: T, onClose: () => void) => ReactNode;

  headerZIndex?: string;
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

  // New props (all optional)
  clickableRows = false,
  highlightSelectedRow = true,
  selectedRowId = null,
  onRowSelect,
  modalRender,
}: TableProps<T>) => {

  const tableData = Array.isArray(data) ? data : [];
  const hasData = tableData.length > 0 && !loading;

  // Column width management (your original logic)
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

  const [resizing, setResizing] = useState<{ colIndex: number; startX: number; startWidth: number } | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  // ─── Resizing logic (unchanged) ───────────────────────
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

  // ─── Row click handler ────────────────────────────────
  const handleRowClick = (row: T, rowIndex: number) => {
    // 1. Handle expandable (your original logic)
    if (expandable && onRowExpand) {
      onRowExpand(row, rowIndex);
    }

    // 2. Handle selection + modal trigger
    if (clickableRows && onRowSelect) {
      onRowSelect(row, rowIndex);
    }
  };

  const getRowId = (row: T, rowIndex: number): string | number => {
    return (row as any).id ?? (row as any)._id ?? rowIndex;
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

                return (
                  <th
                    key={index}
                    className={`${column.cellPadding || 'p-3'} text-left sticky text-white top-0 ${headerZIndex} text-sm bg-[#E11D48] font-semibold uppercase tracking-wider relative group ${column.headerClassName || ''}`}
                    style={{
                      width: isAutoWidth ? 'auto' : width,
                      minWidth: isAutoWidth ? 'auto' : width,
                      maxWidth: isAutoWidth ? 'none' : width,
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="truncate">{column.header}</span>
                    </div>

                    {showResizeHandle && (
                      <div
                        className={`absolute right-0 top-1/2 transform -translate-y-1/2 h-[2rem] w-[2px] cursor-col-resize rounded transition-all duration-200 ${
                          resizing?.colIndex === index
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
              tableData.map((row, rowIndex) => {
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
                      onClick={() => handleRowClick(row, rowIndex)}
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

                    {/* Expanded content – your original */}
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