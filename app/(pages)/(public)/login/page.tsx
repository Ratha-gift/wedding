'use client';

import { useState} from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '../../server/api';
import type { AxiosError } from 'axios';
import Link from 'next/link';
import { useAuth } from '../../../src/lib/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { onLogin } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/user/login', {
        user_name: username,
        password,
      });

      const { access_token } = res.data;
      console.log("test_token", access_token);
    
      // Redirect to home
      
      onLogin(access_token)
      router.push("./home")

    } catch (err) {
      const error = err as AxiosError<any>;
      setError(
        error.response?.data?.message ||
        error.response?.data?.errors?.login?.[0] ||
        'Invalid username or password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative bg-cover bg-center"
      style={{ backgroundImage: "url('./backround_login.png')" }}
    >
      <div className="absolute inset-0 bg-pink-50/30" />

      <div className="relative z-10 w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-10">
          <h1 className="text-center text-4xl font-semibold text-red-600">
            ចូលគណនី
          </h1>

          {/* Username */}
          <div>
            <label className="text-red-600 text-xl font-semibold">ឈ្មោះ</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="បញ្ចូលឈ្មោះ..."
              className="w-full px-6 py-3 rounded-xl bg-[#ffd1d1] focus:outline-none"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-red-600 text-xl font-semibold">
              ពាក្យសម្ងាត់
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="បញ្ចូលពាក្យសម្ងាត់..."
                className="w-full px-6 py-3 rounded-xl bg-[#ffd1d1] focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-600 text-center font-medium">
              {error}
            </p>
          )}

          {/* Submit */}
         
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-[#e11d48] text-white text-xl font-semibold"
          >
            {loading ? 'កំពុងចូល...' : 'ចូល'}
          </button>
      
        </form>
      </div>
    </div>
  );
}
