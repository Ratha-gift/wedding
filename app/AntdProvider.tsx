'use client';

import { ConfigProvider } from 'antd';
import './src/assets/Style/globals.css';

export default function AntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'inherit',
          colorPrimary: '#E11D48',
        },
        components: {
          Pagination: {
            itemActiveColor: '#E11D48',
            itemActiveBg: '#fff1f0',
          },
          Modal: {
            contentBg: '#F2F2F2',
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
