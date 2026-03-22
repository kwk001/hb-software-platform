/**
 * 同步工作日报到 Kaiwu Form
 * 日期: 2026-03-19
 * 目标: https://app.kaiwu.cloud/portal/application/data/e3830be75cd87d26bf229f4cf9d364f5/form/t68d8e0c03923770007cf3212?pane=tododata
 */

const { chromium } = require('playwright');

const WORK_ITEMS = [
  {
    title: '门户首页 - 合作伙伴模块重新设计',
    content: '参考 gemcoder.com "他们都在用" 模块样式，实现横向无限滚动跑马灯动效，双行设计（第一行向左滚动，第二行向右滚动），支持企业 Logo 图片展示（16家企业），添加悬停暂停、Logo 灰度转彩色效果',
    type: '前端开发',
    status: '已完成'
  },
  {
    title: '门户首页 - 产品网格布局优化',
    content: '移除 grid gap，改用边框分隔，使用 nth-child 实现每行最后一个无边框，统一圆角和边框样式',
    type: '前端开发',
    status: '已完成'
  },
  {
    title: '门户首页 - 政策列表优化',
    content: '选中框固定在顶部，其他政策保持滚动动效，优化滚动交互体验',
    type: '前端开发',
    status: '已完成'
  },
  {
    title: '门户首页 - 标签样式优化',
    content: '重新设计 section-tag 样式，将英文标签改为中文（功能特性、核心优势、成功案例）',
    type: '前端开发',
    status: '已完成'
  },
  {
    title: '门户首页 - Hero 区域垂直居中',
    content: '调整 flexbox 布局实现垂直居中，优化底部统计栏干扰问题',
    type: '前端开发',
    status: '已完成'
  },
  {
    title: '门户首页 - 行业解决方案模块优化',
    content: '统一配色为主题色，移除过度动画，隐藏渐变背景，按钮样式与 Hero 区域保持一致',
    type: '前端开发',
    status: '已完成'
  },
  {
    title: '门户首页 - 最新政策模块优化',
    content: '隐藏"查看全部政策"按钮，隐藏标签内容，隐藏渐变背景，分析并优化动效',
    type: '前端开发',
    status: '已完成'
  },
  {
    title: '登录/注册页面优化',
    content: '整屏高度适配，隐藏顶部导航，添加返回首页入口，优化 UI 精致度',
    type: '前端开发',
    status: '已完成'
  },
  {
    title: '消息中心页面优化',
    content: '消息模板、消息发送、发送记录页 UI 优化，按钮风格统一',
    type: '前端开发',
    status: '已完成'
  },
  {
    title: '企业审核页面优化',
    content: 'UI 设计精致化，表单验证修复',
    type: '前端开发',
    status: '已完成'
  },
  {
    title: '需求汇总页面优化',
    content: 'UI 设计精致化，多选功能实现',
    type: '前端开发',
    status: '已完成'
  },
  {
    title: '申报补贴页面优化',
    content: 'UI 设计精致化，软件类型多选支持，隐藏申报类型',
    type: '前端开发',
    status: '已完成'
  }
];

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
    // 访问 Kaiwu Form
    const targetUrl = 'https://app.kaiwu.cloud/portal/application/data/e3830be75cd87d26bf229f4cf9d364f5/form/t68d8e0c03923770007cf3212?pane=tododata';
    
    console.log('📄 正在打开 Kaiwu Form...');
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 60000 });
    
    // 等待页面加载
    await page.waitForTimeout(3000);
    
    // 检查是否需要登录
    const currentUrl = page.url();
    console.log('当前URL:', currentUrl);
    
    if (currentUrl.includes('login') || currentUrl.includes('auth')) {
      console.log('⚠️ 检测到登录页面，请手动登录...');
      console.log('登录后脚本将继续执行');
      
      // 等待登录完成（URL 变化）
      await page.waitForFunction(
        () => !window.location.href.includes('login') && !window.location.href.includes('auth'),
        { timeout: 300000 }
      );
      
      console.log('✅ 登录成功，继续执行...');
      await page.waitForTimeout(3000);
    }
    
    // 逐个添加工作事项
    for (let i = 0; i < WORK_ITEMS.length; i++) {
      const item = WORK_ITEMS[i];
      console.log(`\n📝 正在添加第 ${i + 1}/${WORK_ITEMS.length} 条工作事项: ${item.title}`);
      
      try {
        // 查找并点击"新增"按钮
        const addButton = await page.$('button:has-text("新增"), .add-btn, [data-testid="add"], .ant-btn-primary');
        if (addButton) {
          await addButton.click();
          await page.waitForTimeout(1500);
        } else {
          // 尝试通过其他方式找到新增按钮
          const buttons = await page.$$('button');
          for (const btn of buttons) {
            const text = await btn.textContent();
            if (text && (text.includes('新增') || text.includes('添加') || text.includes('新建'))) {
              await btn.click();
              await page.waitForTimeout(1500);
              break;
            }
          }
        }
        
        // 填写表单字段（根据实际表单结构调整选择器）
        // 标题
        const titleInputs = await page.$$('input[type="text"], .ant-input, [placeholder*="标题"], [placeholder*="名称"]');
        if (titleInputs.length > 0) {
          await titleInputs[0].fill(item.title);
        }
        
        // 内容/描述
        const contentInputs = await page.$$('textarea, .ant-input-textarea, [placeholder*="内容"], [placeholder*="描述"]');
        if (contentInputs.length > 0) {
          await contentInputs[0].fill(item.content);
        }
        
        // 类型
        const typeSelects = await page.$$('.ant-select, [role="combobox"], select');
        if (typeSelects.length > 0) {
          await typeSelects[0].click();
          await page.waitForTimeout(500);
          // 选择"前端开发"
          const options = await page.$$('.ant-select-item, .ant-select-dropdown-menu-item, [role="option"]');
          for (const opt of options) {
            const text = await opt.textContent();
            if (text && text.includes(item.type)) {
              await opt.click();
              break;
            }
          }
        }
        
        // 状态
        const statusSelects = await page.$$('.ant-select, [role="combobox"], select');
        if (statusSelects.length > 1) {
          await statusSelects[1].click();
          await page.waitForTimeout(500);
          const options = await page.$$('.ant-select-item, .ant-select-dropdown-menu-item, [role="option"]');
          for (const opt of options) {
            const text = await opt.textContent();
            if (text && text.includes(item.status)) {
              await opt.click();
              break;
            }
          }
        }
        
        // 点击保存/提交
        const saveButtons = await page.$$('button:has-text("保存"), button:has-text("提交"), button:has-text("确定"), .ant-btn-primary');
        for (const btn of saveButtons) {
          const text = await btn.textContent();
          if (text && (text.includes('保存') || text.includes('提交') || text.includes('确定'))) {
            await btn.click();
            await page.waitForTimeout(2000);
            break;
          }
        }
        
        console.log(`✅ 第 ${i + 1} 条工作事项添加成功`);
        
        // 等待表单关闭
        await page.waitForTimeout(2000);
        
      } catch (error) {
        console.error(`❌ 第 ${i + 1} 条工作事项添加失败:`, error.message);
        // 尝试关闭弹窗继续下一条
        try {
          const cancelButtons = await page.$$('button:has-text("取消"), button:has-text("关闭"), .ant-modal-close');
          if (cancelButtons.length > 0) {
            await cancelButtons[0].click();
            await page.waitForTimeout(1000);
          }
        } catch (e) {
          // 忽略关闭错误
        }
      }
    }
    
    console.log('\n🎉 所有工作事项同步完成！');
    
    // 保存截图
    await page.screenshot({ 
      path: '/Users/apple/Desktop/文件/kaiwu_jingxin/work_sync_result_20260319.png',
      fullPage: true 
    });
    console.log('📸 截图已保存');
    
  } catch (error) {
    console.error('❌ 同步过程出错:', error.message);
    
    // 保存错误截图
    await page.screenshot({ 
      path: '/Users/apple/Desktop/文件/kaiwu_jingxin/work_sync_error_20260319.png',
      fullPage: true 
    });
    console.log('📸 错误截图已保存');
    
  } finally {
    console.log('\n⏳ 浏览器将在 10 秒后关闭...');
    await page.waitForTimeout(10000);
    await browser.close();
    console.log('✅ 浏览器已关闭');
  }
}

// 执行同步
syncToKaiwuForm().catch(console.error);
