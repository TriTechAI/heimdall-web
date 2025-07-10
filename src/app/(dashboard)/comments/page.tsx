'use client';

import { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Tag,
  Typography,
  Space,
  Avatar,
  Modal,
  Dropdown,
  Row,
  Col,
  Statistic,
  DatePicker,
  message,
} from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import {
  SearchOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  MoreOutlined,
  MessageOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
import { 
  useCommentList, 
  useCommentStats,
  useUpdateCommentStatus,
  useBatchUpdateCommentStatus,
  useDeleteComment,
  useBatchDeleteComments,
  useReplyComment,
} from '@/services/hooks/useComments';
import type { Comment, CommentQueryParams, CommentStatus } from '@/services/api/comment.service';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

export default function CommentsPage() {
  const [queryParams, setQueryParams] = useState<CommentQueryParams>({
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [replyingComment, setReplyingComment] = useState<Comment | null>(null);
  const [replyContent, setReplyContent] = useState('');

  // API hooks
  const { data: commentListData, isLoading } = useCommentList(queryParams);
  const { data: stats } = useCommentStats();
  const updateStatusMutation = useUpdateCommentStatus();
  const batchUpdateStatusMutation = useBatchUpdateCommentStatus();
  const deleteCommentMutation = useDeleteComment();
  const batchDeleteMutation = useBatchDeleteComments();
  const replyMutation = useReplyComment();

  const comments = commentListData?.list || [];
  const pagination = commentListData?.pagination;

  // 状态样式映射
  const statusConfig = {
    pending: { color: 'orange', text: '待审核' },
    approved: { color: 'green', text: '已通过' },
    rejected: { color: 'red', text: '已拒绝' },
    spam: { color: 'volcano', text: '垃圾评论' },
  };

  // 处理搜索
  const handleSearch = (keyword: string) => {
    setQueryParams(prev => ({
      ...prev,
      keyword: keyword || undefined,
      page: 1,
    }));
  };

  // 处理筛选
  const handleFilterChange = (key: keyof CommentQueryParams, value: any) => {
    setQueryParams(prev => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  // 处理日期范围筛选
  const handleDateRangeChange = (dates: any) => {
    if (dates && dates.length === 2) {
      setQueryParams(prev => ({
        ...prev,
        startDate: dates[0].format('YYYY-MM-DD'),
        endDate: dates[1].format('YYYY-MM-DD'),
        page: 1,
      }));
    } else {
      setQueryParams(prev => ({
        ...prev,
        startDate: undefined,
        endDate: undefined,
        page: 1,
      }));
    }
  };

  // 处理表格变化
  const handleTableChange: TableProps<Comment>['onChange'] = (pagination) => {
    setQueryParams(prev => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
    }));
  };

  // 处理行选择
  const handleSelectChange = (selectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  // 更新单个评论状态
  const handleUpdateStatus = async (comment: Comment, status: CommentStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ id: comment.id, status });
    } catch (error) {
      console.error('Update status failed:', error);
    }
  };

  // 批量更新评论状态
  const handleBatchUpdateStatus = async (status: CommentStatus) => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要操作的评论');
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

  // 删除评论
  const handleDelete = (comment: Comment) => {
    Modal.confirm({
      title: '删除评论',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除来自 ${comment.author.name} 的评论吗？`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteCommentMutation.mutateAsync(comment.id);
        } catch (error) {
          console.error('Delete failed:', error);
        }
      },
    });
  };

  // 批量删除评论
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的评论');
      return;
    }

    Modal.confirm({
      title: '批量删除评论',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除选中的 ${selectedRowKeys.length} 条评论吗？`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
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

  // 回复评论
  const handleReply = (comment: Comment) => {
    setReplyingComment(comment);
    setReplyContent('');
    setReplyModalVisible(true);
  };

  const handleSubmitReply = async () => {
    if (!replyingComment || !replyContent.trim()) {
      message.warning('请输入回复内容');
      return;
    }

    try {
      await replyMutation.mutateAsync({
        commentId: replyingComment.id,
        content: replyContent.trim(),
      });
      setReplyModalVisible(false);
      setReplyingComment(null);
      setReplyContent('');
    } catch (error) {
      console.error('Reply failed:', error);
    }
  };

  // 表格列定义
  const columns: ColumnsType<Comment> = [
    {
      title: '评论者',
      dataIndex: ['author', 'name'],
      key: 'author',
      width: 150,
      render: (name: string, record: Comment) => (
        <div className="flex items-center space-x-2">
          <Avatar size="small" src={record.author.avatar}>
            {name.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <div className="font-medium text-sm">{name}</div>
            <div className="text-xs text-gray-500">{record.author.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: '评论内容',
      dataIndex: 'content',
      key: 'content',
      render: (content: string, record: Comment) => (
        <div>
          <Paragraph
            ellipsis={{ rows: 2, expandable: true, symbol: '展开' }}
            className="mb-2"
          >
            {content}
          </Paragraph>
          <div className="text-xs text-gray-500">
            文章：<a href={`/posts/${record.post.slug}`} target="_blank" rel="noopener noreferrer">
              {record.post.title}
            </a>
          </div>
          {record.parent && (
            <div className="text-xs text-gray-500 mt-1">
              回复：{record.parent.author} - {record.parent.content.substring(0, 30)}...
            </div>
          )}
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      filters: [
        { text: '待审核', value: 'pending' },
        { text: '已通过', value: 'approved' },
        { text: '已拒绝', value: 'rejected' },
        { text: '垃圾评论', value: 'spam' },
      ],
      render: (status: CommentStatus) => (
        <Tag color={statusConfig[status].color}>
          {statusConfig[status].text}
        </Tag>
      ),
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      sorter: true,
      render: (createdAt: string) => (
        <div className="text-sm">
          <div>{dayjs(createdAt).format('MM-DD HH:mm')}</div>
          <div className="text-xs text-gray-500">
            {dayjs(createdAt).fromNow()}
          </div>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      render: (_, record: Comment) => {
        const menuItems = [
          {
            key: 'approve',
            label: '通过',
            icon: <CheckOutlined />,
            disabled: record.status === 'approved',
            onClick: () => handleUpdateStatus(record, 'approved'),
          },
          {
            key: 'reject',
            label: '拒绝',
            icon: <CloseOutlined />,
            disabled: record.status === 'rejected',
            onClick: () => handleUpdateStatus(record, 'rejected'),
          },
          {
            key: 'spam',
            label: '标记垃圾',
            disabled: record.status === 'spam',
            onClick: () => handleUpdateStatus(record, 'spam'),
          },
          {
            type: 'divider' as const,
          },
          {
            key: 'reply',
            label: '回复',
            onClick: () => handleReply(record),
          },
          {
            key: 'delete',
            label: '删除',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => handleDelete(record),
          },
        ];

        return (
          <Space size="small">
            {record.status === 'pending' && (
              <>
                <Button
                  type="text"
                  size="small"
                  icon={<CheckOutlined />}
                  onClick={() => handleUpdateStatus(record, 'approved')}
                  title="通过"
                />
                <Button
                  type="text"
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={() => handleUpdateStatus(record, 'rejected')}
                  title="拒绝"
                />
              </>
            )}
            <Dropdown menu={{ items: menuItems }} trigger={['click']}>
              <Button type="text" size="small" icon={<MoreOutlined />} />
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: handleSelectChange,
    getCheckboxProps: (record: Comment) => ({
      name: record.id,
    }),
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <Title level={2} className="mb-2">评论管理</Title>
          <p className="text-gray-600">
            审核和管理用户评论
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="待审核"
                value={stats.pending}
                valueStyle={{ color: '#fa8c16' }}
                prefix={<MessageOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="已通过"
                value={stats.approved}
                valueStyle={{ color: '#52c41a' }}
                prefix={<CheckOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="已拒绝"
                value={stats.rejected}
                valueStyle={{ color: '#f5222d' }}
                prefix={<CloseOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="垃圾评论"
                value={stats.spam}
                valueStyle={{ color: '#fa541c' }}
                prefix={<ExclamationCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters */}
      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input
              placeholder="搜索评论内容..."
              prefix={<SearchOutlined />}
              allowClear
              onPressEnter={(e) => handleSearch(e.currentTarget.value)}
              onBlur={(e) => handleSearch(e.currentTarget.value)}
            />
          </Col>
          
          <Col xs={24} sm={12} md={4} lg={3}>
            <Select
              placeholder="状态"
              allowClear
              className="w-full"
              value={queryParams.status}
              onChange={(value) => handleFilterChange('status', value)}
            >
              <Select.Option value="pending">待审核</Select.Option>
              <Select.Option value="approved">已通过</Select.Option>
              <Select.Option value="rejected">已拒绝</Select.Option>
              <Select.Option value="spam">垃圾评论</Select.Option>
            </Select>
          </Col>

          <Col xs={24} sm={12} md={6} lg={4}>
            <RangePicker
              placeholder={['开始日期', '结束日期']}
              format="YYYY-MM-DD"
              className="w-full"
              onChange={handleDateRangeChange}
            />
          </Col>

          <Col xs={24} sm={12} md={6} lg={4}>
            <Select
              placeholder="排序"
              className="w-full"
              value={`${queryParams.sortBy}-${queryParams.sortOrder}`}
              onChange={(value) => {
                const [sortBy, sortOrder] = value.split('-');
                setQueryParams(prev => ({
                  ...prev,
                  sortBy: sortBy as any,
                  sortOrder: sortOrder as any,
                }));
              }}
            >
              <Select.Option value="createdAt-desc">最新评论</Select.Option>
              <Select.Option value="createdAt-asc">最早评论</Select.Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Batch Actions */}
      {selectedRowKeys.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-blue-800">
              已选择 {selectedRowKeys.length} 条评论
            </span>
            <Space>
              <Button
                type="primary"
                size="small"
                onClick={() => handleBatchUpdateStatus('approved')}
              >
                批量通过
              </Button>
              <Button
                size="small"
                onClick={() => handleBatchUpdateStatus('rejected')}
              >
                批量拒绝
              </Button>
              <Button
                size="small"
                onClick={() => handleBatchUpdateStatus('spam')}
              >
                标记垃圾
              </Button>
              <Button
                danger
                size="small"
                onClick={handleBatchDelete}
              >
                批量删除
              </Button>
              <Button
                size="small"
                onClick={() => setSelectedRowKeys([])}
              >
                取消选择
              </Button>
            </Space>
          </div>
        </Card>
      )}

      {/* Comments Table */}
      <Card>
        <Table<Comment>
          columns={columns}
          dataSource={comments}
          rowKey="id"
          loading={isLoading}
          rowSelection={rowSelection}
          pagination={{
            current: pagination?.current || 1,
            pageSize: pagination?.pageSize || 20,
            total: pagination?.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total: number, range: [number, number]) =>
              `${range[0]}-${range[1]} 共 ${total} 条评论`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Reply Modal */}
      <Modal
        title="回复评论"
        open={replyModalVisible}
        onOk={handleSubmitReply}
        onCancel={() => setReplyModalVisible(false)}
        confirmLoading={replyMutation.isPending}
        okText="发送回复"
        cancelText="取消"
      >
        {replyingComment && (
          <div className="space-y-4">
            <div>
              <Text strong>原评论：</Text>
              <div className="mt-2 p-3 bg-gray-50 rounded">
                <div className="text-sm">
                  <strong>{replyingComment.author.name}</strong> 评论了文章 "
                  {replyingComment.post.title}"
                </div>
                <div className="mt-2">{replyingComment.content}</div>
              </div>
            </div>
            <div>
              <Text strong>回复内容：</Text>
              <TextArea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="输入回复内容..."
                rows={4}
                className="mt-2"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}