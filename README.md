# heimdall-web

Heimdall 博客平台的官方管理前端。

`heimdall-web` 是一个功能强大、直观且现代化的管理后台，旨在为博客管理员、编辑和作者提供最佳的内容管理体验。

## ✨ 核心特性

- **现代化的技术栈**: 基于 Next.js 14, TypeScript 和 Mantine UI 组件库。
- **高效的工作流**: 提供强大的所见即所得编辑器和流畅的内容管理流程。
- **完善的权限管理**: 支持多种用户角色（管理员、编辑、作者）。
- **企业级架构**: 清晰、可扩展、易于维护。

## 🚀 快速开始

本项目使用 `pnpm` 作为包管理器。

1.  **安装 pnpm**
    ```bash
    npm install -g pnpm
    ```

2.  **安装依赖**
    ```bash
    pnpm install
    ```

3.  **配置环境**
    - 复制 `.env.example` 文件为 `.env.local`。
    - 修改 `.env.local` 中的环境变量，例如 API 地址。

4.  **启动开发服务器**
    ```bash
    pnpm dev
    ```

## 📚 文档

- **[设计文档](./frontend-docs/DESIGN.md)**: 查看本项目的技术选型、架构设计和开发规范。
- **[API 规范](./frontend-docs/admin-api.yaml)**: 查看与后端 `heimdall-api` 配套的 API 接口定义。

---
*所有开发工作都应与设计文档中概述的原则和规范保持一致。*