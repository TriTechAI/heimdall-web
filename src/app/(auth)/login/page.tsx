'use client';

import { Form, Input, Button, Card, Typography, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '@/services/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const { Title, Text } = Typography;

export default function LoginPage() {
  const { login, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [form] = Form.useForm();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/posts');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (values: any) => {
    try {
      await login(values);
      router.replace('/posts');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#f0f2f5'
    }}>
      <Card style={{ width: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2}>Heimdall Admin</Title>
          <Text type="secondary">Sign in to your account</Text>
        </div>
        
        <Form
          form={form}
          name="login"
          onFinish={handleSubmit}
          size="large"
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              block
            >
              Sign in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}