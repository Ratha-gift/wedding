import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import Allbutton from './Allbutton';
import Searchname from '../Input/Searchname';

const Create: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal} style={{width:'122px',height:'42px',fontSize:'20px'}}>
        បង្កើតថ្មី
      </Button>
      
      <Modal
        title={<div className='text-4xl text-[#e11d48] flex justify-center'>បង្កើតអ្នកប្រើប្រាស់ថ្មី</div>}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={560}
        
        styles={{body:{height:'390px',}
      }}
        footer={
        <div className='h-15 flex justify-center gap-10'>
          <Allbutton Children='បោះបង់' className='bg-[#e7e7e7] text-[#e11d48] shadow-lg text-lg w-50'/>
          <Allbutton Children='រក្សាទុក' className='text-white text-lg shadow-lg shadow-[#a69f9f] w-50'/>
        </div>
}
      >
     <div className="grid ml-6 h-90 items-center ">
          <div className='w-sm '>
            <h1 className='text-xl text-[#e11d48]'>នាមត្រកូល</h1>
            <Searchname Children='បញ្ចូលនាមត្រកូល...' className='bg-white w-115 text-xl p-5'/>
            <h1 className=' mt-8 text-xl text-[#e11d48]'>នាមខ្លួន</h1>
            <Searchname Children='បញ្ចូលនាមខ្លួន...' className='bg-white w-115 text-xl p-5'/>
            <h1 className='mt-8 text-xl text-[#e11d48]'>ឈ្មោះអ្នកប្រើប្រាស់</h1>
            <Searchname Children='បញ្ចូលឈ្មោះអ្នកប្រើប្រាស់...' className='bg-white w-115 text-xl p-5'/>
          </div>
       </div>


      </Modal>
    </>
  );
};

export default Create;