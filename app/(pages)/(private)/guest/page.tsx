"use client";
//api
import api from "../../server/api";
import { useEffect, useState } from "react";
import { IoHomeSharp } from "react-icons/io5";
import { MdOutlineLightMode } from "react-icons/md";
import { RiMoonClearLine } from "react-icons/ri";
import { RiFileExcel2Line } from "react-icons/ri";
//components
import Table from "@/app/Components/Table/table";
import MyPagination from "@/app/Components/Pagination/pagination";
import ModalCreate from "@/app/Components/Modal/modal";
import Link from "antd/es/typography/Link";
import DrawerFilter from "@/app/Components/Button/filter";
import DropdownProfile from "@/app/Components/Dropdown/profile";
import SearchInput from "@/app/Components/input/input";
import { useAuth } from "../../../src/lib/useAuth";


import { Button } from "antd";


export default function GuestInformationTable() {
  const [modalOpen, setModalOpen] = useState(false);

  const handleSuccess = () => {
    // Refresh the guest list after successful creation
    fetchGuest();
  };
  // TABLE COLUMNS
  const columns = [
    {
      header: "ល.រ",
      render: (row: any) => (
        <div className=" flex justify-start items-start">
          {row.guest_id}
        </div>
      ),
      width: 40
    },
    {
      header: "ភ្ញៀវកិតិ្តយស",
      render: (row: any) => {
        return (
          <div className="truncate w-full">
            {row.guest_name}
          </div>
        );
      },
      width: 100
    },
    {
      header: "ភ្ញៀវខាង",
      render: (row: any) => (
        <div className="truncate w-full">
          {row.guest_type}
        </div>
      ),
      width: 80
    },
    {
      header: "លេខទូរស័ព្ទ",
      render: (row: any) => {
        return (
          <div className="truncate w-full">
            {row.phone_number}
          </div>
        );
      },
      width: 150
    },

    {
      header: "ទីតាំង",
      render: (row: any) => {
        return (
          <div className="truncate w-full">
            {row.address}
          </div>
        );
      },
      width: 120
    },
    {
      header: "សម្គាល់",
      render: (row: any) => {
        return (
          <div className="truncate w-full">
            {row.remark}
          </div>
        );
      },
      width: 80
    },
    {
      header: "យកដៃ/សងដៃ",
      render: (row: any) => (
        <div className=" mt-3 flex justify-center items-start">
          {row.give_money_type_name}
        </div>
      ),
      width: 55,
      cellPadding: ' pl-3 pr-2',

    },
  ];

  type Guest = {
    guest_id: number;
    guest_name: string;
    guest_type: string;
    phone_number: string;
    address: string;
    remark: string;
    give_money_type_name: string;
    give_money_type_id: number;

  };
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [data, setData] = useState<Guest[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalEntries, setTotalEntries] = useState(0);
  const [loading, setLoading] = useState(false);
  const { islogin, token } = useAuth();

  useEffect(() => {
    if (islogin && token) {

      fetchGuest();
    }
  }, [currentPage, entriesPerPage, token, islogin]);

  const fetchGuest = async () => {
    try {
      setLoading(true);

      const res = await api.get("/guest", {
        params: {
          page: currentPage,
          per_page: entriesPerPage,
          sort_by: "guest_id",
          sort_direction: "desc",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        }

      });

      setData(res.data.data);
      setTotalEntries(res.data.meta.total);

    } catch (err: any) {
      console.error("FETCH ERROR:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  //  create guest function
  const createGuest = async (payload: {
    guest_name: string;
    guest_type: string;
    phone_number: string;
    address: string;
    remark: string;
    give_money_type_id: number;
  }) => {
    try {
      setLoading(true);

      const res = await api.post(
        "/guest/create",
        payload,
        // {
        //   headers: { ...Authorization(),
        //   },
        // }
      );

      // refresh table after create
      await fetchGuest();
      return res.data;
    } catch (err: any) {
      console.error("CREATE ERROR:", err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // export
  const [exporting, setExporting] = useState(false);
  const handleExportExcel = async () => {
    if (!islogin || !token) {
      alert("សូមចូលគណនីជាមុន");
      return;
    }

    try {
      setExporting(true);
      const response = await api.get("/guest/exportcsv", {
        responseType: "blob",
      });
      const blob = response.data;
      let fileName = `guests-export-${new Date().toISOString().split("T")[0]}.xlsx`;

      const disposition = response.headers["content-disposition"];
      if (disposition && disposition.includes("filename")) {
        const matches = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i);
        if (matches?.[1]) {
          fileName = matches[1].replace(/['"]/g, "");
        }
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err: any) {
      console.error("Export failed:", err);

      if (err.response?.status === 401) {
        alert("សម័យផុតកំណត់ — សូមចូលគណនីឡើងវិញ");
      } else if (err.response?.status === 403) {
        alert("អ្នកមិនមានសិទ្ធិទាញយកទិន្នន័យនេះទេ");
      } else {
        alert("មានបញ្ហាក្នុងការទាញយកឯកសារ។ សូមព្យាយាមម្តងទៀត។");
      }
    }
    finally {
      setExporting(false);
    }

  };

  const [dark, setDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDark(!dark);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="h-[65px] bg-[#E11D48] text-white flex items-center justify-between px-6">
        <div className="flex items-center gap-2 text-4xl font-medium">
          <Link href="/home" className="items-center justify-center p-2 rounded-lg transition"
            aria-label="Go to Home">
            <IoHomeSharp className="text-white" size={28} />
          </Link>
          បញ្ចូលភ្ញៀវកិត្តិយស
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg  transition"
            aria-label="Toggle Dark Mode"
          >
            {dark ? (
              <MdOutlineLightMode size={24} />
            ) : (
              <RiMoonClearLine size={24} />
            )}
          </button>
          <DropdownProfile />
        </div>
      </header>

      {/* CONTENT */}
      <div className=" mx-6 p-3 bg-white mt-4 shadow">
        {/* TOOLBAR */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex gap-2">
            <SearchInput />

            <DrawerFilter />
          </div>
          <div className="flex gap-2">
            <Button
              type="primary"
              onClick={() => setModalOpen(true)}
            >
              បង្កើតថ្មី
            </Button>

            <ModalCreate
              open={modalOpen}
              onCancel={() => setModalOpen(false)}
              onSuccess={handleSuccess}
            />
            <button
              onClick={handleExportExcel}
              disabled={exporting || loading}
              className={`px-4 py-1 rounded flex items-center gap-2 transition
                   ${exporting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#FF89A3] hover:bg-[#e0708a] text-white"}`}
            >
              {exporting ? (
                <>កំពុងទាញយក...</>
              ) : (
                <>
                  {/* <RiFileExcel2Line size={18} /> */}
                  ទាញយក
                </>
              )}
            </button>

            <button
              className="bg-[#686868] text-white px-4 py-1 rounded flex items-center gap-1">
              <RiFileExcel2Line />
              បញ្ចូល

            </button>
          </div>
        </div>

        <Table
          data={data}
          columns={columns}
          clickableRows={true}
          height="13rem"
          highlightSelectedRow={true}
          selectedRowId={selectedRow?.id}
          onRowSelect={setSelectedRow}
          modalRender={(row, onClose) => (
            <ModalCreate
              open={true}
              onCancel={onClose}
              onSuccess={() => {
                onClose();
              }}
              mode="edit"                     
              initialData={row}              
            />
          )}
        />

        {selectedRow && (
          <ModalCreate
            open={!!selectedRow}
            onCancel={() => setSelectedRow(null)}
            initialData={selectedRow}
          />
        )}

        {/* PAGINATION */}
        <div className="flex justify-end mt-3">
          <MyPagination
            currentPage={currentPage}
            totalEntries={totalEntries}
            entriesPerPage={entriesPerPage}
            onPageChange={(page) => setCurrentPage(page)}
            onEntriesPerPageChange={(value) => {
              setEntriesPerPage(value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

    </div>
  );
}


