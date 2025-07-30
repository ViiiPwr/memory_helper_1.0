#!/bin/bash

# 配对题生成器 - Windows应用构建脚本
# 支持构建Windows安装包和便携版

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# 打印标题
print_title() {
    echo "=================================="
    print_message $BLUE "🎯 配对题生成器 - Windows构建工具"
    echo "=================================="
}

# 检查环境
check_environment() {
    print_message $YELLOW "🔍 检查构建环境..."
    
    # 检查Node.js
    if ! command -v node &> /dev/null; then
        print_message $RED "❌ Node.js未安装，请先安装Node.js"
        exit 1
    fi
    
    # 检查npm
    if ! command -v npm &> /dev/null; then
        print_message $RED "❌ npm未安装，请先安装npm"
        exit 1
    fi
    
    # 检查electron-builder
    if ! npx electron-builder --version &> /dev/null; then
        print_message $YELLOW "⚠️  electron-builder未安装，正在安装..."
        npm install --save-dev electron-builder
    fi
    
    print_message $GREEN "✅ 环境检查完成"
}

# 安装依赖
install_dependencies() {
    print_message $YELLOW "📦 安装项目依赖..."
    
    if [ ! -d "node_modules" ]; then
        npm install
        print_message $GREEN "✅ 依赖安装完成"
    else
        print_message $GREEN "✅ 依赖已存在"
    fi
}

# 显示构建选项菜单
show_build_menu() {
    echo ""
    print_message $BLUE "请选择构建类型："
    echo "1. 🏠 构建Windows安装包 (NSIS)"
    echo "2. 📦 构建便携版 (Portable)"
    echo "3. 🔧 构建所有Windows版本"
    echo "4. 🎯 构建特定架构 (x64)"
    echo "5. 📋 查看构建配置"
    echo "6. 🧹 清理构建文件"
    echo "7. 🚪 退出"
    echo ""
}

# 构建Windows安装包
build_nsis() {
    print_message $YELLOW "🏠 构建Windows安装包..."
    
    # 设置Electron镜像
    export ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
    
    npx electron-builder --win --x64 --target nsis
    
    print_message $GREEN "✅ Windows安装包构建完成"
    print_message $BLUE "📁 输出文件位置: dist/"
}

# 构建便携版
build_portable() {
    print_message $YELLOW "📦 构建Windows便携版..."
    
    # 设置Electron镜像
    export ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
    
    npx electron-builder --win --x64 --target portable
    
    print_message $GREEN "✅ Windows便携版构建完成"
    print_message $BLUE "📁 输出文件位置: dist/"
}

# 构建所有Windows版本
build_all_windows() {
    print_message $YELLOW "🔧 构建所有Windows版本..."
    
    # 设置Electron镜像
    export ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
    
    npx electron-builder --win --x64
    
    print_message $GREEN "✅ 所有Windows版本构建完成"
    print_message $BLUE "📁 输出文件位置: dist/"
}

# 构建特定架构
build_specific_arch() {
    print_message $YELLOW "🎯 构建特定架构..."
    
    echo "请选择架构："
    echo "1. x64 (64位)"
    echo "2. ia32 (32位)"
    echo "3. armv7l (ARM)"
    echo "4. arm64 (ARM64)"
    read -p "请输入选项 (1-4): " arch_choice
    
    case $arch_choice in
        1) arch="x64" ;;
        2) arch="ia32" ;;
        3) arch="armv7l" ;;
        4) arch="arm64" ;;
        *) 
            print_message $RED "❌ 无效选项"
            return 1
            ;;
    esac
    
    # 设置Electron镜像
    export ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
    
    npx electron-builder --win --$arch
    
    print_message $GREEN "✅ Windows $arch 版本构建完成"
    print_message $BLUE "📁 输出文件位置: dist/"
}

# 显示构建配置
show_build_config() {
    print_message $BLUE "📋 当前构建配置："
    echo ""
    cat package.json | grep -A 20 '"build"' || echo "未找到构建配置"
    echo ""
}

# 清理构建文件
clean_build() {
    print_message $YELLOW "🧹 清理构建文件..."
    
    if [ -d "dist" ]; then
        rm -rf dist
        print_message $GREEN "✅ 构建文件已清理"
    else
        print_message $GREEN "✅ 没有构建文件需要清理"
    fi
}

# 显示构建结果
show_build_results() {
    if [ -d "dist" ]; then
        print_message $BLUE "📁 构建结果："
        ls -la dist/
        echo ""
        
        # 显示文件大小
        print_message $BLUE "📊 文件大小："
        du -h dist/* 2>/dev/null || echo "无法获取文件大小信息"
    else
        print_message $YELLOW "⚠️  没有找到构建输出目录"
    fi
}

# 主函数
main() {
    print_title
    
    # 检查环境
    check_environment
    
    # 安装依赖
    install_dependencies
    
    while true; do
        show_build_menu
        read -p "请输入选项 (1-7): " choice
        
        case $choice in
            1)
                build_nsis
                show_build_results
                ;;
            2)
                build_portable
                show_build_results
                ;;
            3)
                build_all_windows
                show_build_results
                ;;
            4)
                build_specific_arch
                show_build_results
                ;;
            5)
                show_build_config
                ;;
            6)
                clean_build
                ;;
            7)
                print_message $GREEN "👋 再见！"
                exit 0
                ;;
            *)
                print_message $RED "❌ 无效选项，请重新选择"
                ;;
        esac
        
        echo ""
        read -p "按回车键继续..."
    done
}

# 错误处理
trap 'print_message $RED "\n❌ 构建过程中出现错误，请检查日志"; exit 1' ERR

# 运行主函数
main "$@" 