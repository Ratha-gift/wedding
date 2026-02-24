import React, { useState, useEffect } from "react";
import { Modal, Input, Radio, ConfigProvider, Select, Button, message } from "antd";

type GuestForm = {
  guest_id?: number;
  guest_name?: string;
  guest_type?: string;
  phone_number?: string;
  address?: string;
  remark?: string;
  give_money_type_id?: number;
  // future user fields
  username?: string;
  email?: string;
  password?: string;
};

interface ModalCreateProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  mode?: "create" | "edit";
  loading?: boolean;
  type?: "guest" | "user";
}

const EMPTY_FORM: GuestForm = {
  guest_name: "",
  guest_type: "",
  phone_number: "",
  address: "",
  remark: "",
  give_money_type_id: undefined,
};

const ModalCreate: React.FC<ModalCreateProps> = ({
  open,
  onCancel,
  onSubmit,
  initialData,
  mode = "create",
  loading = false,
  type = "guest",
}) => {
  const isEdit = mode === "edit";
  const [form, setForm] = useState<GuestForm>(EMPTY_FORM);

  useEffect(() => {
    if (open) {
      setForm({
        ...EMPTY_FORM,
        ...initialData,
      });
    }
  }, [open, initialData]);

  const handleSave = () => {
    if (type === "guest" && !form.give_money_type_id) {
      message.warning("សូមបំពេញព័ត៌មាន");
      return;
    }

    onSubmit(form);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "inherit",
          colorPrimary: "#E11D48",
          borderRadiusLG: 25,
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
          {isEdit ? "កែសម្រួល" : type === "guest" ? "បញ្ចូលភ្ញៀវកិត្តិយស" : "បញ្ចូលអ្នកប្រើប្រាស់"}
        </h2>

        <div className="font-medium text-[16px] space-y-4 mt-4">

          {/* ================= GUEST FORM ================= */}
          {type === "guest" && (
            <>
              <InputField
                label="ឈ្មោះ"
                value={form.guest_name || ""}
                onChange={(v) => setForm({ ...form, guest_name: v })}
              />

              <InputField
                label="លេខទូរស័ព្ទ"
                value={form.phone_number || ""}
                onChange={(v) => setForm({ ...form, phone_number: v })}
              />

              <InputField
                label="ទីតាំង"
                value={form.address || ""}
                onChange={(v) => setForm({ ...form, address: v })}
              />

              <div>
                <label className="text-[#E11D48]">យកដៃ/សងដៃ:</label>
                <Select
                  className="w-full h-10 mt-1"
                  value={form.give_money_type_id}
                  disabled={loading}
                  onChange={(value) =>
                    setForm({ ...form, give_money_type_id: value })
                  }
                  options={[
                    { value: 1, label: "យកដៃ" },
                    { value: 2, label: "សងដៃ" },
                  ]}
                />
              </div>

              <InputField
                label="សម្គាល់"
                value={form.remark || ""}
                onChange={(v) => setForm({ ...form, remark: v })}
              />

              <div className="text-[#E11D48] font-medium text-[16px]">
                <span className="mr-7">ភ្ញៀវខាង:</span>

                <Radio.Group
                  value={form.guest_type}
                  disabled={loading}
                  onChange={(e) =>
                    setForm({ ...form, guest_type: e.target.value })
                  }
                  className="flex gap-6 mt-2"
                >
                  <Radio value="ខាងស្រី">ភ្ញៀវខាងស្រី</Radio>
                  <Radio value="ខាងប្រុស">ភ្ញៀវខាងប្រុស</Radio>
                  <Radio value="ទាំងខាង">ភ្ញៀវទាំងខាង</Radio>
                </Radio.Group>
              </div>
            </>
          )}

          {/* ================= USER FORM  ================= */}
          {type === "user" && (
            <>
              <InputField
                label="Username"
                value={form.username || ""}
                onChange={(v) => setForm({ ...form, username: v })}
              />

              <InputField
                label="Email"
                value={form.email || ""}
                onChange={(v) => setForm({ ...form, email: v })}
              />

              <InputField
                label="Password"
                value={form.password || ""}
                onChange={(v) => setForm({ ...form, password: v })}
              />
            </>
          )}
        </div>

        <div className="flex justify-center gap-6 mt-8">
          <Button
            onClick={onCancel}
            disabled={loading}
            className="px-8 w-32 h-16 text-base rounded-lg"
          >
            បោះបង់
          </Button>

          <Button
            type="primary"
            loading={loading}
            onClick={handleSave}
            className="px-8 w-32 h-16 text-base rounded-lg"
          >
            {isEdit ? "កែប្រែ" : "រក្សាទុក"}
          </Button>
        </div>

      </Modal>
    </ConfigProvider>
  );
};

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