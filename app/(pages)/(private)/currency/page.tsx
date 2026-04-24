"use client";

import api from "@/app/server/api";
import { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { RiFileExcel2Line } from "react-icons/ri";

import Header from "@/app/src/Components/Header/header";
import Table from "@/app/src/Components/Table/table";
import MyPagination from "@/app/src/Components/Pagination/pagination";
import SearchInput from "@/app/src/Components/input/input";
import { Input, DatePicker, Radio,Select, Button } from "antd";

import DrawerFilter from "@/app/src/Components/Button/filter";
import Allbutton from "@/app/src/Components/Button/allbutton";

import { useAuth } from "@/app/src/lib/useAuth";
import { useRequireAuth } from "@/app/src/Hooks/useAuthRedirect";
import ModalCreate from "@/app/src/Components/Modal/modal";

export default function GuestCurrencyPage() {
  useRequireAuth();
  const { islogin, token } = useAuth();

  const [activeTab, setActiveTab] = useState<"guest" | "amount">("guest");
  const [giveMoneyType, setGiveMoneyType] = useState<number | undefined>();

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalEntries, setTotalEntries] = useState(0);

  const [guestData, setGuestData] = useState<any[]>([]);
  const [amountData, setAmountData] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const isGuestTab = activeTab === "guest";
  const currentData = isGuestTab ? guestData : amountData;
  const [modalType, setModalType] = useState<"guest" | "currency">("guest");

  const [openModal, setOpenModal] = useState(false);


  // ================= FETCH =================
  useEffect(() => {
    if (islogin && token) {
      if (activeTab === "guest") fetchGuest();
      if (activeTab === "amount") fetchAmount();
    }
  }, [activeTab, currentPage, entriesPerPage, search, token, islogin]);

  const fetchGuest = async () => {
    try {
      setLoading(true);
      const res = await api.get("/guest", {
        params: {
          page: currentPage,
          per_page: entriesPerPage,
          search: search,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      setGuestData(res.data.data || []);
      setTotalEntries(res.data.meta?.total || 0);
    } finally {
      setLoading(false);
    }
  };

  const fetchAmount = async () => {
    try {
      setLoading(true);
      const res = await api.get("/amount", {
        params: {
          page: currentPage,
          per_page: entriesPerPage,
          search: search,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      setAmountData(res.data.data || []);
      setTotalEntries(res.data.meta?.total || 0);
    } finally {
      setLoading(false);
    }
  };

  // Export Excel 
  const [exporting, setExporting] = useState(false);

  const handleExportExcel = async () => {
    if (!islogin || !token) {
      alert("សូមចូលគណនីជាមុន");
      return;
    }

    try {
      setExporting(true);
      const endpoint =
        activeTab === "guest"
          ? "/guest/exportcsv"
          : "/amount/exportcsv";

      const response = await api.get(endpoint, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
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
    } finally {
      setExporting(false);
    }
  };

  // ================= COLUMNS =================
  const guestColumns = [
    {
      header: "ល.រ",
      accessor: "guest_id",
      sortable: true,
      render: (row: any) => (
        <div className="flex justify-start items-start">{row.guest_id}</div>
      ),
      width: 40,
    },
    {
      header: "ភ្ញៀវកិត្តិយស",
      accessor: "guest_name",
      sortable: true,
      render: (row: any) => (
        <div className="truncate w-full">{row.guest_name}</div>
      ),
      width: 100,
    },
    {
      header: "ភ្ញៀវខាង",
      accessor: "guest_type",
      sortable: true,
      render: (row: any) => (
        <div className="truncate w-full">{row.guest_type}</div>
      ),
      width: 80,
    },
    {
      header: "លេខទូរស័ព្ទ",
      accessor: "phone_number",
      sortable: true,
      render: (row: any) => (
        <div className="truncate w-full">{row.phone_number}</div>
      ),
      width: 150,
    },
    {
      header: "ទីតាំង",
      accessor: "address",
      sortable: true,
      render: (row: any) => (
        <div className="truncate w-full">{row.address}</div>
      ),
      width: 120,
    },
    {
      header: "សម្គាល់",
      accessor: "remark",
      sortable: true,
      render: (row: any) => (
        <div className="truncate w-full">{row.remark}</div>
      ),
      width: 80,
    },
    {
      header: "យកដៃ/សងដៃ",
      accessor: "give_money_type_name",
      sortable: true,
      render: (row: any) => (
        <div className="mt-3 flex justify-center items-start">
          {row.give_money_type_name}
        </div>
      ),
      width: 55,
      cellPadding: "pl-3 pr-2",
    },
  ];

  const amountColumns = [
    {
      header: "ល.រ",
      accessor: "guest_id",
      sortable: true,
      render: (row: any) => (
        <div className="flex justify-start items-start">{row.guest_id}</div>
      ),
      width: 90,
    },
    {
      header: "ភ្ញៀវកិត្តិយស",
      accessor: "guest_name",
      sortable: true,
      render: (row: any) => (
        <div className="truncate w-full">{row.guest_name}</div>
      ),
      width: 100,
    },
    {
      header: "កាលបរិច្ឆេទ",
      accessor: "date",
      sortable: true,
      render: (row: any) => (
        <div className="truncate w-full">{row.date}</div>
      ),
      width: 120,
    },
    {
      header: "ភ្ញៀវខាង",
      accessor: "guest_type",
      sortable: true,
      render: (row: any) => (
        <div className="truncate w-full">{row.guest_type}</div>
      ),
      width: 80,
    },
    {
      header: "លេខទូរស័ព្ទ",
      accessor: "phone_number",
      sortable: true,
      render: (row: any) => (
        <div className="truncate w-full">{row.phone_number}</div>
      ),
      width: 150,
    },
    {
      header: "ទីតាំង",
      accessor: "address",
      sortable: true,
      render: (row: any) => (
        <div className="truncate w-full">{row.address}</div>
      ),
      width: 120,
    },
    { header: "ចំនួន(KHR)", accessor: "amount_khr", render: (r: any) => `${r.amount_khr} ៛` },
    { header: "ចំនួន(USD)", accessor: "amount_usd", render: (r: any) => `${r.amount_usd} $` },
    { header: "Bank", accessor: "bank_name", render: (r: any) => r.bank_name },
    {
      header: "យកដៃ/សងដៃ",
      accessor: "give_money_type_name",
      sortable: true,
      render: (row: any) => (
        <div className="mt-3 flex justify-center items-start">
          {row.give_money_type_name}
        </div>
      ),
      width: 110,
      cellPadding: "pl-3 pr-2",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title={activeTab === "guest" ? "បញ្ជូលចំណងដៃ" : "ចំណងដៃ"} />
      {/* ================= TABS ================= */}
      <div className="bg-[#E5E5E5] mx-4 h-[46px] items-center rounded-t-xl mt-2 overflow-hidden">
        <div className="flex gap-3 ">
          <button
            onClick={() => {
              setActiveTab("guest");
              setCurrentPage(1);
              setSearch("");
              setTotalEntries(0);
              setAmountData([]);
            }}
            className={` h-[56px] px-6 flex items-center font-medium transition-all rounded-t-[12px]
              ${activeTab === "guest"
                ? "bg-white border-b-2 border-[#E11D48] text-[#E11D48] shadow-sm"
                : "text-gray-500"
              }
          `}
          >
            បញ្ជូលចំណងដៃ
          </button>
          <button
            onClick={() => {
              setActiveTab("amount");
              setCurrentPage(1);
              setSearch("");
              setTotalEntries(0);
              setGuestData([]);
            }}
            className={` h-[56px]  px-6 flex items-center font-medium transition-all rounded-t-[12px]
               ${activeTab === "amount"
                ? "bg-white  border-b-2 border-[#E11D48] text-[#E11D48] shadow-sm"
                : "text-gray-500"
              }
           `}
          >
            ចំណងដៃ
          </button>

        </div>
      </div>
      <div className="mx-4 p-2 bg-white shadow">
        {/* ================= TOOLBAR ================= */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex gap-2">
            <SearchInput
              value={search}
              placeholder="ស្វែងរក..."
              onChange={(e: any) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />

            <DrawerFilter width={400}>
              <div className="space-y-4">
                <div>
                  <label className="text-[#E11D48] font-medium text-base">ឈ្មោះ</label>
                  <Input
                    style={{ backgroundColor: "#ffffff" }}
                    
                    placeholder="បញ្ចូលឈ្មោះ..."
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="text-[#E11D48] font-medium text-base">កាលបរិច្ឆេទ</label>
                  <div className="flex gap-2">
                    <DatePicker
                      style={{ backgroundColor: "  #ffffff" }}
                    
                      className="w-full border-[#E11D48] cursor-pointer h-10"
                    />
                    <DatePicker
                      style={{ backgroundColor: "#ffffff" }}
                      // bordered={false}
                      className="w-full cursor-pointer h-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#E11D48] font-medium text-base">លេខទូរស័ព្ទ</label>
                  <Input
                    style={{ backgroundColor: "#ffffff" }}
                   
                    placeholder="បញ្ចូលលេខទូរស័ព្ទ..."
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="text-[#E11D48] font-medium text-base">ទីតាំង</label>
                  <Input
                    style={{ backgroundColor: "#ffffff" }}
                   
                    placeholder="បញ្ចូលទីតាំង..."
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="text-[#E11D48] font-medium text-base">វិធីបង់ប្រាក់</label>
                  <Input
                    style={{ backgroundColor: "#ffffff" }}
                    
                    placeholder="ស្វែងរកតាមវិធីបង់ប្រាក់..."
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="text-[#E11D48] font-medium text-base">
                    យកដៃ / សងដៃ:
                  </label>
                  <Select
                    className="w-full h-10"
                    placeholder="ជ្រើសរើស..."
                    value={giveMoneyType}
                    allowClear
                    onChange={(value) => setGiveMoneyType(value)}
                    options={[
                      { value: 1, label: "យកដៃ" },
                      { value: 2, label: "សងដៃ" },
                    ]}
                  />
                </div>

                <div className="text-[#E11D48] font-medium text-[16px] block mb-2 gap-1">
                  <label className="text-[#E11D48] mr-7 font-medium text-base">ភ្ញៀវខាង:</label>
                  <Radio.Group className="flex gap-4 mt-2">
                    <Radio value={1}>ខាងប្រុស</Radio>
                    <Radio value={2}>ខាងស្រី</Radio>
                    <Radio value={3}>ទាំងសង​ខាង</Radio>
                  </Radio.Group>
                </div>

                {/* <div className="flex gap-3 mt-6 h-15">
                  <Allbutton
                    Children="បោះបង់"
                    className="bg-[#e7e7e7] text-[#e11d48] shadow-lg text-lg w-40"
                  />
                  <Allbutton
                    Children="អនុវត្តន៍"
                    className="text-white text-lg shadow-lg shadow-[#9c9c9c] w-50"
                  />
                </div> */}

                <div className="flex items-center justify-center gap-4 mt-6 px-4 sm:px-0">
                  <Allbutton
                    children="បោះបង់"           // ← should be lowercase 'children' in most React components
                    className=" bg-gray-200 text-rose-600  hover:bg-gray-200 active:bg-gray-300 shadow-md hover:shadow text-lg font-medium px-6 py-2.5 rounded-lg min-w-[120px] sm:min-w-[140px] transition-all duration-150"
                  />

                  <Allbutton
                    children="អនុវត្តន៍"
                    className="bg-[#e11d48] from-[#e11d48] hover:bg-rose-500  text-white shadow-lg shadow-gray-600/40 text-lg font-medium px-6 py-2.5 rounded-lg min-w-[140px] sm:min-w-[160px] transition-all duration-150"
                  />
                </div>
              </div>
            </DrawerFilter>
          </div>
          <div className="flex gap-2 ">
            {activeTab === "guest" && (
              <Button type="primary" onClick={() => setOpenModal(true)}>
                  <IoMdAdd size={16} />
                  បង្កើតថ្មី
                </Button>
            )}
            <button
              onClick={handleExportExcel}
              disabled={exporting || loading}
              className={`px-4 py-1 rounded flex items-center gap-2 transition
                            ${exporting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#FF89A3] hover:bg-[#e0708a] text-white"}`}
            >
              {exporting ? <>កំពុងទាញយក...</> : <>ទាញយក</>}
            </button>

            <button className="bg-[#686868] text-white px-4 py-1 rounded flex items-center gap-1">
              <RiFileExcel2Line />
              បញ្ចូល
            </button>
          </div>
        </div>

      <ModalCreate
        open={openModal}
        onCancel={() => setOpenModal(false)}
        onSubmit={async (data) => {
          try {
            if (!token) return;

            await api.post("/guest", data, {
              headers: { Authorization: `Bearer ${token}` },
            });

            setOpenModal(false);
            fetchGuest(); // refresh table
          } catch (err) {
            console.error(err);
          }
        }}
        type="guest"
      />

        {/* ================= TABLE ================= */}
        {activeTab === "guest" && (
          <Table
            data={guestData}
            columns={guestColumns}
            loading={loading}
            height="15rem"
          />
        )}

        {activeTab === "amount" && (
          <Table
            data={amountData}
            columns={amountColumns}
            loading={loading}
            height="15rem"
          />
        )}

        {/* ================= PAGINATION ================= */}
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