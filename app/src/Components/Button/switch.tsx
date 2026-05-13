import React from 'react';
import { Switch, ConfigProvider } from 'antd';

interface MyBigSwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  loading?: boolean;
}

const MyBigSwitch: React.FC<MyBigSwitchProps> = ({ checked, onChange, disabled, loading }) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Switch: {
            handleSize: 15,
            trackHeight: 20,
            trackMinWidth: 40,
            borderRadius: 3,
          },
        },
      }}
    >
      <Switch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        loading={loading}
      />
    </ConfigProvider>
  );
};

export default MyBigSwitch;