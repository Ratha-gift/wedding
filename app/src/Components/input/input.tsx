'use client';

import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { ConfigProvider, Input, Space } from 'antd';

type SearchInputProps = {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'ស្វែងរក...',
}) => {
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
          <span className="flex items-center px-2  border border-r-0 rounded-l-md border-[#E11D48] text-[#E11D48]">
            <SearchOutlined />
          </span>

          <Input
            size="large"
            value={value}        
            onChange={onChange}   
            placeholder={placeholder}
            className="rounded-l-none  border-[#E11D48] focus:border-[#E11D48]"
            allowClear            
          />
        </Space.Compact>
      </Space>
    </ConfigProvider>
  );
};

export default SearchInput;
