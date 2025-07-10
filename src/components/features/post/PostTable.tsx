'use client';

import { useState } from 'react';
import { 
  Table, 
  Tag, 
  Button, 
  Space, 
  Dropdown, 
  Typography, 
  Avatar, 
  Tooltip,
  Modal
} from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  MoreOutlined,
  FileTextOutlined,
  CalendarOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import type { Post, PostStatus } from '@/types/models/post';

const { Text, Paragraph } = Typography;

interface PostTableProps extends Omit<TableProps<Post>, 'columns' | 'dataSource'> {
  posts: Post[];
  loading?: boolean;
  onEdit?: (post: Post) => void;
  onDelete?: (post: Post) => void;
  onView?: (post: Post) => void;
  onPublish?: (post: Post) => void;
  onUnpublish?: (post: Post) => void;
  selectedRowKeys?: React.Key[];
  onSelectChange?: (selectedRowKeys: React.Key[], selectedRows: Post[]) => void;
}

// Status tag colors
const statusColors: Record<PostStatus, string> = {
  draft: 'orange',
  published: 'green',
  archived: 'red',
};

export function PostTable({
  posts,
  loading = false,
  onEdit,
  onDelete,
  onView,
  onPublish,
  onUnpublish,
  selectedRowKeys,
  onSelectChange,
  ...tableProps
}: PostTableProps) {
  const router = useRouter();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  const handleEdit = (post: Post) => {
    if (onEdit) {
      onEdit(post);
    } else {
      router.push(`/posts/${post.id}/edit`);
    }
  };

  const handleView = (post: Post) => {
    if (onView) {
      onView(post);
    } else {
      // Open in new tab or navigate to preview
      window.open(`/posts/${post.id}/preview`, '_blank');
    }
  };

  const handleDelete = (post: Post) => {
    setPostToDelete(post);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (postToDelete && onDelete) {
      onDelete(postToDelete);
    }
    setDeleteModalVisible(false);
    setPostToDelete(null);
  };

  const handlePublishToggle = (post: Post) => {
    if (post.status === 'published' && onUnpublish) {
      onUnpublish(post);
    } else if (post.status !== 'published' && onPublish) {
      onPublish(post);
    }
  };

  const columns: ColumnsType<Post> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      width: '30%',
      render: (title: string, record: Post) => (
        <div className="flex items-start space-x-3">
          <Avatar
            icon={<FileTextOutlined />}
            size="small"
            className="mt-1 flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <Tooltip title={title}>
              <Text strong className="block truncate">
                {title}
              </Text>
            </Tooltip>
            {record.excerpt && (
              <Paragraph
                ellipsis={{ rows: 2, tooltip: record.excerpt }}
                className="text-gray-500 text-xs mt-1 mb-0"
              >
                {record.excerpt}
              </Paragraph>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      filters: [
        { text: 'Draft', value: 'draft' },
        { text: 'Published', value: 'published' },
        { text: 'Archived', value: 'archived' },
      ],
      render: (status: PostStatus) => (
        <Tag color={statusColors[status]} className="capitalize">
          {status}
        </Tag>
      ),
    },
    {
      title: 'Author',
      dataIndex: ['author', 'username'],
      key: 'author',
      width: 120,
      render: (username: string, record: Post) => (
        <div className="flex items-center space-x-2">
          <Avatar size="small" icon={<UserOutlined />} />
          <Text className="text-sm">
            {username || 'Unknown'}
          </Text>
        </div>
      ),
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      width: 150,
      render: (tags: Post['tags']) => (
        <div className="flex flex-wrap gap-1">
          {tags?.slice(0, 2).map((tag: any) => (
            <Tag
              key={tag.id}
              color={tag.color}
              className="text-xs"
            >
              {tag.name}
            </Tag>
          ))}
          {tags && tags.length > 2 && (
            <Tag className="text-xs">+{tags.length - 2}</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Stats',
      key: 'stats',
      width: 100,
      render: (_, record: Post) => (
        <div className="text-xs text-gray-500">
          <div>👁 {record.viewCount}</div>
          <div>💬 {record.commentCount}</div>
        </div>
      ),
    },
    {
      title: 'Date',
      key: 'date',
      width: 120,
      sorter: true,
      render: (_, record: Post) => (
        <div className="text-xs">
          <div className="flex items-center space-x-1 mb-1">
            <CalendarOutlined className="text-gray-400" />
            <Text className="text-gray-600">
              {dayjs(record.createdAt).format('MMM DD')}
            </Text>
          </div>
          {record.publishedAt && (
            <div className="text-green-600">
              Published {dayjs(record.publishedAt).format('MMM DD')}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record: Post) => {
        const menuItems = [
          {
            key: 'edit',
            icon: <EditOutlined />,
            label: 'Edit',
            onClick: () => handleEdit(record),
          },
          {
            key: 'view',
            icon: <EyeOutlined />,
            label: 'Preview',
            onClick: () => handleView(record),
          },
          {
            type: 'divider' as const,
          },
          {
            key: 'publish',
            label: record.status === 'published' ? 'Unpublish' : 'Publish',
            onClick: () => handlePublishToggle(record),
          },
          {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: 'Delete',
            danger: true,
            onClick: () => handleDelete(record),
          },
        ];

        return (
          <Space size="small">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              title="Edit"
            />
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
              title="Preview"
            />
            <Dropdown
              menu={{ items: menuItems }}
              trigger={['click']}
              placement="bottomRight"
            >
              <Button
                type="text"
                size="small"
                icon={<MoreOutlined />}
                title="More actions"
              />
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  const rowSelection = onSelectChange ? {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record: Post) => ({
      name: record.id,
    }),
  } : undefined;

  return (
    <>
      <Table<Post>
        columns={columns}
        dataSource={posts}
        rowKey="id"
        loading={loading}
        rowSelection={rowSelection}
        size="small"
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} posts`,
        }}
        {...tableProps}
      />

      <Modal
        title="Delete Post"
        open={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Delete"
        okType="danger"
      >
        <p>
          Are you sure you want to delete the post "
          <strong>{postToDelete?.title}</strong>"?
        </p>
        <p className="text-gray-500 text-sm">
          This action cannot be undone.
        </p>
      </Modal>
    </>
  );
}