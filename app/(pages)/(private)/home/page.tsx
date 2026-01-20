import React from 'react'
import Link from 'next/link'
import { Kantumruy_Pro } from 'next/font/google'
import { IoSettingsSharp } from "react-icons/io5";
import { AllData } from "@/app/Components/Data/Image/image";
const kantumruyPro = Kantumruy_Pro({
  subsets: ['khmer'],
  weight: ['400'],
});

export default function HomePage() {
  return (
    <div style={{ backgroundImage: `url(${AllData.BackgroundURL.data})` }} className="w-full h-screen bg-[url('/backround.png')] bg-cover bg-center bg-no-repeat flex flex-col items-end justify-center">
      
      <div className="w-full h-200 flex justify-end p-8">
        <div className="w-55 h-12 bg-white flex items-center justify-center gap-3 rounded-xl shadow-lg">
          
          <Link href="/Setting">
            <h3 className={`text-[#E11D48] text-[17px] ${kantumruyPro.className}`}>
              គ្រប់គ្រងអ្នកប្រើប្រាស់
            </h3>
          </Link>

          <Link href="/Setting">
            <IoSettingsSharp className="text-[#E11D48] text-3xl" />
          </Link>

        </div>
      </div>

      <div className="w-full h-70 flex flex-col items-center justify-center gap-7">
        <Link href="./guest">
          <h1 className={`w-xs h-14 bg-[#E11D48] text-white text-xl flex items-center justify-center rounded-xl shadow-xl ${kantumruyPro.className}`}>
            បញ្ចូលភ្ញៀវកិត្តិយស
          </h1>
        </Link>

        <Link href="./amount">
          <h1 className={`w-xs h-14 bg-[#E11D48] text-white text-xl flex items-center justify-center rounded-xl shadow-xl ${kantumruyPro.className}`}>
            បញ្ចូលចំណងដៃ
          </h1>
        </Link>
      </div>

    </div>
  )
}