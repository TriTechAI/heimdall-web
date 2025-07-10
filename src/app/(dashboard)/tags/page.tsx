'use client';

import { useState } from 'react';
import {
  Card,
  Button,
  Input,
  Select,
  Row,
  Col,
  Tag,
  Typography,
  Space,
  Modal,
  Dropdown,
  message,
  Empty,
  Spin,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useTagList, useCreateTag, useUpdateTag, useDeleteTag } from '@/services/hooks/useTags';
import { TagForm } from '@/components/features/tag/TagForm';
import type { Tag as TagType, TagQueryParams } from '@/services/api/tag.service';

const { Title, Text } = Typography;

export default function TagsPage() {
  const [queryParams, setQueryParams] = useState<TagQueryParams>({
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [tagFormVisible, setTagFormVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<TagType | undefined>();

  // API hooks
  const { data: tagListData, isLoading } = useTagList(queryParams);
  const createTagMutation = useCreateTag();
  const updateTagMutation = useUpdateTag();
  const deleteTagMutation = useDeleteTag();

  const tags = tagListData?.list || [];
  const pagination = tagListData?.pagination;

  // 处理搜索
  const handleSearch = (keyword: string) => {
    setQueryParams(prev => ({
      ...prev,
      keyword: keyword || undefined,
      page: 1,
    }));
  };

  // 处理排序
  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-');
    setQueryParams(prev => ({
      ...prev,
      sortBy: sortBy as any,
      sortOrder: sortOrder as any,
      page: 1,
    }));
  };

  // 处理新建标签
  const handleCreate = async (data: any) => {
    try {
      await createTagMutation.mutateAsync(data);
      setTagFormVisible(false);
    } catch (error) {
      console.error('Create tag failed:', error);
    }
  };

  // 处理编辑标签
  const handleEdit = (tag: TagType) => {
    setEditingTag(tag);
    setTagFormVisible(true);
  };

  const handleUpdate = async (data: any) => {
    if (!editingTag) return;
    
    try {
      await updateTagMutation.mutateAsync({
        id: editingTag.id,
        data,
      });
      setTagFormVisible(false);
      setEditingTag(undefined);
    } catch (error) {
      console.error('Update tag failed:', error);
    }
  };

  // 处理删除标签
  const handleDelete = (tag: TagType) => {
    Modal.confirm({
      title: '删除标签',
      content: (
        <div>
          <p>确定要删除标签 "<strong>{tag.name}</strong>" 吗？</p>
          {tag.postCount > 0 && (
            <p className="text-orange-600">
              注意：该标签关联了 {tag.postCount} 篇文章，删除后这些文章将失去该标签。
            </p>
          )}
        </div>
      ),
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteTagMutation.mutateAsync(tag.id);
        } catch (error) {
          console.error('Delete tag failed:', error);
        }
      },
    });
  };

  // 关闭表单
  const handleFormCancel = () => {
    setTagFormVisible(false);
    setEditingTag(undefined);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <Title level={2} className="mb-2">标签管理</Title>
          <p className="text-gray-600">
            管理文章分类标签，组织您的内容
          </p>
        </div>
        
        <Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setTagFormVisible(true)}
          >
            新建标签
          </Button>
        </Space>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input
              placeholder="搜索标签..."
              prefix={<SearchOutlined />}
              allowClear
              onPressEnter={(e) => handleSearch(e.currentTarget.value)}
              onBlur={(e) => handleSearch(e.currentTarget.value)}
            />
          </Col>
          
          <Col xs={24} sm={12} md={6} lg={4}>
            <Select
              placeholder="排序方式"
              className="w-full"
              value={`${queryParams.sortBy}-${queryParams.sortOrder}`}
              onChange={handleSortChange}
            >
              <Select.Option value="createdAt-desc">最新创建</Select.Option>
              <Select.Option value="createdAt-asc">最早创建</Select.Option>
              <Select.Option value="name-asc">名称 A-Z</Select.Option>
              <Select.Option value="name-desc">名称 Z-A</Select.Option>
              <Select.Option value="postCount-desc">使用最多</Select.Option>
              <Select.Option value="postCount-asc">使用最少</Select.Option>
            </Select>
          </Col>

          <Col xs={24} sm={12} md={4} lg={3}>
            <Text className="text-sm text-gray-500">
              共 {pagination?.total || 0} 个标签
            </Text>
          </Col>
        </Row>
      </Card>

      {/* Tags Grid */}
      <Card>
        {isLoading ? (
          <div className="text-center py-12">
            <Spin size="large" />
          </div>
        ) : tags.length === 0 ? (
          <Empty
            description="暂无标签"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setTagFormVisible(true)}>
              创建第一个标签
            </Button>
          </Empty>
        ) : (
          <Row gutter={[16, 16]}>
            {tags.map(tag => (
              <Col xs={24} sm={12} md={8} lg={6} xl={4} key={tag.id}>
                <Card
                  size="small"
                  className="h-full hover:shadow-md transition-shadow"
                  style={{ borderLeft: `4px solid ${tag.color || '#1890ff'}` }}
                  actions={[
                    <Button
                      key="edit"
                      type="text"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(tag)}
                    >
                      编辑
                    </Button>,
                    <Button
                      key="delete"
                      type="text"
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(tag)}
                    >
                      删除
                    </Button>,
                  ]}
                >
                  <div className="space-y-3">
                    {/* 标签名称和颜色 */}
                    <div>
                      <Tag
                        color={tag.color}
                        className="mb-2"
                      >
                        {tag.name}
                      </Tag>
                      <Text className="text-xs text-gray-500 block">
                        /{tag.slug}
                      </Text>
                    </div>

                    {/* 描述 */}
                    {tag.description && (
                      <Text className="text-sm text-gray-600 block">
                        {tag.description}
                      </Text>
                    )}

                    {/* 统计信息 */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">关联文章</span>
                        <span className="font-medium">{tag.postCount}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">创建时间</span>
                        <span>{dayjs(tag.createdAt).format('MM-DD')}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 text-center">
            <Button
              disabled={queryParams.page === 1}
              onClick={() => setQueryParams(prev => ({
                ...prev,
                page: (prev.page || 1) - 1,
              }))}
            >
              上一页
            </Button>
            <span className="mx-4 text-gray-500">
              第 {pagination.current} 页，共 {pagination.totalPages} 页
            </span>
            <Button
              disabled={queryParams.page === pagination.totalPages}
              onClick={() => setQueryParams(prev => ({
                ...prev,
                page: (prev.page || 1) + 1,
              }))}
            >
              下一页
            </Button>
          </div>
        )}
      </Card>

      {/* Tag Form Modal */}
      <TagForm
        tag={editingTag}
        visible={tagFormVisible}
        onSubmit={editingTag ? handleUpdate : handleCreate}
        onCancel={handleFormCancel}
        loading={createTagMutation.isPending || updateTagMutation.isPending}
      />
    </div>
  );
}