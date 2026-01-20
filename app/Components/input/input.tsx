'use client';

import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { ConfigProvider, Input, Space } from 'antd';

const SearchInput: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'inherit',
          colorPrimary: '#E11D48',
          colorBorder: '#E11D48',
        },
        components: {
          Input: {
            activeBorderColor: '#E11D48',
            hoverBorderColor: '#E11D48',
          },
        },
      }}
    >
      <Space direction="vertical">
        <Space.Compact size="large">
          <span className="flex items-center px-3 border border-r-0 rounded-l-md border-[#E11D48] text-[#E11D48]">
            <SearchOutlined />
          </span>
          <Input
            size="large"
            placeholder="ស្វែងរក..."
            className="rounded-l-none border-[#E11D48] focus:border-[#E11D48]"
          />
          
        </Space.Compact>
      </Space>
    </ConfigProvider>
  );
};

export default SearchInput;
