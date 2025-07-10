'use client';

import { useState, useCallback, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Button, Upload, message, Modal } from 'antd';
import { 
  PictureOutlined, 
  FullscreenOutlined, 
  FullscreenExitOutlined,
  TableOutlined,
  LinkOutlined,
  CodeOutlined
} from '@ant-design/icons';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

interface MarkdownEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  height?: number;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>;
}

export function MarkdownEditor({
  value = '',
  onChange,
  height = 500,
  placeholder = '开始编写您的文章内容...',
  onImageUpload,
}: MarkdownEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 处理图片上传
  const handleImageUpload = useCallback(async (file: File) => {
    if (!onImageUpload) {
      message.error('图片上传功能未配置');
      return false;
    }

    // 验证文件类型
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件！');
      return false;
    }

    // 验证文件大小 (5MB)
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('图片大小不能超过 5MB！');
      return false;
    }

    try {
      setUploading(true);
      const imageUrl = await onImageUpload(file);
      
      // 插入图片到编辑器
      const imageMarkdown = `![${file.name}](${imageUrl})`;
      const newValue = value + '\n\n' + imageMarkdown;
      onChange?.(newValue);
      
      message.success('图片上传成功');
    } catch (error) {
      message.error('图片上传失败');
      console.error('Image upload error:', error);
    } finally {
      setUploading(false);
    }

    return false; // 阻止默认上传行为
  }, [value, onChange, onImageUpload]);

  // 插入表格
  const insertTable = useCallback(() => {
    const tableMarkdown = `
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 行1 | 数据 | 数据 |
| 行2 | 数据 | 数据 |
`;
    const newValue = value + '\n' + tableMarkdown;
    onChange?.(newValue);
  }, [value, onChange]);

  // 插入链接
  const insertLink = useCallback(() => {
    Modal.confirm({
      title: '插入链接',
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">链接文本</label>
            <input
              id="link-text"
              type="text"
              placeholder="链接显示文本"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">链接地址</label>
            <input
              id="link-url"
              type="url"
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
        </div>
      ),
      onOk: () => {
        const text = (document.getElementById('link-text') as HTMLInputElement)?.value || '链接';
        const url = (document.getElementById('link-url') as HTMLInputElement)?.value || '#';
        const linkMarkdown = `[${text}](${url})`;
        const newValue = value + linkMarkdown;
        onChange?.(newValue);
      },
    });
  }, [value, onChange]);

  // 插入代码块
  const insertCodeBlock = useCallback(() => {
    Modal.confirm({
      title: '插入代码块',
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">编程语言</label>
            <select
              id="code-language"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="css">CSS</option>
              <option value="html">HTML</option>
              <option value="bash">Bash</option>
              <option value="json">JSON</option>
              <option value="markdown">Markdown</option>
              <option value="">其他</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">代码内容</label>
            <textarea
              id="code-content"
              rows={6}
              placeholder="在此输入代码..."
              className="w-full px-3 py-2 border border-gray-300 rounded font-mono text-sm"
            />
          </div>
        </div>
      ),
      onOk: () => {
        const language = (document.getElementById('code-language') as HTMLSelectElement)?.value || '';
        const content = (document.getElementById('code-content') as HTMLTextAreaElement)?.value || '';
        const codeMarkdown = `\n\`\`\`${language}\n${content}\n\`\`\`\n`;
        const newValue = value + codeMarkdown;
        onChange?.(newValue);
      },
    });
  }, [value, onChange]);

  // 自定义工具栏命令
  const extraCommands = [
    // 图片上传
    {
      name: 'image-upload',
      keyCommand: 'image-upload',
      buttonProps: { 'aria-label': '上传图片', title: '上传图片' },
      icon: (
        <Upload
          accept="image/*"
          showUploadList={false}
          beforeUpload={handleImageUpload}
          disabled={uploading}
        >
          <PictureOutlined />
        </Upload>
      ),
    },
    // 插入表格
    {
      name: 'table',
      keyCommand: 'table',
      buttonProps: { 'aria-label': '插入表格', title: '插入表格' },
      icon: <TableOutlined />,
      execute: insertTable,
    },
    // 插入链接
    {
      name: 'link',
      keyCommand: 'link',
      buttonProps: { 'aria-label': '插入链接', title: '插入链接' },
      icon: <LinkOutlined />,
      execute: insertLink,
    },
    // 插入代码块
    {
      name: 'code-block',
      keyCommand: 'code-block',
      buttonProps: { 'aria-label': '插入代码块', title: '插入代码块' },
      icon: <CodeOutlined />,
      execute: insertCodeBlock,
    },
    // 全屏切换
    {
      name: 'fullscreen',
      keyCommand: 'fullscreen',
      buttonProps: { 'aria-label': '全屏模式', title: '全屏模式' },
      icon: isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />,
      execute: () => setIsFullscreen(!isFullscreen),
    },
  ];

  // 键盘快捷键处理
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + F: 全屏
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'F') {
        event.preventDefault();
        setIsFullscreen(!isFullscreen);
      }
      
      // Ctrl/Cmd + Shift + T: 插入表格
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'T') {
        event.preventDefault();
        insertTable();
      }
      
      // Ctrl/Cmd + Shift + L: 插入链接
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'L') {
        event.preventDefault();
        insertLink();
      }
      
      // Ctrl/Cmd + Shift + C: 插入代码块
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'C') {
        event.preventDefault();
        insertCodeBlock();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, insertTable, insertLink, insertCodeBlock]);

  return (
    <div className={`markdown-editor-container ${isFullscreen ? 'fullscreen' : ''}`}>
      <MDEditor
        value={value}
        onChange={(val) => onChange?.(val || '')}
        height={isFullscreen ? '100vh' : height}
        preview="live"
        hideToolbar={false}
        toolbarHeight={45}
        extraCommands={extraCommands}
        data-color-mode="light"
        textareaProps={{
          placeholder,
          style: {
            fontSize: 14,
            lineHeight: 1.6,
            fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
          },
        }}
      />
      
      {/* 自定义样式 */}
      <style jsx global>{`
        .markdown-editor-container.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          background: white;
        }
        
        .w-md-editor {
          background-color: #ffffff;
        }
        
        .w-md-editor-text-textarea,
        .w-md-editor-text {
          color: #24292e !important;
          font-size: 14px !important;
          line-height: 1.6 !important;
        }
        
        .w-md-editor-preview {
          padding: 16px;
          background-color: #fafbfc;
        }
        
        .w-md-editor-preview h1,
        .w-md-editor-preview h2,
        .w-md-editor-preview h3,
        .w-md-editor-preview h4,
        .w-md-editor-preview h5,
        .w-md-editor-preview h6 {
          margin-top: 24px;
          margin-bottom: 16px;
          font-weight: 600;
          line-height: 1.25;
        }
        
        .w-md-editor-preview h1 {
          font-size: 2em;
          border-bottom: 1px solid #e1e4e8;
          padding-bottom: 0.3em;
        }
        
        .w-md-editor-preview h2 {
          font-size: 1.5em;
          border-bottom: 1px solid #e1e4e8;
          padding-bottom: 0.3em;
        }
        
        .w-md-editor-preview code {
          background-color: rgba(27, 31, 35, 0.05);
          border-radius: 6px;
          font-size: 85%;
          margin: 0;
          padding: 0.2em 0.4em;
        }
        
        .w-md-editor-preview pre {
          background-color: #f6f8fa;
          border-radius: 6px;
          font-size: 85%;
          line-height: 1.45;
          overflow: auto;
          padding: 16px;
        }
        
        .w-md-editor-preview blockquote {
          border-left: 0.25em solid #d0d7de;
          color: #656d76;
          margin: 0;
          padding: 0 1em;
        }
        
        .w-md-editor-preview table {
          border-collapse: collapse;
          border-spacing: 0;
          width: 100%;
          margin-bottom: 16px;
        }
        
        .w-md-editor-preview table th,
        .w-md-editor-preview table td {
          border: 1px solid #d0d7de;
          padding: 6px 13px;
        }
        
        .w-md-editor-preview table th {
          background-color: #f6f8fa;
          font-weight: 600;
        }
        
        .w-md-editor-toolbar {
          border-bottom: 1px solid #e1e4e8;
          background-color: #f6f8fa;
        }
        
        .w-md-editor-toolbar button {
          color: #24292e;
          border: none;
          background: transparent;
          padding: 8px;
          margin: 0 2px;
          border-radius: 4px;
          transition: all 0.2s;
        }
        
        .w-md-editor-toolbar button:hover {
          background-color: #e1e4e8;
        }
        
        .w-md-editor-toolbar button.active {
          background-color: #0366d6;
          color: white;
        }
      `}</style>
    </div>
  );
}