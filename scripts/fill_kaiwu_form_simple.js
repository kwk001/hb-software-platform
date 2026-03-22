#!/usr/bin/env node

/**
 * Kaiwu Form 自动填写脚本 - 简化版
 * 使用 Playwright 自动填写工作日报表单
 * 
 * 使用方法:
 * 1. 先在浏览器中登录 Kaiwu Cloud
 * 2. 然后运行此脚本
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  formUrl: 'https://app.kaiwu.cloud/portal/application/data/e3830be75cd87d26bf229f4cf9d364f5/form/t68d8e0c03923770007cf3212?pane=tododata',
  workReportPath: path.join(__dirname, '..', 'work_report_2026-03-19.md'),
  headless: true, // 无头模式
  slowMo: 50,
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
  
  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    
    const page = await context.newPage();
    
    // 打开表单页面
    console.log('📍 正在打开表单页面...');
    await page.goto(CONFIG.formUrl, { waitUntil: 'networkidle', timeout: 60000 });
    
    // 等待页面加载
    await page.waitForTimeout(3000);
    
    console.log('✅ 页面已打开\n');
    
    // 获取页面标题
    const title = await page.title();
    console.log(`📋 页面标题: ${title}\n`);
    
    // 分析页面内容
    const pageContent = await page.content();
    
    // 检查是否是登录页面
    if (pageContent.includes('登录') || pageContent.includes('login') || title.includes('登录')) {
      console.log('⚠️  当前是登录页面，需要登录后才能填写表单\n');
      console.log('💡 建议:');
      console.log('   1. 先在浏览器中手动登录 Kaiwu Cloud');
      console.log('   2. 然后重新运行此脚本');
      console.log('   3. 或者使用 --headed 参数运行脚本进行手动登录\n');
      
      // 保存截图供查看
      await page.screenshot({ path: 'kaiwu_form_login.png', fullPage: true });
      console.log('📸 已保存登录页面截图: kaiwu_form_login.png\n');
      
      await browser.close();
      return;
    }
    
    // 查找表单字段
    console.log('🔍 正在分析表单结构...');
    
    // 查找所有输入框
    const inputs = await page.$$('input[type="text"], input:not([type]), textarea');
    console.log(`📋 发现 ${inputs.length} 个输入字段\n`);
    
    // 尝试填写表单
    let filled = false;
    
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      
      // 获取字段信息
      const placeholder = await input.getAttribute('placeholder');
      const name = await input.getAttribute('name');
      const id = await input.getAttribute('id');
      const tagName = await input.evaluate(el => el.tagName.toLowerCase());
      
      const fieldLabel = placeholder || name || id || `字段${i + 1}`;
      
      // 根据字段类型填写内容
      if (tagName === 'textarea' || fieldLabel.includes('内容') || fieldLabel.includes('描述') || fieldLabel.includes('详情')) {
        console.log(`📝 填写内容字段: ${fieldLabel}`);
        await input.fill(workReportContent);
        filled = true;
        console.log('✅ 已填入工作日报内容\n');
      } else if (fieldLabel.includes('标题') || fieldLabel.includes('主题')) {
        console.log(`📝 填写标题字段: ${fieldLabel}`);
        await input.fill('工作日报 - 2026-03-19');
        console.log('✅ 已填入标题\n');
      } else if (fieldLabel.includes('日期')) {
        console.log(`📝 填写日期字段: ${fieldLabel}`);
        await input.fill('2026-03-19');
        console.log('✅ 已填入日期\n');
      }
    }
    
    if (!filled) {
      console.log('⚠️  未找到合适的内容字段，尝试填写第一个文本域...\n');
      const firstTextarea = await page.$('textarea');
      if (firstTextarea) {
        await firstTextarea.fill(workReportContent);
        console.log('✅ 已在第一个文本域填入工作日报内容\n');
        filled = true;
      }
    }
    
    // 保存填写后的截图
    await page.screenshot({ path: 'kaiwu_form_filled.png', fullPage: true });
    console.log('📸 已保存填写后截图: kaiwu_form_filled.png\n');
    
    if (filled) {
      // 查找提交按钮
      const submitButton = await page.$('button[type="submit"], button:has-text("提交"), button:has-text("保存"), .submit-btn, [class*="submit"], [class*="save"]');
      
      if (submitButton) {
        const buttonText = await submitButton.textContent();
        console.log(`🚀 找到提交按钮: "${buttonText?.trim()}"`);
        console.log('💡 如需自动提交，请修改脚本取消注释以下代码:\n');
        console.log('   // await submitButton.click();\n');
        
        // 不自动提交，等待用户确认
        console.log('⏳ 表单已填写完成，请手动检查并提交');
        console.log('📸 截图已保存，请查看 kaiwu_form_filled.png\n');
      } else {
        console.log('⚠️  未找到提交按钮\n');
      }
      
      console.log('🎉 表单填写完成！');
    } else {
      console.log('❌ 未能填写任何字段\n');
    }
    
  } catch (error) {
    console.error('❌ 发生错误:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
    console.log('👋 浏览器已关闭');
  }
}

// 运行主函数
main().catch(error => {
  console.error('❌ 脚本执行失败:', error);
  process.exit(1);
});
