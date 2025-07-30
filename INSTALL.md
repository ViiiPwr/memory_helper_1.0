# 配对题生成器 - 安装指南

## 🎯 目标
将HTML网站快速封装成桌面应用（支持macOS、Windows、Linux）

## 📋 前置要求

### 1. 安装Node.js

#### macOS (推荐使用Homebrew)
```bash
# 安装Homebrew (如果还没有)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装Node.js
brew install node

# 验证安装
node --version
npm --version
```

#### Windows
1. 访问 https://nodejs.org/
2. 下载并安装LTS版本
3. 重启命令行工具
4. 验证安装：
```cmd
node --version
npm --version
```

#### Linux (Ubuntu/Debian)
```bash
# 使用NodeSource仓库
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node --version
npm --version
```

### 2. 安装Git (可选)
```bash
# macOS
brew install git

# Windows
# 下载: https://git-scm.com/download/win

# Linux
sudo apt-get install git
```

## 🚀 快速构建

### 方法一：一键构建脚本
```bash
# 给脚本执行权限
chmod +x build-app.sh

# 运行构建脚本
./build-app.sh
```

### 方法二：手动构建
```bash
# 1. 安装依赖
npm install

# 2. 开发模式测试
npm start

# 3. 构建应用
npm run build:mac    # macOS
npm run build:win    # Windows  
npm run build:linux  # Linux
```

## 📦 构建输出

构建完成后，应用文件将保存在 `dist/` 目录：

### macOS
- `配对题生成器-1.0.0.dmg` - 安装包
- `配对题生成器-1.0.0-mac.zip` - 压缩包

### Windows
- `配对题生成器 Setup 1.0.0.exe` - 安装程序
- `配对题生成器-1.0.0-win.zip` - 便携版

### Linux
- `配对题生成器-1.0.0.AppImage` - 可执行文件
- `配对题生成器_1.0.0_amd64.deb` - Debian包

## 🔧 故障排除

### 常见问题

#### Q: npm命令未找到
A: 确保Node.js正确安装：
```bash
# 检查Node.js
node --version

# 检查npm
npm --version

# 如果npm未找到，重新安装Node.js
```

#### Q: 构建失败 - 网络问题
A: 设置npm镜像：
```bash
# 使用淘宝镜像
npm config set registry https://registry.npmmirror.com

# 或者使用cnpm
npm install -g cnpm --registry=https://registry.npmmirror.com
cnpm install
```

#### Q: 构建失败 - 权限问题
A: 检查文件权限：
```bash
# 确保脚本可执行
chmod +x build-app.sh

# 检查目录权限
ls -la
```

#### Q: 应用无法启动
A: 检查依赖：
```bash
# 重新安装依赖
rm -rf node_modules package-lock.json
npm install

# 清除缓存
npm cache clean --force
```

### 调试模式

#### 开发模式运行
```bash
npm start
```

#### 查看详细日志
```bash
# 构建时显示详细日志
npm run build:mac --verbose
```

#### 检查Electron版本
```bash
npx electron --version
```

## 🎨 自定义应用

### 修改应用图标
1. 准备图标文件：
   - `assets/icon.png` (512x512)
   - `assets/icon.icns` (macOS)
   - `assets/icon.ico` (Windows)

2. 重新构建：
```bash
npm run build:mac
```

### 修改应用信息
编辑 `package.json`：
```json
{
  "name": "你的应用名称",
  "version": "1.0.0",
  "description": "应用描述",
  "author": "作者信息"
}
```

### 修改窗口设置
编辑 `main.js`：
```javascript
mainWindow = new BrowserWindow({
  width: 1200,        // 窗口宽度
  height: 800,        // 窗口高度
  minWidth: 800,      // 最小宽度
  minHeight: 600,     // 最小高度
  // ... 其他配置
});
```

## 📱 分发应用

### macOS
- `.dmg` 文件可以直接分发给其他macOS用户
- 支持Intel和Apple Silicon芯片

### Windows
- `.exe` 安装程序适合大多数用户
- `.zip` 便携版适合高级用户

### Linux
- `.AppImage` 文件在大多数Linux发行版上可直接运行
- `.deb` 包适合Ubuntu/Debian用户

## 🔄 更新应用

### 版本更新
1. 修改 `package.json` 中的版本号
2. 更新应用代码
3. 重新构建：
```bash
npm run build:mac
```

### 自动更新 (可选)
添加自动更新功能：
```bash
npm install electron-updater
```

然后在 `main.js` 中配置更新逻辑。

## 📞 获取帮助

如果遇到问题：

1. 检查Node.js版本是否 >= 16
2. 确保网络连接正常
3. 查看构建日志获取错误信息
4. 尝试清除缓存重新安装

## 🎉 完成！

构建成功后，你就可以：
- 在macOS上获得原生应用体验
- 在Windows上获得.exe安装程序
- 在Linux上获得AppImage可执行文件

所有平台的应用都包含完整的功能，包括配对题生成、历史记录、标签系统等。 