import { message } from 'antd';

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
}

class ImageUploadService {
  /**
   * 上传单个图片文件
   */
  async uploadImage(file: File): Promise<string> {
    try {
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        throw new Error('只能上传图片文件');
      }

      // 验证文件大小 (5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('图片大小不能超过 5MB');
      }

      // 创建FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'post-image');

      // 这里应该调用实际的上传API
      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData,
      // });

      // 模拟上传过程
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 模拟返回的图片URL
      const mockUrl = URL.createObjectURL(file);
      
      return mockUrl;
    } catch (error: any) {
      console.error('Image upload failed:', error);
      throw new Error(error.message || '图片上传失败');
    }
  }

  /**
   * 批量上传图片
   */
  async uploadImages(files: File[]): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadImage(file));
    return Promise.all(uploadPromises);
  }

  /**
   * 获取图片信息
   */
  getImageInfo(file: File): Promise<{
    width: number;
    height: number;
    size: number;
    type: string;
  }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          size: file.size,
          type: file.type,
        });
        URL.revokeObjectURL(url);
      };

      img.onerror = () => {
        reject(new Error('无法读取图片信息'));
        URL.revokeObjectURL(url);
      };

      img.src = url;
    });
  }

  /**
   * 压缩图片
   */
  compressImage(
    file: File, 
    options: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
    } = {}
  ): Promise<File> {
    const { maxWidth = 1920, maxHeight = 1080, quality = 0.8 } = options;

    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        const { width, height } = img;
        
        // 计算新尺寸
        let newWidth = width;
        let newHeight = height;

        if (width > maxWidth) {
          newWidth = maxWidth;
          newHeight = (height * maxWidth) / width;
        }

        if (newHeight > maxHeight) {
          newHeight = maxHeight;
          newWidth = (newWidth * maxHeight) / newHeight;
        }

        // 设置canvas尺寸
        canvas.width = newWidth;
        canvas.height = newHeight;

        // 绘制压缩后的图片
        ctx?.drawImage(img, 0, 0, newWidth, newHeight);

        // 转换为blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('图片压缩失败'));
            }
          },
          file.type,
          quality
        );

        URL.revokeObjectURL(url);
      };

      img.onerror = () => {
        reject(new Error('图片加载失败'));
        URL.revokeObjectURL(url);
      };

      img.src = url;
    });
  }

  /**
   * 生成图片预览URL
   */
  createPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  /**
   * 清理预览URL
   */
  revokePreviewUrl(url: string): void {
    URL.revokeObjectURL(url);
  }
}

// 导出单例实例
export const imageUploadService = new ImageUploadService();