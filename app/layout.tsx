import AntdRegistry from './AntdRegistry';
import AntdProvider from './AntdProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="km">
      <body>
        <AntdRegistry>
          <AntdProvider>
            {children}
          </AntdProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
