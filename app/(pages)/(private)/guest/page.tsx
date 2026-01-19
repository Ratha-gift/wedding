"use client";
//api
import api,{Authorization} from "../../server/api";
//icons
import { useEffect, useState } from "react";
import { IoHomeSharp } from "react-icons/io5";
import { MdOutlineLightMode } from "react-icons/md";
import { RiMoonClearLine } from "react-icons/ri";
import { RiFileExcel2Line } from "react-icons/ri";
//components
import Table from "@/app/Components/Table/table";
import MyPagination from "@/app/Components/Pagination/pagination";
import Modalcreate from "../../../Components/Modal/modal";
import Link from "antd/es/typography/Link";
import DrawerFilter from "@/app/Components/Button/filter";
import DropdownProfile from "@/app/Components/Dropdown/profile";
import SearchInput from "@/app/Components/input/input";
import { useAuth } from "../../../src/lib/useAuth";
import Header from "@/app/Components/Header/header";
import Searchname from "@/app/Components/input/Searchname";
import { Input, DatePicker, Radio, Button } from "antd";
import Allbutton from "@/app/Components/Button/Allbutton";




export default function GuestInformationTable() {
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
  };

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

    const res = await api.get("/guest",{
      params: {
        page: currentPage,
        per_page: entriesPerPage,
        sort_by: "guest_id",
        sort_direction: "desc",
      },
      headers: { ...Authorization() }
    });
    setData(res.data.data);
    setTotalEntries(res.data.meta.total);

  } catch (err: any) {
    console.error("FETCH ERROR:", err.response?.data || err.message);
  } finally {
    setLoading(false);
  }
};

  const createGuest = async (payload: {
    guest_name: string;
    guest_type: string;
    phone_number: string;
    address: string;
    remark?: string;
    give_money_type_id: number;
  }) => {
    try {
      setLoading(true);

      const res = await api.post(
        "/guest/create",
        payload,
        {
          headers: { ...Authorization() }

        }
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
     <Header title="បញ្ចូលភ្ញៀវកិត្តិយស"/>
      {/* CONTENT */}
      <div className=" mx-6 p-3 bg-white mt-4 shadow">
        {/* TOOLBAR */}
        <div className="flex justify-between items-center mb-3">
           <div className=" w-138 h-13 flex justify-between items-center">
                  <Searchname Children="ស្វែងរក...." className=" border-2 border-[#e11d48] p-3 w-104 text-lg"/>
                  <DrawerFilter width={400}>
                    <div className=" ">

                      <div className="space-y-4">
                        {/* Name */}
                        <div>
                          <label className="text-red-600 font-medium text-base">ឈ្មោះ</label>
                          <Input  style={{ backgroundColor: "#ffffff" }} bordered={false} placeholder="បញ្ចូលឈ្មោះ..." className="h-10 "/>
                        </div>

                        {/* Date */}
                        <div>
                          <label className="text-red-600 font-medium text-base">កាលបរិច្ឆេទ</label>
                          <div className="flex gap-2">
                            <DatePicker style={{ backgroundColor: "#ffffff" }} bordered={false}  className="w-full h-10" />
                            <DatePicker style={{ backgroundColor: "#ffffff" }} bordered={false} className="w-full h-10" />
                          </div>
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="text-red-600 font-medium text-base">លេខទូរស័ព្ទ</label>
                          <Input style={{ backgroundColor: "#ffffff" }} bordered={false} placeholder="បញ្ចូលលេខទូរស័ព្ទ..." className="h-10"/>
                        </div>

                        {/* Location */}
                        <div>
                          <label className="text-red-600 font-medium text-base">ទីតាំង</label>
                          <Input style={{ backgroundColor: "#ffffff" }} bordered={false} placeholder="បញ្ចូលទីតាំង..." className="h-10" />
                        </div>

                        {/* Status / Gender */}
                        <div>
                          <label className="text-red-600 font-medium text-base">ស្ថានភាព:</label>
                          <Radio.Group className="flex gap-4 mt-2">
                            <Radio value={1}>ខាងប្រុស</Radio>
                            <Radio value={2}>ខាងស្រី</Radio>
                            <Radio value={3}>ផ្សេងៗ</Radio>
                          </Radio.Group>
                        </div>
                      </div>

                      {/* Footer Buttons */}
                      <div className="flex gap-3 mt-6 h-15">
                        <Allbutton Children='បោះបង់' className='bg-[#e7e7e7] text-[#e11d48] shadow-lg text-lg w-40'/>
                        <Allbutton Children='អនុវត្តន៍' className='text-white text-lg shadow-lg shadow-[#9c9c9c] w-50'/>
                      </div>
                    </div>
                  </DrawerFilter>
                </div>
           <div className="flex gap-2">

            <Modalcreate onSuccess={fetchGuest} />


            <button className="bg-[#FF89A3] text-white px-4 py-1 rounded">
              ទាញយក
            </button>

            <button className="bg-[#686868] text-white px-4 py-1 rounded flex items-center gap-1">
              <RiFileExcel2Line />
              បញ្ចូល
            </button>
          </div>
        </div>

        {/* TABLE */}
        <Table
          height="15rem"
          columns={columns}
          data={data}
          loading={loading}
        />

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
