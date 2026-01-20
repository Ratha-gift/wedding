"use client";
import { useState } from "react";
import { MdEdit } from "react-icons/md";

export default function DropdownForm() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full max-w-135 bg-white rounded-md shadow p-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-red-600 text-lg ">
          ផ្លាស់ប្ដូរពាក្យសម្ងាត់ថ្មី
        </h1>

        {/* Right action */}
        {!open ? (
          // ✏️ Icon (closed)
          <MdEdit
            onClick={() => setOpen(true)}
            className="text-red-600 text-xl cursor-pointer hover:scale-110 transition"
          />
        ) : (
          // ✅ Button (opened)
          <span
            onClick={() => setOpen(false)}
            className="bg-blue-500 text-white px-4 py-1.5 rounded-lg cursor-pointer hover:bg-blue-600 transition"
          >
            រក្សាទុក
          </span>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-sm">ពាក្យសម្ងាត់ថ្មី</label>
            <input className="w-full bg-gray-100 rounded-lg p-2 outline-none" />
          </div>

          <div>
            <label className="text-sm">បញ្ជាក់ពាក្យសម្ងាត់ថ្មី</label>
            <input className="w-full bg-gray-100 rounded-lg p-2 outline-none" />
          </div>
        </div>
      )}
    </div>
  );
}