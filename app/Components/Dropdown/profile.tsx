"use clien";

import React from 'react';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { FaUser } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { useAuth } from '@/app/src/lib/useAuth';
import { redirect, useRouter } from 'next/navigation';
import { Router } from 'next/router';

const items: MenuProps['items'] = [
  {
    key: 'profile',
    label: 'មើលព័ត៌មានគណនី',
    icon: <FaUser size={17} />,
  },
  { type: 'divider' },
  {
    key: 'logout',
    label: 'ចាកចេញ',
    icon: <IoLogOutOutline size={22} />,
    danger: true,
  },
];

interface DropdownProfileProps {
  imageSrc?: string;
  imageAlt?: string;
  imageClassName?: string;
  size?: number;
}

const DropdownProfile: React.FC<DropdownProfileProps> = ({
  imageSrc = '/image.png',
  imageAlt = 'profile',
  imageClassName = 'w-8 h-8 rounded-full',
  size = 32,
}) => {
  const { onLogout } = useAuth(); 
  const router = useRouter();
  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      console.log('Logging out...');
      // alert('You have been logged out.');
      onLogout();
      router.push('/login');
      router.refresh();
      //router.replace('./login');
  
    } else if (key === 'profile') {
      console.log('Go to profile page');
      // e.g., router.push('/profile')
    }
  };

  return (
    <Dropdown
      menu={{ items, onClick: handleMenuClick }}
      trigger={['hover']}          
      placement="bottomRight"
      arrow={{ pointAtCenter: true }}
      overlayStyle={{ minWidth: 100 }}
    >
      <div className="cursor-pointer select-none inline-block">
        <img
          src={imageSrc}
          alt={imageAlt}
          className={`${imageClassName} object-cover border-2 border-white shadow-sm 
                     hover:border-[#E11D48] hover:shadow-lg 
                     transition-all duration-200`}
        />
      </div>
    </Dropdown>
  );
};

export default DropdownProfile;