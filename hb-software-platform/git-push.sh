#!/bin/bash

# Git 自动推送脚本
# 使用方法: ./git-push.sh "提交信息"

# 设置颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 获取提交信息
if [ -z "$1" ]; then
    COMMIT_MSG="update: $(date '+%Y-%m-%d %H:%M:%S')"
    echo -e "${YELLOW}未提供提交信息，使用默认提交信息: $COMMIT_MSG${NC}"
else
    COMMIT_MSG="$1"
fi

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}      Git 自动推送脚本${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 检查是否在 git 仓库中
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}错误: 当前目录不是 Git 仓库${NC}"
    exit 1
fi

# 显示当前分支
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${GREEN}当前分支: $CURRENT_BRANCH${NC}"
echo ""

# 检查远程仓库
echo -e "${YELLOW}检查远程仓库...${NC}"
REMOTE_COUNT=$(git remote | wc -l)
if [ "$REMOTE_COUNT" -eq 0 ]; then
    echo -e "${RED}错误: 没有配置远程仓库${NC}"
    exit 1
fi

echo -e "${GREEN}远程仓库:${NC}"
git remote -v
echo ""

# 获取默认远程和分支
DEFAULT_REMOTE="origin"
echo -e "${GREEN}默认推送至: $DEFAULT_REMOTE/$CURRENT_BRANCH${NC}"
echo ""

# 检查文件更改
echo -e "${YELLOW}检查文件更改...${NC}"
git status --short

# 如果没有更改，提示并退出
if [ -z "$(git status --short)" ]; then
    echo -e "${GREEN}没有需要提交的更改${NC}"
    exit 0
fi

echo ""

# 确认推送
read -p "是否继续推送? (y/n): " CONFIRM
if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
    echo -e "${YELLOW}已取消推送${NC}"
    exit 0
fi

echo ""
echo -e "${YELLOW}开始执行 Git 操作...${NC}"
echo ""

# 添加所有更改
echo -e "${GREEN}1. 添加更改...${NC}"
git add .
if [ $? -ne 0 ]; then
    echo -e "${RED}错误: git add 失败${NC}"
    exit 1
fi
echo -e "${GREEN}   ✓ 更改已添加${NC}"
echo ""

# 提交更改
echo -e "${GREEN}2. 提交更改...${NC}"
echo -e "${GREEN}   提交信息: $COMMIT_MSG${NC}"
git commit -m "$COMMIT_MSG"
if [ $? -ne 0 ]; then
    echo -e "${RED}错误: git commit 失败${NC}"
    exit 1
fi
echo -e "${GREEN}   ✓ 提交成功${NC}"
echo ""

# 拉取最新代码（避免冲突）
echo -e "${GREEN}3. 拉取远程最新代码...${NC}"
git pull $DEFAULT_REMOTE $CURRENT_BRANCH
if [ $? -ne 0 ]; then
    echo -e "${RED}错误: git pull 失败，可能存在冲突${NC}"
    echo -e "${YELLOW}请手动解决冲突后再推送${NC}"
    exit 1
fi
echo -e "${GREEN}   ✓ 代码已更新${NC}"
echo ""

# 推送到远程
echo -e "${GREEN}4. 推送到远程仓库...${NC}"
git push $DEFAULT_REMOTE $CURRENT_BRANCH
if [ $? -ne 0 ]; then
    echo -e "${RED}错误: git push 失败${NC}"
    exit 1
fi
echo -e "${GREEN}   ✓ 推送成功${NC}"
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}      推送完成!${NC}"
echo -e "${GREEN}========================================${NC}"
