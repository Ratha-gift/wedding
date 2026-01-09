"use client";
import React from "react";
import { Pagination } from "antd";

interface MyPaginationProps {
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
}

const MyPagination: React.FC<MyPaginationProps> = ({
  page,
  total,
  pageSize,
  onPageChange,
}) => {
  return (
    <Pagination
      current={page}           // ✅ controlled
      total={total}            // ✅ from parent
      pageSize={pageSize}
      onChange={onPageChange}  // ✅ update state
      showQuickJumper
      showSizeChanger={false}
    />
  );
};

export default MyPagination;
