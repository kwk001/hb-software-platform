#!/bin/bash

# Git 推送脚本
# 使用方法: ./git-push.sh "提交信息"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查是否在 git 仓库中
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}错误: 当前目录不是 Git 仓库${NC}"
    exit 1
fi

# 获取当前分支
BRANCH=$(git symbolic-ref --short HEAD)
echo -e "${BLUE}当前分支: $BRANCH${NC}"

# 检查是否有提交信息
if [ -z "$1" ]; then
    # 如果没有提供提交信息，使用默认信息
    COMMIT_MSG="更新代码 $(date '+%Y-%m-%d %H:%M:%S')"
    echo -e "${YELLOW}未提供提交信息，使用默认: $COMMIT_MSG${NC}"
else
    COMMIT_MSG="$1"
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Git 推送流程${NC}"
echo -e "${BLUE}========================================${NC}"

# 1. 检查远程仓库
echo -e "\n${YELLOW}【1/5】检查远程仓库...${NC}"
git remote -v

# 2. 查看当前状态
echo -e "\n${YELLOW}【2/5】查看当前状态...${NC}"
git status

# 3. 添加所有更改
echo -e "\n${YELLOW}【3/5】添加所有更改...${NC}"
git add -A
if [ $? -ne 0 ]; then
    echo -e "${RED}添加文件失败${NC}"
    exit 1
fi

# 检查是否有要提交的更改
if git diff --cached --quiet; then
    echo -e "${YELLOW}没有要提交的更改${NC}"
    exit 0
fi

# 4. 提交更改
echo -e "\n${YELLOW}【4/5】提交更改...${NC}"
echo -e "提交信息: ${GREEN}$COMMIT_MSG${NC}"
git commit -m "$COMMIT_MSG"
if [ $? -ne 0 ]; then
    echo -e "${RED}提交失败${NC}"
    exit 1
fi

# 5. 推送到远程
echo -e "\n${YELLOW}【5/5】推送到远程仓库...${NC}"
git push origin $BRANCH
if [ $? -ne 0 ]; then
    echo -e "${RED}推送失败${NC}"
    exit 1
fi

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  推送成功!${NC}"
echo -e "${GREEN}========================================${NC}"

# 显示提交信息
echo -e "\n${BLUE}最新提交:${NC}"
git log -1 --oneline --decorate
