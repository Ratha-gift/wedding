"use client";
import { ConfigProvider } from "antd";
import "./src/assets/Style/globals.css";
import { useAuth } from "./src/lib/useAuth";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { islogin } = useAuth();
  
  return (
    <html lang="km">
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