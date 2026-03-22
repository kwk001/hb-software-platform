/**
 * 简化版工作日报同步脚本
 * 日期: 2026-03-19
 */

const { chromium } = require('playwright');

const WORK_CONTENT = `今日工作内容（2026-03-19）：

1. 门户首页 - 合作伙伴模块重新设计
   - 参考 gemcoder.com 样式，实现横向无限滚动跑马灯动效
   - 双行设计（第一行向左滚动，第二行向右滚动）
   - 支持企业 Logo 图片展示（16家企业）
   - 添加悬停暂停、Logo 灰度转彩色效果

2. 门户首页 - 产品网格布局优化
   - 移除 grid gap，改用边框分隔
   - 使用 nth-child 实现每行最后一个无边框

3. 门户首页 - 政策列表优化
   - 选中框固定在顶部，其他政策保持滚动动效

4. 门户首页 - 标签样式优化
   - 将英文标签改为中文（功能特性、核心优势、成功案例）

5. 门户首页 - Hero 区域垂直居中
   - 调整 flexbox 布局实现垂直居中

6. 门户首页 - 行业解决方案模块优化
   - 统一配色为主题色，移除过度动画，隐藏渐变背景

7. 门户首页 - 最新政策模块优化
   - 隐藏"查看全部政策"按钮和标签内容

8. 登录/注册页面优化
   - 整屏高度适配，隐藏顶部导航，添加返回首页入口

9. 消息中心页面优化
   - 消息模板、消息发送、发送记录页 UI 优化

10. 企业审核页面优化
    - UI 设计精致化，表单验证修复

11. 需求汇总页面优化
    - UI 设计精致化，多选功能实现

12. 申报补贴页面优化
    - UI 设计精致化，软件类型多选支持`;

async function syncToKaiwuForm() {
  console.log('🚀 启动浏览器...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 100 
  });
  
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  
  const page = await context.newPage();
  
  try {
    const targetUrl = 'https://app.kaiwu.cloud/portal/application/data/e3830be75cd87d26bf229f4cf9d364f5/form/t68d8e0c03923770007cf3212?pane=tododata';
    
    console.log('📄 正在打开 Kaiwu Form...');
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 60000 });
    
    await page.waitForTimeout(3000);
    
    const currentUrl = page.url();
    console.log('当前URL:', currentUrl);
    
    // 等待登录完成
    if (currentUrl.includes('login') || currentUrl.includes('auth')) {
      console.log('⚠️ 请手动登录...');
      await page.waitForFunction(
        () => !window.location.href.includes('login') && !window.location.href.includes('auth'),
        { timeout: 300000 }
      );
      console.log('✅ 登录成功');
      await page.waitForTimeout(3000);
    }
    
    console.log('\n📝 请在页面中手动添加以下工作记录：\n');
    console.log(WORK_CONTENT);
    console.log('\n⏳ 请在浏览器中完成操作，完成后按 Ctrl+C 关闭脚本');
    
    // 保持浏览器打开
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

syncToKaiwuForm().catch(console.error);
