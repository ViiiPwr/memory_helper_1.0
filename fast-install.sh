#!/bin/bash

# 配对题生成器 - 快速安装脚本（使用国内镜像）

echo "🚀 配对题生成器 - 快速安装（使用国内镜像）"
echo "=========================================="

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未找到Node.js，请先安装"
    exit 1
fi

echo "✅ Node.js版本: $(node --version)"
echo "✅ npm版本: $(npm --version)"

# 设置npm镜像为淘宝镜像（加速下载）
echo "🌐 设置npm镜像为淘宝镜像..."
npm config set registry https://registry.npmmirror.com
npm config set disturl https://npmmirror.com/dist
npm config set electron_mirror https://npmmirror.com/mirrors/electron/
npm config set electron_builder_binaries_mirror https://npmmirror.com/mirrors/electron-builder-binaries/

echo "📦 开始安装依赖（使用国内镜像加速）..."

# 清除缓存（可选）
read -p "是否清除npm缓存？(y/n): " clear_cache
if [ "$clear_cache" = "y" ]; then
    echo "🧹 清除npm缓存..."
    npm cache clean --force
fi

# 安装依赖
echo "📥 安装依赖包..."
npm install --verbose

# 检查安装结果
if [ -d "node_modules" ] && [ -f "node_modules/.package-lock.json" ]; then
    echo ""
    echo "✅ 依赖安装完成！"
    echo "📊 安装统计:"
    echo "  - 依赖包数量: $(ls node_modules | wc -l)"
    echo "  - 总大小: $(du -sh node_modules | cut -f1)"
    
    echo ""
    echo "🎉 安装成功！现在可以运行以下命令："
    echo "  npm start          - 开发模式"
    echo "  npm run build:mac  - 构建macOS应用"
    echo "  ./quick-start.sh   - 快速启动"
else
    echo "❌ 安装失败，请检查网络连接"
    exit 1
fi 