"use client";

import React, { useState } from "react";
import { Button, Drawer } from "antd";
import { FaFilter } from "react-icons/fa";

type DrawerFilterProps = {
  width?: number;
  children: React.ReactNode;
};

const DrawerFilter: React.FC<DrawerFilterProps> = ({
  width = 360,
  children,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="primary"
        className="flex items-center gap-2 w-30 "
        onClick={() => setOpen(true)}
         style={{ height: "45px", fontSize: "18px" }}
      >
        <FaFilter size={22} />
        ច្រោះ
      </Button>

      {/* Drawer */}
      <Drawer
        placement="right"
        open={open}
        onClose={() => setOpen(false)}
        width={width}
        title={null}
        closable={false}
        style={{ backgroundColor: "#F2F2F2" }}
      >
        {children}
      </Drawer>
    </>
  );
};

export default DrawerFilter;
