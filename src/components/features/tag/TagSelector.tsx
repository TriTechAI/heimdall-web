'use client';

import { useState, useEffect } from 'react';
import { Select, Tag, Button, Space, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAllTags, useSearchTags, useCreateTag } from '@/services/hooks/useTags';
import { TagForm } from './TagForm';
import type { Tag as TagType } from '@/services/api/tag.service';

const { Option } = Select;

interface TagSelectorProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  maxTagCount?: number;
  allowCreate?: boolean;
  disabled?: boolean;
}

export function TagSelector({
  value = [],
  onChange,
  placeholder = '选择或搜索标签...',
  maxTagCount = 10,
  allowCreate = true,
  disabled = false,
}: TagSelectorProps) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [tagFormVisible, setTagFormVisible] = useState(false);
  
  // 获取所有标签和搜索结果
  const { data: allTags = [], isLoading: isLoadingAll } = useAllTags();
  const { data: searchResults = [], isLoading: isSearching } = useSearchTags(searchKeyword);
  const createTagMutation = useCreateTag();

  // 根据搜索关键词决定使用哪个数据源
  const tags = searchKeyword ? searchResults : allTags;
  const isLoading = searchKeyword ? isSearching : isLoadingAll;

  // 获取已选标签的详细信息
  const selectedTags = tags.filter(tag => value.includes(tag.id));

  // 处理标签选择变化
  const handleChange = (selectedValues: string[]) => {
    onChange?.(selectedValues);
  };

  // 处理搜索
  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword.trim());
  };

  // 创建新标签
  const handleCreateTag = async (data: any) => {
    try {
      const newTag = await createTagMutation.mutateAsync(data);
      // 自动选中新创建的标签
      const newValue = [...value, (newTag as any).id];
      onChange?.(newValue);
      setTagFormVisible(false);
    } catch (error) {
      console.error('Failed to create tag:', error);
    }
  };

  // 自定义标签渲染
  const tagRender = (props: any) => {
    const { label, value: tagId, closable, onClose } = props;
    const tag = tags.find(t => t.id === tagId);
    
    return (
      <Tag
        color={tag?.color}
        closable={closable}
        onClose={onClose}
        className="mr-1 mb-1"
      >
        {label}
      </Tag>
    );
  };

  // 下拉菜单底部的创建按钮
  const dropdownRender = (menu: React.ReactElement) => (
    <>
      {menu}
      {allowCreate && (
        <>
          <div className="border-t border-gray-200 my-1" />
          <div className="px-2 py-1">
            <Button
              type="text"
              icon={<PlusOutlined />}
              onClick={() => setTagFormVisible(true)}
              className="w-full justify-start"
            >
              创建新标签
            </Button>
          </div>
        </>
      )}
    </>
  );

  return (
    <>
      <Select
        mode="multiple"
        value={value}
        onChange={handleChange}
        onSearch={handleSearch}
        placeholder={placeholder}
        loading={isLoading}
        disabled={disabled}
        showSearch
        filterOption={false}
        tagRender={tagRender}
        dropdownRender={dropdownRender}
        maxTagCount={maxTagCount}
        className="w-full"
        notFoundContent={
          isLoading ? (
            <div className="text-center py-2">
              <Spin size="small" />
            </div>
          ) : searchKeyword ? (
            <div className="text-center py-2 text-gray-500">
              没有找到相关标签
            </div>
          ) : (
            <div className="text-center py-2 text-gray-500">
              暂无标签
            </div>
          )
        }
      >
        {tags.map(tag => (
          <Option key={tag.id} value={tag.id}>
            <Space>
              <div
                className="w-3 h-3 rounded-full inline-block"
                style={{ backgroundColor: tag.color || '#1890ff' }}
              />
              <span>{tag.name}</span>
              <span className="text-gray-400 text-xs">({tag.postCount})</span>
            </Space>
          </Option>
        ))}
      </Select>

      {/* 创建标签表单 */}
      <TagForm
        visible={tagFormVisible}
        onSubmit={handleCreateTag}
        onCancel={() => setTagFormVisible(false)}
        loading={createTagMutation.isPending}
      />
    </>
  );
}