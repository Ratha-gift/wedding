"use client";

import { IoHomeSharp } from "react-icons/io5";
import { MdOutlineLightMode } from "react-icons/md";
import { RiMoonClearLine } from "react-icons/ri";
import Link from "next/link";
import Profile from "../Dropdown/profile";
import { useState } from "react";

type HeaderProps = {
  title?: string;
};

function Header({ title = "គ្រប់គ្រងអ្នកប្រើប្រាស់" }: HeaderProps) {
  const [dark, setDark] = useState(false);

  const toggleTheme = () => {
    setDark(!dark);
  };

  return (
    <div className="w-full h-19 bg-[#e11d48] flex items-center p-2">
      <div className="w-6xl h-16 flex gap-5 items-center">
        <Link href="/home">
          <IoHomeSharp className="text-3xl text-white" />
        </Link>

        <h1 className="text-white text-2xl font-bold">
          {title}
        </h1>
      </div>

      <div className="w-3xl h-16 flex justify-end items-center gap-6 mr-5">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg transition text-white"
        >
          {dark ? <MdOutlineLightMode size={24} /> : <RiMoonClearLine size={24} />}
        </button>

        <Profile />
      </div>
    </div>
  );
}

export default Header;
