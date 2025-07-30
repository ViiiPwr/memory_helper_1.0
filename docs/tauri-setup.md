# Tauri 替代方案（更轻量级）

如果你想要更轻量级的桌面应用，可以考虑使用 Tauri。Tauri 比 Electron 更小、更快、更安全。

## 🚀 Tauri 优势

- ✅ **更小的应用体积** (通常 < 10MB vs Electron 的 100MB+)
- ✅ **更快的启动速度**
- ✅ **更好的安全性**
- ✅ **更少的资源占用**
- ✅ **原生性能**

## 📦 安装 Tauri

### 1. 安装 Rust
```bash
# macOS/Linux
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Windows
# 下载: https://rustup.rs/
```

### 2. 安装 Tauri CLI
```bash
cargo install tauri-cli
```

### 3. 创建 Tauri 项目
```bash
# 在现有HTML项目基础上添加Tauri
cargo tauri init
```

### 4. 配置 Tauri
编辑 `src-tauri/tauri.conf.json`：
```json
{
  "build": {
    "beforeDevCommand": "",
    "beforeBuildCommand": "",
    "devPath": ".",
    "distDir": "."
  },
  "tauri": {
    "allowlist": {
      "all": false
    },
    "bundle": {
      "active": true,
      "targets": "all",
      "identifier": "com.pairingcard.app",
      "icon": [
        "icons/32x32.png",
        "icons/128x128.png",
        "icons/128x128@2x.png",
        "icons/icon.icns",
        "icons/icon.ico"
      ]
    },
    "security": {
      "csp": null
    },
    "windows": [
      {
        "fullscreen": false,
        "resizable": true,
        "title": "配对题生成器",
        "width": 1200,
        "height": 800
      }
    ]
  }
}
```

### 5. 构建应用
```bash
# 开发模式
cargo tauri dev

# 构建发布版本
cargo tauri build
```

## 📋 系统要求

### Tauri 要求
- **Rust**: 1.70+
- **Node.js**: 16+ (可选)
- **系统依赖**:
  - **macOS**: Xcode Command Line Tools
  - **Windows**: Microsoft Visual Studio C++ Build Tools
  - **Linux**: build-essential, libwebkit2gtk-4.0-dev

### 安装系统依赖

#### macOS
```bash
xcode-select --install
```

#### Windows
```bash
# 安装 Visual Studio Build Tools
# 下载: https://visualstudio.microsoft.com/visual-cpp-build-tools/
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev
```

## 🔄 迁移指南

### 从 Electron 迁移到 Tauri

1. **保留现有HTML文件**
   - `index.html` 保持不变
   - `cloud-config.js` 保持不变
   - `cloud-db.js` 保持不变

2. **创建 Tauri 项目结构**
```bash
mkdir tauri-app
cd tauri-app
cargo tauri init
```

3. **复制HTML文件**
```bash
cp ../index.html .
cp ../cloud-config.js .
cp ../cloud-db.js .
```

4. **配置 Tauri**
编辑 `src-tauri/tauri.conf.json` 指向正确的文件。

5. **构建应用**
```bash
cargo tauri build
```

## 📊 对比表

| 特性 | Electron | Tauri |
|------|----------|-------|
| 应用大小 | 100MB+ | < 10MB |
| 启动速度 | 较慢 | 快 |
| 内存占用 | 高 | 低 |
| 安全性 | 中等 | 高 |
| 开发难度 | 简单 | 中等 |
| 生态系统 | 成熟 | 新兴 |

## 🎯 推荐方案

### 选择 Electron 如果你：
- 需要快速开发
- 团队熟悉 JavaScript
- 需要丰富的第三方库
- 不介意应用体积较大

### 选择 Tauri 如果你：
- 追求最佳性能
- 需要最小的应用体积
- 重视安全性
- 愿意学习 Rust

## 🚀 快速开始（推荐）

对于你的配对题生成器，我推荐先使用 **Electron**，因为：

1. **开发简单** - 只需要JavaScript知识
2. **生态成熟** - 大量现成的解决方案
3. **快速原型** - 可以快速验证想法
4. **易于维护** - 团队容易接手

如果后续需要优化性能或减小体积，再考虑迁移到 Tauri。

## 📞 获取帮助

- **Electron**: https://www.electronjs.org/
- **Tauri**: https://tauri.app/
- **Rust**: https://www.rust-lang.org/ 