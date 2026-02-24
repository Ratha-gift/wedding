"use client";

import {  useRouter } from "next/navigation";
import { useAuth } from "./src/lib/useAuth";
import LoginPage from "./(pages)/(public)/login/page";
import HomePage from "./(pages)/(private)/home/page";

export default function RootPage() {
  const { islogin,token} = useAuth();
  const router = useRouter();
  // console.log("test",{islogin,token})

  return !islogin ?<LoginPage/> : <HomePage />;
 
}
