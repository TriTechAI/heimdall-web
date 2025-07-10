import type { Metadata } from 'next';
import { ConfigProvider } from 'antd';
import { ReactQueryProvider } from '@/lib/providers/ReactQueryProvider';
import { AuthProvider } from '@/services/hooks/useAuth';
import { antdTheme } from '@/styles/antd-theme';
import './globals.css';

export const metadata: Metadata = {
  title: 'Heimdall Admin',
  description: 'Blog management admin interface',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <ConfigProvider theme={antdTheme}>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ConfigProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}