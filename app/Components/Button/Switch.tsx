// Components/Bu/MySwitch.tsx  (ឬណាដែលអ្នកដាក់)
import React from 'react';
import { Switch } from 'antd';

interface MySwitchProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean; // បើចង់ disable ពេល loading
}

const MySwitch: React.FC<MySwitchProps> = ({ checked, onChange, disabled = false }) => {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      size="default" // ឬ "small" បើចង់តូច
    />
  );
};

export default MySwitch;