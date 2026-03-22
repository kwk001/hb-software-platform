#!/usr/bin/env node
/**
 * 每日工作日报自动提交脚本
 * 使用方法: node daily_work_report.js "工作内容1|工作内容2|工作内容3"
 * 
 * 示例:
 * node daily_work_report.js "门户首页-合作伙伴模块优化|登录页面UI优化|消息中心页面优化"
 */

const WORK_DATE = new Date().toISOString().split('T')[0]; // 当日日期 YYYY-MM-DD
const PROJECT_NAME = "湖北省电信-省经信工业申报平台";
const TASK_TYPE = "合同需求";
const TASK_STAGE = "已完成";
const PRIORITY = "一级";
const ESTIMATED_DAYS = 1;

// 解析命令行参数
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log(`
使用方法:
  node daily_work_report.js "工作内容1|工作内容2|工作内容3"

示例:
  node daily_work_report.js "门户首页-合作伙伴模块优化|登录页面UI优化|消息中心页面优化"

参数说明:
  - 使用 | 分隔多个工作事项
  - 每个工作事项会创建一个独立的任务
  - 任务状态默认为: 已完成
  - 实际开始/结束时间默认为: 当日 (${WORK_DATE})
`);
  process.exit(0);
}

// 解析工作内容
const workItems = args[0].split('|').map(item => item.trim()).filter(item => item);

if (workItems.length === 0) {
  console.error('❌ 错误: 没有提供有效的工作内容');
  process.exit(1);
}

console.log(`📅 工作日期: ${WORK_DATE}`);
console.log(`📋 工作事项数: ${workItems.length}`);
console.log('\n📝 工作内容列表:');
workItems.forEach((item, index) => {
  console.log(`  ${index + 1}. ${item}`);
});

console.log('\n⚠️  提示: 此脚本需要 Project Task MCP 工具支持');
console.log('请在支持 MCP 的环境中运行此脚本。');
console.log('\n生成的任务配置:');
console.log(JSON.stringify({
  project: PROJECT_NAME,
  date: WORK_DATE,
  tasks: workItems.map(item => ({
    taskName: item,
    taskType: TASK_TYPE,
    taskStage: TASK_STAGE,
    priority: PRIORITY,
    estimatedDays: ESTIMATED_DAYS,
    planStartTime: WORK_DATE,
    planEndTime: WORK_DATE,
    taskContent: `## ${WORK_DATE} 完成工作\n\n### ${item}\n- 已完成相关开发工作\n- 代码已提交\n\n**完成日期**: ${WORK_DATE}`
  }))
}, null, 2));
