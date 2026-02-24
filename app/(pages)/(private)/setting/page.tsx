"use client";
import { useState, useEffect } from "react";
import { ConfigProvider } from 'antd';
import Header from "@/app/src/Components/Header/header";
import Search from "@/app/src/Components/Button/search";
import Table from "@/app/src/Components/Table/table";
import DrawerFilter from "@/app/src/Components/Button/filter";
import MySwitch from "@/app/src/Components/Button/switch";
import SearchInput from "@/app/src/Components/input/input";
import Actions from "@/app/src/Components/Button/action";
import CreateUser from "@/app/src/Components/Modal/UserModal";
import { RiLockPasswordFill } from "react-icons/ri";
import { BiSolidEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import Button from "@/app/src/Components/Button/allbutton";
import ProfileEdit from "@/app/src/Components/Dropdown/edit_profile";
import DropdownForm from "@/app/src/Components/Dropdown/changPW";
import { FaExclamationTriangle } from "react-icons/fa";
import MyPagination from "@/app/src/Components/Pagination/pagination";
import { useRequireAuth } from '@/app/src/Hooks/useAuthRedirect';
// import Search from "@/app/src/Components/Button/search";
import api from "../../../server/api";
import ModalCreate from "@/app/src/Components/Modal/modal";


export default function settingsPage() {
  useRequireAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  // sort
  const [sortBy, setSortBy] = useState<string>("user_id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const [profileImage, setProfileImage] = useState<string>(
    "/Ratha.png"
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);

      // call your api here
      console.log(data);

      setModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (img: string) => {
    fetchUsers(currentPage);
    setProfileImage(img);
  };

  const fetchUsers = async (page: number) => {
    setLoading(true);
    try {
      const res = await api.get('/user/list', {
        params: {
          page,
          per_page: entriesPerPage,
          sort_by: sortBy,
          sort_direction: sortDirection,
        },
      });

      const { data = [], meta = {} } = res.data ?? {};
      setUsers(data);
      setTotal(meta.total || meta.total_records || 0);
    } catch (err: any) {
      console.error('Fetch users failed:', err);
      setUsers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, entriesPerPage, sortBy, sortDirection]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  const columns = [
    {
      header: "ល.រ",
      accessor: "user_id",
      sortable: true,
      render: (row: any) => (
        <div className="flex justify-start items-start">
          {row.user_id}
        </div>
      ),
      width: 40,
    },
    {
      header: "នាមត្រកូល",
      accessor: "first_name",
      sortable: true,
      render: (row: any) => (
        <div className="truncate">
          {row.first_name}

        </div>

      ),
      width: 90,

    },
    {
      header: "នាមត្រខ្លួន",
      accessor: "last_name",
      sortable: true,
      render: (row: any) => (
        <div className="truncate">
          {row.last_name}
        </div>
      ),
    },
    {
      header: "Email",
      accessor: "email",
      sortable: true,
      render: (row: any) => (
        <div className="truncate">
          {row.email}
        </div>
      ),
      width: 140,
    },
    {
      header: "Username",
      accessor: "user_name",
      sortable: true,
      render: (row: any) => (
        <div className="truncate">
          {row.user_name}
        </div>
      ),
    },

    {
      header: "Actions",
      accessor: "actions",
      sortable: true,
      width: 100,
      // cellPadding: ' pl-1 pr-2',
      render: () => (
        <div className="flex ">
          <Actions icon={<RiLockPasswordFill size={24} color="#e11d48" />}
            modalTitle="ផ្លាស់ប្ដូរលេខសម្ងាត់ថ្មី"
            Radius="50px"
            width="630px"
            height="450px"
            iconTitle={<BiSolidEdit className="text-3xl text-[#e11d48]" />}
            classNames=" flex justify-center items-end gap-2"
          >
            <div className=" grid mt-10">
              <div className="grid justify-center items-center">
                <h1 className="text-[#e11d48] text-xl">លេខសម្ងាត់ថ្មី</h1>
                <Search Children="Password" type="password" className="bg-white text-xl p-3 w-120" />
                <h1 className="text-[#e11d48] mt-8 text-xl">បញ្ជាក់លេខសម្ងាត់ថ្មី</h1>
                <Search Children="Password" type="password" className="bg-white text-xl p-3 w-120" />
              </div>
              {/* <div className=" flex mt-10 justify-center gap-10">
              <Button Children="បោះបង់" className=" w-45 h-12 bg-[#e7e7e7] text-[#e11d48] shadow-lg text-xl" />
              <Button Children="រក្សាទុក" className=" text-white shadow-lg w-45 h-12 text-xl" />
            </div> */}

              <div className="mt-10 flex items-center justify-center gap-4 pr-2 sm:pr-6">
                <Button
                  children="បោះបង់"
                  className="w-45 h-12 bg-[#e7e7e7] text-[#e11d48] shadow-lg text-xl"
                />
                <Button
                  children="រក្សាទុក"
                  className="text-white shadow-lg w-45 h-12 text-xl"
                />
              </div>
            </div>
          </Actions>

          <Actions icon={<BiSolidEdit size={24} color="#e11d48" />}
            width="610px"
            height="690px"
            modalTitle="កែសម្រួល"
            iconTitle={<BiSolidEdit className="text-3xl text-[#e11d48]" />}
            classNames=" flex justify-center items-end gap-2"

          >
            <div className="flex mt-10 gap-13 items-center ">
              <div className=" grid ">
                <h1 className="text-xl text-[#e11d48]">នាមត្រកូល</h1>
                <Search Children="នាមត្រកូល" className="bg-white text-xl p-3 w-90" />
                <h1 className="mt-5 text-xl text-[#e11d48]">នាមខ្លួន</h1>
                <Search Children="នាមខ្លួន" className="bg-white text-xl p-3 w-90" />
              </div>
              <ProfileEdit image={profileImage} onChangeImage={handleImageChange} />
            </div>

            <h1 className="text-xl text-[#e11e48] mt-4">ឈ្មោះអ្នកប្រើប្រាស់</h1>
            <Search Children="ឈ្មោះអ្នកប្រើប្រាស់" className="bg-white text-xl p-3 w-135 mb-4" />
            <div className="h-50 ">
              <DropdownForm />
            </div>
            {/* <div className="flex justify-center items-center gap-8 h-20 ">
            <Button Children="បោះបង់" className=" w-45 h-12 bg-[#e7e7e7] text-[#e11d48] shadow-lg text-xl" />
            <Button Children="រក្សាទុក" className=" text-white shadow-lg w-45 h-12 text-xl" />
          </div> */}

            <div className="flex items-center justify-center gap-6 sm:gap-8 h-20 px-4">
              <Button
                children="បោះបង់"
                className="w-44 sm:w-48 h-12 px-6 bg-gray-100 text-rose-600 hover:bg-gray-200 active:bg-gray-300 font-medium text-xl rounded-xl shadow-md hover:shadow-lg transition-all duration-150"
              />

              <Button
                children="រក្សាទុក"
                className="w-44 sm:w-48 h-12 px-6 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-medium text-xl rounded-xl shadow-lg shadow-rose-600/30 hover:shadow-xl transition-all duration-150"
              />
            </div>
          </Actions>
          <Actions icon={<MdDelete size={23} color="#e11d48" />}
            modalTitle=""
            iconTitle={<FaExclamationTriangle size={100} color="#e11d48" />}
            classNames=" flex justify-center items-end h-30"
            height="320px"
            width="600px"
          >
            
            <h1 className=" flex justify-center text-xl  text-[#e11d48] mt-7 mb-6">តើអ្នកប្រាកដទេថាលុបគណនីនេះ?</h1>
            {/* <div className="flex justify-center items-center gap-8 h-20 ">
            <Button Children="បោះបង់" className=" w-45 h-12 bg-[#e7e7e7] text-[#e11d48] shadow-lg text-xl" />
            <Button Children="បាទ/ចាស់" className=" text-white shadow-lg w-45 h-12 text-xl" />
          </div> */}

            <div className="flex items-center justify-center gap-6 sm:gap-8 h-20 px-4">
              <Button
                children="បោះបង់"
                className=" w-44 sm:w-48 h-12 px-6  bg-gray-100 text-rose-600 hover:bg-gray-200 active:bg-gray-300 font-medium text-xl rounded-xl shadow-md hover:shadow-lg transition-all duration-150"
              />

              <Button
                children="បាទ/ចាស់"
                className="w-44 sm:w-48 h-12 px-6 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-medium text-xl rounded-xl shadow-lg shadow-rose-600/30 hover:shadow-xl transition-all duration-150"
              />
            </div>

          </Actions>
        </div>
      ),
    },

    {
      header: "ស្ថានភាព",
      accessor: "status",
      width: 60,
      render: (row: any) => (
        <div className="flex justify-center ">
          <MySwitch
          // checked={row.status === 1}
          // បើចង់ឲ្យ toggle ផ្លាស់ប្តូរទិន្នន័យពិតប្រាកដ (update API ឬ state)
          // onChange={(newChecked) => handleToggleStatus(row.id, newChecked)}
          />
        </div>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#E11D48',
        },
        components: {
          Pagination: {
            itemActiveColor: '#E11D48',
            itemActiveBg: '#fff1f0',
          },
        },
      }}
    >
      <div className="bg-gray-200 min-h-screen">
        <div>
          <Header />
        </div>
        <div className="mx-4 p-2 bg-white mt-3 shadow">
          {/* <div className="bg-white p-3 shadow-sm"> */}
          <div className="w-full flex items-center pb-2 gap-2 p-1 flex-wrap">
            <div className="w-full sm:w-60 h-11 flex gap-1 ">
              <SearchInput />
            </div>
            <div className="w-24 h-11">
              <DrawerFilter width={400}>
                <div className="">
                  <h1 className="text-lg text-[#e11d48] font-bold">ឈ្មោះ</h1>
                  <Search Children="ស្វែងរកតាមឈ្មោះ..." className="bg-white p-3 text-lg w-88 " />
                </div>
                <div className="bg-white w-88 h-12 mt-7 rounded-md flex items-center justify-between p-4">
                  <h1 className="text-lg text-[#e11d48] font-bold">ស្ថានភាព</h1>
                  <MySwitch />
                </div>
                {/* <div className=" w-88 h-15 flex items-end gap-5">
                  <Button Children='បោះបង់' className='bg-[#e7e7e7] text-[#e11d48] shadow-lg text-lg w-40' />
                  <Button Children='អនុវត្តន៍' className='text-white text-lg shadow-lg shadow-[#9c9c9c] w-50' />
                </div> */}

                <div className="w-88 h-15 mt-8 flex items-center justify-center gap-5 px-4"> {/* changed items-end → items-center for better alignment */}
                  <Button
                    children="បោះបង់"
                    className="w-40 sm:w-44 h-11 px-5 bg-gray-100 text-rose-600 hover:bg-gray-200 active:bg-gray-300 font-medium text-lg rounded-lg shadow-md hover:shadow transition-all duration-150"
                  />
                  <Button
                    children="អនុវត្តន៍"
                    className=" w-48 sm:w-52 h-11 px-6 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-medium text-lg rounded-lg shadow-lg shadow-rose-600/30 hover:shadow-xl transition-all duration-150"
                  />
                </div>
              </DrawerFilter>
            </div>
            <div className="flex-1 flex justify-end">
              <Button
                children="បង្កើតថ្មី"
                className="text-white h-11 px-6"
                onClick={() => {
                  setMode("create");
                  setModalOpen(true);
                }}
              />
              <ModalCreate
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                mode="create"
                type="user"
                loading={loading}
              />
              <ModalCreate
                open={isViewOpen}
                onCancel={() => setIsViewOpen(false)}
                onSubmit={handleSubmit}
                mode="edit"
                type="user"
                initialData={selectedUser}
                loading={loading}
              />
            </div>
          </div>
          <Table
            data={users}
            columns={columns}
            loading={loading}
            clickableRows={true}
            height="13rem"
            highlightSelectedRow={true}
            selectedRowId={selectedUser?.user_id}
            onRowSelect={(row) => {

              setMode("edit");
              setSelectedUser(row);
              setIsViewOpen(true);
            }}

            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortChange={(newSort) => {
              if (!newSort) {
                setSortBy("user_id");
                setSortDirection("desc");
              } else {
                setSortBy(newSort.key as string);
                setSortDirection(newSort.direction);
              }
            }}
          />

          <div className="flex justify-end mt-3">
            <MyPagination
              currentPage={currentPage}
              totalEntries={total}
              entriesPerPage={entriesPerPage}
              onPageChange={(page) => setCurrentPage(page)}
              onEntriesPerPageChange={(value) => {
                setEntriesPerPage(value);
                setCurrentPage(1);
              }}
            />
          </div>
          {/* </div> */}
        </div>
      </div>
    </ConfigProvider>
  );
}