"use client";

import React from "react";
import { Pagination, Select, Spin } from "antd";
import type { PaginationProps } from "antd";

type MyPaginationProps = {
  currentPage: number;
  totalEntries: number;
  entriesPerPage: number;
  onPageChange: (page: number) => void;
  onEntriesPerPageChange: (size: number) => void;
  loading?: boolean;
  loadingComponent?: React.ReactNode;
};

const MyPagination: React.FC<MyPaginationProps> = ({
  currentPage,
  totalEntries,
  entriesPerPage,
  onPageChange,
  onEntriesPerPageChange,
  loading = false,
  loadingComponent = null,
}) => {
  if (loading) {
    return <>{loadingComponent ?? <Spin />}</>;
  }

  const handleChange: PaginationProps["onChange"] = (page, pageSize) => {
    onPageChange(page);

    if (pageSize && pageSize !== entriesPerPage) {
      onEntriesPerPageChange(pageSize);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Page size */}
      <Select
        value={entriesPerPage}
        onChange={(value) => onEntriesPerPageChange(value)}
        options={[
    
          { value: 10, label: "10 / page" },
          { value: 20, label: "20 / page" },
          { value: 50, label: "50 / page" },
        ]}
        style={{ width: 120 }}
      />

      {/* Pagination */}
      <Pagination
        showQuickJumper={{goButton: "page"}}
        showSizeChanger={false} 
        current={currentPage}
        total={totalEntries}
        pageSize={entriesPerPage}
        onChange={handleChange}
    
      />
    </div>
  );
};

export default MyPagination;
