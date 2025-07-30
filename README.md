# 配对题生成器

一个基于Electron的桌面应用，用于创建和管理配对题练习。

## 📁 项目结构

```
配对题生成器/
├── src/                    # 源代码目录
│   ├── js/                # JavaScript文件
│   │   └── local-storage.js  # 本地存储管理器
│   ├── css/               # CSS样式文件
│   └── pages/             # 页面文件
│       ├── data-manager.html    # 数据管理页面
│       ├── test-fixes.html      # 功能测试页面
│       └── quick-test.html      # 快速测试页面
├── docs/                  # 文档目录
│   ├── README.md              # 主文档
│   ├── README-Desktop.md      # 桌面应用说明
│   ├── README-LocalStorage.md # 本地存储说明
│   ├── INSTALL.md             # 安装指南
│   ├── BUGFIX-SUMMARY.md      # 修复总结
│   ├── MIGRATION-SUMMARY.md   # 迁移总结
│   ├── update-guide.md        # 更新指南
│   └── tauri-setup.md         # Tauri设置
├── scripts/               # 脚本目录
│   ├── quick-start.sh         # 快速启动脚本
│   ├── build-mac.sh           # macOS构建脚本
│   ├── build-windows.sh       # Windows构建脚本
│   ├── build-app.sh           # 通用构建脚本
│   ├── update.sh              # 更新脚本
│   └── fast-install.sh        # 快速安装脚本
├── build/                  # 构建相关文件
│   ├── Dockerfile             # Docker配置
│   ├── nginx.conf             # Nginx配置
│   └── .dockerignore          # Docker忽略文件
├── assets/                 # 资源文件
│   └── icon.*               # 应用图标
├── dist/                   # 构建输出目录
├── index.html              # 主应用页面
├── main.js                 # Electron主进程
├── package.json            # 项目配置
└── README.md              # 项目说明
```

## 🚀 快速开始

### 开发模式
```bash
npm start
```

### 构建应用
```bash
# macOS
./scripts/build-mac.sh

# Windows
./scripts/build-windows.sh

# 通用构建
./scripts/build-app.sh

# 快速启动
./scripts/quick-start.sh
```

## 📋 功能特性

- ✅ **完全离线**：不依赖任何云服务
- ✅ **本地存储**：所有数据保存在本地
- ✅ **跨平台**：支持macOS、Windows、Linux
- ✅ **用户友好**：简洁的界面和操作流程
- ✅ **数据管理**：支持数据导出、导入、迁移
- ✅ **测试工具**：内置功能测试页面

## 🔧 技术栈

- **Electron**: 桌面应用框架
- **HTML/CSS/JavaScript**: 前端技术
- **LocalStorage**: 本地数据存储
- **Node.js**: 运行时环境

## 📖 文档

- [桌面应用说明](docs/README-Desktop.md)
- [本地存储说明](docs/README-LocalStorage.md)
- [安装指南](docs/INSTALL.md)
- [修复总结](docs/BUGFIX-SUMMARY.md)
- [迁移总结](docs/MIGRATION-SUMMARY.md)

## 🛠️ 开发

### 文件组织
- `src/js/`: JavaScript模块
- `src/pages/`: 页面文件
- `docs/`: 项目文档
- `scripts/`: 构建和部署脚本

### 测试
- 功能测试：`src/pages/test-fixes.html`
- 快速测试：`src/pages/quick-test.html`
- 数据管理：`src/pages/data-manager.html`

## 📦 构建

### 环境要求
- Node.js 16+
- npm 8+

### 构建命令
```bash
# 安装依赖
npm install

# 开发模式
npm start

# 构建应用
npm run build

# 平台特定构建
npm run build:mac
npm run build:win
npm run build:win:nsis    # Windows安装包
npm run build:win:portable # Windows便携版
npm run build:linux
```

## 🎯 使用说明

1. **启动应用**：运行 `npm start`
2. **输入授权码**：任意字符串即可登录
3. **创建配对题**：添加题目和选项
4. **保存数据**：自动保存到本地存储
5. **管理数据**：通过数据管理页面导出/导入

## �� 许可证

MIT License 