"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Eye, EyeOff, Upload, Camera } from 'lucide-react';
import { Modal, Input, Radio, ConfigProvider, Select, Button, message } from "antd";
import { AllData } from "../Data/Image/image";
import { useAuth } from "@/app/src/lib/useAuth";

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
  password_confirmation?: string;
  image_profile?: string;

  //currency
  images?: string[];
  amount_khr?: number;
  amount_usd?: number;
  bank_khr?: number;
  bank_usd?: number;

  total_khr?: number;
  total_usd?: number;

  // meta
  created_by?: string;
};

interface ModalCreateProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (data: FormData) => void;
  initialData?: Partial<FormData>;
  inputClassName?: string;
  mode?: "create" | "edit";
  loading?: boolean;
  type?: "guest" | "user" | "currency";
  giveMoneyTypeOptions?: { value: number; label: string }[];
  roles?: { role_id: number; role_name: string }[];
}
// const [form, setForm] = useState({
//   amount_khr: 0, // cash
//   amount_usd: 0,
//   bank_khr: 0,   // bank
//   bank_usd: 0,
// });
// const totalKHR = form.amount_khr + form.bank_khr;
// const totalUSD = form.amount_usd + form.bank_usd;

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
  password_confirmation: "",
  role_id: undefined,
  image_profile: "",

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
  giveMoneyTypeOptions,
  roles = [],
}) => {
  const { user } = useAuth();
  const giveMoneyOpts = giveMoneyTypeOptions?.length
    ? giveMoneyTypeOptions
    : [{ value: 1, label: "យកដៃ" }, { value: 2, label: "សងដៃ" }];
  const isEdit = mode === "edit";
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [pwModalOpen, setPwModalOpen] = useState(false);
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [showPwNew, setShowPwNew] = useState(false);
  const [showPwConfirm, setShowPwConfirm] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const openCamera = useCallback(async () => {
    setShowCamera(true);
    try {
      // Enumerate all video devices and prefer Iriun Webcam if available
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((d) => d.kind === "videoinput");
      const iriun = videoDevices.find((d) => d.label.toLowerCase().includes("iriun"));
      const deviceId = iriun?.deviceId ?? videoDevices[0]?.deviceId;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: deviceId ? { deviceId: { exact: deviceId } } : true,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      message.error("មិនអាចប្រើកាមេរ៉ាបាន — សូមពិនិត្យ Iriun Webcam");
      setShowCamera(false);
    }
  }, []);

  const closeCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setShowCamera(false);
  }, []);

  const takePhoto = useCallback(() => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL("image/png");
    setForm((prev) => ({ ...prev, images: [...(prev.images ?? []), dataUrl] }));
    closeCamera();
  }, [closeCamera]);

  const handleImageUpload = (file: File | null) => {
    if (!file) return;
    if ((form.images ?? []).length >= 2) {
      message.warning("អាចបញ្ចូលបានត្រឹមតែ 2 រូបភាព");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      message.error("ទំហំឯកសារធំពេក! អតិបរមា 25MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setForm((prev) => ({ ...prev, images: [...(prev.images ?? []), e.target?.result as string] }));
    };
    reader.readAsDataURL(file);
  };

  const resizeImageToBase64 = (src: string, maxPx = 300): Promise<string> =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > maxPx || h > maxPx) {
          if (w > h) { h = Math.round(h * maxPx / w); w = maxPx; }
          else { w = Math.round(w * maxPx / h); h = maxPx; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d")?.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.75));
      };
      img.src = src;
    });

  const handleSaveImage = (src: string) => {
    const a = document.createElement("a");
    a.href = src;
    a.download = `transaction-image-${Date.now()}.png`;
    a.click();
  };

  useEffect(() => {
    if (open) {
      const createdBy = mode === "create"
        ? (user?.user_name ?? "")
        : (initialData?.user_name ?? initialData?.created_by ?? "");
      setForm({ ...EMPTY_FORM, ...initialData, created_by: createdBy });
      setShowChangePassword(false);
      setShowPassword(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

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

    if (type === "currency") {
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
      if (mode === "create" && !form.password?.trim()) {
        message.warning("សូមបញ្ចូលលេខសម្ងាត់");
        return;
      }
      if (mode === "edit" && showChangePassword) {
        if (!form.password?.trim()) {
          message.warning("សូមបញ្ចូលលេខសម្ងាត់ថ្មី");
          return;
        }
        if (form.password !== form.password_confirmation) {
          message.warning("លេខសម្ងាត់មិនត្រូវគ្នា");
          return;
        }
      }
    }

    onSubmit(form);
  };

  const modalTitle = isEdit
  ? "កែសម្រួល"
  : {
      guest: "បញ្ចូលភ្ញៀវកិត្តិយស",
      user: "បញ្ចូលអ្នកប្រើប្រាស់ថ្មី",
      currency: "បញ្ចូលចំណងដៃ",
    }[type];

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
        centered={type !== "currency"}
        width={type === "currency" ? 800 : type === "user" ? 660 : 750}
        style={type === "currency" ? { top: 8 } : { top: "2vh" }}
        footer={null}
        closable={false}
        maskClosable={!loading}
        onCancel={onCancel}
        bodyStyle={
          type === "currency"
            ? { padding: "10px 32px 12px" }
            : type === "user"
            ? { padding: "20px 28px" }
            : { padding: "28px 32px", minHeight: "600px" }  // ← change minHeight here
        }
      >
        <h2 className="text-center text-xl  font-bold text-[#E11D48] mb-2">
          {modalTitle}
        </h2>

        <div className={`text-[16px] font-medium ${type === "user" ? "space-y-0" : "space-y-20"}`}>

          {/* Guest Form */}
          {type === "guest" && (
            <div className="guest-form mt-10 space-y-4">

              {/* Row 1: ឈ្មោះ | លេខទូរស័ព្ទ */}
              <div className="grid grid-cols-2 gap-4">
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
              </div>

              {/* Row 2: ទីតាំង | យកដៃ/សងដៃ */}
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="ទីតាំង / អាសយដ្ឋាន"
                  value={form.address || ""}
                  onChange={(v) => setForm({ ...form, address: v })}
                  placeholder="ភូមិ ឃុំ ស្រុក ខេត្ត..."
                />
                <div>
                  <label className="text-[#E11D48] block mb-1 font-medium">យកដៃ / សងដៃ:</label>
                  <Select
                    className="w-full h-10"
                    placeholder="ជ្រើសរើស..."
                    value={form.give_money_type_id}
                    disabled={loading}
                    onChange={(value) => setForm({ ...form, give_money_type_id: value })}
                    options={giveMoneyOpts}
                  />
                </div>
              </div>

              {/* Row 3: ភ្ញៀវខាង | (edit only: បង្កើតដោយ) */}
              <div className={`grid gap-4 ${isEdit ? "grid-cols-2" : "grid-cols-1"}`}>
                <div>
                  <label className="text-[#E11D48] block mb-1 font-medium">ភ្ញៀវខាង:</label>
                  <Radio.Group
                    value={form.guest_type}
                    disabled={loading}
                    onChange={(e) => setForm({ ...form, guest_type: e.target.value })}
                    className="flex flex-col gap-2 mt-1"
                  >
                    <Radio value="ខាងស្រី">ភ្ញៀវខាងស្រី</Radio>
                    <Radio value="ខាងប្រុស">ភ្ញៀវខាងប្រុស</Radio>
                    <Radio value="ទាំងខាង">ភ្ញៀវទាំងខាង</Radio>
                  </Radio.Group>
                </div>
                {isEdit && (
                  <div>
                    <label className="text-[#E11D48] block mb-1 font-medium">បង្កើតដោយ:</label>
                    <Input
                      className="rounded-lg px-3 h-10 bg-gray-100 text-gray-500"
                      value={form.created_by || "—"}
                      readOnly
                    />
                  </div>
                )}
              </div>

              {/* Row 4: Full width - សម្គាល់ */}
              <InputField
                label="សម្គាល់"
                multiline
                value={form.remark || ""}
                onChange={(v) => setForm({ ...form, remark: v })}
                placeholder="ចំណាំ..."
              />

            </div>
          )}

          {/* User Form */}
          {type === "user" && (
            <div className="flex flex-col gap-3">

              {/* ── Top row: fields (left) + profile image (right) ── */}
              <div className="flex gap-5">

                {/* Left: main form fields */}
                <div className="flex-1 space-y-2">
                  <InputField
                    label="នាមត្រកូល"
                    value={form.first_name || ""}
                    onChange={(v) => setForm((p) => ({ ...p, first_name: v }))}
                    placeholder="នាមត្រកូល..."
                  />
                  <InputField
                    label="នាមខ្លួន"
                    value={form.last_name || ""}
                    onChange={(v) => setForm((p) => ({ ...p, last_name: v }))}
                    placeholder="នាមខ្លួន..."
                  />
                  <InputField
                    label="ឈ្មោះអ្នកប្រើ"
                    value={form.user_name || ""}
                    onChange={(v) => setForm((p) => ({ ...p, user_name: v }))}
                    placeholder="username សម្រាប់ Login"
                  />
                  <InputField
                    label="អ៊ីមែល"
                    value={form.email || ""}
                    onChange={(v) => setForm((p) => ({ ...p, email: v }))}
                    placeholder="example@gmail.com"
                  />

                  {/* Password: inline for CREATE only */}
                  {!isEdit && (
                    <div className="relative">
                      <InputField
                        label="លេខសម្ងាត់"
                        value={form.password || ""}
                        onChange={(v) => setForm((p) => ({ ...p, password: v }))}
                        type={showPassword ? "text" : "password"}
                        placeholder="យ៉ាងហោចណាស់ ៦ តួ"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-500 hover:text-[#E11D48] focus:outline-none"
                        tabIndex={-1}
                      >
                        {showPassword ? <Eye className="h-5 w-5" />: <EyeOff className="h-5 w-5" />}
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="text-[#E11D48] block mb-1">តួនាទី:</label>
                    <Select
                      className="w-full h-10"
                      placeholder="ជ្រើសរើសតួនាទី..."
                      value={form.role_id ?? undefined}
                      disabled={loading}
                      onChange={(value) => setForm((p) => ({ ...p, role_id: value }))}
                      options={roles.map((r) => ({ value: Number(r.role_id), label: r.role_name }))}
                    />
                  </div>
                </div>

                {/* Right: profile image (shown in both create and edit) */}
                <div className="w-44 shrink-0 flex flex-col items-center gap-2 pt-1">
                  <div className="relative">
                    <img
                      src={form.image_profile || "/pic.png"}
                      alt="profile"
                      className="w-28 h-28 rounded-full cursor-pointer object-cover border-2 border-[#E11D48] bg-gray-100"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/pic.png"; }}
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById("profile-img-upload")?.click()}
                      className="absolute bottom-1 right-1 w-8 h-8 bg-[#E11D48] text-white rounded-full flex items-center justify-center hover:bg-rose-700 shadow-md transition-colors"
                    >
                      <Camera className="w-4 cursor-pointer h-4" />
                    </button>
                    <input
                      id="profile-img-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = async (ev) => {
                          const resized = await resizeImageToBase64(ev.target?.result as string);
                          setForm((p) => ({ ...p, image_profile: resized }));
                        };
                        reader.readAsDataURL(file);
                        e.target.value = "";
                      }}
                    />
                  </div>
                  <p className="text-[#E11D48] text-xs font-medium">ផ្លាស់ប្ដូររូបភាព</p>
                </div>
              </div>

              {/* ── Change password button (EDIT only) ── */}
              {isEdit && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setPwNew(""); setPwConfirm(""); setShowPwNew(false); setShowPwConfirm(false);
                      setPwModalOpen(true);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 hover:bg-rose-50 hover:border-[#E11D48] transition-colors"
                  >
                    <span className="text-[#E11D48] font-semibold text-sm">ផ្លាស់ប្ដូរ​លេខ​សម្ងាត់</span>
                    <span className="text-xs px-3 py-1 rounded-full font-medium bg-rose-100 text-[#E11D48]">
                      ចុចដើម្បីផ្លាស់ប្ដូរ
                    </span>
                  </button>

                  {/* ── Password change modal ── */}
                  <Modal
                    open={pwModalOpen}
                    centered
                    width={420}
                    footer={null}
                    closable={false}
                    maskClosable
                    onCancel={() => setPwModalOpen(false)}
                    styles={{ body: { padding: "28px 32px" } }}
                  >
                    <h2 className="text-center text-lg font-bold text-[#E11D48] mb-5">
                      ផ្លាស់ប្ដូរ​លេខ​សម្ងាត់
                    </h2>
                    <div className="space-y-4">
                      <div className="relative">
                        <label className="text-[#E11D48] block mb-1 text-sm font-medium">លេខសម្ងាត់ថ្មី:</label>
                        <Input
                          type={showPwNew ? "text" : "password"}
                          autoComplete="new-password"
                          value={pwNew}
                          onChange={(e) => setPwNew(e.target.value)}
                          placeholder="យ៉ាងហោចណាស់ ៦ តួ"
                          className="h-10 rounded-lg pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPwNew((v) => !v)}
                          className="absolute right-3 bottom-2.5 text-gray-400 hover:text-[#E11D48]"
                          tabIndex={-1}
                        >
                          {showPwNew ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                      </div>
                      <div className="relative">
                        <label className="text-[#E11D48] block mb-1 text-sm font-medium">បញ្ជាក់លេខសម្ងាត់ថ្មី:</label>
                        <Input
                          type={showPwConfirm ? "text" : "password"}
                          autoComplete="new-password"
                          value={pwConfirm}
                          onChange={(e) => setPwConfirm(e.target.value)}
                          placeholder="បញ្ចូលម្ដងទៀត..."
                          className="h-10 rounded-lg pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPwConfirm((v) => !v)}
                          className="absolute right-3 bottom-2.5 text-gray-400 hover:text-[#E11D48]"
                          tabIndex={-1}
                        >
                          {showPwConfirm ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-center gap-4 mt-6">
                      <Button
                        onClick={() => setPwModalOpen(false)}
                        className="min-w-[110px] h-10 rounded-lg border-gray-400"
                      >
                        បោះបង់
                      </Button>
                      <Button
                        type="primary"
                        className="min-w-[110px] h-10 rounded-lg"
                        onClick={() => {
                          if (!pwNew.trim()) { message.warning("សូមបញ្ចូលលេខសម្ងាត់ថ្មី"); return; }
                          if (pwNew !== pwConfirm) { message.warning("លេខសម្ងាត់មិនត្រូវគ្នា"); return; }
                          setForm((p) => ({ ...p, password: pwNew, password_confirmation: pwConfirm }));
                          setPwModalOpen(false);
                          message.success("រួចរាល់ — ចុច កែប្រែ ដើម្បីរក្សាទុក");
                        }}
                      >
                        យល់ព្រម
                      </Button>
                    </div>
                  </Modal>
                </>
              )}
            </div>
          )}

          {type === "currency" && (
          <div className="flex gap-6">

            {/* LEFT: Form Fields */}
            <div className="flex-1 space-y-3">
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
                  options={giveMoneyOpts}
                />
              </div>

              <div>
                <label className="text-[#E11D48] block mb-1">ភ្ញៀវខាង:</label>
                <Radio.Group
                  value={form.guest_type}
                  onChange={(e) => setForm({ ...form, guest_type: e.target.value })}
                  className="flex flex-wrap gap-x-6 gap-y-2"
                >
                  <Radio value="ខាងស្រី">ភ្ញៀវខាងស្រី</Radio>
                  <Radio value="ខាងប្រុស">ភ្ញៀវខាងប្រុស</Radio>
                  <Radio value="ទាំងខាង">ភ្ញៀវទាំងខាង</Radio>
                </Radio.Group>
              </div>

              <InputField
                inputClassName="w-full rounded-xl bg-gray-50"
                label="សម្គាល់"
                multiline
                value={form.remark || ""}
                onChange={(v) => setForm({ ...form, remark: v })}
                placeholder="ចំណាំ..."
              />

              {isEdit && (
                <div>
                  <label className="text-[#E11D48] block mb-1 font-medium">បង្កើតដោយ:</label>
                  <Input
                    className="rounded-lg px-3 h-10 bg-gray-100 text-gray-500"
                    value={form.created_by || "—"}
                    readOnly
                  />
                </div>
              )}
            </div>

            {/* RIGHT: Payment Panel - Stacked Cards */}
            <div className="w-75 shrink-0 space-y-3">

              <label className="text-[#E11D48] font-semibold text-[15px] block">
                វិធីបង់ប្រាក់
              </label>
              
              {/* Cash Card */}
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <div className="h-11 bg-[#E11D48] px-4 flex items-center gap-2 ">
                  <span className="text-white font-semibold text-[15px]">សាច់ប្រាក់</span>
                  <img src={AllData.IconCash.data} alt="cash" className="w-5 h-5" />
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-11 text-sm font-medium text-gray-600">KHR</span>
                    <Input
                      className="h-9 rounded-lg text-right"
                      value={form.amount_khr ?? ""}
                      onChange={(e) => setForm({ ...form, amount_khr: Number(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-11 text-sm font-medium text-gray-600">USD</span>
                    <Input
                      className="h-9 rounded-lg text-right"
                      value={form.amount_usd ?? ""}
                      onChange={(e) => setForm({ ...form, amount_usd: Number(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Bank Card */}
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <div className="h-11 bg-[#14B8E6] px-4 flex items-center gap-4">
                  <span className="text-white font-semibold text-[15px]">ធនាគារ</span>
                  <div className="flex gap-1">
                    {[AllData.IconBK, AllData.IconAC, AllData.IconABA].map((icon, i) => (
                      <img key={i} src={icon.data} alt="bank" className="w-5 h-5" />
                    ))}
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-11 text-sm font-medium text-gray-600">KHR</span>
                    <Input
                      className="h-9 rounded-lg text-right"
                      value={form.bank_khr ?? ""}
                      onChange={(e) => setForm({ ...form, bank_khr: Number(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-11 text-sm font-medium text-gray-600">USD</span>
                    <Input
                      className="h-9 rounded-lg text-right"
                      value={form.bank_usd ?? ""}
                      onChange={(e) => setForm({ ...form, bank_usd: Number(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
                {/* ================= IMAGE UPLOAD - Drag & Drop Style ================= */}
                <div className="rounded-lg  p-3"  >
                  <label className="text-[#E11D48] block  font-medium">
                    ឯសារយោង (Transaction)
                  </label>

                  <div className="flex flex-wrap gap-3">
                    {/* Uploaded thumbnails */}
                    {(form.images ?? []).map((src, idx) => (
                      <div
                        key={idx}
                        className="relative w-28 h-28 rounded-xl overflow-hidden border border-gray-200 shadow-sm shrink-0 cursor-pointer"
                        onClick={() => setPreviewImage(src)}
                      >
                        <img src={src} alt={`img-${idx}`} className="w-full h-full object-cover" />
                        <button
                          onClick={(e) => { e.stopPropagation(); setForm((prev) => ({ ...prev, images: (prev.images ?? []).filter((_, i) => i !== idx) })); }}
                          className="absolute top-1 right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    {/* Single add tile — hidden when 2 images uploaded */}
                    {(form.images ?? []).length < 2 && (
                      <div className="relative shrink-0">
                        <div
                          className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer flex flex-col items-center justify-center"
                          onClick={() => setShowUploadMenu((v) => !v)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => { e.preventDefault(); setShowUploadMenu(false); handleImageUpload(e.dataTransfer.files[0]); }}
                        >
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                            <Upload className="w-5 h-5 text-blue-500" />
                          </div>
                          <p className="text-[11px] text-gray-500">បន្ថែមរូប</p>
                        </div>

                        {/* Dropdown menu */}
                        {showUploadMenu && (
                          <div className="absolute bottom-full left-0 mb-2 w-36 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                            <button
                              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() => { setShowUploadMenu(false); document.getElementById('file-upload-add')?.click(); }}
                            >
                              <Upload className="w-4 h-4 text-blue-500" />
                              <span>រូបភាព</span>
                            </button>
                            <div className="h-px bg-gray-100" />
                            <button
                              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() => { setShowUploadMenu(false); openCamera(); }}
                            >
                              <Camera className="w-4 h-4 text-green-600" />
                              <span>ថតរូប</span>
                            </button>
                          </div>
                        )}

                        <input
                          id="file-upload-add"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); e.target.value = ""; }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Camera overlay */}
                  {showCamera && (
                    <div className="fixed inset-0 z-9999 bg-black/90 flex flex-col items-center justify-center gap-3">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="rounded-2xl max-w-[90vw] max-h-[65vh] object-cover shadow-2xl"
                      />
                      <div className="flex gap-4">
                        <button
                          onClick={takePhoto}
                          className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl"
                        >
                          ថតរូប
                        </button>
                        <button
                          onClick={closeCamera}
                          className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-xl"
                        >
                          បិទ
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Lightbox */}
                  {previewImage && (
                    <div
                      className="fixed inset-0 z-9999 bg-black/80 flex flex-col items-center justify-center"
                      onClick={() => setPreviewImage(null)}
                    >
                      <img 
                        src={previewImage}
                        alt="preview-full"
                        className="max-w-[90vw] max-h-[75vh] rounded-2xl object-contain shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex gap-4 mt-5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleSaveImage(previewImage)}
                          className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl"
                        >
                          រក្សាទុក
                        </button>
                        <button
                          onClick={() => setPreviewImage(null)}
                          className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-xl"
                        >
                          បិទ
                        </button>
                      </div>
                    </div>
                  )}
                </div>
            </div>
            
          </div>
         )}
        </div>
        <div className={`flex justify-center gap-4 ${type === "user" ? "mt-10" : "mt-10"}`}>
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
  multiline?: boolean;
}

const InputField = ({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  multiline = false,
  className = "",
  inputClassName = ""
}: InputFieldProps & { className?: string; inputClassName?: string }) => (
  <div className={className}>
    <label className="text-[#E11D48] block mb-1 font-medium">{label}:</label>
    {multiline ? (
      <Input.TextArea
        className={`rounded-lg px-3 resize-none ${inputClassName || "h-14"}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoSize={{ minRows: 2, maxRows: 4 }}
      />
    ) : (
      <Input
        type={type}
        autoComplete={type === "password" ? "new-password" : "off"}
        className={`rounded-lg px-3 ${inputClassName || "h-10"}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    )}
  </div>
);

export default ModalCreate;