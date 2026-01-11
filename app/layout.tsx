
"use client";
import { Kantumruy_Pro, Noto_Sans } from "next/font/google";
import { ConfigProvider } from "antd";
import "./globals.css";
import { useAuth } from "./src/lib/useAuth";

// Load font (you can add more weights if needed)
const kantumruyPro = Kantumruy_Pro({
  subsets: ["khmer"],
  weight: ["400", "500", "700"], // ← add more weights if your design needs them
  display: "swap",               // good practice
  variable: "--font-kantumruy",  // optional but useful for tailwind or custom css
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "700"], // ← add more weights if your design needs them
  display: "swap",        // good practice
  variable: "--font-noto",// optional but useful for tailwind or custom css
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { islogin } = useAuth();
  
  return (
    <html lang="km" className={kantumruyPro.className}>
      <body>
        {/* Apply font globally to ALL Ant Design components */}
        <ConfigProvider
          theme={{
            token: {
              fontFamily: "inherit", // ← very important! tells AntD to use parent's font
              colorPrimary: "#E11D48",
              // You can add more token overrides here...
            },
            components: {
              Pagination: {
                itemActiveColor: "#E11D48",
                itemActiveBg: "#fff1f0",
              },

              Modal: {      
               contentBg: '#F2F2F2',          
               },
              // Drawer, Button, etc. will automatically inherit fontFamily
            },
          }}
        >
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
}