#!/bin/bash

# 配对题生成器 - 快速更新脚本

echo "🔄 配对题生成器 - 快速更新构建"
echo "================================"

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未找到Node.js，请先安装"
    exit 1
fi

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 检测操作系统
OS=$(uname -s)
echo "📱 检测到操作系统: $OS"

# 根据操作系统选择构建命令
case "$OS" in
    Darwin*)    # macOS
        echo "🍎 检测到macOS系统"
        echo "请选择构建架构:"
        echo "  a) 🍎 Intel (x64) + Apple Silicon (arm64) - 通用版本"
        echo "  b) 🖥️  Intel (x64) 版本"
        echo "  c) 🚀 Apple Silicon (arm64) 版本"
        echo ""
        read -p "请选择架构 (a/b/c): " arch_choice
        
        case $arch_choice in
            a)
                echo "🍎 构建通用版本 (Intel + Apple Silicon)..."
                npm run build:mac
                ;;
            b)
                echo "🖥️  构建Intel版本..."
                npm run build:mac:x64
                ;;
            c)
                echo "🚀 构建Apple Silicon版本..."
                npm run build:mac:arm64
                ;;
            *)
                echo "🍎 默认构建通用版本..."
                npm run build:mac
                ;;
        esac
        ;;
    Linux*)     # Linux
        echo "🐧 构建Linux应用..."
        npm run build:linux
        ;;
    MINGW*|MSYS*|CYGWIN*)  # Windows
        echo "🪟 构建Windows应用..."
        npm run build:win
        ;;
    *)
        echo "❓ 未知操作系统，构建所有平台..."
        npm run build
        ;;
esac

# 检查构建结果
if [ -d "dist" ]; then
    echo ""
    echo "✅ 构建完成！"
    echo "📁 输出文件:"
    ls -la dist/
    echo ""
    echo "🎉 更新完成！"
else
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi 