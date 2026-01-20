import { IoHomeSharp } from "react-icons/io5";
import { MdOutlineLightMode } from "react-icons/md";
import { RiMoonClearLine } from "react-icons/ri";
import Link from 'next/link'
import { Kantumruy_Pro } from 'next/font/google'
import DropdownProfile from "../Dropdown/profile";
import { useEffect, useState } from "react";
const kantumruyPro = Kantumruy_Pro({
  subsets: ['khmer'],
  weight: ['400'],
});

 
function Header() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDark(!dark);
  };
  return (
     <header className="h-[65px] bg-[#E11D48] text-white flex items-center justify-between px-6">
        <div className="flex items-center gap-2 text-4xl font-medium">
          <Link href="/home" className="items-center justify-center p-2 rounded-lg transition"
            aria-label="Go to Home">
            <IoHomeSharp className="text-white" size={28} />
          </Link>
          បញ្ចូលភ្ញៀវកិត្តិយស
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg  transition"
            aria-label="Toggle Dark Mode"
          >
            {dark ? (
              <MdOutlineLightMode size={24} />
            ) : (
              <RiMoonClearLine size={24} />
            )}
          </button>
          <DropdownProfile />
        </div>
      </header>
  )
}

export default Header;