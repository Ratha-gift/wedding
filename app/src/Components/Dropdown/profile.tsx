"use client";
import React, { useState, useEffect } from 'react';
import { Dropdown, ConfigProvider, message } from 'antd';
import type { MenuProps } from 'antd';
import { FaUser } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { Eye, EyeOff, Camera } from 'lucide-react';
import { MdEdit } from 'react-icons/md';
import { BiSolidEdit } from 'react-icons/bi';
import { useAuth } from '@/app/src/lib/useAuth';
import { useRouter } from 'next/navigation';
import api from '@/app/server/api';
import { Modal, Input } from 'antd';

const DropdownProfile: React.FC = () => {
  const { onLogout, user, setUser } = useAuth();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    user_name: '',
    email: '',
    role_name: '',
    image_profile: '',
  });

  const [pwModalOpen, setPwModalOpen] = useState(false);
  const [pwForm, setPwForm] = useState({ password: '', password_confirmation: '' });
  const [showPw, setShowPw] = useState(false);
  // keep for legacy compat but no longer drives the inline card
  const [showChangePw, setShowChangePw] = useState(false);

  // Load user profile when modal opens
  useEffect(() => {
    if (!isModalOpen) return;
    api.get('/user/me')
      .then((res) => {
        const d = res.data.data;
        setForm({
          first_name: d.first_name || '',
          last_name: d.last_name || '',
          user_name: d.user_name || '',
          email: d.email || '',
          role_name: d.role_name || d.role?.role_name || '',
          image_profile: d.image_profile || '',
        });
        if (user) setUser({ ...user, ...d });
      })
      .catch(() => {});
  }, [isModalOpen]);

  const resizeImage = (src: string, maxPx = 300): Promise<string> =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > maxPx || h > maxPx) {
          if (w > h) { h = Math.round(h * maxPx / w); w = maxPx; }
          else { w = Math.round(w * maxPx / h); h = maxPx; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d')?.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.75));
      };
      img.src = src;
    });

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const resized = await resizeImage(ev.target?.result as string);
      setForm((p) => ({ ...p, image_profile: resized }));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSave = async () => {
    if (!form.first_name.trim()) { message.warning('សូមបញ្ចូលនាមត្រកូល'); return; }
    if (!form.user_name.trim()) { message.warning('សូមបញ្ចូលឈ្មោះអ្នកប្រើ'); return; }

    if (showChangePw) {
      if (!pwForm.password.trim()) { message.warning('សូមបញ្ចូលលេខសម្ងាត់ថ្មី'); return; }
      if (pwForm.password !== pwForm.password_confirmation) {
        message.warning('លេខសម្ងាត់មិនត្រូវគ្នា'); return;
      }
    }

    try {
      setSaving(true);
      const payload: any = { ...form };
      delete payload.role_name;
      if (!payload.image_profile) delete payload.image_profile;
      if (showChangePw && pwForm.password) payload.password = pwForm.password;

      await api.put(`/user/update/${user?.user_id}`, payload);

      if (user) setUser({ ...user, ...form });
      message.success('កែសម្រួលបានជោគជ័យ');
      setIsModalOpen(false);
      setShowChangePw(false);
      setPwForm({ password: '', password_confirmation: '' });
    } catch (err: any) {
      message.error(err.response?.data?.message || 'ប្រតិបត្តិការមិនជោគជ័យ');
    } finally {
      setSaving(false);
    }
  };

  const items: MenuProps['items'] = [
    {
      key: 'edit-profile',
      label: (
        <div className="flex items-center gap-2 py-1">
          <FaUser size={16} color="#e11d48" />
          <span>មើលព័ត៌មានគណនី</span>
        </div>
      ),
    },
    { type: 'divider' },
    {
      key: 'logout',
      label: (
        <div className="flex items-center gap-2 py-1">
          <IoLogOutOutline size={18} />
          <span>ចាកចេញ</span>
        </div>
      ),
      danger: true,
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') { onLogout(); router.push('/login'); }
    if (key === 'edit-profile') { setIsModalOpen(true); }
  };

  const avatarSrc = user?.image_profile || '/pic.png';

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#e11d48', borderRadiusLG: 10 } }}>
      <Dropdown menu={{ items, onClick: handleMenuClick }} placement="bottomRight">
        <div className="cursor-pointer inline-block">
          <img
            src={avatarSrc}
            alt="profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
            onError={(e) => { (e.target as HTMLImageElement).src = '/ratha.png'; }}
          />
        </div>
      </Dropdown>

      <Modal
        open={isModalOpen}
        footer={null}
        centered
        width={580}
        closable={true}
        maskClosable={!saving}
        onCancel={() => { setIsModalOpen(false); setShowChangePw(false); }}
        styles={{ body: { padding: '20px 28px' } }}
        title={
          <div className="flex justify-center items-center gap-2 text-[#e11d48]">
            <BiSolidEdit size={26} />
            <span className="text-2xl font-bold">កែសម្រួលប្រវត្តិ</span>
          </div>
        }
      >
        <div className="flex flex-col gap-3 mt-2">

          {/* Top row: fields + profile image */}
          <div className="flex gap-5">

            {/* Left: form fields */}
            <div className="flex-1 space-y-2">
              <div>
                <label className="text-[#e11d48] block mb-1 font-medium text-sm">នាមត្រកូល:</label>
                <Input
                  autoComplete="off"
                  value={form.first_name}
                  onChange={(e) => setForm((p) => ({ ...p, first_name: e.target.value }))}
                  placeholder="នាមត្រកូល..."
                  className="h-10 rounded-lg"
                />
              </div>
              <div>
                <label className="text-[#e11d48] block mb-1 font-medium text-sm">នាមខ្លួន:</label>
                <Input
                  autoComplete="off"
                  value={form.last_name}
                  onChange={(e) => setForm((p) => ({ ...p, last_name: e.target.value }))}
                  placeholder="នាមខ្លួន..."
                  className="h-10 rounded-lg"
                />
              </div>
              <div>
                <label className="text-[#e11d48] block mb-1 font-medium text-sm">ឈ្មោះអ្នកប្រើ:</label>
                <Input
                  autoComplete="off"
                  value={form.user_name}
                  onChange={(e) => setForm((p) => ({ ...p, user_name: e.target.value }))}
                  placeholder="username..."
                  className="h-10 rounded-lg"
                />
              </div>
              <div>
                <label className="text-[#e11d48] block mb-1 font-medium text-sm">អ៊ីមែល:</label>
                <Input
                  autoComplete="off"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="example@gmail.com"
                  className="h-10 rounded-lg"
                />
              </div>
              <div>
                <label className="text-[#e11d48] block mb-1 font-medium text-sm">តួនាទី:</label>
                <Input
                  value={form.role_name || "—"}
                  readOnly
                  className="h-10 rounded-lg bg-gray-100 text-gray-500"
                />
              </div>
            </div>

            {/* Right: profile image */}
            <div className="w-40 shrink-0 flex flex-col items-center gap-2 pt-1">
              <div className="relative">
                <img
                  src={form.image_profile || '/pic.png'}
                  alt="profile"
                  className="w-28 h-28 rounded-full cursor-pointer object-cover border-2 border-[#e11d48] bg-gray-100"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/pic.png'; }}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('profile-modal-upload')?.click()}
                  className="absolute bottom-1 right-1 w-8 h-8 bg-[#e11d48] text-white rounded-full flex items-center justify-center hover:bg-rose-700 shadow-md transition-colors"
                >
                  <Camera className="w-4 cursor-pointer h-4" />
                </button>
                <input
                  id="profile-modal-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfileImageUpload}
                />
              </div>
              <p className="text-[#e11d48] text-xs font-medium">ផ្លាស់ប្ដូររូបភាព</p>
            </div>
          </div>

          {/* Change password button */}
          <button
            type="button"
            onClick={() => { setPwForm({ password: '', password_confirmation: '' }); setShowPw(false); setPwModalOpen(true); }}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 hover:bg-rose-50 hover:border-[#e11d48] transition-colors"
          >
            <span className="text-[#e11d48] font-semibold text-sm">ផ្លាស់ប្ដូរ​លេខ​សម្ងាត់</span>
            <span className="text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 bg-rose-100 text-[#e11d48]">
              <MdEdit size={13} />
              ចុចដើម្បីផ្លាស់ប្ដូរ
            </span>
          </button>

          {/* Password change modal */}
          <Modal
            open={pwModalOpen}
            centered
            width={400}
            footer={null}
            closable={false}
            maskClosable
            onCancel={() => setPwModalOpen(false)}
            styles={{ body: { padding: '28px 32px' } }}
          >
            <h2 className="text-center text-lg font-bold text-[#e11d48] mb-5">ផ្លាស់ប្ដូរ​លេខ​សម្ងាត់</h2>
            <div className="space-y-4">
              <div className="relative">
                <label className="text-[#e11d48] block mb-1 text-sm font-medium">លេខសម្ងាត់ថ្មី:</label>
                <Input
                  type={showPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={pwForm.password}
                  onChange={(e) => setPwForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="យ៉ាងហោចណាស់ ៦ តួ"
                  className="h-10 rounded-lg pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 bottom-2.5 text-gray-400 hover:text-[#e11d48]"
                  tabIndex={-1}
                >
                  {showPw ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
              <div>
                <label className="text-[#e11d48] block mb-1 text-sm font-medium">បញ្ជាក់លេខសម្ងាត់ថ្មី:</label>
                <Input
                  type="password"
                  autoComplete="new-password"
                  value={pwForm.password_confirmation}
                  onChange={(e) => setPwForm((p) => ({ ...p, password_confirmation: e.target.value }))}
                  placeholder="បញ្ចូលម្ដងទៀត..."
                  className="h-10 rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <button
                type="button"
                onClick={() => setPwModalOpen(false)}
                className="w-32 h-10 rounded-xl bg-gray-100 text-[#e11d48] font-medium text-sm hover:bg-gray-200 transition-colors"
              >
                បោះបង់
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!pwForm.password.trim()) { message.warning('សូមបញ្ចូលលេខសម្ងាត់ថ្មី'); return; }
                  if (pwForm.password !== pwForm.password_confirmation) { message.warning('លេខសម្ងាត់មិនត្រូវគ្នា'); return; }
                  setShowChangePw(true);
                  setPwModalOpen(false);
                  message.success('រួចរាល់ — ចុច រក្សាទុក ដើម្បីបញ្ជាក់');
                }}
                className="w-32 h-10 rounded-xl bg-[#e11d48] text-white font-medium text-sm hover:bg-rose-700 transition-colors"
              >
                យល់ព្រម
              </button>
            </div>
          </Modal>

          {/* Footer buttons */}
          <div className="flex justify-center gap-4 mt-1">
            <button
              type="button"
              onClick={() => { setIsModalOpen(false); setShowChangePw(false); }}
              disabled={saving}
              className="w-36 h-11 rounded-xl bg-gray-100 text-[#e11d48] font-medium text-base hover:bg-gray-200 transition-colors"
            >
              បោះបង់
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="w-36 h-11 rounded-xl bg-[#e11d48] text-white font-medium text-base hover:bg-rose-700 transition-colors disabled:opacity-60"
            >
              {saving ? 'កំពុងរក្សា...' : 'រក្សាទុក'}
            </button>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default DropdownProfile;
