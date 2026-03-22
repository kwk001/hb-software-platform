# E2E 自动化测试

使用 Playwright 进行端到端自动化测试

## 安装

```bash
cd e2e
npm install
npx playwright install
```

## 运行测试

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npx playwright test activity.spec.ts

# 调试模式
npm run test:debug

# UI模式（可视化）
npm run test:ui

# 查看报告
npm run test:report
```

## 测试覆盖

- [x] 活动发布全流程
- [x] 表单校验
- [x] 搜索功能
- [x] 筛选功能
- [x] 编辑活动
- [x] 删除活动
- [x] 分页功能
