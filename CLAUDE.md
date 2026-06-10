# 誉学坊 Yux Academy

React SPA + Express 后端，数学一对一辅导个人网站。

## 快速启动
```bash
npm run build    # 构建前端
npm run start    # 启动后端 → http://localhost:3001
npm run dev      # 开发模式
```

## 管理员

- 用户名: frank / 密码: frank202507
- 管理入口: /admin（文件管理 + 用户管理）

## 设计
深海蓝 #0F2440 / 暖金 #C4A265 / 灰色 #7B8D9E
系统字体，无 Google Fonts

## 项目结构
- client/src/pages/ — 9 个页面组件
- client/src/components/ — Navbar, FileList
- client/src/context/AuthContext.jsx — 认证 + 权限
- server/routes/ — auth, files, users, contact
- server/data/ — JSON 文件存储
