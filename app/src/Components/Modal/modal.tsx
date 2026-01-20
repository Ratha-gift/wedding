import React, { useState, useEffect } from "react";
import { Modal, Input, Radio, ConfigProvider, message } from "antd";
import api from "@/app/server/api";

type GuestForm = {
  id?: number;
  guest_name: string;
  guest_type: "1" | "2" | "3";
  phone_number: string;
  address: string;
  remark: string;
  give_money_type_id: number;
};

interface ModalCreateProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  initialData?: Partial<GuestForm>;
  mode?: "create" | "edit";
}

const EMPTY_FORM: GuestForm = {
  guest_name: "",
  guest_type: "1",
  phone_number: "",
  address: "",
  remark: "",
  give_money_type_id: 1,
};

const ModalCreate: React.FC<ModalCreateProps> = ({
  open,
  onCancel,
  onSuccess,
  initialData,
  mode = "create",
}) => {
  const isEdit = mode === "edit";
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<GuestForm>(EMPTY_FORM);

  /** Reset form every time modal opens */
  useEffect(() => {
    if (open) {
      setForm({
        ...EMPTY_FORM,
        ...initialData,
      });
    }
  }, [open, initialData]);

  const handleSave = async () => {
    try {
      setLoading(true);

      const payload = {
        guest_name: form.guest_name,
        // guest_type: form.guest_type?.trim() || undefined,
        guest_type: form.guest_type,
        phone_number: form.phone_number,
        address: form.address,
        remark: form.remark,
        give_money_type_id: form.give_money_type_id,

      };

      if (isEdit && form.id) {
        await api.put(`/guest/update${form.id}`, payload);
        message.success("កែប្រែភ្ញៀវបានជោគជ័យ");
      } else {
        await api.post("/guest/create", payload);
        message.success("បង្កើតភ្ញៀវបានជោគជ័យ");
      }

      onSuccess();
      onCancel();
    } catch (err: any) {
      message.error(
        err.response?.data?.message ||
        (isEdit
          ? "កែប្រែមិនបានជោគជ័យ"
          : "បង្កើតភ្ញៀវមិនបានជោគជ័យ")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
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
      <Modal
        open={open}
        centered
        width={520}
        footer={null}
        closable={false}
        maskClosable={!loading}
        onCancel={onCancel}
        bodyStyle={{ padding: "28px 32px" }}
      >
        <h2 className="text-center text-xl font-bold text-[#E11D48]">
          {isEdit ? "កែសម្រួល" : "បញ្ចូលភ្ញៀវកិត្តិយស"}
        </h2>

        <div className="font-medium text-[16px] space-y-4 mt-4">
          <InputField label="ឈ្មោះ" value={form.guest_name}
            onChange={(v) => setForm({ ...form, guest_name: v })}
          />

          <InputField label="លេខទូរស័ព្ទ " value={form.phone_number}
            onChange={(v) => setForm({ ...form, phone_number: v })}
          />

          <InputField label="ទីតាំង" value={form.address}
            onChange={(v) => setForm({ ...form, address: v })}
          />
          <InputField label="យកដៃ/សងដៃ" value={form.give_money_type_id.toString()}
            onChange={(v) => setForm({ ...form, give_money_type_id: Number(v) })}
          />

          <InputField label="សម្គាល់" value={form.remark}
            onChange={(v) => setForm({ ...form, remark: v })}
          />

          <div className="text-[#E11D48] font-medium text-[16px] block mb-2 gap-1">
            <span className="mr-7">ភ្ញៀវខាង:</span>

            <Radio.Group
              value={form.guest_type}
              disabled={loading}
              onChange={(e) =>
                setForm({ ...form, guest_type: e.target.value })
              }
              className="flex gap-6"
            >
              <Radio value={1}>ភ្ញៀវខាងស្រី</Radio>
              <Radio value={2}>ភ្ញៀវខាងប្រុស</Radio>
              <Radio value={3}>ភ្ញៀវទាំងខាង</Radio>
            </Radio.Group>
          </div>

          {/* <div className="text-[#E11D48] block mb-2 gap-1">
            <span className="mr-7">ស្លាក:</span>
          
            <Radio.Group
            
              value={form.give_money_type_id}
              disabled={loading}
              onChange={(e) =>
                setForm({ ...form, give_money_type_id: e.target.value })
              }
              className="flex gap-6"
            >
              <Radio value={1}>យកដៃ</Radio>
              <Radio value={2}>សងដៃ</Radio>
              <Radio value={3}>ផ្សេងៗ</Radio>
            </Radio.Group>
          </div> */}

        </div>

        <div className=" font-medium text-[16px] flex justify-center gap-6 mt-8">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-8 py-2 rounded-lg bg-gray-200"
          >
            បោះបង់
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-8 py-2 rounded-lg bg-[#E11D48] text-white"
          >
            {loading ? "កំពុងរក្សាទុក..." : isEdit ? "កែប្រែ" : "រក្សាទុក"}
          </button>
        </div>
      </Modal>
    </ConfigProvider>
  );
};
/** Small helper */
const InputField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div>
    <label className="text-[#E11D48]">{label}:</label>
    <Input
      className="mt-1 h-10 rounded-lg"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default ModalCreate;


