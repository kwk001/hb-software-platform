#!/usr/bin/env node

/**
 * Kaiwu Form 自动填写脚本
 * 使用 Playwright 自动填写工作日报表单
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  formUrl: 'https://app.kaiwu.cloud/portal/application/data/e3830be75cd87d26bf229f4cf9d364f5/form/t68d8e0c03923770007cf3212?pane=tododata',
  workReportPath: path.join(__dirname, '..', 'work_report_2026-03-19.md'),
  headless: false, // 设置为 true 可以隐藏浏览器窗口
  slowMo: 100, // 操作延迟，便于观察
};

// 读取工作日报内容
function readWorkReport() {
  try {
    const content = fs.readFileSync(CONFIG.workReportPath, 'utf-8');
    return content;
  } catch (error) {
    console.error('❌ 无法读取工作日报文件:', error.message);
    process.exit(1);
  }
}

// 主函数
async function main() {
  console.log('🚀 启动 Kaiwu Form 自动填写...\n');
  
  const workReportContent = readWorkReport();
  console.log('✅ 已读取工作日报内容');
  console.log(`📄 文件路径: ${CONFIG.workReportPath}`);
  console.log(`📝 内容长度: ${workReportContent.length} 字符\n`);
  
  // 启动浏览器
  console.log('🌐 正在启动浏览器...');
  const browser = await chromium.launch({
    headless: CONFIG.headless,
    slowMo: CONFIG.slowMo,
  });
  
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  
  const page = await context.newPage();
  
  try {
    // 打开表单页面
    console.log('📍 正在打开表单页面...');
    await page.goto(CONFIG.formUrl, { waitUntil: 'networkidle' });
    
    // 等待页面加载
    await page.waitForTimeout(3000);
    
    // 截图查看当前页面状态
    await page.screenshot({ path: 'kaiwu_form_initial.png', fullPage: true });
    console.log('📸 已保存初始页面截图: kaiwu_form_initial.png\n');
    
    // 检查是否需要登录
    const loginButton = await page.$('text=登录');
    if (loginButton) {
      console.log('⚠️  检测到需要登录，请手动登录后继续...');
      console.log('⏳ 等待 60 秒用于手动登录...');
      await page.waitForTimeout(60000);
    }
    
    // 分析表单结构
    console.log('🔍 正在分析表单结构...');
    const formFields = await page.$$eval('input, textarea, select', fields => {
      return fields.map(field => ({
        tag: field.tagName.toLowerCase(),
        type: field.type,
        name: field.name,
        id: field.id,
        placeholder: field.placeholder,
        className: field.className,
      }));
    });
    
    console.log(`📋 发现 ${formFields.length} 个表单字段:`);
    formFields.forEach((field, index) => {
      console.log(`  ${index + 1}. ${field.tag}${field.type ? `(${field.type})` : ''} - ${field.name || field.id || field.placeholder || 'unnamed'}`);
    });
    console.log('');
    
    // 尝试填写表单
    console.log('✏️  正在填写表单...');
    
    // 查找文本域或内容输入框
    const textareas = await page.$$('textarea');
    const contentInputs = await page.$$('input[type="text"], input:not([type])');
    
    if (textareas.length > 0) {
      // 如果有文本域，填入工作日报
      console.log('📝 在文本域中填入工作日报...');
      await textareas[0].fill(workReportContent);
      console.log('✅ 已填入工作日报内容\n');
    } else if (contentInputs.length > 0) {
      // 否则尝试在第一个文本输入框填入
      console.log('📝 在输入框中填入工作日报...');
      await contentInputs[0].fill(workReportContent.substring(0, 500)); // 限制长度
      console.log('✅ 已填入工作日报内容（前500字符）\n');
    } else {
      console.log('⚠️  未找到合适的内容输入框\n');
    }
    
    // 查找并填写其他字段（如标题、日期等）
    const titleInput = await page.$('input[placeholder*="标题"], input[name*="title"], input[name*="标题"]');
    if (titleInput) {
      await titleInput.fill('工作日报 - 2026-03-19');
      console.log('✅ 已填写标题\n');
    }
    
    // 截图查看填写结果
    await page.screenshot({ path: 'kaiwu_form_filled.png', fullPage: true });
    console.log('📸 已保存填写后截图: kaiwu_form_filled.png\n');
    
    // 查找提交按钮
    const submitButton = await page.$('button[type="submit"], button:has-text("提交"), button:has-text("保存"), .submit-btn, [class*="submit"]');
    
    if (submitButton) {
      console.log('🚀 找到提交按钮，准备提交...');
      console.log('⏳ 请在 10 秒内检查填写内容，脚本将自动提交...');
      await page.waitForTimeout(10000);
      
      // 点击提交
      await submitButton.click();
      console.log('✅ 已点击提交按钮\n');
      
      // 等待提交完成
      await page.waitForTimeout(5000);
      
      // 截图查看提交结果
      await page.screenshot({ path: 'kaiwu_form_submitted.png', fullPage: true });
      console.log('📸 已保存提交后截图: kaiwu_form_submitted.png\n');
      
      console.log('🎉 表单填写完成！');
    } else {
      console.log('⚠️  未找到提交按钮，请手动提交\n');
      console.log('⏳ 浏览器将保持打开 60 秒，请手动完成提交...');
      await page.waitForTimeout(60000);
    }
    
  } catch (error) {
    console.error('❌ 发生错误:', error.message);
    await page.screenshot({ path: 'kaiwu_form_error.png', fullPage: true });
    console.log('📸 已保存错误截图: kaiwu_form_error.png\n');
  } finally {
    // 关闭浏览器
    await browser.close();
    console.log('👋 浏览器已关闭');
  }
}

// 运行主函数
main().catch(error => {
  console.error('❌ 脚本执行失败:', error);
  process.exit(1);
});
