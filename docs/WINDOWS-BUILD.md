# Windows应用构建指南

## 🎯 概述

本指南介绍如何构建配对题生成器的Windows版本，包括安装包和便携版。

## 🚀 快速开始

### 方法一：使用构建脚本（推荐）

```bash
# 运行Windows构建脚本
./scripts/build-windows.sh
```

脚本会提供交互式菜单，选择你需要的构建类型。

### 方法二：使用npm命令

```bash
# 构建Windows安装包
npm run build:win:nsis

# 构建Windows便携版
npm run build:win:portable

# 构建所有Windows版本
npm run build:win
```

## 📋 构建选项

### 1. Windows安装包 (NSIS)
- **文件格式**: `.exe`
- **特点**: 自动安装，创建开始菜单快捷方式
- **适用场景**: 正式发布，用户安装

### 2. Windows便携版 (Portable)
- **文件格式**: `.exe`
- **特点**: 无需安装，直接运行
- **适用场景**: 临时使用，U盘携带

### 3. 所有Windows版本
- **包含**: 安装包 + 便携版
- **特点**: 一次性构建所有版本

### 4. 特定架构
- **x64**: 64位Windows
- **ia32**: 32位Windows
- **armv7l**: ARM架构
- **arm64**: ARM64架构

## 🔧 环境要求

### 必需软件
- **Node.js**: 16.0+
- **npm**: 8.0+
- **Git**: 用于版本控制

### 可选软件
- **Wine**: 在macOS/Linux上构建Windows应用
- **Windows虚拟机**: 在Windows环境中构建

## 📁 输出文件

构建完成后，文件位于 `dist/` 目录：

```
dist/
├── 配对题生成器 Setup 1.0.0.exe    # Windows安装包
├── 配对题生成器-1.0.0.exe          # Windows便携版
└── win-unpacked/                    # 解压版本
    └── 配对题生成器.exe
```

## ⚙️ 构建配置

### package.json中的Windows配置

```json
{
  "build": {
    "win": {
      "icon": "assets/icon.ico",
      "target": [
        {
          "target": "nsis",
          "arch": ["x64"]
        },
        {
          "target": "portable",
          "arch": ["x64"]
        }
      ]
    }
  }
}
```

### 配置说明
- **icon**: Windows应用图标
- **target**: 构建目标类型
- **arch**: 目标架构

## 🐛 常见问题

### 1. 构建失败
```bash
# 清理缓存
npm cache clean --force

# 重新安装依赖
rm -rf node_modules package-lock.json
npm install
```

### 2. 图标问题
- 确保 `assets/icon.ico` 文件存在
- 图标文件应为 `.ico` 格式
- 建议尺寸：256x256像素

### 3. 网络问题
```bash
# 设置Electron镜像
export ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
```

### 4. 权限问题
```bash
# 给脚本添加执行权限
chmod +x scripts/build-windows.sh
```

## 📊 文件大小

构建后的文件大小参考：
- **安装包**: ~100MB
- **便携版**: ~80MB
- **解压版**: ~120MB

## 🎯 最佳实践

### 1. 开发阶段
```bash
# 快速测试
npm start
```

### 2. 测试阶段
```bash
# 构建便携版进行测试
npm run build:win:portable
```

### 3. 发布阶段
```bash
# 构建安装包
npm run build:win:nsis
```

## 🔗 相关链接

- [Electron Builder文档](https://www.electron.build/)
- [Windows应用打包指南](https://www.electron.build/configuration/win)
- [NSIS安装包配置](https://www.electron.build/configuration/nsis)

## 📞 技术支持

如果遇到构建问题，请检查：
1. Node.js版本是否符合要求
2. 网络连接是否正常
3. 磁盘空间是否充足
4. 构建日志中的错误信息 