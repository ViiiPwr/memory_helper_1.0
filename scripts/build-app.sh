#!/bin/bash

# 配对题生成器桌面应用构建脚本

echo "🚀 开始构建配对题生成器桌面应用..."

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到Node.js，请先安装Node.js"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未找到npm，请先安装npm"
    exit 1
fi

echo "✅ Node.js版本: $(node --version)"
echo "✅ npm版本: $(npm --version)"

# 安装依赖
echo "📦 安装依赖..."
npm install

# 创建简单的图标文件（如果不存在）
if [ ! -f "assets/icon.png" ]; then
    echo "🎨 创建默认图标..."
    # 创建一个简单的SVG图标
    cat > assets/icon.svg << 'EOF'
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#3498db" rx="80"/>
  <circle cx="256" cy="200" r="60" fill="white" opacity="0.9"/>
  <circle cx="180" cy="320" r="50" fill="white" opacity="0.8"/>
  <circle cx="332" cy="320" r="50" fill="white" opacity="0.8"/>
  <path d="M 200 180 L 312 180 M 200 220 L 312 220 M 200 260 L 312 260" stroke="white" stroke-width="8" stroke-linecap="round"/>
  <path d="M 140 300 L 220 300 M 140 340 L 220 340" stroke="white" stroke-width="8" stroke-linecap="round"/>
  <path d="M 292 300 L 372 300 M 292 340 L 372 340" stroke="white" stroke-width="8" stroke-linecap="round"/>
</svg>
EOF

    # 如果有ImageMagick，转换为PNG
    if command -v convert &> /dev/null; then
        convert assets/icon.svg assets/icon.png
        echo "✅ 图标已创建"
    else
        echo "⚠️  未找到ImageMagick，请手动创建assets/icon.png文件"
        echo "或者安装ImageMagick: brew install imagemagick (macOS)"
    fi
fi

# 检测操作系统
OS=$(uname -s)
case "$OS" in
    Darwin*)    # macOS
        echo "🍎 检测到macOS系统"
        echo "🔨 构建macOS应用..."
        npm run build:mac
        ;;
    Linux*)     # Linux
        echo "🐧 检测到Linux系统"
        echo "🔨 构建Linux应用..."
        npm run build:linux
        ;;
    MINGW*|MSYS*|CYGWIN*)  # Windows
        echo "🪟 检测到Windows系统"
        echo "🔨 构建Windows应用..."
        npm run build:win
        ;;
    *)
        echo "❓ 未知操作系统: $OS"
        echo "🔨 构建通用应用..."
        npm run build
        ;;
esac

echo "✅ 构建完成！"
echo "📁 输出文件位于 dist/ 目录"

# 显示构建结果
if [ -d "dist" ]; then
    echo "📋 构建结果:"
    ls -la dist/
fi

echo "🎉 构建脚本执行完成！" 