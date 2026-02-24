import React, { useEffect,useState } from 'react';
import { Button, Modal, Input, } from 'antd';
import Allbutton from '../Button/allbutton';
import Searchname from '../Button/search';
type UserForm = {
  user_id?: number;
  first_name: string;
  last_name: string;
  email: string;
  user_name: string;
};
interface UserModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (data: UserForm) => void;
  initialData?: Partial<UserForm>;
  loading?: boolean;
  mode: "create" | "edit";
}
const EMPTY_FORM: UserForm = {
  first_name: "",
  last_name: "",
  email: "",
  user_name: "",
};
const CreateUser: React.FC<UserModalProps> = ({
     open, onCancel, onSubmit, initialData, loading = false, mode, }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<UserForm>(EMPTY_FORM);
    useEffect(() => {
    if (open) {
        setForm({
            ...EMPTY_FORM,
            ...initialData,
        });
        setIsModalOpen(true);
    } else {
        setIsModalOpen(false);
    }
    }, [open, initialData]);

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
      <Button type="primary" onClick={showModal} style={{ width: '122px', height: '42px', fontSize: '20px' }}>
        បង្កើតថ្មី
      </Button>

      <Modal
        title={<div className='text-4xl text-[#e11d48] flex justify-center'>បង្កើតអ្នកប្រើប្រាស់ថ្មី</div>}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={560}

        styles={{
          body: { height: '390px', }
        }}
        footer={
          // <div className='h-15 flex justify-center gap-10'>
          //   <Allbutton Children="បោះបង់" className='bg-[#e7e7e7] text-[#e11d48] shadow-lg text-lg w-50'/>
          //   <Allbutton Children="រក្សាទុក" className='text-white text-lg shadow-lg shadow-[#a69f9f] w-50'/>
          // </div>
          <div className="h-15 flex items-center justify-center gap-10 px-6 py-4">
            <Allbutton
              children="បោះបង់"           // ← lowercase 'c' is correct in React
              className="bg-[#e7e7e7] text-[#e11d48] hover:bg-[#e0e0e0] active:bg-[#d0d0d0] shadow-lg text-lg font-medium w-48 min-w-[140px] rounded-lg py-2.5"
            />

            <Allbutton
              children="រក្សាទុក"
              className="bg-[#e11d48] text-white hover:bg-[#c51a3f] active:bg-[#a81533] shadow-lg shadow-[#e11d48]/40 text-lg font-medium w-48 min-w-[140px] rounded-lg py-2.5"
            />
          </div>
        }
      >
        <div className="grid ml-6 h-90 items-center ">
          <div className='w-sm '>
            <h1 className='text-xl text-[#e11d48]'>នាមត្រកូល</h1>
            <Searchname Children='បញ្ចូលនាមត្រកូល...' className='bg-white w-115 text-xl p-5' />
            <h1 className=' mt-8 text-xl text-[#e11d48]'>នាមខ្លួន</h1>
            <Searchname Children='បញ្ចូលនាមខ្លួន...' className='bg-white w-115 text-xl p-5' />
            <h1 className='mt-8 text-xl text-[#e11d48]'>ឈ្មោះអ្នកប្រើប្រាស់</h1>
            <Searchname Children='បញ្ចូលឈ្មោះអ្នកប្រើប្រាស់...' className='bg-white w-115 text-xl p-5' />
          </div>
        </div>

      </Modal>
    </>
  );
};

export default CreateUser;