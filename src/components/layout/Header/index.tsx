'use client';

import { Layout, Breadcrumb, Typography, Space, Avatar, Dropdown } from 'antd';
import { UserOutlined, BellOutlined, SettingOutlined } from '@ant-design/icons';
import { useAuth } from '@/services/hooks/useAuth';
import { usePathname } from 'next/navigation';
import type { MenuProps } from 'antd';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Generate breadcrumb items based on current path
  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbItems = [
      {
        title: 'Dashboard',
        href: '/',
      },
    ];

    if (pathSegments.length > 0) {
      pathSegments.forEach((segment, index) => {
        const title = segment.charAt(0).toUpperCase() + segment.slice(1);
        const href = '/' + pathSegments.slice(0, index + 1).join('/');
        
        breadcrumbItems.push({
          title,
          href,
        });
      });
    }

    return breadcrumbItems;
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <UserOutlined />,
      label: 'Logout',
      onClick: logout,
    },
  ];

  return (
    <AntHeader className={`bg-white border-b border-gray-200 px-6 ${className || ''}`}>
      <div className="flex items-center justify-between h-full">
        {/* Left: Breadcrumb */}
        <div className="flex-1">
          <Breadcrumb
            items={generateBreadcrumbs()}
            className="text-sm"
          />
        </div>

        {/* Right: User Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications (placeholder) */}
          <BellOutlined className="text-gray-500 hover:text-gray-700 cursor-pointer text-lg" />

          {/* User Menu */}
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={['click']}
          >
            <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
              <Avatar size="small" icon={<UserOutlined />} />
              <Space>
                <Text className="text-sm font-medium">
                  {user?.username || 'Admin'}
                </Text>
              </Space>
            </div>
          </Dropdown>
        </div>
      </div>
    </AntHeader>
  );
}