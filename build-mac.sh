#!/bin/bash

# 配对题生成器 - macOS构建脚本

echo "🍎 配对题生成器 - macOS构建工具"
echo "================================"

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未找到Node.js，请先安装"
    exit 1
fi

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 依赖未安装，正在安装..."
    npm install
fi

# 设置Electron镜像
export ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/

echo ""
echo "请选择构建类型:"
echo "1. 🍎 通用版本 (Intel + Apple Silicon) - 推荐"
echo "2. 🖥️  Intel (x64) 版本"
echo "3. 🚀 Apple Silicon (arm64) 版本"
echo "4. 📦 仅构建DMG安装包"
echo "5. 📦 仅构建ZIP压缩包"
echo "6. 🔙 返回"
echo ""

read -p "请选择 (1-6): " choice

case $choice in
    1)
        echo "🍎 构建通用版本 (Intel + Apple Silicon)..."
        echo "⏳ 这可能需要几分钟时间..."
        npm run build:mac
        ;;
    2)
        echo "🖥️  构建Intel版本..."
        echo "⏳ 这可能需要几分钟时间..."
        npm run build:mac:x64
        ;;
    3)
        echo "🚀 构建Apple Silicon版本..."
        echo "⏳ 这可能需要几分钟时间..."
        npm run build:mac:arm64
        ;;
    4)
        echo "📦 构建DMG安装包..."
        echo "⏳ 这可能需要几分钟时间..."
        npx electron-builder --mac --target dmg
        ;;
    5)
        echo "📦 构建ZIP压缩包..."
        echo "⏳ 这可能需要几分钟时间..."
        npx electron-builder --mac --target zip
        ;;
    6)
        echo "🔙 返回..."
        exit 0
        ;;
    *)
        echo "❌ 无效选项"
        exit 1
        ;;
esac

# 检查构建结果
if [ -d "dist" ]; then
    echo ""
    echo "✅ 构建完成！"
    echo "📁 输出文件:"
    ls -la dist/
    
    echo ""
    echo "📊 文件信息:"
    for file in dist/*; do
        if [ -f "$file" ]; then
            size=$(du -h "$file" | cut -f1)
            echo "  📄 $(basename "$file") - $size"
        fi
    done
    
    echo ""
    echo "🎉 构建成功！"
    echo "💡 提示:"
    echo "  - .dmg 文件可以直接安装"
    echo "  - .zip 文件可以解压后直接运行"
    echo "  - 通用版本支持Intel和Apple Silicon芯片"
else
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi 