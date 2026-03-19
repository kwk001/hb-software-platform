#!/bin/bash

# 湖北省工业软件公共服务平台 - 启动脚本

echo "=================================="
echo "  湖北省工业软件公共服务平台"
echo "=================================="
echo ""

# 进入项目目录
cd "$(dirname "$0")/hb-software-platform"

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    npm install
    echo "✅ 依赖安装完成"
    echo ""
fi

# 启动开发服务器
echo "🚀 正在启动开发服务器..."
echo ""
npm run dev
