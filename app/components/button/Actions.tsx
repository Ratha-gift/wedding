"use client";

import { useState, ReactNode } from "react";

export interface SaveButtonProps {
  icon: ReactNode;   // ❗ REQUIRED
  iconTitle?: ReactNode;   // ❗ REQUIRED
  modalTitle?: string;
  children?: ReactNode;
  size?: string;
  bgColor?: string;
  width?: string;
  height?: string;
  Radius?: string;
  classNames?: string;
  
}


export default function Actions({
  icon,
  iconTitle,
  classNames,
  width = "500px",
  height = "50vh",
  children,
  modalTitle = "Modal",
  Radius = "10px",
  bgColor = "#", // ✅ default color
}: SaveButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ICON BUTTON */}
      <div
        onClick={() => setOpen(true)}
        style={{

          backgroundColor: bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        {icon}
      </div>

      {/* MODAL */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.35)", // ព្រាល
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)", // ✅ Safari
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#f2f2f2",
              padding: 20,
              borderRadius: Radius,
              minWidth: width,
              height: height,
              maxWidth: "90%",
            }}
          >
            <div className={classNames}>
              {iconTitle}
                <h3 className=" h-15 flex justify-center items-end text-3xl text-[#e11d48] font-bold">{modalTitle}</h3>
            </div>
             {children}
          </div>
        </div>
      )}
    </>
  );
}
