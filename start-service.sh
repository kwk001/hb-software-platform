#!/bin/bash

# 工业软件公共服务平台 - 启动脚本
# 用于快速启动前端开发服务

echo "======================================"
echo "  工业软件公共服务平台 - 启动服务"
echo "======================================"
echo ""

# 进入项目目录
cd "$(dirname "$0")/hb-software-platform"

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo "⚠️  未找到 node_modules，正在安装依赖..."
    echo ""
    npm install
    echo ""
fi

# 启动开发服务
echo "🚀 正在启动开发服务..."
echo ""
echo "服务启动后，请访问: http://localhost:5173"
echo ""
npm run dev
