"use client";

import { useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { useAuth } from "./src/lib/useAuth";
import LoginPage from "./(pages)/(public)/login/page";
import { Home } from "lucide-react";

export default function RootPage() {
  const { islogin } = useAuth();
  const router = useRouter();


  return islogin ? router.push("/home") : <LoginPage />;
}
