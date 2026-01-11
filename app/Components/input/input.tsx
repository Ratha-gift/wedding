import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Input, Select, Space } from 'antd';

const { Search } = Input;

const options = [
  {
    value: 'guest_id',
    label: 'Guest ID',
  },
  {
    value: 'guest_name',
    label: 'Guest Name',
  },
];

const SearchInput: React.FC = () => (

  <ConfigProvider
    theme={{
       token: {
      fontFamily: "inherit",
      colorPrimary: "#E11D48",        // focus color
      colorBorder: "#E11D48",         // normal border
      colorBorderSecondary: "#E11D48",
    },
      components: {
        Input: {
          activeBorderColor: "#E11D48",
          hoverBorderColor: "#E11D48",
        },
        Select: {
          activeBorderColor: "#E11D48",
          hoverBorderColor: "#E11D48",
        },
      },
    }}
  >

    <Space vertical size="middle">

      <Space.Compact>
        <Select defaultValue="Search by" options={options} />
        <Input defaultValue="" />
      </Space.Compact>

    </Space>
  </ConfigProvider>

);


export default SearchInput;