import { IoHomeSharp } from "react-icons/io5";
import { MdSunny } from "react-icons/md";
import Link from 'next/link'
import { Kantumruy_Pro } from 'next/font/google'
import Profile from "../profile/Profile";
const kantumruyPro = Kantumruy_Pro({
  subsets: ['khmer'],
  weight: ['400'],
});
function Header() {
  return (
    <div>
        <div className='w-full h-19 bg-[#e11d48] flex items-center p-2'>
        <div className='w-6xl h-16  flex gap-7 items-center'>
            <Link href={"/Homepage"}>
               <IoHomeSharp className='text-3xl text-white'/>
                  </Link>
                     <h1 className={`text-white text-xl  ${kantumruyPro.className}`}>គ្រប់គ្រងអ្នកប្រើប្រាស់</h1>
                      </div>
                        <div className='w-3xl h-16 flex justify-end items-center gap-6'>
                          <MdSunny className='text-3xl text-white'/>
                          <Profile />
                             </div>
                               </div>
    </div>
  )
}

export default Header