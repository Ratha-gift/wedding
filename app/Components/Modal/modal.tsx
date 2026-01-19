"use client";

import React, { useState } from "react";
import { Button, Modal, Input, Radio, ConfigProvider, message } from "antd";
import api  from "../../(pages)/server/api";
type Props = {
  onSuccess?: () => void; // refresh table
   title?: string;
   width?: number;
  
};

const Modalcreate: React.FC<Props> = ({ onSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
   guest_name: "",
    guest_type: "ភ្ញៀវកិត្តិយស", // default value - you can make it selectable later
    phone_number: "",
    address: "",
    remark: "",
    give_money_type_id: 1,

  });

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  const handleOk = async () => {
    try {
      setLoading(true);

      await api.post(
        "/guest/create",
        {
          guest_name: form.guest_name,
          guest_type: form.guest_type,           // ← added
          phone_number: form.phone_number,
          address: form.address,
          remark: form.remark,
          give_money_type_id: form.give_money_type_id,

        },
      );

      message.success("បង្កើតភ្ញៀវបានជោគជ័យ");
      setIsModalOpen(false);
      onSuccess?.();

      // reset form
      setForm({
        guest_name: "",
        guest_type: "ភ្ញៀវកិត្តិយស  ",
        phone_number: "",
        address: "",
        remark: "",
        give_money_type_id: 1,
      });
    } catch (err: any) {
      message.error(
        err.response?.data?.message || "បង្កើតភ្ញៀវមិនបានជោគជ័យ"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: "inherit",
            colorPrimary: "#E11D48",
            borderRadiusLG: 28,
          },
          components: {
            Modal: {
              contentBg: "#F2F2F2",
            },
          },
        }}
      >
        <Button type="primary" onClick={showModal} style={{width:'122px',height:'42px',fontSize:'20px'}}>
          បង្កើតថ្មី
        </Button>

              <Modal
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
          centered
          width={520}
          closable={false}
          styles={{
            body: { padding: "28px 32px" },
            mask: { backgroundColor: "rgba(0,0,0,0.45)" },
          }}
        >
          <h2 className="text-center text-2xl font-bold text-[#E11D48]">
            បញ្ចូលភ្ញៀវកិត្តិយស
          </h2>

          <div className="space-y-4 mt-4">
            <div>
              <label className="text-[#E11D48] text-lg">ឈ្មោះ:</label>
              <Input
                bordered={false}
                style={{ backgroundColor: "#ffffff" }}
                className="mt-1 h-12 rounded-lg"
                value={form.guest_name}
                onChange={(e) =>
                  setForm({ ...form, guest_name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-[#E11D48] text-lg">លេខទូរស័ព្ទ:</label>
              <Input
                bordered={false}
                style={{ backgroundColor: "#ffffff" }}
                className="mt-1 h-12 rounded-lg"
                value={form.phone_number}
                onChange={(e) =>
                  setForm({ ...form, phone_number: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-[#E11D48] text-lg">ទីតាំង:</label>
              <Input
                bordered={false}
                style={{ backgroundColor: "#ffffff" }}
                className="mt-1 h-12 rounded-lg"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-[#E11D48] text-lg">សម្គាល់:</label>
              <Input
                bordered={false}
                style={{ backgroundColor: "#ffffff" }}
                className="mt-1 h-12 rounded-lg"
                value={form.remark}
                onChange={(e) =>
                  setForm({ ...form, remark: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-[#E11D48] block mb-2 text-lg">ស្ថានភាព:</label>
              <Radio.Group
                value={form.give_money_type_id}
                onChange={(e) =>
                  setForm({ ...form, give_money_type_id: e.target.value })
                }
                className="flex gap-6"
              >
                <Radio value={1}>យកដៃ</Radio>
                <Radio value={2}>សងដៃ</Radio>
                <Radio value={3}>ផ្សេងៗ</Radio>
              </Radio.Group>
            </div>
          </div>

          <div className="flex justify-center gap-6 mt-8">
            <button
              onClick={handleCancel}
              className="px-8 py-2 rounded-lg bg-gray-200 shadow w-35 h-12"
            >
              បោះបង់
            </button>

            <button
              onClick={handleOk}
              disabled={loading}
              className="px-8 py-2 rounded-lg bg-[#E11D48] text-white shadow disabled:opacity-60 w-45 h-12"
            >
              {loading ? "កំពុងរក្សាទុក..." : "រក្សាទុក"}
            </button>
          </div>
        </Modal>

      </ConfigProvider>
    </>
  );
};

export default Modalcreate;
