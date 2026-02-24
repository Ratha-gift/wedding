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
  imageAlt?: string;
  imageClassName?: string;
}

const DropdownProfile: React.FC<DropdownProfileProps> = ({
  imageAlt = 'profile',
  imageClassName = 'mr-2 w-9 h-9 rounded-full',
}) => {
  const { onLogout } = useAuth();
  const router = useRouter();

  //  IMAGE STATE (HERE ONLY)
  const [profileImage, setProfileImage] = useState('/Ratha.png');
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
        <div className="flex items-center gap-2 py-1 text-red-600">
          <IoLogOutOutline size={18} />
          <span>ចាកចេញ</span>
        </div>
      ),
      danger: true,
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      onLogout();
      router.push('/login');
    }
    if (key === 'edit-profile') {
      setIsModalOpen(true);
    }
  };

  //  SAVE BUTTON
  const handleSave = () => {
    console.log('Saved image:', profileImage);
    // TODO: upload to backend later
    setIsModalOpen(false);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#e11d48",
          borderRadiusLG: 10,
        },
      }}
    >
      <Dropdown
        menu={{ items, onClick: handleMenuClick }}
        placement="bottomRight"
      >
        <div className="cursor-pointer inline-block">
          <img
            src={profileImage}
            alt={imageAlt}
            className={`${imageClassName} object-cover border-2 border-white shadow`}
          />
        </div>
      </Dropdown>

      <Modal
        open={isModalOpen}
        footer={null}
        centered
        width={600}
        onCancel={() => setIsModalOpen(false)}
        title={
          <div className="flex justify-center gap-3 text-[#e11d48]">
            <BiSolidEdit size={32} />
            <h1 className="text-3xl">កែសម្រួលប្រវត្តិ</h1>
          </div>
        }
      >
        <div className="flex mt-10 gap-10 items-center">
          <div>
            <h1 className="text-xl text-[#e11d48]">នាមត្រកូល</h1>
            <Search Children="នាមត្រកូល" className="bg-white text-xl p-3 w-90" />

            <h1 className="mt-5 text-xl text-[#e11d48]">នាមខ្លួន</h1>
            <Search Children="នាមខ្លួន" className="bg-white text-xl p-3 w-90" />
          </div>

          {/* PASS IMAGE STATE */}
          <ProfileEdit
            image={profileImage}
            onChangeImage={setProfileImage}
          />
        </div>

        <h1 className="text-xl text-[#e11d48] mt-4">ឈ្មោះអ្នកប្រើប្រាស់</h1>
        <Search Children="ឈ្មោះអ្នកប្រើប្រាស់" className="bg-white text-xl p-3 w-135 mb-5" />

        <DropdownForm />

        <div className="flex justify-center gap-8 mt-8">
          <Allbutton
            onClick={() => setIsModalOpen(false)}
            className="w-45 h-12 bg-gray-200 text-[#e11d48]"
          >
            បោះបង់
          </Allbutton>

          <Allbutton
            onClick={handleSave}
            className="w-45 h-12 text-white bg-[#e11d48]"
          >
            រក្សាទុក
          </Allbutton>

        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default DropdownProfile;
