import React from 'react';
import { Switch, ConfigProvider } from 'antd';

const onChange = (checked: boolean) => {
  console.log(`switch to ${checked}`);
};

const MyBigSwitch: React.FC = () => {
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
      <Switch defaultChecked onChange={onChange} />
    </ConfigProvider>
  );
};

export default MyBigSwitch;