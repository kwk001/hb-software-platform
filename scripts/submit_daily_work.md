# 每日工作日报自动提交脚本使用说明

## 脚本功能
自动将每日工作内容提交到 Project Task 系统，支持：
- ✅ 自动设置任务状态为"已完成"
- ✅ 自动设置实际开始/结束时间为当日
- ✅ 批量创建多个工作事项
- ✅ 默认项目名称和任务类型

## 使用方法

### 方式一：使用 Node.js 脚本（推荐）

```bash
# 进入脚本目录
cd /Users/apple/Desktop/文件/kaiwu_jingxin/scripts

# 提交单个工作事项
node daily_work_report.js "门户首页-合作伙伴模块优化"

# 提交多个工作事项（使用 | 分隔）
node daily_work_report.js "门户首页-合作伙伴模块优化|登录页面UI优化|消息中心页面优化"
```

### 方式二：使用 Shell 脚本

```bash
# 赋予执行权限
chmod +x /Users/apple/Desktop/文件/kaiwu_jingxin/scripts/daily_work_submit.sh

# 进入脚本目录
cd /Users/apple/Desktop/文件/kaiwu_jingxin/scripts

# 提交工作事项
./daily_work_submit.sh "门户首页-合作伙伴模块优化|登录页面UI优化|消息中心页面优化"
```

### 方式三：使用 Trae MCP 命令（当前环境）

直接在 Trae 中输入：

```
提交今日工作: 门户首页-合作伙伴模块优化|登录页面UI优化|消息中心页面优化
```

## 参数说明

| 参数 | 说明 | 默认值 |
|-----|------|--------|
| 工作内容 | 使用 `\|` 分隔多个工作事项 | 必填 |
| 任务状态 | 自动设置为"已完成" | 已完成 |
| 实际开始时间 | 自动设置为当日 | 当日 |
| 实际结束时间 | 自动设置为当日 | 当日 |
| 项目名称 | 湖北省电信-省经信工业申报平台 | 固定 |
| 任务类型 | 合同需求 | 固定 |
| 优先级 | 一级 | 固定 |

## 示例

### 示例 1：提交单个工作事项
```bash
node daily_work_report.js "门户首页-合作伙伴模块重新设计"
```

### 示例 2：提交多个工作事项
```bash
node daily_work_report.js "门户首页-合作伙伴模块优化|产品网格布局优化|政策列表优化|标签样式优化|Hero区域垂直居中|行业解决方案优化|最新政策优化|登录页面优化|注册页面优化|消息模板优化|消息发送优化|发送记录优化|企业审核优化|需求汇总优化|申报补贴优化"
```

### 示例 3：在 Trae 中使用
直接在对话中输入：
```
提交今日工作: 门户首页-合作伙伴模块优化|登录页面UI优化
```

## 注意事项

1. **MCP 环境**: 脚本需要在支持 MCP 的环境中运行（如 Trae IDE）
2. **登录状态**: 确保 Project Task MCP 已登录
3. **日期格式**: 自动使用当日日期（YYYY-MM-DD）
4. **任务名称**: 建议简洁明了，包含模块名和工作内容

## 脚本位置

- Node.js 脚本: `/Users/apple/Desktop/文件/kaiwu_jingxin/scripts/daily_work_report.js`
- Shell 脚本: `/Users/apple/Desktop/文件/kaiwu_jingxin/scripts/daily_work_submit.sh`
- 使用说明: `/Users/apple/Desktop/文件/kaiwu_jingxin/scripts/submit_daily_work.md`
