'use client';

import { Card, Row, Col, Statistic, Typography, Space } from 'antd';
import { 
  FileTextOutlined, 
  TagsOutlined, 
  MessageOutlined, 
  UserOutlined,
  EyeOutlined,
  LikeOutlined 
} from '@ant-design/icons';

const { Title } = Typography;

export default function DashboardPage() {
  // Mock data - will be replaced with real API calls
  const stats = [
    {
      title: 'Total Posts',
      value: 124,
      icon: <FileTextOutlined className="text-blue-600" />,
      color: 'blue',
    },
    {
      title: 'Published',
      value: 98,
      icon: <EyeOutlined className="text-green-600" />,
      color: 'green',
    },
    {
      title: 'Total Views',
      value: '12.4K',
      icon: <LikeOutlined className="text-orange-600" />,
      color: 'orange',
    },
    {
      title: 'Comments',
      value: 432,
      icon: <MessageOutlined className="text-purple-600" />,
      color: 'purple',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <Title level={2} className="mb-2">Dashboard</Title>
        <p className="text-gray-600">Welcome back! Here's what's happening with your blog.</p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="hover:shadow-md transition-shadow">
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{ fontSize: '24px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quick Actions */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Quick Actions" className="h-full">
            <Space direction="vertical" className="w-full">
              <a href="/posts/new" className="block p-3 hover:bg-gray-50 rounded border">
                <div className="flex items-center space-x-3">
                  <FileTextOutlined className="text-blue-600" />
                  <div>
                    <div className="font-medium">Create New Post</div>
                    <div className="text-sm text-gray-500">Start writing a new blog post</div>
                  </div>
                </div>
              </a>
              <a href="/posts" className="block p-3 hover:bg-gray-50 rounded border">
                <div className="flex items-center space-x-3">
                  <FileTextOutlined className="text-green-600" />
                  <div>
                    <div className="font-medium">Manage Posts</div>
                    <div className="text-sm text-gray-500">Edit, publish, or delete posts</div>
                  </div>
                </div>
              </a>
              <a href="/tags" className="block p-3 hover:bg-gray-50 rounded border">
                <div className="flex items-center space-x-3">
                  <TagsOutlined className="text-orange-600" />
                  <div>
                    <div className="font-medium">Manage Tags</div>
                    <div className="text-sm text-gray-500">Organize your content with tags</div>
                  </div>
                </div>
              </a>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Recent Activity" className="h-full">
            <Space direction="vertical" className="w-full">
              <div className="p-3 border rounded">
                <div className="text-sm text-gray-500">2 hours ago</div>
                <div>Published "Getting Started with React"</div>
              </div>
              <div className="p-3 border rounded">
                <div className="text-sm text-gray-500">5 hours ago</div>
                <div>Updated "TypeScript Best Practices"</div>
              </div>
              <div className="p-3 border rounded">
                <div className="text-sm text-gray-500">1 day ago</div>
                <div>Created new tag "Frontend"</div>
              </div>
              <div className="p-3 border rounded">
                <div className="text-sm text-gray-500">2 days ago</div>
                <div>Approved 3 comments</div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}