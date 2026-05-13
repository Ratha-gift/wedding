"use client";
// api
import api from "@/app/server/api";
import { useEffect, useState } from "react";
import { RiFileExcel2Line } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
import { message, Select, Modal, Upload } from "antd";
import { CloudUploadOutlined } from "@ant-design/icons";

const { Dragger } = Upload;
// components
import Header from "@/app/src/Components/Header/header";
import Table from "@/app/src/Components/Table/table";
import MyPagination from "@/app/src/Components/Pagination/pagination";
import ModalCreate from "@/app/src/Components/Modal/modal";

import DrawerFilter from "@/app/src/Components/Button/filter";
import SearchInput from "@/app/src/Components/input/input";
import { useAuth } from "../../../src/lib/useAuth";
import { Input, DatePicker, Radio, Button } from "antd";
import Allbutton from "@/app/src/Components/Button/allbutton";
import { useRequireAuth } from '@/app/src/Hooks/useAuthRedirect';

export default function GuestInformationTable() {
  useRequireAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const [mode, setMode] = useState<"create" | "edit">("create");

  // Sorting state
  const [sortBy, setSortBy] = useState<string>("guest_id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState("");

  //filter
  const [filterName, setFilterName] = useState("");
  const [filterPhone, setFilterPhone] = useState("");
  const [filterAddress, setFilterAddress] = useState("");
  const [filterGuestType, setFilterGuestType] = useState("");
  const [giveMoneyType, setGiveMoneyType] = useState<number | undefined>(undefined);
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);

  // Pagination & data 
  const [data, setData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalEntries, setTotalEntries] = useState(0);
  const [loading, setLoading] = useState(false);

  const { islogin, token, hasHydrated } = useAuth();

  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, sortDirection]);

  // // load when token ready
  // useEffect(() => {
  //   if (token) {
  //     fetchGuest();
  //   }
  // }, [token]);
  // Fetch guests 
  useEffect(() => {
    if (!hasHydrated) return;
    if (token) {
      fetchGuest();
    }
  }, [currentPage, entriesPerPage, sortBy, sortDirection, startDate, filterGuestType, giveMoneyType, endDate, search, token, hasHydrated]);

    // filterGuestType, filterName, filterPhone, filterAddress, startDate, endDate,

  const fetchGuest = async () => {
    if (!token) return;
    try {
      setLoading(true);

      const res = await api.get("/guest", {
        params: {
          page: currentPage,
          per_page: entriesPerPage,
          sort_by: sortBy,
          sort_direction: sortDirection,
          search: search,

          // ✅ ADD FILTERS HERE
          guest_type: filterGuestType || undefined,
          start_date: startDate ? startDate.format("YYYY-MM-DD") : undefined,
          end_date: endDate ? endDate.format("YYYY-MM-DD") : undefined,

          //  (if backend supports)
          guest_name: filterName || undefined,
          phone_number: filterPhone || undefined,
          address: filterAddress || undefined,
          give_money_type_id: giveMoneyType || undefined,

        },
        headers: {
          Authorization: `Bearer ${token}`,
        
        },
      });

      const rows = res.data.data || [];
      setData(rows);
      setTotalEntries(res.data.meta?.total || 0);
    } catch (err: any) {
      console.error("FETCH ERROR:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // const handleSuccess = () => {
  //   fetchGuest();
  // }

  const filteredData = search.trim()
    ? data.filter((row) =>
        row.guest_name?.toLowerCase().includes(search.trim().toLowerCase())
      )
    : data;

  const displayTotal = search.trim() ? filteredData.length : totalEntries;

  const columns = [
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
      header: "កាលបរិច្ឆេទ",
      accessor: "created_at",
      sortable: true,
      render: (row: any) => {
        const raw = row.created_at;
        if (!raw) return <div className="truncate w-full">—</div>;
        const d = new Date(raw);
        const formatted = isNaN(d.getTime()) ? raw : d.toISOString().slice(0, 10);
        return <div className="truncate w-full">{formatted}</div>;
      },
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

  // fetch Create

  const handleSubmitGuest = async (formData: any) => {
    try {
      setSaving(true);

      const payload = {
        guest_name: formData.guest_name,
        guest_type: formData.guest_type,
        phone_number: formData.phone_number,
        address: formData.address,
        remark: formData.remark,
        give_money_type_id: formData.give_money_type_id,
        user_id: 1 
      };

      if (mode === "edit" && formData.guest_id) {
        await api.put(`/guest/update/${formData.guest_id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("កែប្រែជោគជ័យ ");
      } else {
        await api.post("/guest/create", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("បង្កើតជោគជ័យ ");
      }

      setModalOpen(false);
      setSelectedRow(null);
      await fetchGuest();

    } catch (err: any) {
      message.error("រក្សាទុកបរាជ័យ ");
    } finally {
      setSaving(false);
    }
  };

  // // fetch update  
  // const handleEdit = (row: any) => {
  //   setMode("edit");
  //   setSelectedRow(row);
  //   setModalOpen(true);
  // };

  // Export / Import
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);

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
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'បញ្ចូលបានបរាជ័យ';
      message.error(msg, 6);
    } finally {
      setImporting(false);
    }
  };

  const handleExportExcel = async () => {
    if (!islogin || !token) {
      alert("សូមចូលគណនីជាមុន");
      return;
    }

    try {
      setExporting(true);
      const response = await api.get("/guest/exportcsv", {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
        alert("ផុតកំណត់ — សូមចូលគណនីឡើងវិញ");
      } else if (err.response?.status === 403) {
        alert("អ្នកមិនមានសិទ្ធិទាញយកទិន្នន័យនេះទេ");
      } else {
        alert("មានបញ្ហាក្នុងការទាញយកឯកសារ។ សូមព្យាយាមម្តងទៀត។");
      }
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div>
        <Header title="បញ្ចូលភ្ញៀវកិត្តិយស" />
      </div>

      <div className="mx-4 p-2 bg-white mt-3 shadow">
        {/* TOOLBAR */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex gap-2">
            <SearchInput
              value={search}
              placeholder="ស្វែងរកភ្ញៀវ..."
              onChange={(e: any) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />

            <DrawerFilter width={400}>
              <div className="space-y-4">
                {/* <div>
                  <label className="text-red-600 font-medium text-base">ឈ្មោះ</label>
                  <Input
                    style={{ backgroundColor: "#ffffff" }}
                    bordered={false}
                    placeholder="បញ្ចូលឈ្មោះ..."
                    className="h-10"
                      value={filterName}
                      onChange={(e) => setFilterName(e.target.value)}
                  />
                </div> */}

                <div>
                  <label className="text-red-600 font-medium text-base">កាលបរិច្ឆេទ</label>
                  <div className="flex gap-2">
                    <DatePicker
                      style={{ backgroundColor: "#ffffff" }}
                      bordered={false}
                      className="w-full cursor-pointer h-10"
                      value={startDate}
                      onChange={(date) => setStartDate(date)}
                      placeholder="ពី..."
                    />
                    <DatePicker
                      style={{ backgroundColor: "#ffffff" }}
                      bordered={false}
                      className="w-full cursor-pointer h-10"
                      value={endDate}
                      onChange={(date) => setEndDate(date)}
                      placeholder="ដល់..."
                    />
                  </div>
                </div>

                <div>
                  <label className="text-red-600 font-medium text-base">លេខទូរស័ព្ទ</label>
                  <Input
                    style={{ backgroundColor: "#ffffff" }}
                    bordered={false}
                    
                    placeholder="បញ្ចូលលេខទូរស័ព្ទ..."
                    className="h-10"
                      value={filterPhone}
                      onChange={(e) => setFilterPhone(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-red-600 font-medium text-base">ទីតាំង</label>
                  <Input
                    style={{ backgroundColor: "#ffffff" }}
                    bordered={false}
                    placeholder="បញ្ចូលទីតាំង..."
                    className="h-10"
                      value={filterAddress}
                     onChange={(e) => setFilterAddress(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[#E11D48] font-medium text-base">
                    យកដៃ / សងដៃ:
                  </label>
                  < Select
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

                <div className="flex items-center justify-center gap-4 mt-60 px-4 sm:px-0">
                  <Allbutton
                    children="បោះបង់"
                    className=" bg-gray-200 text-rose-600  hover:bg-gray-200 active:bg-gray-300 shadow-md hover:shadow text-lg font-medium px-6 py-2.5 rounded-lg min-w-[120px] sm:min-w-[140px] transition-all duration-150"
                    onClick={() => {
                      setFilterName(""); setFilterPhone(""); setFilterAddress("");
                      setFilterGuestType(""); setGiveMoneyType(undefined); setStartDate(null); setEndDate(null);
                    }}
                  />

                  <Allbutton
                    children="អនុវត្តន៍"
                    className="bg-[#e11d48] from-[#e11d48] hover:bg-rose-500  text-white shadow-lg shadow-gray-600/40 text-lg font-medium px-6 py-2.5 rounded-lg min-w-[140px] sm:min-w-[160px] transition-all duration-150"
                     onClick={() => {
                      if (loading) return;
                      setCurrentPage(1);
                      fetchGuest();
                    }}
                  />
                </div>
              </div>
            </DrawerFilter>
          </div>

          <div className="flex gap-2 ">
            <Button
              type="primary"
              onClick={() => {
                // if (!user?.id) {
                //   message.error("សូមចូលគណនីជាមុន");
                //   return;
                // }
                setMode("create");
                setSelectedRow(null);
                setModalOpen(true);
              }}
              className="font-medium text-base"
            >
              <IoMdAdd size="16" />
              បង្កើតថ្មី
            </Button>

            <ModalCreate
              open={modalOpen}
              mode={mode}
              initialData={selectedRow}
              loading={saving}
              onCancel={() => {
                setModalOpen(false);
                setSelectedRow(null);
              }}
              onSubmit={handleSubmitGuest}
            />


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
          <button
            disabled={!importFile || importing}
            onClick={handleImportUpload}
            className={`w-full mt-4 py-2 rounded text-white font-medium transition ${
              !importFile || importing ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1677ff] hover:bg-[#0958d9]'
            }`}
          >
            {importing ? 'កំពុងបញ្ចូល...' : 'Upload'}
          </button>
        </Modal>

        {/* TABLE  */}
        <Table
          data={filteredData}
          columns={columns}
          loading={loading}
          clickableRows={true}
          height="13rem"
          highlightSelectedRow={true}
          selectedRowId={selectedRow?.guest_id}
          onRowSelect={(row) => {

            setMode("edit");
            setSelectedRow(row);
            setModalOpen(true);
          }}


          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortChange={(newSort) => {

            if (!newSort) {
              setSortBy("guest_id");
              setSortDirection("desc");
            } else {
              setSortBy(newSort.key as string);
              setSortDirection(newSort.direction);
            }
          }}
        />

        {/* PAGINATION */}
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