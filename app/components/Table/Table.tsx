"use client"
import React, { useState, useRef, useEffect, ReactNode } from 'react';
import NoDataComponent from '../Empty/Nodata';

// Define types for the Table component
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
  expandedRows?: Record<string | number, boolean>;
  onRowExpand?: (row: T, rowIndex: number) => void;
  expandable?: boolean;
  expandableColumnIndex?: number;
  renderExpandContent?: (row: T, rowIndex: number) => ReactNode;
  rowClassName?: string | ((row: T, rowIndex: number, isExpanded: boolean) => string);
  headerZIndex?: string;
}

interface ResizingState {
  colIndex: number;
  startX: number;
  startWidth: number;
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
  headerZIndex = 'z-20'
}: TableProps<T>) => {
  // Ensure data is always an array
  const tableData = Array.isArray(data) ? data : [];
  const hasData = tableData.length > 0 && !loading;

  // State for column widths
  const [columns, setColumns] = useState<Column<T>[]>(
    initialColumns.map((col, index) => {
      const isLastColumn = index === initialColumns.length - 1;
      const width = isLastColumn && !col.width ? 'auto' : (col.width || 150);
      
      return {
        ...col,
        width: width,
        cellPadding: col.cellPadding || 'p-3'
      };
    })
  );

  const [resizing, setResizing] = useState<ResizingState | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  // Handle mouse move for resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizing) return;

      const diff = e.clientX - resizing.startX;
      const newWidth = Math.max(50, resizing.startWidth + diff);

      setColumns(prev => {
        const newCols = [...prev];
        newCols[resizing.colIndex] = { 
          ...newCols[resizing.colIndex], 
          width: newWidth 
        };
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

  // Handle row expand/collapse
  const handleRowClick = (row: T, rowIndex: number) => {
    if (!expandable || !onRowExpand) return;
    
    onRowExpand(row, rowIndex);
  };

  const getRowId = (row: T, rowIndex: number): string | number => {
    return row.id || row._id || rowIndex;
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
                    className={`${column.cellPadding || 'p-3'} text-left sticky text-white top-0 ${headerZIndex || 'z-20'} text-sm bg-[#E11D48] font-semibold uppercase tracking-wider relative group ${column.headerClassName || ''}`}
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
                            : 'bg-white hover:bg-blue-400 hover:scale-105 hover:w-[4px]'
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
                const isExpanded = expandedRows[rowId];
                const rowClass = typeof rowClassName === 'function' 
                  ? (rowClassName as (row: T, rowIndex: number, isExpanded: boolean) => string)(row, rowIndex, isExpanded)
                  : rowClassName;
                
                return (
                  <React.Fragment key={rowId}>
                    <tr 
                      className={`transition-colors duration-200 ${
                        expandable ? 'cursor-pointer hover:bg-gray-50' : ''
                      } ${isExpanded ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''} ${rowClass}`}
                      onClick={() => expandable && handleRowClick(row, rowIndex)}
                    >
                      {columns.map((column, colIndex) => {
                        let cellClassName = `${column.cellPadding || 'p-3'} text-left text-sm align-top`;
                        
                        if (column.cellClassName) {
                          if (typeof column.cellClassName === 'function') {
                            cellClassName = `${cellClassName} ${(column.cellClassName as (row: T, rowIndex: number, colIndex: number) => string)(row, rowIndex, colIndex)}`;
                          } else {
                            cellClassName = `${cellClassName} ${column.cellClassName}`;
                          }
                        }

                        let cellContent: ReactNode;
                        if (column.render) {
                          try {
                            cellContent = column.render(row, rowIndex);
                          } catch (error) {
                            console.error('Error rendering column:', error);
                            cellContent = 'Error';
                          }
                        } else {
                          cellContent = row[column.accessor as keyof T] || '';
                        }

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
                    
                    {/* Expanded row content */}
                    {expandable && isExpanded && renderExpandContent && (
                      <tr className="bg-gray-50">
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