import React, { useState } from 'react';
import { Button, Drawer } from 'antd';
import { ConfigProvider,  } from 'antd';
import { FaFilter } from "react-icons/fa";
import Searchname from '../Input/Searchname';
import MySwitch from './Switch';
import Allbutton from './Allbutton';


const Filder: React.FC = () => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
     <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#E11D48',           // optional: changes other primary elements too
        },
        components: {
          Pagination: {
            itemActiveColor: '#E11D48',      // ← active page TEXT color = red
            itemActiveBg: '#fff1f0',         // ← active page BACKGROUND = light red (nice contrast)
          },
        },
      }}
    >

  
    <>
      <Button type="primary" icon={<FaFilter />} onClick={showDrawer} style={{ width: '120px',height: '45px',fontSize: '19px',  }}>
        ច្រោះ
      </Button>
      <Drawer
        
        closable={{ placement: 'end' }}
        onClose={onClose}
        open={open}
        styles={{
    body: { 
      background: '#f2f2f2',
    }
  }}
      >
        <div>
            <div>
              <h1 className='text-[20px] text-[#e11d48]'>ឈ្មោះ</h1>
              <Searchname Children='ស្វែងរកតាមឈ្មោះ' className='bg-white p-2 text-lg w-'/>
            </div>
            <div className='w-85 h-12 bg-white flex items-center justify-between p-2 mt-4 rounded-md'>
                <h1 className='text-[#e11d48] text-[20px]'>ស្ថានភាព</h1>
                <MySwitch />
            </div>
            <div className='flex w-86 h-25 items-center gap-6'>
              <Allbutton Children='បោះបង់' className=' w-34 bg-gray-200 shadow-lg text-[#e11d48]'/>
              <Allbutton Children='អនុវត្តន៍' className='w-45 shadow-lg text-white'/>
            </div>
        </div>
      </Drawer>
    </>
    </ConfigProvider>
  );
};

export default Filder;