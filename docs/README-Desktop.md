# 配对题生成器 - 桌面应用

将HTML网站封装成跨平台桌面应用（支持macOS、Windows、Linux）。

## 🚀 快速开始

### 方法一：一键构建（推荐）

```bash
# 运行构建脚本
./build-app.sh
```

### 方法二：手动构建

1. **安装依赖**
```bash
npm install
```

2. **开发模式运行**
```bash
npm start
```

3. **构建应用**
```bash
# 构建所有平台
npm run build

# 只构建macOS
npm run build:mac

# 只构建Windows
npm run build:win

# 只构建Linux
npm run build:linux
```

## 📦 构建输出

构建完成后，应用文件将保存在 `dist/` 目录中：

- **macOS**: `.dmg` 安装包和 `.zip` 压缩包
- **Windows**: `.exe` 安装程序和便携版
- **Linux**: `.AppImage` 和 `.deb` 包

## 🎯 功能特性

### 桌面应用特性
- ✅ 原生桌面应用体验
- ✅ 跨平台支持（macOS/Windows/Linux）
- ✅ 系统菜单集成
- ✅ 快捷键支持
- ✅ 窗口管理
- ✅ 自动更新支持（可配置）

### 应用功能
- ✅ 配对题生成和练习
- ✅ 历史记录管理
- ✅ 标签系统
- ✅ 搜索功能
- ✅ 复习模式
- ✅ 数据同步（云端/本地）

## 🔧 技术栈

- **Electron**: 桌面应用框架
- **HTML/CSS/JavaScript**: 前端技术
- **electron-builder**: 应用打包工具

## 📋 系统要求

### 开发环境
- Node.js 16+ 
- npm 8+
- Git

### 运行环境
- **macOS**: 10.14+ (Intel/Apple Silicon)
- **Windows**: Windows 10+ (64位)
- **Linux**: Ubuntu 18.04+, CentOS 7+, 等主流发行版

## 🛠️ 自定义配置

### 修改应用信息
编辑 `package.json` 中的以下字段：
```json
{
  "name": "你的应用名称",
  "version": "1.0.0",
  "description": "应用描述",
  "author": "作者信息"
}
```

### 修改窗口设置
编辑 `main.js` 中的窗口配置：
```javascript
mainWindow = new BrowserWindow({
  width: 1200,        // 窗口宽度
  height: 800,        // 窗口高度
  minWidth: 800,      // 最小宽度
  minHeight: 600,     // 最小高度
  // ... 其他配置
});
```

### 自定义图标
替换 `assets/` 目录中的图标文件：
- `icon.png` - 通用图标
- `icon.icns` - macOS图标
- `icon.ico` - Windows图标

## 🚨 常见问题

### Q: 构建失败怎么办？
A: 检查以下几点：
1. 确保Node.js版本 >= 16
2. 确保网络连接正常
3. 检查是否有足够的磁盘空间
4. 查看错误日志获取详细信息

### Q: 应用无法启动？
A: 尝试以下步骤：
1. 重新安装依赖：`npm install`
2. 清除缓存：`npm cache clean --force`
3. 删除 `node_modules` 重新安装

### Q: 如何添加自动更新功能？
A: 可以使用 `electron-updater` 包：
```bash
npm install electron-updater
```

### Q: 如何减小应用体积？
A: 可以配置 `electron-builder` 的优化选项：
```json
{
  "build": {
    "compression": "maximum",
    "removePackageScripts": true,
    "removePackageKeywords": true
  }
}
```

## 📝 开发指南

### 添加新功能
1. 修改 `index.html` 添加前端功能
2. 在 `main.js` 中添加对应的菜单项
3. 测试功能是否正常工作
4. 重新构建应用

### 调试技巧
- 开发模式：`npm start`
- 打开开发者工具：`Cmd+Option+I` (macOS) 或 `Ctrl+Shift+I` (Windows/Linux)
- 查看控制台日志

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！

---

**提示**: 首次构建可能需要较长时间，因为需要下载Electron运行时。后续构建会更快。 