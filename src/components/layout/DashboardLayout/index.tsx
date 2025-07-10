'use client';

import { useState } from 'react';
import { Layout } from 'antd';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

const { Content } = Layout;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <Layout className="min-h-screen">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onCollapse={setSidebarCollapsed} 
      />
      <Layout>
        <Header />
        <Content className="bg-gray-50">
          <div className="p-6">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}