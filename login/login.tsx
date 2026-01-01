'use client';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('បញ្ចូលឈ្មោះ...');
  const [password, setPassword] = useState('បញ្ចូលពាក្យសម្ងាត់...');
  const [showPassword, setShowPassword] = useState(false);

//Username
  const handleUsernameFocus = () => {
    if (username === 'បញ្ចូលឈ្មោះ...') {
      setUsername('');
    }
  };
  const handleUsernameBlur = () => {
    if (username === '') {
      setUsername('បញ្ចូលឈ្មោះ...');
    }
  }; 

//password
const handlePasswordFocus = () => {
    if (password === 'បញ្ចូលពាក្យសម្ងាត់...') {
      setPassword('');
    }
    };
    const handlePasswordBlur = () => {
    if (password === '') {
      setPassword('បញ្ចូលពាក្យសម្ងាត់...');
    }
    };

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const realUsername = username === 'បញ្ចូលឈ្មោះ' ? '' : username;

    console.log('Login submitted:', { username: realUsername, password });
  };
  return (
    <>
      {/* Full-screen watercolor floral background */}
      <div 
        className="min-h-screen flex items-center justify-center px-4 relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('./backround_login.png')" }}
      >
        {/* Optional subtle overlay for better text contrast if needed */}
        <div className="absolute inset-0 bg-pink-50/30"></div>

        {/* Login Form - Transparent directly on background */}
        <div className="relative z-10 w-full max-w-md">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Title */}
            <h1 className="text-center text-4xl font-semibold text-red-600">
              ចូលគណនី
            </h1>

            {/* Username Field */}
            <div className="space-x-14">
              <label className="text-red-600 py-3 text-xl font-semibold">ឈ្មោះ</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={handleUsernameFocus}
                onBlur={handleUsernameBlur}
                className="w-full px-6 py-3 rounded-xl bg-[#ffd1d1] text-[#000000] placeholder-[#000000] focus:outline-none font-medium"
                style={{
                  color: username === 'បញ្ចូលឈ្មោះ...' ? '#FF8989' : '#000',
                }}
              />
            </div>

            {/* Password Field */}
            <div className="space-x-14">
              <label className="text-red-600 text-xl font-semibold">ពាក្យសម្ងាត់</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                    onFocus={handlePasswordFocus}
                    onBlur={handlePasswordBlur}
                  className="w-full px-6 py-3 rounded-xl bg-[#ffd1d1] text-[#00000000] placeholder-[#000000] focus:outline-none font-medium"
                    style={{
                        color: password === 'បញ្ចូលពាក្យសម្ងាត់...' ? '#FF8989' : '#000',
                    }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-800 "
                >
                  {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-[#e11d48] text-white text-xl font-semibold transition shadow-lg"
            >
              ចូល
            </button>
          </form>
        </div>
      </div>

       {/* Load Kantumruy Pro Font */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&display=swap');

        body, h1, label, input, button {
          font-family: 'Kantumruy Pro', sans-serif !important;
        }
      `}</style>
    </>
  );
}