# 代码更新和重新编译指南

## 🔄 快速更新流程

### 方法一：使用快速启动脚本
```bash
./quick-start.sh
```
选择相应的构建选项即可。

### 方法二：手动更新和构建
```bash
# 1. 更新代码后，重新构建
npm run build:mac    # macOS
npm run build:win    # Windows
npm run build:linux  # Linux
```

## 📝 更新代码的步骤

### 1. 修改代码
- 编辑 `index.html` - 修改界面和功能
- 编辑 `cloud-config.js` - 修改云配置
- 编辑 `cloud-db.js` - 修改数据库逻辑
- 编辑 `main.js` - 修改桌面应用配置

### 2. 测试更改
```bash
# 开发模式测试
npm start
```

### 3. 重新构建
```bash
# 构建所有平台
npm run build

# 或构建特定平台
npm run build:mac
npm run build:win
npm run build:linux
```

## 🎯 常见更新场景

### 场景一：修改界面样式
1. 编辑 `index.html` 中的 CSS 样式
2. 运行 `npm start` 测试效果
3. 运行 `npm run build:mac` 重新构建

### 场景二：添加新功能
1. 在 `index.html` 中添加新的 JavaScript 函数
2. 在 `main.js` 中添加对应的菜单项（如需要）
3. 测试功能：`npm start`
4. 重新构建：`npm run build:mac`

### 场景三：修改应用配置
1. 编辑 `package.json` 中的应用信息
2. 编辑 `main.js` 中的窗口配置
3. 重新构建：`npm run build:mac`

### 场景四：更新图标
1. 替换 `assets/` 目录中的图标文件
2. 重新构建：`npm run build:mac`

## 🔧 构建选项详解

### 开发模式
```bash
npm start
```
- 用于测试和调试
- 实时加载代码更改
- 显示开发者工具

### 构建特定平台
```bash
npm run build:mac    # macOS (.dmg, .zip)
npm run build:win    # Windows (.exe, .zip)
npm run build:linux  # Linux (.AppImage, .deb)
```

### 构建所有平台
```bash
npm run build
```
- 同时构建所有平台
- 需要较长时间
- 输出文件在 `dist/` 目录

## 📦 输出文件说明

### macOS
- `配对题生成器-1.0.0.dmg` - 安装包
- `配对题生成器-1.0.0-mac.zip` - 压缩包

### Windows
- `配对题生成器 Setup 1.0.0.exe` - 安装程序
- `配对题生成器-1.0.0-win.zip` - 便携版

### Linux
- `配对题生成器-1.0.0.AppImage` - 可执行文件
- `配对题生成器_1.0.0_amd64.deb` - Debian包

## 🚨 常见问题

### Q: 构建失败怎么办？
A: 检查以下几点：
1. 确保代码语法正确
2. 检查 `package.json` 配置
3. 清除缓存：`npm cache clean --force`
4. 重新安装依赖：`rm -rf node_modules && npm install`

### Q: 应用无法启动？
A: 尝试以下步骤：
1. 开发模式测试：`npm start`
2. 检查控制台错误信息
3. 确保所有依赖文件存在

### Q: 构建速度慢？
A: 优化建议：
1. 只构建需要的平台
2. 使用SSD硬盘
3. 确保网络连接稳定
4. 关闭不必要的程序

### Q: 如何增量更新？
A: 如果只修改了HTML/CSS/JS：
1. 直接运行 `npm run build:mac`
2. 不需要重新安装依赖
3. 构建速度会更快

## 🔄 自动化更新脚本

创建 `update.sh` 脚本：
```bash
#!/bin/bash
echo "🔄 开始更新构建..."
npm run build:mac
echo "✅ 更新完成！"
```

使用方法：
```bash
chmod +x update.sh
./update.sh
```

## 📋 更新检查清单

在重新构建前，请检查：

- [ ] 代码语法正确
- [ ] 功能测试通过
- [ ] 版本号已更新（如需要）
- [ ] 图标文件已更新（如需要）
- [ ] 应用信息已更新（如需要）

## 🎯 最佳实践

### 1. 版本管理
```bash
# 更新版本号
# 编辑 package.json 中的 "version" 字段
```

### 2. 测试流程
```bash
# 1. 开发模式测试
npm start

# 2. 构建测试
npm run build:mac

# 3. 安装测试
# 双击生成的 .dmg 文件测试安装
```

### 3. 备份策略
```bash
# 备份当前版本
cp -r dist dist_backup_$(date +%Y%m%d)
```

## 📞 获取帮助

如果遇到问题：
1. 查看构建日志
2. 检查 `INSTALL.md` 文件
3. 运行 `npm start` 进行调试
4. 检查网络连接

---

**提示**: 每次更新代码后，建议先在开发模式下测试，确认无误后再重新构建。 