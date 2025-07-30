#!/bin/bash

# 配对题生成器 - 快速启动脚本

echo "🎯 配对题生成器桌面应用快速启动"
echo "=================================="

# 检查操作系统
OS=$(uname -s)
echo "📱 检测到操作系统: $OS"

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未找到Node.js"
    echo ""
    echo "请先安装Node.js:"
    echo ""
    case "$OS" in
        Darwin*)
            echo "macOS安装命令:"
            echo "brew install node"
            echo ""
            echo "或者访问: https://nodejs.org/"
            ;;
        Linux*)
            echo "Linux安装命令:"
            echo "curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -"
            echo "sudo apt-get install -y nodejs"
            ;;
        MINGW*|MSYS*|CYGWIN*)
            echo "Windows: 请访问 https://nodejs.org/ 下载安装"
            ;;
    esac
    exit 1
fi

echo "✅ Node.js版本: $(node --version)"
echo "✅ npm版本: $(npm --version)"

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，正在安装依赖..."
    npm install
else
    echo "✅ 依赖已安装"
fi

# 显示选项菜单
echo ""
echo "请选择操作:"
echo "1. 🚀 开发模式运行 (测试应用)"
echo "2. 🔨 构建桌面应用"
echo "3. 📦 构建macOS应用"
echo "4. 🪟 构建Windows应用"
echo "5. 🐧 构建Linux应用"
echo "6. ❓ 查看帮助"
echo "7. 🚪 退出"
echo ""

read -p "请输入选项 (1-7): " choice

case $choice in
    1)
        echo "🚀 启动开发模式..."
        npm start
        ;;
    2)
        echo "🔨 构建所有平台应用..."
        npm run build
        ;;
    3)
        echo "📦 构建macOS应用..."
        echo "请选择架构:"
        echo "  a) 🍎 Intel (x64) + Apple Silicon (arm64) - 通用版本"
        echo "  b) 🖥️  Intel (x64) 版本"
        echo "  c) 🚀 Apple Silicon (arm64) 版本"
        echo "  d) 🔙 返回主菜单"
        echo ""
        read -p "请选择架构 (a/b/c/d): " arch_choice
        
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
            d)
                echo "🔙 返回主菜单..."
                ./quick-start.sh
                ;;
            *)
                echo "❌ 无效选项，返回主菜单"
                ./quick-start.sh
                ;;
        esac
        ;;
    6)
        echo ""
        echo "📖 帮助信息:"
        echo "============="
        echo ""
        echo "🔧 开发模式:"
        echo "   npm start          - 启动开发模式"
        echo ""
        echo "🔨 构建应用:"
        echo "   npm run build      - 构建所有平台"
        echo "   npm run build:mac  - 构建macOS应用"
        echo "   npm run build:win  - 构建Windows应用"
        echo "   npm run build:linux - 构建Linux应用"
        echo ""
        echo "📁 输出文件:"
        echo "   构建完成后，应用文件将保存在 dist/ 目录"
        echo ""
        echo "🔧 故障排除:"
        echo "   如果遇到问题，请查看 INSTALL.md 文件"
        echo ""
        echo "📞 更多帮助:"
        echo "   - README-Desktop.md - 详细使用说明"
        echo "   - INSTALL.md        - 安装指南"
        echo "   - tauri-setup.md    - Tauri替代方案"
        ;;
    7)
        echo "👋 再见！"
        exit 0
        ;;
    *)
        echo "❌ 无效选项，请重新运行脚本"
        exit 1
        ;;
esac

echo ""
echo "✅ 操作完成！" 