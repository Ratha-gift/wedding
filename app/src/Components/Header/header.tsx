"use client";

import { IoHomeSharp } from "react-icons/io5";
import { MdOutlineLightMode } from "react-icons/md";
import { RiMoonClearLine } from "react-icons/ri";
import Link from "next/link";
import Profile from "../Dropdown/profile";
import { useEffect, useState } from "react";

type HeaderProps = {
  title?: string;
};

function Header({ title = "គ្រប់គ្រងអ្នកប្រើប្រាស់" }: HeaderProps) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
  setMounted(true);

  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    setDark(true);
  } else if (savedTheme === "light") {
    setDark(false);
  } else {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setDark(prefersDark);
  }
}, []);

  useEffect(() => {
    if (!mounted) return;

    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark, mounted]);

  const toggleTheme = () => setDark(prev => !prev);

  // prevent hydration flicker
  if (!mounted) return null;

  return (
    <div className="w-full h-19 bg-rose-600 dark:bg-gray-900 flex items-center p-4 transition-colors duration-300">
      <div className="w-6xl h-16 flex gap-2 items-center">
        <Link href="/">
          <IoHomeSharp className="text-3xl text-white dark:text-gray-100" />
        </Link>

        <h1 className="text-white dark:text-gray-100 text-2xl font-bold">
          {title}
        </h1>
      </div>

      <div className="w-3xl h-16 flex justify-end items-center gap-6">
        <button
          onClick={toggleTheme}
          className="rounded-lg transition-all duration-300 text-white dark:text-gray-100 hover:scale-110"
        >
          {dark ? (
            <RiMoonClearLine size={24} />
          ) : (
            <MdOutlineLightMode size={24} />
          )}
        </button>

        <Profile />
      </div>
    </div>
  );
}

export default Header;
