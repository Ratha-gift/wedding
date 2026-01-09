"use client";
import { useState, useMemo } from "react";
import { ConfigProvider, theme, PaginationProps,  } from 'antd'; // ← add theme import if needed
import Header from "../components/Haeder";
import Search from "../components/Input/Search";
import Table from "../components/Table/Table";
import Filter from "../components/button/Filter"; 
import Create from "../components/button/Create";
import MySwitch from "../components/button/Switch";
import Actions from "../components/button/Actions";
import { RiLockPasswordFill } from "react-icons/ri";
import { BiSolidEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import Searchname from "../components/Input/Searchname";
import Allbutton from "../components/button/Allbutton";
import ProfileEdit from "../components/profile/ProfileEdit";
import DropdownForm from "../components/Dropdowns/DropdownsEdit";
import { FaExclamationTriangle } from "react-icons/fa";
import MyPagination from "../components/Pagination/Pagination";


const mockUsers = [
  { id: 1, name: "សុខ សុភា", email: "ឡីឡី", username: "sopheasok", role: "Admin", },
  { id: 2, name: "លី សុភ័ក្ត្រ", email: "លីលី", username: "sophea_lee", role: "Editor", },
  { id: 3, name: "ផល សុខា", email: "ភៅភៅ", username: "sokhaphal", role: "Viewer", },
  { id: 4, name: "គីម សុភី", email: "ពាំពាំ", username: "sophea_kim", role: "Admin", },
  { id: 5, name: "វណ្ណ សុភ័ក្ត្រ", email: "បាបា", username: "vannsophea", role: "Editor", },
  { id: 6, name: "ធី សុភា", email: "បូបូ", username: "sopheathy", role: "Viewer", },
  { id: 7, name: "ចាន់ វណ្ណរ៉ា", email: "លោលោ", username: "vannarachan", role: "Editor", },
  { id: 8, name: "សៀ រតនា", email: "កាកា", username: "ratanasea", role: "Viewer", },
  { id: 9, name: "ហេង សុភក្ស", email: "មិមិ", username: "sophea_heng", role: "Admin", },
  { id: 10, name: "នាង សុភី", email: "នានា", username: "sophea_neang", role: "Editor", },
];


const generateMockData = (baseData: typeof mockUsers, count: number = 85) => {
  const result = [...baseData];
  for (let i = baseData.length + 1; i <= count; i++) {
    const base = baseData[(i - 1) % baseData.length];
    result.push({
      ...base,
      id: i,
      name: `${base.name.split(" ")[0]} ${base.name.split(" ")[1] || ""} ${i}`,
      username: `${base.username}${i}`,
      email: `${base.email.split("@")[0]}${i}@${base.email.split("@")[1]}`,
    });
  }
  return result;
};

const allUsers = generateMockData(mockUsers, 120); 

const columns = [
  { header: "ល.រ", accessor: "id", width: 80 },
  { header: "នាមត្រកូល", accessor: "name", width: 220 },
  { header: "នាមខ្លួន",
    render: (row: any) => (
      <div className="truncate">
        {row.email}
      </div>
    ),
   },
  { header: "Username", accessor: "username", width: 160 },
  { 
    header: "ស្ថានភាព",
    width: 140,
    render: () => (
      <div className="">
        <MySwitch />
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
                      <Searchname Children="Password" type="password" className="bg-white text-xl p-3 w-120" /> 
                 <h1 className="text-[#e11d48] mt-8 text-xl">បញ្ជាក់លេខសម្ងាត់ថ្មី</h1>    
                       <Searchname Children="Password" type="password" className="bg-white text-xl p-3 w-120" /> 
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
          <Searchname Children="នាមត្រកូល" className="bg-white text-xl p-3 w-90"/>
          <h1 className="mt-5 text-xl text-[#e11d48]">នាមខ្លួន</h1>
          <Searchname Children="នាមខ្លួន" className="bg-white text-xl p-3 w-90"/>
          </div>
          <ProfileEdit />
        </div>
        <h1 className="text-xl text-[#e11e48] mt-4">ឈ្មោះអ្នកប្រើប្រាស់</h1>
        <Searchname Children="ឈ្មោះអ្នកប្រើប្រាស់" className="bg-white text-xl p-3 w-135 mb-4"/>
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

export default function SettingsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return allUsers.slice(start, end);
  }, [currentPage]);

  const handlePageChange: PaginationProps['onChange'] = (page) => {
    setCurrentPage(page);
  };

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
            <div className="w-full flex items-center pb-4 gap-2 p-1 flex-wrap">
              <div className="w-full sm:w-137.5 h-12 flex gap-2">
                <Search />
              </div>
              <div className="">
                <Filter />
              </div>
              <div className="flex-1 flex justify-end">
                <Create />
              </div>
            </div>

            <Table
              height="15rem"
              columns={columns}
              data={paginatedData} 
            />
        <div className="mt-6 flex justify-end">
          <MyPagination
            page={currentPage}
            total={allUsers.length}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}