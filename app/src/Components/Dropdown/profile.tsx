
import React, { useState } from 'react';
import { Dropdown, Modal, ConfigProvider } from 'antd';
import type { MenuProps } from 'antd';
import { FaUser } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { useAuth } from '@/app/src/lib/useAuth';
import { useRouter } from 'next/navigation';
import Search from '../Button/search';
import ProfileEdit from './edit_profile';
import Allbutton from '../Button/allbutton';
import DropdownForm from './changPW';
import { BiSolidEdit } from "react-icons/bi";

interface DropdownProfileProps {
  imageSrc?: string;
  imageAlt?: string;
  imageClassName?: string;
  size?: number;
}

const DropdownProfile: React.FC<DropdownProfileProps> = ({
  imageSrc = '/image.png',
  imageAlt = 'profile',
  imageClassName = ' mr-2 w-9 h-9 rounded-full',
  size = 32,
}) => {
  const { onLogout } = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const items: MenuProps['items'] = [
    {
      key: 'edit-profile',
      label: (
        <div className="flex items-center gap-2 py-1">
          <FaUser size={18} color="#e11d48" />
          <span>មើលព័ត៍មានគណនី</span>
        </div>
      ),
    },
    { type: 'divider' },
    {
      key: 'logout',
      label: (
        <div className="flex items-center gap-2 py-1 text-red-600 hover:text-white ">
          <IoLogOutOutline size={18} />
          <span>ចាកចេញ</span>
        </div>
      ),
      danger: true,
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      console.log('Logging out...');
      onLogout();
      router.push('/login');
      router.refresh();
    } else if (key === 'edit-profile') {
      setIsModalOpen(true);
    }
  };

  const handleOk = () => {
    // ដាក់ logic រក្សាទុកទិន្នន័យនៅទីនេះ (បើមាន)
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "inherit",
          colorPrimary: "#e11d48",
          borderRadiusLG: 10,
        },
        components: {
          Modal: {
            contentBg: '#F2F2F2',
            titleColor: '#e11d48',
          },
        },
      }}
    >
      {/* ប្តូរពី ['click'] ទៅ ['hover'] */}
      <Dropdown
        menu={{ items, onClick: handleMenuClick }}
        trigger={['hover']}
        placement="bottomRight"
        arrow={{ pointAtCenter: true }}
      >
        <div className="cursor-pointer select-none inline-block">
          <img
            src={imageSrc}
            alt={imageAlt}
            className={`${imageClassName} object-cover border-3 border-white shadow-sm 
            hover:border-2 hover:shadow-lg transition-all duration-200`}
          />
        </div>
      </Dropdown>

      {/* Modal សម្រាប់កែសម្រួលប្រវត្តិ */}
      <Modal
        title={
          <div className=" w-100 flex items-center justify-end gap-3 text-[#e11d48]">
          <BiSolidEdit size={35} />  
           <h1 className='text-4xl'>កែសម្រួលប្រវត្តិ</h1>
          </div>
       }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
        footer={null}
        centered={true}
        okButtonProps={{
          style: { backgroundColor: '#e11d48', borderColor: '#e11d48' },
        }}
        
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
        <Search Children="ឈ្មោះអ្នកប្រើប្រាស់" className="bg-white text-xl p-3 w-135 mb-5"/>
        <div className="h-50 ">
        <DropdownForm />
        </div>
        <div className="flex justify-center items-center gap-8 h-20 ">
          <Allbutton Children="បោះបង់" className=" w-45 h-12 bg-[#e7e7e7] text-[#e11d48] shadow-lg text-xl"/>
          <Allbutton Children="រក្សាទុក" className=" text-white shadow-lg w-45 h-12 text-xl"/>
        </div>
       
      </Modal>
    </ConfigProvider>
  );
};

export default DropdownProfile;