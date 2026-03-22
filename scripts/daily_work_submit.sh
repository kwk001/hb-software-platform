#!/bin/bash
# 每日工作日报自动提交脚本
# 使用方法: ./daily_work_submit.sh "工作内容1|工作内容2|工作内容3"
# 
# 示例:
# ./daily_work_submit.sh "门户首页-合作伙伴模块优化|登录页面UI优化|消息中心页面优化"

set -e

# 获取当日日期
WORK_DATE=$(date +%Y-%m-%d)
PROJECT_NAME="湖北省电信-省经信工业申报平台"

# 检查参数
if [ $# -eq 0 ]; then
    echo "使用方法:"
    echo "  ./daily_work_submit.sh \"工作内容1|工作内容2|工作内容3\""
    echo ""
    echo "示例:"
    echo "  ./daily_work_submit.sh \"门户首页-合作伙伴模块优化|登录页面UI优化|消息中心页面优化\""
    echo ""
    echo "参数说明:"
    echo "  - 使用 | 分隔多个工作事项"
    echo "  - 每个工作事项会创建一个独立的任务"
    echo "  - 任务状态默认为: 已完成"
    echo "  - 实际开始/结束时间默认为: 当日 ($WORK_DATE)"
    exit 0
fi

# 解析工作内容
IFS='|' read -ra WORK_ITEMS <<< "$1"

echo "📅 工作日期: $WORK_DATE"
echo "📋 工作事项数: ${#WORK_ITEMS[@]}"
echo ""
echo "📝 工作内容列表:"
for i in "${!WORK_ITEMS[@]}"; do
    echo "  $((i+1)). ${WORK_ITEMS[$i]}"
done

echo ""
echo "🚀 开始提交到 Project Task..."
echo ""

# 提交每个工作事项
for item in "${WORK_ITEMS[@]}"; do
    item=$(echo "$item" | xargs)  # 去除前后空格
    if [ -z "$item" ]; then
        continue
    fi
    
    echo "⏳ 正在创建任务: $item"
    
    # 使用 Project Task MCP 创建任务
    # 注意: 此命令需要在支持 MCP 的环境中执行
    cat <<EOF | trae-mcp project-task create_task
{
  "taskName": "$item",
  "projectName": "$PROJECT_NAME",
  "taskType": "合同需求",
  "taskStage": "开发中",
  "priority": "一级",
  "estimatedDays": 1,
  "planStartTime": "$WORK_DATE",
  "planEndTime": "$WORK_DATE",
  "taskContent": "## $WORK_DATE 完成工作\\n\\n### $item\\n- 已完成相关开发工作\\n- 代码已提交\\n\\n**完成日期**: $WORK_DATE"
}
EOF
    
    echo "✅ 任务创建成功: $item"
    echo ""
done

echo "🎉 所有工作事项提交完成！"
echo "📊 总计提交: ${#WORK_ITEMS[@]} 个任务"
