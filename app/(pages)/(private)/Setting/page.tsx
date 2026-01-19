"use client";
import { useState, useMemo, useEffect } from "react";
import { ConfigProvider, theme, PaginationProps,  } from 'antd'; // ← add theme import if needed
import Header from "../../../Components/Header/header";
import Search from "../../../Components/Button/search";
import Table from "../../../Components/Table/table";
import DrawerFilter from "../../../Components/Button/filter"; 
import Create from "../../../Components/Modal/create";
import MySwitch from "../../../Components/Button/switch";
import Actions from "@/app/Components/Button/Actions";
import { RiLockPasswordFill } from "react-icons/ri";
import { BiSolidEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import Allbutton from "../../../Components/Button/Allbutton";
import ProfileEdit from "../../../Components/Dropdown/edit_profile";
import DropdownForm from "../../../Components/Dropdown/changPW";
import { FaExclamationTriangle } from "react-icons/fa";
import MyPagination from "@/app/Components/Pagination/pagination";
import Searchname from "@/app/Components/input/Searchname";
import api from "../../server/api";

const columns = [
  { header: "ល.រ", accessor: "user_id", width: 80 },
  { header: "នាមត្រកូល", accessor: "first_name", width: 220 },
  { header: "នាមត្រកូល", accessor: "last_name", width: 220 },
  { header: "នាមខ្លួន",
    render: (row: any) => (
      <div className="truncate">
        {row.email}
      </div>
    ),
   },
  { header: "Username", accessor: "user_name", width: 160 },
 {
  header: "ស្ថានភាព",
  width: 140,
  render: (row: any) => (
    <div className="">
      <MySwitch 
        checked={row.status === 1} 
        // បើចង់ឲ្យ toggle ផ្លាស់ប្តូរទិន្នន័យពិតប្រាកដ (update API ឬ state)
        // onChange={(newChecked) => handleToggleStatus(row.id, newChecked)}
      />
    </div>
  ),
},
  {
    header: "Actions",
    width: 140,
    render: () => (
      <div className="flex gap-3">
       <Actions icon={<RiLockPasswordFill size={25} color="#e11d48" />} 
          modalTitle="ផ្លាស់ប្ដូរលេខសម្ងាត់ថ្មី" 
          Radius="50px"
          width="630px"
          height="450px"
          iconTitle={<BiSolidEdit className="text-3xl text-[#e11d48]"/>}
          classNames=" flex justify-center items-end gap-2"

          >
          <div className=" grid mt-10">
           <div className="grid justify-center items-center">
               <h1 className="text-[#e11d48] text-xl">លេខសម្ងាត់ថ្មី</h1>
                      <Search Children="Password" type="password" className="bg-white text-xl p-3 w-120" /> 
                 <h1 className="text-[#e11d48] mt-8 text-xl">បញ្ជាក់លេខសម្ងាត់ថ្មី</h1>    
                       <Search Children="Password" type="password" className="bg-white text-xl p-3 w-120" /> 
            </div>
            <div className=" flex mt-10 justify-center gap-10">
              <Allbutton Children="បោះបង់" className=" w-45 h-12 bg-[#e7e7e7] text-[#e11d48] shadow-lg text-xl"/>
              <Allbutton Children="រក្សាទុក" className=" text-white shadow-lg w-45 h-12 text-xl"/>
            </div>
          </div>
        </Actions>

       <Actions  icon={<BiSolidEdit size={25} color="#e11d48"/>}
          width="610px"
          height="690px"
          modalTitle="កែសម្រួល"
          iconTitle={<BiSolidEdit className="text-3xl text-[#e11d48]"/>}
          classNames=" flex justify-center items-end gap-2"

       >

        
        <div className="flex mt-10 gap-13 items-center ">
          <div className=" grid ">
            <h1 className="text-xl text-[#e11d48]">នាមត្រកូល</h1>
          <Search Children="នាមត្រកូល" className="bg-white text-xl p-3 w-90"/>
          <h1 className="mt-5 text-xl text-[#e11d48]">នាមខ្លួន</h1>
          <Search Children="នាមខ្លួន" className="bg-white text-xl p-3 w-90"/>
          </div>
          <ProfileEdit />
        </div>
        <h1 className="text-xl text-[#e11e48] mt-4">ឈ្មោះអ្នកប្រើប្រាស់</h1>
        <Search Children="ឈ្មោះអ្នកប្រើប្រាស់" className="bg-white text-xl p-3 w-135 mb-4"/>
        <div className="h-50 ">
        <DropdownForm />
        </div>
        <div className="flex justify-center items-center gap-8 h-20 ">
          <Allbutton Children="បោះបង់" className=" w-45 h-12 bg-[#e7e7e7] text-[#e11d48] shadow-lg text-xl"/>
          <Allbutton Children="រក្សាទុក" className=" text-white shadow-lg w-45 h-12 text-xl"/>
        </div>
        </Actions>
       <Actions  icon={<MdDelete size={25} color="#e11d48"/>}
        modalTitle=""
        iconTitle={<FaExclamationTriangle size={100} color="#e11d48" />}
        classNames=" flex justify-center items-end h-30"
        height="320px"
        width="600px"
       >
      <h1 className=" flex justify-center text-xl  text-[#e11d48] mt-7 mb-6">តើអ្នកប្រាកដទេថាលុបគណនីនេះ?</h1>
      <div className="flex justify-center items-center gap-8 h-20 ">
          <Allbutton Children="បោះបង់" className=" w-45 h-12 bg-[#e7e7e7] text-[#e11d48] shadow-lg text-xl"/>
          <Allbutton Children="បាទ/ចាស់" className=" text-white shadow-lg w-45 h-12 text-xl"/>
        </div>

       </Actions>
      </div>
    ),
  },
];

//////////

export default function SettingsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);                    // you can make dynamic later
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);


  const fetchUsers = async (page: number) => {
    try {
      // setLoading(true);
      const res = await api.get('/user/list', {
        params: {
          page,
          per_page: pageSize,
        },
      });
      const { data, meta } = res.data;
      setUsers(data || []);
      setTotal(meta?.total || 0);
    } catch (err: any){
      console.log("error");
      
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);

  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  ////////

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#E11D48',           // optional: changes other primary elements too
        },
        components: {
          Pagination: {
            itemActiveColor: '#E11D48',      // ← active page TEXT color = red
            itemActiveBg: '#fff1f0',         // ← active page BACKGROUND = light red (nice contrast)
          },
        },
      }}
    >
      <div className="bg-gray-200 min-h-screen">
        <div>
          <Header />
        </div>

        <div className="p-3">
          <div className="bg-white rounded-2xl p-2 shadow-sm">
            {/* Top controls */}
            <div className="w-full flex items-center pb-5 gap-2 p-1 flex-wrap">
              <div className="w-full sm:w-134 h-12 flex gap-2 mt-1">
                <Search Children="ស្វែងរក" className=" border-2 border-[#e11d48] w-130 p-3" />
              </div>
                 <div className="w-24 h-10">
                  <DrawerFilter width={400}>
                    <div className="">
                      <h1 className="text-lg text-[#e11d48] font-bold">ឈ្មោះ</h1>
                      <Searchname Children="ស្វែងរកតាមឈ្មោះ..." className="bg-white p-3 text-lg w-88 "/>
                    </div>
                    <div className="bg-white w-88 h-12 mt-7 rounded-md flex items-center justify-between p-4">
                        <h1 className="text-lg text-[#e11d48] font-bold">ស្ថានភាព</h1>
                        <MySwitch />
                    </div>
                    <div className=" w-88 h-15 flex items-end gap-5">
                        <Allbutton Children='បោះបង់' className='bg-[#e7e7e7] text-[#e11d48] shadow-lg text-lg w-40'/>
                        <Allbutton Children='អនុវត្តន៍' className='text-white text-lg shadow-lg shadow-[#9c9c9c] w-50'/>
                    </div>
                  </DrawerFilter>
                </div>
                <div className="flex-1 flex justify-end">
                <Create />
              </div>
            </div>
            <Table
              height="15rem"
              columns={columns}
              data={users} 
            />
        <div className="mt-6 flex justify-end">
          <MyPagination
                current={currentPage}
                total={total}
                pageSize={pageSize}
                onChange={handlePageChange}
                // showSizeChanger  ← add later if you want to support changing pageSize
              />
        </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}