"use client";
import { useState, useRef } from 'react';
import Link from 'next/link';
import { FaUsers, FaShieldAlt, FaChevronRight } from "react-icons/fa";
import { AllData } from '@/app/src/Components/Data/Image/image';
import { useRequireAuth } from '@/app/src/Hooks/useAuthRedirect';
import { Drawer, ConfigProvider } from 'antd';
import { useRouter } from 'next/navigation';
import { RiListSettingsLine } from "react-icons/ri";

export default function HomePage() {
  useRequireAuth();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openDrawer = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDrawerOpen(true);
  };

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setDrawerOpen(false), 200);
  };

  const menuItems = [
    {
      key: 'setting',
      icon: <FaUsers size={20} />,
      label: 'គ្រប់គ្រងអ្នកប្រើប្រាស់',
      path: '/setting',
    },
    {
      key: 'permission-group',
      icon: <FaShieldAlt size={20} />,
      label: 'ក្រុមសិទ្ធិ',
      path: '/permission-group',
    },
  ];

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#e11d48', borderRadiusLG: 12 } }}>
      <div
        style={{ backgroundImage: `url(${AllData.Background2.data})` }}
        className="w-full h-screen bg-cover bg-center bg-no-repeat flex flex-col items-end justify-center"
      >
        {/* Settings trigger */}
        <div className="w-full h-200 flex justify-end p-8">
          <RiListSettingsLine
            size={40}
            className="text-[#E11D48] cursor-pointer drop-shadow-lg hover:scale-110 transition-transform"
            onMouseEnter={openDrawer}
            onMouseLeave={scheduleClose}
            onClick={openDrawer}
          />
        </div>

        {/* Main buttons */}
        <div className="w-full h-70 flex flex-col items-center justify-center gap-7">
          <Link href="./guest">
            <h1 className="w-xs h-14 bg-[#E11D48] font-medium text-white text-xl flex items-center justify-center rounded-xl shadow-xl">
              បញ្ចូលភ្ញៀវកិត្តិយស
            </h1>
          </Link>
          <Link href="./currency">
            <h1 className="w-xs h-14 bg-[#E11D48] font-medium text-white text-xl flex items-center justify-center rounded-xl shadow-xl">
              បញ្ចូលចំណងដៃ
            </h1>
          </Link>
        </div>

        {/* Right-side drawer */}
        <Drawer
          placement="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title={null}
          closable={false}
          mask={false}
          styles={{ wrapper: { width: 300 }, body: { backgroundColor: '#F2F2F2' } }}
        >
          <div
            className="flex flex-col gap-3 pt-2"
            onMouseEnter={openDrawer}
            onMouseLeave={scheduleClose}
          >
            <p className="text-[#e11d48] font-bold text-lg mb-2">ការគ្រប់គ្រង</p>
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => { setDrawerOpen(false); router.push(item.path); }}
                className="w-full flex items-center justify-between px-4 py-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-[#e11d48] hover:bg-rose-50 transition-all group"
              >
                <div className="flex items-center gap-3 text-[#e11d48]">
                  {item.icon}
                  <span className="font-medium text-base text-gray-700 group-hover:text-[#e11d48]">
                    {item.label}
                  </span>
                </div>
                <FaChevronRight size={13} className="text-gray-400 group-hover:text-[#e11d48]" />
              </button>
            ))}
          </div>
        </Drawer>
      </div>
    </ConfigProvider>
  );
}
