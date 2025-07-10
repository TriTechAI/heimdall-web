# Heimdall Web 部署方案

本文档提供了 Heimdall Web 博客管理系统的多种部署方案，适用于不同的环境和需求。

## 目录

- [前置要求](#前置要求)
- [环境变量配置](#环境变量配置)
- [部署方案](#部署方案)
  - [1. Vercel 部署（推荐）](#1-vercel-部署推荐)
  - [2. 传统服务器部署](#2-传统服务器部署)
  - [3. 阿里云/腾讯云部署](#3-阿里云腾讯云部署)
  - [4. GitHub Pages + Actions](#4-github-pages--actions)
- [性能优化](#性能优化)
- [监控和日志](#监控和日志)
- [故障排除](#故障排除)

## 前置要求

### 系统要求

- Node.js 18.17.0 或更高版本
- npm 9.0.0 或更高版本（或 yarn 1.22.0+）
- 至少 512MB RAM
- 至少 1GB 磁盘空间

### 检查环境

```bash
# 检查 Node.js 版本
node --version

# 检查 npm 版本
npm --version

# 检查可用内存
free -h
```

## 环境变量配置

### 开发环境 (.env.local)

```env
# API 配置
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1/admin
NEXT_PUBLIC_APP_NAME=Heimdall Admin Dev
NEXT_PUBLIC_APP_VERSION=1.0.0

# 功能开关
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_ERROR_REPORTING=false

# 调试选项
NEXT_PUBLIC_DEBUG_MODE=true
```

### 生产环境 (.env.production)

```env
# API 配置
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1/admin
NEXT_PUBLIC_APP_NAME=Heimdall Admin
NEXT_PUBLIC_APP_VERSION=1.0.0

# CDN 配置
NEXT_PUBLIC_CDN_URL=https://cdn.yourdomain.com

# 功能开关
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_ERROR_REPORTING=true

# 安全配置
NEXT_PUBLIC_DEBUG_MODE=false
```

## 部署方案

## 1. Vercel 部署（推荐）

Vercel 是 Next.js 官方推荐的部署平台，具有零配置、自动优化等优势。

### 1.1 自动部署

1. **连接 GitHub 仓库**
   ```bash
   # 1. 推送代码到 GitHub
   git add .
   git commit -m "feat: ready for deployment"
   git push origin main
   ```

2. **配置 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录
   - 点击 "New Project"
   - 选择你的仓库
   - 配置项目设置

3. **环境变量配置**
   
   在 Vercel Dashboard → Settings → Environment Variables 中添加：
   
   ```
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1/admin
   NEXT_PUBLIC_APP_NAME=Heimdall Admin
   ```

4. **部署配置**
   
   创建 `vercel.json`：
   ```json
   {
     "framework": "nextjs",
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "installCommand": "npm install",
     "functions": {
       "app/api/**/*.ts": {
         "maxDuration": 30
       }
     },
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "X-Content-Type-Options",
             "value": "nosniff"
           },
           {
             "key": "X-Frame-Options",
             "value": "DENY"
           },
           {
             "key": "X-XSS-Protection",
             "value": "1; mode=block"
           }
         ]
       }
     ]
   }
   ```

### 1.2 手动部署

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录 Vercel
vercel login

# 3. 部署
vercel --prod
```

### 1.3 自定义域名

1. 在 Vercel Dashboard → Settings → Domains
2. 添加你的域名
3. 配置 DNS 记录：
   ```
   Type: CNAME
   Name: @（或 www）
   Value: cname.vercel-dns.com
   ```

## 2. 传统服务器部署

适用于 VPS、云服务器等传统服务器环境。

### 2.1 服务器准备

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2（进程管理器）
sudo npm install -g pm2

# 安装 Nginx（反向代理）
sudo apt install nginx -y

# 安装 SSL 证书工具
sudo apt install certbot python3-certbot-nginx -y
```

### 2.2 项目部署

```bash
# 1. 克隆项目
git clone https://github.com/yourusername/heimdall-web.git
cd heimdall-web

# 2. 安装依赖
npm ci --only=production

# 3. 创建生产环境变量
cp .env.example .env.production.local
# 编辑环境变量
nano .env.production.local

# 4. 构建项目
npm run build

# 5. 启动应用
pm2 start npm --name "heimdall-web" -- start
pm2 save
pm2 startup
```

### 2.3 PM2 配置

创建 `ecosystem.config.js`：

```javascript
module.exports = {
  apps: [{
    name: 'heimdall-web',
    script: 'npm',
    args: 'start',
    cwd: '/path/to/heimdall-web',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/heimdall-web-error.log',
    out_file: '/var/log/pm2/heimdall-web-out.log',
    log_file: '/var/log/pm2/heimdall-web.log',
    time: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
```

启动配置：
```bash
pm2 start ecosystem.config.js
```

### 2.4 Nginx 配置

创建 `/etc/nginx/sites-available/heimdall-web`：

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL 证书
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL 配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src * data: 'unsafe-eval' 'unsafe-inline'" always;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;

    # 静态文件缓存
    location /_next/static {
        alias /path/to/heimdall-web/.next/static;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /images {
        alias /path/to/heimdall-web/public/images;
        add_header Cache-Control "public, max-age=31536000";
    }

    # 主要代理
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用站点：
```bash
sudo ln -s /etc/nginx/sites-available/heimdall-web /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 2.5 SSL 证书

```bash
# 获取 SSL 证书
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 设置自动续期
sudo crontab -e
# 添加以下行
0 12 * * * /usr/bin/certbot renew --quiet
```

## 3. 阿里云/腾讯云部署

### 3.1 ECS/CVM 服务器部署

1. **购买服务器**
   - 选择 Ubuntu 20.04 LTS
   - 配置：2核4G（最低配置）
   - 带宽：1Mbps（可根据需求调整）

2. **安全组配置**
   ```
   入站规则：
   - HTTP (80): 0.0.0.0/0
   - HTTPS (443): 0.0.0.0/0
   - SSH (22): 你的IP地址
   - 自定义 (3000): 127.0.0.1（仅本地）
   ```

3. **域名解析**
   
   在域名控制台添加 A 记录：
   ```
   @ -> 服务器公网IP
   www -> 服务器公网IP
   ```

### 3.2 对象存储配置（可选）

如果需要使用 OSS/COS 存储图片：

```bash
# 安装阿里云 CLI
wget https://aliyuncli.alicdn.com/aliyun-cli-linux-latest-amd64.tgz
tar -xzf aliyun-cli-linux-latest-amd64.tgz
sudo mv aliyun /usr/local/bin/

# 配置访问密钥
aliyun configure
```

环境变量添加：
```env
NEXT_PUBLIC_OSS_REGION=oss-cn-hangzhou
NEXT_PUBLIC_OSS_BUCKET=your-bucket-name
NEXT_PUBLIC_OSS_ENDPOINT=https://oss-cn-hangzhou.aliyuncs.com
```

## 4. GitHub Pages + Actions

适用于静态站点部署（需要后端 API 支持）。

### 4.1 GitHub Actions 配置

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build application
      run: npm run build
      env:
        NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}
        NEXT_PUBLIC_APP_NAME: ${{ secrets.APP_NAME }}

    - name: Export static files
      run: npm run export

    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./out
```

### 4.2 Next.js 静态导出配置

修改 `next.config.js`：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/heimdall-web' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/heimdall-web' : '',
}

module.exports = nextConfig
```

添加导出脚本到 `package.json`：

```json
{
  "scripts": {
    "export": "next export"
  }
}
```

## 性能优化

### 5.1 构建优化

1. **启用压缩**
   
   修改 `next.config.js`：
   ```javascript
   const nextConfig = {
     compress: true,
     poweredByHeader: false,
     generateEtags: false,
   }
   ```

2. **图片优化**
   ```javascript
   const nextConfig = {
     images: {
       domains: ['yourdomain.com'],
       formats: ['image/webp', 'image/avif'],
       minimumCacheTTL: 86400,
     }
   }
   ```

### 5.2 CDN 配置

```javascript
const nextConfig = {
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://cdn.yourdomain.com' 
    : '',
}
```

### 5.3 缓存策略

Nginx 缓存配置：
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location ~* \.(html)$ {
    expires 1h;
    add_header Cache-Control "public";
}
```

## 监控和日志

### 6.1 PM2 监控

```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs heimdall-web

# 监控面板
pm2 monit

# 重启应用
pm2 restart heimdall-web
```

### 6.2 Nginx 日志

```bash
# 查看访问日志
sudo tail -f /var/log/nginx/access.log

# 查看错误日志
sudo tail -f /var/log/nginx/error.log
```

### 6.3 系统监控

安装系统监控工具：
```bash
# 安装 htop
sudo apt install htop

# 安装 iotop
sudo apt install iotop

# 查看磁盘使用
df -h

# 查看内存使用
free -h
```

## 故障排除

### 7.1 常见问题

1. **构建失败**
   ```bash
   # 清理缓存
   rm -rf .next
   rm -rf node_modules
   npm install
   npm run build
   ```

2. **端口被占用**
   ```bash
   # 查找占用端口的进程
   sudo lsof -i :3000
   
   # 杀死进程
   sudo kill -9 <PID>
   ```

3. **内存不足**
   ```bash
   # 增加 swap 文件
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   ```

### 7.2 日志分析

```bash
# PM2 日志
pm2 logs --lines 100

# 系统日志
sudo journalctl -u nginx -f

# 磁盘空间检查
du -sh .next/
```

### 7.3 性能调优

```bash
# 调整 PM2 实例数
pm2 scale heimdall-web 4

# 查看性能指标
pm2 monit
```

## 部署检查清单

### 部署前检查

- [ ] 代码已推送到仓库
- [ ] 环境变量已配置
- [ ] 依赖项已更新
- [ ] 构建测试通过
- [ ] 安全审计完成

### 部署后检查

- [ ] 应用正常启动
- [ ] 所有页面可访问
- [ ] API 连接正常
- [ ] SSL 证书有效
- [ ] 性能监控正常
- [ ] 日志记录正常

### 定期维护

- [ ] 每周检查日志
- [ ] 每月更新依赖
- [ ] 每季度备份数据
- [ ] 每年更新 SSL 证书

## 总结

本部署指南涵盖了从简单的 Vercel 部署到复杂的服务器部署的各种方案。选择最适合你需求和技术水平的部署方式：

- **初学者**：推荐使用 Vercel
- **有服务器经验**：推荐传统服务器部署
- **企业级**：推荐云服务器 + CDN + 监控

无论选择哪种方案，都要确保：
1. 正确配置环境变量
2. 启用 HTTPS
3. 设置监控和日志
4. 定期备份和更新