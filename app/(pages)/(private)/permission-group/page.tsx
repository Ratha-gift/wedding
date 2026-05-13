"use client";
import Header from "@/app/src/Components/Header/header";
import { useRequireAuth } from "@/app/src/Hooks/useAuthRedirect";

export default function PermissionGroupPage() {
  useRequireAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="ក្រុមសិទ្ធិ" />
      <div className="flex items-center justify-center h-[80vh]">
        <p className="text-[#e11d48] text-xl font-medium">ក្រុមសិទ្ធិ — នឹងមកដល់ឆាប់ៗ</p>
      </div>
    </div>
  );
}
