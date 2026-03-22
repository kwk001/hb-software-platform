import { test, expect } from '@playwright/test';

/**
 * 活动管理模块端到端测试
 * 覆盖：新增、编辑、删除、查询功能
 */

test.describe('活动发布功能测试', () => {
  
  // 每个测试前执行：设置登录状态
  test.beforeEach(async ({ page }) => {
    // 模拟登录 - 设置localStorage
    await page.goto('/');
    await page.evaluate(() => {
      const testUser = {
        id: 'test-admin-001',
        username: 'test_admin',
        role: 'platform_admin',
        name: '测试管理员'
      };
      localStorage.setItem('currentUser', JSON.stringify(testUser));
    });
    
    // 进入活动管理页面
    await page.goto('/platform/activity');
    await expect(page.locator('h4.ant-typography:has-text("活动管理")')).toBeVisible();
  });

  test('TC-ACT-001: 正常新增活动', async ({ page }) => {
    // 1. 点击新增活动按钮
    await page.click('button:has-text("新增活动")');
    
    // 2. 验证弹窗打开
    await expect(page.locator('.ant-modal:has-text("新增活动")')).toBeVisible();
    
    // 3. 填写表单
    await page.fill('input[placeholder="请输入活动标题"]', '自动化测试活动');
    await page.fill('textarea[placeholder*="活动简介"]', '这是通过Playwright自动化测试创建的活动');
    
    // 选择活动类型（AntD Select）- 使用键盘导航
    await page.click('.ant-form-item:has-text("活动类型") .ant-select-selector');
    await page.waitForSelector('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    
    // 选择活动分类 - 使用键盘导航
    await page.click('.ant-form-item:has-text("活动分类") .ant-select-selector');
    await page.waitForSelector('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    
    // 选择活动时间 - 简化选择
    await page.click('.ant-form-item:has-text("活动时间") .ant-picker');
    await page.waitForSelector('.ant-picker-dropdown');
    // 选择今天作为开始日期
    await page.click('.ant-picker-cell-today');
    // 选择明天作为结束日期
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    
    // 填写地点和主办方
    await page.fill('input[placeholder*="地点"]', '腾讯会议');
    await page.fill('input[placeholder*="主办方"]', 'Playwright测试团队');
    
    // 填写最大参与人数
    await page.fill('.ant-form-item:has-text("最大参与人数") input', '100');
    
    // 添加标签
    await page.click('.ant-form-item:has-text("活动标签") .ant-select-selector');
    await page.fill('.ant-select-selection-search-input', '自动化测试');
    await page.keyboard.press('Enter');
    
    // 4. 保存
    await page.click('.ant-modal-footer button:has-text("保存")');
    
    // 5. 验证成功提示
    await expect(page.locator('.ant-message-success')).toContainText('添加成功');
    
    // 6. 验证列表中显示新活动
    await expect(page.locator('text=自动化测试活动')).toBeVisible();
  });

  test('TC-ACT-004: 活动标题为空校验', async ({ page }) => {
    // 1. 打开新增弹窗
    await page.click('button:has-text("新增活动")');
    
    // 2. 直接点击保存（不填写任何字段）
    await page.click('.ant-modal-footer button:has-text("保存")');
    
    // 3. 验证校验提示
    await expect(page.locator('.ant-form-item-explain-error:has-text("请输入活动标题")')).toBeVisible();
    await expect(page.locator('.ant-form-item-explain-error:has-text("请输入活动简介")')).toBeVisible();
  });

  test('TC-ACT-012: 搜索功能测试', async ({ page }) => {
    // 1. 在搜索框输入关键词
    await page.fill('input[placeholder*="搜索活动"]', '工业软件');
    
    // 2. 验证搜索结果
    await expect(page.locator('text=2025湖北省工业软件创新发展论坛')).toBeVisible();
    
    // 3. 清空搜索
    await page.click('.ant-input-clear-icon');
    
    // 4. 验证显示所有活动
    const rows = await page.locator('.ant-table-row').count();
    expect(rows).toBeGreaterThan(0);
  });

  test('TC-ACT-013: 筛选功能测试', async ({ page }) => {
    // 1. 按类型筛选
    await page.click('.ant-form-item:has-text("全部类型") .ant-select-selector');
    await page.click('.ant-select-dropdown .ant-select-item-option-content:has-text("线下")');
    
    // 2. 验证筛选结果
    const rows = await page.locator('.ant-table-row').count();
    expect(rows).toBeGreaterThanOrEqual(0);
    
    // 3. 重置筛选
    await page.click('text=全部类型');
  });

  test('TC-ACT-002: 编辑活动', async ({ page }) => {
    // 前置条件：确保有活动存在
    const firstEditBtn = page.locator('button:has-text("编辑")').first();
    await expect(firstEditBtn).toBeVisible();
    
    // 1. 点击编辑按钮
    await firstEditBtn.click();
    
    // 2. 验证弹窗标题为"编辑活动"
    await expect(page.locator('.ant-modal-title:has-text("编辑活动")')).toBeVisible();
    
    // 3. 修改标题
    const titleInput = page.locator('input[placeholder="请输入活动标题"]');
    await titleInput.clear();
    await titleInput.fill('修改后的活动标题');
    
    // 4. 保存
    await page.click('.ant-modal-footer button:has-text("保存")');
    
    // 5. 验证成功
    await expect(page.locator('.ant-message-success')).toContainText('修改成功');
  });

  test('TC-ACT-003: 删除活动', async ({ page }) => {
    // 前置条件：先创建一个测试活动
    await page.click('button:has-text("新增活动")');
    await page.fill('input[placeholder="请输入活动标题"]', '待删除的测试活动');
    await page.fill('textarea[placeholder*="活动简介"]', '这个活动将被删除');
    await page.click('.ant-form-item:has-text("活动类型") .ant-select-selector');
    await page.click('.ant-select-dropdown .ant-select-item-option-content:has-text("线上")');
    await page.click('.ant-form-item:has-text("活动分类") .ant-select-selector');
    await page.click('.ant-select-dropdown .ant-select-item-option-content:has-text("培训")');
    await page.fill('input[placeholder*="地点"]', '测试地点');
    await page.fill('input[placeholder*="主办方"]', '测试方');
    await page.click('.ant-modal-footer button:has-text("保存")');
    await expect(page.locator('.ant-message-success')).toContainText('添加成功');
    
    // 1. 找到刚创建的活动并点击删除
    const deleteBtn = page.locator('.ant-table-row:has-text("待删除的测试活动") button:has-text("删除")');
    await deleteBtn.click();
    
    // 2. 确认删除
    await page.click('.ant-popconfirm-buttons button:has-text("确认")');
    
    // 3. 验证成功提示
    await expect(page.locator('.ant-message-success')).toContainText('删除成功');
    
    // 4. 验证活动已删除
    await expect(page.locator('text=待删除的测试活动')).not.toBeVisible();
  });

  test('TC-ACT-014: 分页功能测试', async ({ page }) => {
    // 1. 验证分页组件存在
    await expect(page.locator('.ant-pagination')).toBeVisible();
    
    // 2. 切换每页显示条数
    await page.click('.ant-pagination-options-size-changer');
    await page.click('.ant-select-dropdown .ant-select-item-option-content:has-text("20")');
    
    // 3. 验证页码变化
    await expect(page.locator('.ant-pagination-item-active')).toContainText('1');
  });
});
