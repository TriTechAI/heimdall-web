'use client';

import { useState } from 'react';
import { Layout, Menu, Button, Avatar, Typography } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  TagsOutlined,
  MessageOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/services/hooks/useAuth';

const { Sider } = Layout;
const { Text } = Typography;

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed, onCollapse }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/posts',
      icon: <FileTextOutlined />,
      label: 'Posts',
    },
    {
      key: '/tags',
      icon: <TagsOutlined />,
      label: 'Tags',
    },
    {
      key: '/comments',
      icon: <MessageOutlined />,
      label: 'Comments',
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: 'Users',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    router.push(key);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={240}
      theme="light"
      className="shadow-md border-r border-gray-200"
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          {collapsed ? (
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <Text className="text-white font-bold text-sm">H</Text>
            </div>
          ) : (
            <Text className="text-xl font-bold text-gray-800">Heimdall</Text>
          )}
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 py-4">
          <Menu
            mode="inline"
            selectedKeys={[pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            className="border-r-0"
          />
        </div>

        {/* User Info & Actions */}
        <div className="border-t border-gray-200 p-4">
          {!collapsed && (
            <div className="flex items-center space-x-3 mb-3">
              <Avatar size="small" icon={<UserOutlined />} />
              <div className="flex-1 min-w-0">
                <Text className="text-sm font-medium text-gray-900 truncate">
                  {user?.username || 'Admin'}
                </Text>
                <Text className="text-xs text-gray-500 block">
                  {user?.role || 'Administrator'}
                </Text>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => onCollapse(!collapsed)}
              className="flex items-center justify-center"
            />
            
            {!collapsed && (
              <Button
                type="text"
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                className="flex items-center"
                title="Logout"
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </Sider>
  );
}