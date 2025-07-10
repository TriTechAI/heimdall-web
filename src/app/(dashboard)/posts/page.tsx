'use client';

import { useState } from 'react';
import { 
  Card, 
  Button, 
  Space, 
  Input, 
  Select, 
  DatePicker, 
  Typography,
  Row,
  Col,
  Dropdown,
  Modal,
  message
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  FilterOutlined,
  DeleteOutlined,
  ExportOutlined,
  MoreOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { PostTable } from '@/components/features/post/PostTable';
import { 
  usePostList, 
  useDeletePost, 
  useBatchDeletePosts,
  usePublishPost,
  useUnpublishPost,
  useBatchUpdatePostStatus 
} from '@/services/hooks/usePosts';
import type { Post, PostQueryParams, PostStatus } from '@/types/models/post';

const { Title } = Typography;
const { RangePicker } = DatePicker;

export default function PostsPage() {
  const router = useRouter();
  const [queryParams, setQueryParams] = useState<PostQueryParams>({
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [batchModalVisible, setBatchModalVisible] = useState(false);

  // API hooks
  const { data: postListData, isLoading } = usePostList(queryParams);
  const deletePostMutation = useDeletePost();
  const batchDeleteMutation = useBatchDeletePosts();
  const publishMutation = usePublishPost();
  const unpublishMutation = useUnpublishPost();
  const batchUpdateStatusMutation = useBatchUpdatePostStatus();

  const posts = postListData?.list || [];
  const pagination = postListData?.pagination;

  // Handle search
  const handleSearch = (keyword: string) => {
    setQueryParams((prev: PostQueryParams) => ({
      ...prev,
      keyword: keyword || undefined,
      page: 1,
    }));
  };

  // Handle filters
  const handleFilterChange = (key: keyof PostQueryParams, value: any) => {
    setQueryParams((prev: PostQueryParams) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  // Handle date range filter
  const handleDateRangeChange = (dates: any) => {
    if (dates && dates.length === 2) {
      setQueryParams((prev: PostQueryParams) => ({
        ...prev,
        startDate: dates[0].format('YYYY-MM-DD'),
        endDate: dates[1].format('YYYY-MM-DD'),
        page: 1,
      }));
    } else {
      setQueryParams((prev: PostQueryParams) => ({
        ...prev,
        startDate: undefined,
        endDate: undefined,
        page: 1,
      }));
    }
  };

  // Handle table pagination and sorting
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setQueryParams((prev: PostQueryParams) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
      sortBy: sorter.field || 'createdAt',
      sortOrder: sorter.order === 'ascend' ? 'asc' : 'desc',
      status: filters.status?.[0] || undefined,
    }));
  };

  // Handle row selection
  const handleSelectChange = (selectedRowKeys: React.Key[], selectedRows: Post[]) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  // Handle individual post actions
  const handleEdit = (post: Post) => {
    router.push(`/posts/${post.id}/edit`);
  };

  const handleDelete = async (post: Post) => {
    try {
      await deletePostMutation.mutateAsync(post.id);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handlePublish = async (post: Post) => {
    try {
      await publishMutation.mutateAsync({ id: post.id });
    } catch (error) {
      console.error('Publish failed:', error);
    }
  };

  const handleUnpublish = async (post: Post) => {
    try {
      await unpublishMutation.mutateAsync(post.id);
    } catch (error) {
      console.error('Unpublish failed:', error);
    }
  };

  // Handle batch actions
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select posts to delete');
      return;
    }

    Modal.confirm({
      title: 'Delete Selected Posts',
      content: `Are you sure you want to delete ${selectedRowKeys.length} selected posts?`,
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await batchDeleteMutation.mutateAsync(selectedRowKeys as string[]);
          setSelectedRowKeys([]);
        } catch (error) {
          console.error('Batch delete failed:', error);
        }
      },
    });
  };

  const handleBatchUpdateStatus = async (status: PostStatus) => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select posts to update');
      return;
    }

    try {
      await batchUpdateStatusMutation.mutateAsync({
        ids: selectedRowKeys as string[],
        status,
      });
      setSelectedRowKeys([]);
    } catch (error) {
      console.error('Batch update failed:', error);
    }
  };

  // Batch action menu items
  const batchMenuItems = [
    {
      key: 'publish',
      label: 'Publish Selected',
      onClick: () => handleBatchUpdateStatus('published'),
    },
    {
      key: 'draft',
      label: 'Move to Draft',
      onClick: () => handleBatchUpdateStatus('draft'),
    },
    {
      key: 'archive',
      label: 'Archive Selected',
      onClick: () => handleBatchUpdateStatus('archived'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'delete',
      label: 'Delete Selected',
      danger: true,
      onClick: handleBatchDelete,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <Title level={2} className="mb-2">Posts</Title>
          <p className="text-gray-600">
            Manage your blog posts, drafts, and published content.
          </p>
        </div>
        
        <Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => router.push('/posts/new')}
          >
            New Post
          </Button>
        </Space>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input
              placeholder="Search posts..."
              prefix={<SearchOutlined />}
              allowClear
              onPressEnter={(e) => handleSearch(e.currentTarget.value)}
              onBlur={(e) => handleSearch(e.currentTarget.value)}
            />
          </Col>
          
          <Col xs={24} sm={12} md={4} lg={3}>
            <Select
              placeholder="Status"
              allowClear
              className="w-full"
              value={queryParams.status}
              onChange={(value) => handleFilterChange('status', value)}
            >
              <Select.Option value="draft">Draft</Select.Option>
              <Select.Option value="published">Published</Select.Option>
              <Select.Option value="archived">Archived</Select.Option>
            </Select>
          </Col>

          <Col xs={24} sm={12} md={6} lg={4}>
            <RangePicker
              placeholder={['Start Date', 'End Date']}
              format="YYYY-MM-DD"
              className="w-full"
              onChange={handleDateRangeChange}
            />
          </Col>

          <Col xs={24} sm={12} md={6} lg={4}>
            <Select
              placeholder="Sort by"
              className="w-full"
              value={`${queryParams.sortBy}-${queryParams.sortOrder}`}
              onChange={(value) => {
                const [sortBy, sortOrder] = value.split('-');
                setQueryParams((prev: PostQueryParams) => ({
                  ...prev,
                  sortBy: sortBy as any,
                  sortOrder: sortOrder as any,
                }));
              }}
            >
              <Select.Option value="createdAt-desc">Newest First</Select.Option>
              <Select.Option value="createdAt-asc">Oldest First</Select.Option>
              <Select.Option value="title-asc">Title A-Z</Select.Option>
              <Select.Option value="title-desc">Title Z-A</Select.Option>
              <Select.Option value="viewCount-desc">Most Viewed</Select.Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Batch Actions */}
      {selectedRowKeys.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-blue-800">
              {selectedRowKeys.length} posts selected
            </span>
            <Space>
              <Dropdown menu={{ items: batchMenuItems }} trigger={['click']}>
                <Button>
                  Batch Actions <MoreOutlined />
                </Button>
              </Dropdown>
              <Button onClick={() => setSelectedRowKeys([])}>
                Clear Selection
              </Button>
            </Space>
          </div>
        </Card>
      )}

      {/* Posts Table */}
      <Card>
        <PostTable
          posts={posts}
          loading={isLoading}
          selectedRowKeys={selectedRowKeys}
          onSelectChange={handleSelectChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPublish={handlePublish}
          onUnpublish={handleUnpublish}
          pagination={{
            current: pagination?.current || 1,
            pageSize: pagination?.pageSize || 20,
            total: pagination?.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total: number, range: [number, number]) =>
              `${range[0]}-${range[1]} of ${total} posts`,
          }}
          onChange={handleTableChange}
        />
      </Card>
    </div>
  );
}