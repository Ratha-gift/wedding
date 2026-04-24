"use client";
import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from 'lucide-react';
import { Modal, Input, Radio, ConfigProvider, Select, Button, message } from "antd";

type FormData = {
  // Guest fields
  guest_id?: number;
  guest_name?: string;
  guest_type?: string;
  phone_number?: string;
  address?: string;
  remark?: string;
  give_money_type_id?: number;

  // User fields
  role_id?: number;
  first_name?: string;
  last_name?: string;
  user_name?: string;
  email?: string;
  password?: string;

  //currency
  amount_khr?: number;
  amount_usd?: number;

  total_khr?: number;
  total_usd?: number;
};

interface ModalCreateProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (data: FormData) => void;
  initialData?: Partial<FormData>;
  mode?: "create" | "edit";
  loading?: boolean;
  type?: "guest" | "user" | "currency";
}

const EMPTY_FORM: FormData = {
  guest_name: "",
  guest_type: "",
  phone_number: "",
  address: "",
  remark: "",
  give_money_type_id: undefined,


  // User fields
  first_name: "",
  last_name: "",
  user_name: "",
  email: "",
  password: "",
  role_id: undefined,

  //currency
  amount_khr: 0,
  amount_usd: 0,
  total_khr: 0,
  total_usd: 0,
};

const ModalCreate: React.FC<ModalCreateProps> = ({

  open,
  onCancel,
  onSubmit,
  initialData = {},
  mode = "create",
  loading = false,
  type = "guest",
}) => {
  const isEdit = mode === "edit";
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  // const [roles, setRoles] = useState<any[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        ...EMPTY_FORM,
        ...initialData,
        // role_id: initialData.role_id ? Number(initialData.role_id) : undefined, // default to "User" role for user form
      });
      // fetch("/api/roles")
      //   .then((res) => res.json())
      //   .then((data) => setRoles(data))
      //   .catch(() => setRoles([]));
    }
  }, [open, initialData]);

  const handleSave = () => {
    if (type === "guest") {
      if (!form.guest_name?.trim()) {
        message.warning("សូមបញ្ចូលឈ្មោះ");
        return;
      }
      if (!form.give_money_type_id) {
        message.warning("សូមជ្រើសរើស យកដៃ/សងដៃ");
        return;
      }
    }

    if (type === "user") {
      if (!form.first_name?.trim()) {
        message.warning("សូមបញ្ចូលនាមត្រកូល");
        return;
      }
      if (!form.last_name?.trim()) {
        message.warning("សូមបញ្ចូលនាមខ្លួន");
        return;
      }
      if (!form.user_name?.trim()) {
        message.warning("សូមបញ្ចូលឈ្មោះអ្នកប្រើ");
        return;
      }
      if (!form.email?.trim()) {
        message.warning("សូមបញ្ចូលអ៊ីមែល");
        return;
      }
      // if (!form.password?.trim()) {
      //   message.warning("សូមបញ្ចូលលេខសម្ងាត់");
      //   return;
      // }
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
        width={540}
        footer={null}
        closable={false}
        maskClosable={!loading}
        onCancel={onCancel}
        bodyStyle={{ padding: "28px 32px", maxHeight: "85vh", overflowY: "auto" }}
      >
        <h2 className="text-center text-xl font-bold text-[#E11D48] mb-6">
          {isEdit
            ? "កែសម្រួល"
            : type === "guest"
              ? "បញ្ចូលភ្ញៀវកិត្តិយស"
              : "បញ្ចូលអ្នកប្រើប្រាស់ថ្មី"}
        </h2>

        <div className="space-y-5 text-[16px] font-medium">

          {/* Guest Form */}
          {type === "guest" && (
            <div className="guest-form space-y-3">
              <InputField
                label="ឈ្មោះ"
                value={form.guest_name || ""}
                onChange={(v) => setForm({ ...form, guest_name: v })}
                placeholder="បញ្ចូលឈ្មោះភ្ញៀវ..."
              />

              <InputField
                label="លេខទូរស័ព្ទ"
                value={form.phone_number || ""}
                onChange={(v) => setForm({ ...form, phone_number: v })}
                placeholder="012 345 678"
              />

              <InputField
                label="ទីតាំង / អាសយដ្ឋាន"
                value={form.address || ""}
                onChange={(v) => setForm({ ...form, address: v })}
                placeholder="ភូមិ ឃុំ ស្រុក ខេត្ត..."
              />

              <div>
                <label className="text-[#E11D48] block mb-1">យកដៃ / សងដៃ:</label>
                <Select
                  className="w-full h-10"
                  placeholder="ជ្រើសរើស..."
                  value={form.give_money_type_id}
                  disabled={loading}
                  onChange={(value) => setForm({ ...form, give_money_type_id: value })}
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
                placeholder="ចំណាំ..."
              />

              <div className="text-[#E11D48] font-medium text-[16px]">
                <span className="mr-7">ភ្ញៀវខាង:</span>

                <Radio.Group
                  value={form.guest_type}
                  disabled={loading}
                  onChange={(e) =>
                    setForm({ ...form, guest_type: e.target.value })
                  }
                  className="flex gap-6 mt-4"
                >
                  <Radio value="ខាងស្រី">ភ្ញៀវខាងស្រី</Radio>
                  <Radio value="ខាងប្រុស">ភ្ញៀវខាងប្រុស</Radio>
                  <Radio value="ទាំងខាង">ភ្ញៀវទាំងខាង</Radio>
                </Radio.Group>
              </div>
            </div>
          )}


          {/* User Form */}
          {type === "user" && (
            <div className="user-form space-y-2">
              <InputField
                label="នាមត្រកូល"
                value={form.first_name || ""}
                onChange={(v) => setForm({ ...form, first_name: v })}
                placeholder="នាមត្រកូល..."
              />

              <InputField
                label="នាមខ្លួន"
                value={form.last_name || ""}
                onChange={(v) => setForm({ ...form, last_name: v })}
                placeholder="នាមខ្លួន..."
              />

              <InputField
                label="ឈ្មោះអ្នកប្រើ"
                value={form.user_name || ""}
                onChange={(v) => setForm({ ...form, user_name: v })}
                placeholder="username សម្រាប់ Login"
              />

              <InputField
                label="អ៊ីមែល"
                value={form.email || ""}
                onChange={(v) => setForm({ ...form, email: v })}
                placeholder="example@gmail.com"
              />

              <div className="relative ">
                <InputField
                  label="លេខសម្ងាត់"
                  value={form.password || ""}
                  onChange={(v) => setForm({ ...form, password: v })}
                  type={showPassword ? "text" : "password"}
                  placeholder="យ៉ាងហោចណាស់ ៦ តួ"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-500 hover:text-[#E11D48] focus:outline-none"
                  tabIndex={-1} // prevent focus stealing
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div>
                <label className="text-[#E11D48] block mb-1">តួនាទី:</label>
               <Select
                  className="w-full h-10"
                  placeholder="ជ្រើសរើសតួនាទី..."
                  value={form.role_id ?? undefined}
                  disabled={loading}
                  onChange={(value) => setForm({ ...form, role_id: value })}
                  // options={roles.map((r) => ({
                  //   value: Number(r.role_id),
                  //   label: r.role_name,
                  // }))}
                />
              </div>
            </div>
          )}

          {type === "currency" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* LEFT SIDE (Guest Info) */}
              <div className="space-y-3">
                <InputField
                  label="ឈ្មោះ"
                  value={form.guest_name || ""}
                  onChange={(v) => setForm({ ...form, guest_name: v })}
                  placeholder="បញ្ចូលឈ្មោះភ្ញៀវ..."
                />

                <InputField
                  label="លេខទូរស័ព្ទ"
                  value={form.phone_number || ""}
                  onChange={(v) => setForm({ ...form, phone_number: v })}
                  placeholder="012 345 678"
                />

                <InputField
                  label="ទីតាំង / អាសយដ្ឋាន"
                  value={form.address || ""}
                  onChange={(v) => setForm({ ...form, address: v })}
                  placeholder="ភូមិ ឃុំ ស្រុក ខេត្ត..."
                />

                <div>
                  <label className="text-[#E11D48] block mb-1">យកដៃ / សងដៃ:</label>
                  <Select
                    className="w-full h-10"
                    placeholder="ជ្រើសរើស..."
                    value={form.give_money_type_id}
                    onChange={(value) => setForm({ ...form, give_money_type_id: value })}
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
                  placeholder="ចំណាំ..."
                />

                <div className="text-[#E11D48] font-medium">
                  <span className="mr-7">ភ្ញៀវខាង:</span>
                  <Radio.Group
                    value={form.guest_type}
                    onChange={(e) =>
                      setForm({ ...form, guest_type: e.target.value })
                    }
                    className="flex gap-4 mt-2"
                  >
                    <Radio value="ខាងស្រី">ស្រី</Radio>
                    <Radio value="ខាងប្រុស">ប្រុស</Radio>
                    <Radio value="ទាំងខាង">ទាំងអស់</Radio>
                  </Radio.Group>
                </div>
              </div>

              {/* RIGHT SIDE (Currency) */}
              <div className="space-y-4">

                {/* MONEY BOX */}
                <div className="rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-[#E11D48] text-white px-4 py-2 font-semibold">
                    សាច់ប្រាក់ 💸
                  </div>

                  <div className="p-3 bg-white space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-12 text-gray-500">KHR</span>
                      <Input
                        value={form.amount_khr}
                        onChange={(e) =>
                          setForm({ ...form, amount_khr: Number(e.target.value) || 0 })
                        }
                        placeholder="0"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-12 text-gray-500">USD</span>
                      <Input
                        value={form.amount_usd}
                        onChange={(e) =>
                          setForm({ ...form, amount_usd: Number(e.target.value) || 0 })
                        }
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* TOTAL BOX */}
                <div className="rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-[#06B6D4] text-white px-4 py-2 font-semibold">
                    សរុប 💰
                  </div>

                  <div className="p-3 bg-white space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-12 text-gray-500">KHR</span>
                      <Input value={form.total_khr} disabled />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-12 text-gray-500">USD</span>
                      <Input value={form.total_usd} disabled />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        <div className="flex justify-center gap-6 mt-4 pt-2 border-gray-200">
          <Button
            onClick={onCancel}
            disabled={loading}
            className="min-w-[120px] h-11 text-base rounded-lg border-gray-400 hover:border-[#E11D48]"
          >
            បោះបង់
          </Button>

          <Button
            type="primary"
            loading={loading}
            onClick={handleSave}
            className="min-w-[120px] h-11 text-base rounded-lg"
          >
            {isEdit ? "កែប្រែ" : "រក្សាទុក"}
          </Button>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}

const InputField = ({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  className = "",           // ← allow extra class
}: InputFieldProps & { className?: string }) => (
  <div className={className}>
    <label className="text-[#E11D48] block mb-1 font-medium">{label}:</label>
    <Input
      type={type}
      className="h-10 rounded-lg pr-10" // ← pr-10 = padding-right for icon
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

export default ModalCreate;