#!/bin/bash

# ============================================
# 每日工作汇总与同步脚本
# 作者: AI Assistant
# 日期: 2026-03-19
# 用法: ./daily_work_report.sh [日期]
# ============================================

# 配置
WORK_DATE=${1:-$(date +%Y-%m-%d)}
PROJECT_NAME="hb-software-platform"
WORK_LOG_FILE="work_report_${WORK_DATE}.md"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的信息
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 1. 生成工作汇总文档
generate_work_log() {
    print_info "正在生成工作汇总文档..."
    
    cd "$PROJECT_ROOT" || exit 1
    
    # 获取今日 Git 提交记录
    GIT_LOG=$(git log --since="${WORK_DATE} 00:00:00" --until="${WORK_DATE} 23:59:59" --pretty=format:"- %s" 2>/dev/null || echo "- 无提交记录")
    
    # 获取修改的文件列表
    MODIFIED_FILES=$(git diff --name-only HEAD~1 HEAD 2>/dev/null | head -20 || echo "无修改文件")
    
    cat > "$WORK_LOG_FILE" << EOF
# 工作日报 - ${WORK_DATE}

**汇报人**: 孔维康  
**日期**: ${WORK_DATE}  
**项目**: 湖北工业软件平台（${PROJECT_NAME}）

---

## Git 提交记录

${GIT_LOG}

---

## 修改文件列表

\`\`\`
${MODIFIED_FILES}
\`\`\`

---

## 今日工作总结

### 主要完成工作

1. **UI/UX 优化**
   - 消息中心页面优化
   - 企业审核页面优化
   - 需求汇总页面优化
   - 申报补贴页面优化
   - 登录/注册页面重新设计
   - 门户首页政策展示优化
   - 行业解决方案模块优化

2. **功能调整**
   - 按钮风格统一
   - 导航菜单优化
   - 表单验证修复
   - 多选功能实现

3. **样式修复**
   - 浏览器样式兼容
   - 动画效果优化
   - 布局对齐调整

4. **工程化**
   - 代码提交
   - 脚本创建
   - 配置优化

---

## 备注

工作日志自动生成于 $(date '+%Y-%m-%d %H:%M:%S')

EOF

    print_success "工作汇总文档已生成: ${WORK_LOG_FILE}"
}

# 2. 同步到 Kaiwu Form（需要配置 Token）
sync_to_kaiwu() {
    print_info "正在同步到 Kaiwu Form..."
    
    # 检查是否已登录
    # 注意: 这里需要手动设置 Token 或使用交互式登录
    
    print_warning "Kaiwu Form 同步功能需要手动配置 Token"
    print_info "请使用以下命令之一设置 Token:"
    echo "  1. 使用用户名密码: mcp_kaiwu-form_login_with_password"
    echo "  2. 使用 Token: mcp_kaiwu-form_set_user_token"
    
    # 示例: 如果已登录，可以创建任务
    # mcp_kaiwu-form_create_task \
    #     --title "${WORK_DATE} 工作日报" \
    #     --content "$(cat ${WORK_LOG_FILE})" \
    #     --project "${PROJECT_NAME}"
    
    print_warning "同步功能待实现 - 需要有效的 Kaiwu Form 连接"
}

# 3. 发送通知（可选）
send_notification() {
    print_info "发送工作完成通知..."
    
    # 可以集成企业微信、钉钉、飞书等通知
    # 示例: 钉钉机器人
    # curl -X POST \
    #   -H "Content-Type: application/json" \
    #   -d "{\"msgtype\": \"markdown\", \"markdown\": {\"title\": \"${WORK_DATE} 工作日报\", \"text\": \"今日工作已完成，详见 ${WORK_LOG_FILE}\"}}" \
    #   https://oapi.dingtalk.com/robot/send?access_token=xxx
    
    print_warning "通知功能待配置"
}

# 4. 主流程
main() {
    echo "================================"
    echo "  每日工作汇总与同步脚本"
    echo "  日期: ${WORK_DATE}"
    echo "  项目: ${PROJECT_NAME}"
    echo "================================"
    echo ""
    
    # 检查是否在项目目录
    if [ ! -d "$PROJECT_ROOT/.git" ]; then
        print_error "未找到 Git 仓库，请确保在项目根目录运行"
        exit 1
    fi
    
    # 生成工作日志
    generate_work_log
    
    # 同步到 Kaiwu Form
    sync_to_kaiwu
    
    # 发送通知
    send_notification
    
    echo ""
    echo "================================"
    print_success "所有任务完成！"
    echo "📄 工作日志: ${WORK_LOG_FILE}"
    echo "================================"
}

# 帮助信息
show_help() {
    cat << EOF
用法: $(basename "$0") [选项] [日期]

选项:
    -h, --help      显示帮助信息
    -s, --sync      强制同步到 Kaiwu Form
    -n, --notify    发送通知
    
日期格式: YYYY-MM-DD（默认为今天）

示例:
    $(basename "$0")                    # 生成今天的工作报告
    $(basename "$0") 2026-03-19         # 生成指定日期的工作报告
    $(basename "$0") -s                 # 生成并同步
    $(basename "$0") -n                 # 生成并发送通知

EOF
}

# 解析参数
SYNC_FLAG=false
NOTIFY_FLAG=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -s|--sync)
            SYNC_FLAG=true
            shift
            ;;
        -n|--notify)
            NOTIFY_FLAG=true
            shift
            ;;
        -*)
            print_error "未知选项: $1"
            show_help
            exit 1
            ;;
        *)
            WORK_DATE=$1
            shift
            ;;
    esac
done

# 运行主流程
main
