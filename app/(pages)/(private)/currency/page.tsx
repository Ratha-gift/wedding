"use client";

import api from "@/app/server/api";
import { useEffect, useState, useRef } from "react";
import { IoMdAdd } from "react-icons/io";
import { RiFileExcel2Line } from "react-icons/ri";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

import Header from "@/app/src/Components/Header/header";
import Table from "@/app/src/Components/Table/table";
import NoDataComponent from "@/app/src/Components/Empty/Nodata";
import MyPagination from "@/app/src/Components/Pagination/pagination";
import SearchInput from "@/app/src/Components/input/input";
import { Input, DatePicker, Radio, Select, Button, message, Modal, Upload } from "antd";
import { CloudUploadOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

import DrawerFilter from "@/app/src/Components/Button/filter";
import Allbutton from "@/app/src/Components/Button/allbutton";

import { useAuth } from "@/app/src/lib/useAuth";
import { useRequireAuth } from "@/app/src/Hooks/useAuthRedirect";
import ModalCreate from "@/app/src/Components/Modal/modal";

export default function GuestCurrencyPage() {
  useRequireAuth();
  const { islogin, token, hasHydrated } = useAuth();

  const [activeTab, setActiveTab] = useState<"guest" | "amount">("guest");

  // Filter state
  const [filterName,      setFilterName]      = useState("");
  const [filterPhone,     setFilterPhone]      = useState("");
  const [filterAddress,   setFilterAddress]    = useState("");
  const [filterGuestType, setFilterGuestType]  = useState<string>("");
  const [giveMoneyType,   setGiveMoneyType]    = useState<number | undefined>();
  const [giveMoneyStatus, setGiveMoneyStatus]  = useState<number | undefined>();
  const [paymentMethod,   setPaymentMethod]    = useState<number | undefined>();
  const [startDate,       setStartDate]        = useState<any>(null);
  const [endDate,         setEndDate]          = useState<any>(null);

  const clearFilters = () => {
    setFilterName(""); setFilterPhone(""); setFilterAddress("");
    setFilterGuestType(""); setGiveMoneyType(undefined);
    setGiveMoneyStatus(undefined); setPaymentMethod(undefined);
    setStartDate(null); setEndDate(null);
  };

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalEntries, setTotalEntries] = useState(0);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [guestData, setGuestData] = useState<any[]>([]);
  const [amountData, setAmountData] = useState<any[]>([]);
  const [grandTotal, setGrandTotal] = useState({ khr_cash: 0, khr_bank: 0, usd_cash: 0, usd_bank: 0 });

  const [loading, setLoading] = useState(false);

  // Amount table column resizing
  const [colWidths, setColWidths] = useState([
    50,   // [0]  ល.រ
    // 50,   // [1]  រូបភាព
    150,  // [1]  ភ្ញៀវកិត្តិយស
    160,  // [2]  កាលបរិច្ឆេទ
    90,   // [3]  ភ្ញៀវខាង
    130,  // [4]  លេខទូរស័ព្ទ
    180,  // [5]  ទីតាំង
    110,  // [6]  Cash - KHR
    100,  // [7]  Cash - USD
    110,  // [8]  Bank - KHR
    100,  // [9]  Bank - USD
    100,  // [10] យកដៃ/សងដៃ
  ]);
  const [resizingCol, setResizingCol] = useState<{ idx: number; startX: number; startW: number } | null>(null);
  const amountTableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizingCol) return;
      const diff = e.clientX - resizingCol.startX;
      const newW = Math.max(40, resizingCol.startW + diff);
      setColWidths(prev => { const n = [...prev]; n[resizingCol.idx] = newW; return n; });
    };
    const handleMouseUp = () => {
      setResizingCol(null);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    if (resizingCol) {
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
  }, [resizingCol]);

  const startColResize = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    e.preventDefault();
    setResizingCol({ idx, startX: e.clientX, startW: colWidths[idx] });
  };

  const [modalType, setModalType] = useState<"guest" | "currency">("guest");

  const KHR_ID = 1, USD_ID = 2, CASH_ID = 1, BANK_ID = 2;

  const buildEditData = (row: any) => {
    const gm = (row.give_money ?? []) as any[];
    const findAmt = (cId: number, pmId: number) =>
      Number(gm.find((r: any) => r.currency_id === cId && r.payment_method_id === pmId)?.amount ?? 0);
    return {
      ...row,
      amount_khr: findAmt(KHR_ID, CASH_ID),
      bank_khr:   findAmt(KHR_ID, BANK_ID),
      amount_usd: findAmt(USD_ID, CASH_ID),
      bank_usd:   findAmt(USD_ID, BANK_ID),
      images: gm.map((r: any) => r.image).filter(Boolean),
    };
  };

  const fmtDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: false,
      });
    } catch {
      return dateStr;
    }
  };

  const [openModal, setOpenModal] = useState(false);


  // ================= FETCH =================
  useEffect(() => {
    if (!hasHydrated) return;
    if (islogin && token) {
      if (activeTab === "guest") fetchGuest();
      if (activeTab === "amount") fetchAmount();
    }
  }, [activeTab, currentPage, entriesPerPage, search, token, islogin, hasHydrated]);

  const filterParams = () => ({
    search:             search          || undefined,
    guest_name:         filterName      || undefined,
    phone_number:       filterPhone     || undefined,
    address:            filterAddress   || undefined,
    guest_type:         filterGuestType || undefined,
    give_money_type_id: giveMoneyType   || undefined,
    give_money_status:  giveMoneyStatus || undefined,
    payment_method_id:  paymentMethod   || undefined,
    start_date:         startDate ? startDate.format("YYYY-MM-DD") : undefined,
    end_date:           endDate   ? endDate.format("YYYY-MM-DD")   : undefined,
  });

  const fetchGuest = async () => {
    try {
      setLoading(true);
      const res = await api.get("/guest", {
        params: { page: currentPage, per_page: entriesPerPage, ...filterParams() },
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
      const [pageRes, allRes] = await Promise.all([
        api.get("/guest", {
          params: { page: currentPage, per_page: entriesPerPage, ...filterParams() },
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/guest", {
          params: { page: 1, per_page: 9999, ...filterParams(), search: undefined },
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setAmountData(pageRes.data.data || []);
      setTotalEntries(pageRes.data.meta?.total || 0);

      const all: any[] = allRes.data.data || [];
      const sumGiveMoney = (cId: number, pmId: number) =>
        all.reduce((s, r) => {
          const rec = (r.give_money ?? []).find((g: any) => g.currency_id === cId && g.payment_method_id === pmId);
          return s + (Number(rec?.amount) || 0);
        }, 0);
      setGrandTotal({
        khr_cash: sumGiveMoney(KHR_ID, CASH_ID),
        khr_bank: sumGiveMoney(KHR_ID, BANK_ID),
        usd_cash: sumGiveMoney(USD_ID, CASH_ID),
        usd_bank: sumGiveMoney(USD_ID, BANK_ID),
      });
    } finally {
      setLoading(false);
    }
  };

  // Export / Import
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);

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
          : "/guest/amount-exportcsv";

      const response = await api.get(endpoint, {
        responseType: "blob",
        params: { ...filterParams(), search: undefined },
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

  const handleImportUpload = async () => {
    if (!importFile || !token) return;
    const fd = new FormData();
    fd.append('file', importFile);
    try {
      setImporting(true);
      await api.post('/guest/importcsv', fd, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      message.success('បញ្ចូលជោគជ័យ');
      setImportModalOpen(false);
      setImportFile(null);
      fetchGuest();
      fetchAmount();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'បញ្ចូលបានបរាជ័យ';
      message.error(msg, 6);
    } finally {
      setImporting(false);
    }
  };

  const filteredGuestData = search.trim()
    ? guestData.filter((row) =>
        row.guest_name?.toLowerCase().includes(search.trim().toLowerCase())
      )
    : guestData;

  const filteredAmountData = search.trim()
    ? amountData.filter((row) =>
        row.guest_name?.toLowerCase().includes(search.trim().toLowerCase())
      )
    : amountData;

  const displayTotal = search.trim()
    ? (activeTab === "guest" ? filteredGuestData.length : filteredAmountData.length)
    : totalEntries;

  // ================= COLUMNS Guest =================
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
    //  NEW IMAGE COLUMN
    {
      header: "រូបភាព",
      accessor: "image",        
      width: 40,
      render: (row: any) => {
        const src = row.image || row.photo || row.avatar
          || (row.give_money ?? []).map((g: any) => g.image).find(Boolean);
        return (
          <div className="flex justify-start">
            <Avatar
              size={30}
              src={src}
              icon={<UserOutlined />}
              className="border border-gray-300"
            />
          </div>
        );
      },
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
        <div className="truncate w-full">{fmtDate(row.date)}</div>
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
            className={` h-[56px] px-6 cursor-pointer flex items-center font-medium transition-all rounded-t-[12px]
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
            className={` h-[56px] cursor-pointer px-6 flex items-center font-medium transition-all rounded-t-[12px]
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
                {/* <div>
                  <label className="text-[#E11D48] font-medium text-base">ឈ្មោះ</label>
                  <Input
                    style={{ backgroundColor: "#ffffff" }}
                    placeholder="បញ្ចូលឈ្មោះ..."
                    className="h-10"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                  />
                </div> */}

                <div>
                  <label className="text-[#E11D48] font-medium text-base">កាលបរិច្ឆេទ</label>
                  <div className="flex gap-2">
                    <DatePicker
                      style={{ backgroundColor: "#ffffff" }}
                      className="w-full border-[#E11D48] cursor-pointer h-10"
                      value={startDate}
                      onChange={(date) => setStartDate(date)}
                      placeholder="ពី  ..."
                    />
                    <DatePicker
                      style={{ backgroundColor: "#ffffff" }}
                      className="w-full cursor-pointer h-10"
                      value={endDate}
                      onChange={(date) => setEndDate(date)}
                      placeholder="ដល់..."
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#E11D48] font-medium text-base">លេខទូរស័ព្ទ</label>
                  <Input
                    style={{ backgroundColor: "#ffffff" }}
                    placeholder="បញ្ចូលលេខទូរស័ព្ទ..."
                    className="h-10"
                    value={filterPhone}
                    onChange={(e) => setFilterPhone(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-[#E11D48] font-medium text-base">ទីតាំង</label>
                  <Input
                    style={{ backgroundColor: "#ffffff" }}
                    placeholder="បញ្ចូលទីតាំង..."
                    className="h-10"
                    value={filterAddress}
                    onChange={(e) => setFilterAddress(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[#E11D48] font-medium text-base">វិធីបង់ប្រាក់</label>
                  <Select
                    className="w-full h-10"
                    placeholder="ជ្រើសរើស..."
                    value={paymentMethod}
                    allowClear
                    onChange={(value) => setPaymentMethod(value)}
                    options={[
                      { value: 1, label: "សាច់ប្រាក់ (Cash)" },
                      { value: 2, label: "ធនាគារ (Bank)" },
                    ]}
                  />
                </div>

                <div>
                  <label className="text-[#E11D48] font-medium text-base">ប្រភេទចំណងដៃ</label>
                  <Select
                    className="w-full h-10"
                    placeholder="ជ្រើសរើស..."
                    value={giveMoneyStatus}
                    allowClear
                    onChange={(value) => setGiveMoneyStatus(value)}
                    options={[
                      { value: 1, label: "ចងដៃរួច" },
                      { value: 2, label: "មិនទាន់រួច" },
                    ]}
                  />
                </div>

                <div>
                  <label className="text-[#E11D48] font-medium text-base">យកដៃ / សងដៃ</label>
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
                  <Radio.Group
                    value={filterGuestType}
                    onChange={(e) => setFilterGuestType(e.target.value)}
                    className="flex gap-4 mt-2"
                  >
                    <Radio value="ខាងប្រុស">ខាងប្រុស</Radio>
                    <Radio value="ខាងស្រី">ខាងស្រី</Radio>
                    <Radio value="">ទាំងអស់</Radio>
                  </Radio.Group>
                </div>

                <div className="flex items-center justify-center gap-4 mt-30 px-4 sm:px-0">
                  <Allbutton
                    children="បោះបង់"
                    className=" bg-gray-200 text-rose-600  hover:bg-gray-200 active:bg-gray-300 shadow-md hover:shadow text-lg font-medium px-6 py-2.5 rounded-lg min-w-[120px] sm:min-w-[140px] transition-all duration-150"
                    onClick={clearFilters}
                  />

                  <Allbutton
                    children="អនុវត្តន៍"
                    className="bg-[#e11d48] from-[#e11d48] hover:bg-rose-500  text-white shadow-lg shadow-gray-600/40 text-lg font-medium px-6 py-2.5 rounded-lg min-w-[140px] sm:min-w-[160px] transition-all duration-150"
                    onClick={() => { setCurrentPage(1); activeTab === "guest" ? fetchGuest() : fetchAmount(); }}
                  />
                </div>
              </div>
            </DrawerFilter>
          </div>
          <div className="flex gap-2 ">
            {activeTab === "guest" && (
              <Button
                type="primary"
                onClick={() => {
                  setSelectedData(null);
                  setModalType("currency");
                  setOpenModal(true);
                }}
              >
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

            <button
              onClick={() => { setImportFile(null); setImportModalOpen(true); }}
              className="bg-[#686868] hover:bg-[#4a4a4a] text-white px-4 py-1 rounded flex items-center gap-1 transition"
            >
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
              if (!token) {
                message.error("សូមចូលគណនីឡើងវិញ");
                return;
              }
              const headers = { Authorization: `Bearer ${token}` };
              const isEdit = !!selectedData?.guest_id;

              const guestPayload = {
                guest_name: data.guest_name,
                phone_number: data.phone_number,
                address: data.address,
                remark: data.remark,
                guest_type: data.guest_type,
                give_money_type_id: data.give_money_type_id,
              };

              const toBlob = (img: string) => {
                const base64 = img.startsWith('data:') ? img.split(',')[1] : img;
                const mime   = img.startsWith('data:') ? img.split(';')[0].split(':')[1] : 'image/jpeg';
                const bytes  = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
                return new Blob([bytes], { type: mime });
              };

              const today = new Date().toISOString().slice(0, 19).replace('T', ' ');

              // Send one give-money record per non-zero amount
              const sendGiveMoney = async (guestId: number) => {
                const records = [
                  { amount: data.amount_khr, currency_id: KHR_ID, payment_method_id: CASH_ID },
                  { amount: data.bank_khr,   currency_id: KHR_ID, payment_method_id: BANK_ID },
                  { amount: data.amount_usd, currency_id: USD_ID, payment_method_id: CASH_ID },
                  { amount: data.bank_usd,   currency_id: USD_ID, payment_method_id: BANK_ID },
                ].filter(r => Number(r.amount) > 0);

                const images: string[] = data.images ?? [];

                // If no amounts but has image, still save with amount=0 using first currency
                if (records.length === 0 && images.length > 0) {
                  records.push({ amount: 0, currency_id: KHR_ID, payment_method_id: CASH_ID });
                }

                for (let i = 0; i < records.length; i++) {
                  const rec = records[i];
                  const fd  = new FormData();
                  fd.append('guest_id',          String(guestId));
                  fd.append('date',              today);
                  fd.append('amount',            String(rec.amount));
                  fd.append('currency_id',       String(rec.currency_id));
                  fd.append('payment_method_id', String(rec.payment_method_id));
                  if (data.remark) fd.append('remark', data.remark);
                  if (images[i] && images[i].startsWith('data:')) {
                    fd.append('image', toBlob(images[i]), `image_${i}.jpg`);
                  }

                  try {
                    console.log(`[Give Money ${i + 1}]`, { amount: rec.amount, currency_id: rec.currency_id, payment_method_id: rec.payment_method_id, date: today });
                    await api.post(`/guest/${guestId}/give-money`, fd, {
                      headers: { ...headers, 'Content-Type': 'multipart/form-data' },
                    });
                  } catch (err: any) {
                    const d   = err?.response?.data;
                    const msg = d?.errors
                      ? Object.values(d.errors).flat().join(', ')
                      : d?.message || 'Give-money save failed';
                    throw new Error(`[Give Money record ${i + 1}] ${msg}`);
                  }
                }
              };

              if (modalType === "currency") {
                let guestId = selectedData?.guest_id;

                if (isEdit) {
                  try {
                    await api.put(`/guest/update/${guestId}`, guestPayload, { headers });
                  } catch (updateErr: any) {
                    const errData = updateErr?.response?.data;
                    const msg = errData?.errors
                      ? Object.values(errData.errors).flat().join(', ')
                      : errData?.message || "Update guest failed";
                    throw new Error(`[Update Guest] ${msg}`);
                  }

                  const orig = selectedData ?? {};
                  const amountsChanged =
                    Number(data.amount_khr) !== Number(orig.amount_khr ?? 0) ||
                    Number(data.bank_khr)   !== Number(orig.bank_khr   ?? 0) ||
                    Number(data.amount_usd) !== Number(orig.amount_usd ?? 0) ||
                    Number(data.bank_usd)   !== Number(orig.bank_usd   ?? 0);
                  const hasNewImages = (data.images ?? []).some((img: string) => img.startsWith('data:'));
                  if (amountsChanged || hasNewImages) {
                    await sendGiveMoney(guestId);
                  }
                  message.success("កែប្រែជោគជ័យ");
                } else {
                  // Step 1: create guest
                  let guestRes: any;
                  try {
                    console.log("[Step 1 - Guest] Payload:", guestPayload);
                    guestRes = await api.post("/guest/create", guestPayload, { headers });
                  } catch (guestErr: any) {
                    const errData = guestErr?.response?.data;
                    const msg = errData?.errors
                      ? Object.values(errData.errors).flat().join(', ')
                      : errData?.message || "Guest creation failed";
                    throw new Error(`[Step 1 - Guest] ${msg}`);
                  }

                  guestId = guestRes.data?.data?.guest_id
                    ?? guestRes.data?.guest_id
                    ?? guestRes.data?.id;

                  if (!guestId) throw new Error("[Step 1] guest_id not found: " + JSON.stringify(guestRes.data));

                  // Step 2: give-money
                  await sendGiveMoney(guestId);
                  message.success("បង្កើតជោគជ័យ");
                }

                fetchGuest();
                fetchAmount();
              } else {
                await api.post("/guest/create", data, { headers });
                fetchGuest();
              }

              setOpenModal(false);
            } catch (err: any) {
              const msg = err?.message || err?.response?.data?.message || "មានបញ្ហាក្នុងការរក្សាទិន្នន័យ។";
              message.error(msg, 6);
              console.error("Submit error:", err?.response?.data ?? err?.message ?? err);
            }
          }}
          type={modalType}

          mode={selectedData?.guest_id ? "edit" : "create"}
          initialData={selectedData}
        />

        {/* ================= IMPORT MODAL ================= */}
        <Modal
          title={<span className="text-base font-semibold">បញ្ចូលឯកសារ</span>}
          open={importModalOpen}
          onCancel={() => { setImportModalOpen(false); setImportFile(null); }}
          centered
          footer={null}
          width={420}
        >
          <Dragger
            accept=".xlsx,.xls,.csv"
            maxCount={1}
            beforeUpload={(file) => { setImportFile(file); return false; }}
            onRemove={() => setImportFile(null)}
            fileList={importFile ? [{ uid: '1', name: importFile.name, status: 'done' }] : []}
          >
            <p className="ant-upload-drag-icon">
              <CloudUploadOutlined style={{ fontSize: 48, color: '#7c3aed' }} />
            </p>
            <p className="ant-upload-text">Drag or drop files, or <span className="text-blue-500">Browse</span></p>
            <p className="ant-upload-hint text-gray-400 text-xs mt-1">.xlsx, .xls, .csv</p>
          </Dragger>
          <Button
            type="primary"
            block
            className="mt-4"
            loading={importing}
            disabled={!importFile}
            onClick={handleImportUpload}
          >
            Upload
          </Button>
        </Modal>

        {/* ================= TABLE ================= */}
        {activeTab === "guest" && (
          <Table
            data={filteredGuestData}
            columns={guestColumns}
            loading={loading}
            height="15rem"
            clickableRows={true}
              onRowSelect ={(row: any) => {
              setSelectedData(buildEditData(row));
              setModalType("currency");
              setOpenModal(true);
            }}
          />
        )}

        {activeTab === "amount" && (
          <div ref={amountTableRef} className="relative overflow-x-auto rounded-lg text-sm custom-scrollbar" style={{ height: "calc(100vh - 15rem)" }}>
            <table className="w-full border-collapse">
              <thead>
                {/* Row 1 — grouped headers */}
                <tr>
                  {[
                    { label: "ល.រ",             colIdx: 0,    rowSpan: 2, colSpan: 1 },
                    // { label: "រូបភាព",          colIdx: null, rowSpan: 2, colSpan: 1 },
                    { label: "ភ្ញៀវកិត្តិយស", colIdx: 1,    rowSpan: 2, colSpan: 1 },
                    { label: "កាលបរិច្ឆេទ",    colIdx: 2,    rowSpan: 2, colSpan: 1 },
                    { label: "ភ្ញៀវខាង",        colIdx: 3,    rowSpan: 2, colSpan: 1 },
                    { label: "លេខទូរស័ព្ទ",     colIdx: 4,    rowSpan: 2, colSpan: 1 },
                    { label: "ទីតាំង",          colIdx: 5,    rowSpan: 2, colSpan: 1 },
                    { label: "សាច់ប្រាក់(Cash)",  colIdx: null, rowSpan: 1, colSpan: 2 },
                    { label: "ធានាគា(Bank)",  colIdx: null, rowSpan: 1, colSpan: 2 },
                    { label: "យកដៃ/សងដៃ",      colIdx: 10,   rowSpan: 2, colSpan: 1 },
                  ].map((col, i) => (
                    <th
                      key={i}
                      colSpan={col.colSpan}
                      rowSpan={col.rowSpan}
                      className="p-3 text-center sticky top-0 z-20 text-white bg-[#E11D48] text-sm uppercase tracking-wider border border-rose-400 group"
                      style={col.colIdx !== null ? { width: colWidths[col.colIdx], minWidth: colWidths[col.colIdx] } : {}}
                    >
                      {col.label}
                      {col.colIdx !== null && (
                        <div
                          className={`absolute right-0 top-1/2 -translate-y-1/2 h-8 w-0.5 cursor-col-resize rounded transition-all duration-200 ${resizingCol?.idx === col.colIdx ? 'bg-blue-400 scale-110' : 'bg-white/70 hover:bg-blue-300 hover:w-1'}`}
                          onMouseDown={(e) => startColResize(e, col.colIdx!)}
                        />
                      )}
                    </th>
                  ))}
                </tr>
                {/* Row 2 — sub-headers */}
                <tr>
                  {([
                    { label: "KHR", colIdx: 6 },
                    { label: "USD",        colIdx: 7 },
                    { label: "KHR", colIdx: 8 },
                    { label: "USD",        colIdx: 9 },
                  ] as { label: string; colIdx: number }[]).map((sub) => (
                    <th
                      key={sub.colIdx}
                      className="p-2 text-center sticky z-20 text-white bg-[#E11D48] text-xs uppercase tracking-wider border border-rose-400 group"
                      style={{ top: '44px', width: colWidths[sub.colIdx], minWidth: colWidths[sub.colIdx] }}
                    >
                      {sub.label}
                      <div
                        className={`absolute right-0 top-1/2 -translate-y-1/2 h-6 w-0.5 cursor-col-resize rounded transition-all duration-200 ${resizingCol?.idx === sub.colIdx ? 'bg-blue-400 scale-110' : 'bg-white/70 hover:bg-blue-300 hover:w-1'}`}
                        onMouseDown={(e) => startColResize(e, sub.colIdx)}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Summary row */}
                <tr className="sticky z-10 bg-white" style={{ top: '82px' }}>
                  <td colSpan={6} className="p-2 text-right font-semibold text-[#E11D48] text-sm border border-gray-200">
                    ទឹកប្រាក់សរុប :
                  </td>
                  <td className="p-2 text-center font-bold text-[#E11D48] text-sm border border-gray-200">
                    {grandTotal.khr_cash.toLocaleString()} ៛
                  </td>
                  <td className="p-2 text-center font-bold text-[#E11D48] text-sm border border-gray-200">
                    {grandTotal.usd_cash.toLocaleString()} USD
                  </td>
                  <td className="p-2 text-center font-bold text-[#E11D48] text-sm border border-gray-200">
                    {grandTotal.khr_bank.toLocaleString()} ៛
                  </td>
                  <td className="p-2 text-center font-bold text-[#E11D48] text-sm border border-gray-200">
                    {grandTotal.usd_bank.toLocaleString()} USD
                  </td>
                  <td className="border border-gray-200" />
                </tr>
                {loading ? (
                  <tr><td colSpan={11} className="p-4 h-60 text-center">{/* loading */}</td></tr>
                ) : amountData.length === 0 ? (
                  <tr><td colSpan={11} className="p-3 text-center"><NoDataComponent /></td></tr>
                ) : (
                  filteredAmountData.map((row, idx) => {
                    const gm = row.give_money ?? [];
                    const findAmt = (cId: number, pmId: number) =>
                      Number(gm.find((g: any) => g.currency_id === cId && g.payment_method_id === pmId)?.amount) || 0;
                    const khrCash = findAmt(KHR_ID, CASH_ID);
                    const usdCash = findAmt(USD_ID, CASH_ID);
                    const khrBank = findAmt(KHR_ID, BANK_ID);
                    const usdBank = findAmt(USD_ID, BANK_ID);
                    return (
                    <tr
                      key={row.guest_id ?? idx}
                      className="hover:bg-rose-50 cursor-pointer transition-colors"
                      onClick={() => { setSelectedData(buildEditData(row)); setModalType("currency"); setOpenModal(true); }}
                    >
                      <td className="p-3 text-sm border border-gray-100" style={{ width: colWidths[0], minWidth: colWidths[0] }}>{row.guest_id}</td>
                      <td className="p-3 text-sm border border-gray-100" style={{ width: colWidths[1], minWidth: colWidths[1] }}>{row.guest_name}</td>
                      <td className="p-3 text-sm border border-gray-100" style={{ width: colWidths[2], minWidth: colWidths[2] }}>
                        {fmtDate(row.give_money?.[row.give_money.length - 1]?.date)}
                      </td>
                      <td className="p-3 text-sm border border-gray-100" style={{ width: colWidths[3], minWidth: colWidths[3] }}>{row.guest_type}</td>
                      <td className="p-3 text-sm border border-gray-100" style={{ width: colWidths[4], minWidth: colWidths[4] }}>{row.phone_number}</td>
                      <td className="p-3 text-sm border border-gray-100" style={{ width: colWidths[5], minWidth: colWidths[5] }}>{row.address}</td>
                      <td className="p-3 text-sm text-center border border-gray-100 font-medium" style={{ width: colWidths[6], minWidth: colWidths[6] }}>
                        {khrCash ? `${khrCash.toLocaleString()} ៛` : <span className="text-gray-300">0 ៛</span>}
                      </td>
                      <td className="p-3 text-sm text-center border border-gray-100 font-medium" style={{ width: colWidths[7], minWidth: colWidths[7] }}>
                        {usdCash ? `${usdCash.toLocaleString()} USD` : <span className="text-gray-300">0 USD</span>}
                      </td>
                      <td className="p-3 text-sm text-center border border-gray-100 font-medium" style={{ width: colWidths[8], minWidth: colWidths[8] }}>
                        {khrBank ? `${khrBank.toLocaleString()} ៛` : <span className="text-gray-300">0 ៛</span>}
                      </td>
                      <td className="p-3 text-sm text-center border border-gray-100 font-medium" style={{ width: colWidths[9], minWidth: colWidths[9] }}>
                        {usdBank ? `${usdBank.toLocaleString()} USD` : <span className="text-gray-300">0 USD</span>}
                      </td>
                      <td className="p-3 text-sm text-center border border-gray-100" style={{ width: colWidths[10], minWidth: colWidths[10] }}>{row.give_money_type_name}</td>
                    </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ================= PAGINATION ================= */}
        <div className="flex justify-end mt-3">
          <MyPagination
            currentPage={currentPage}
            totalEntries={displayTotal}
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