# 全栈工程师项目执行规则（必须严格遵守）

> **说明**：核心规则（禁止事项、必须遵循的原则）详见 fullstack_user_rules.md

---

## 任务执行规则

### 需求分析阶段任务
1. **需求梳理**：使用Kaiwu Form MCP收集和整理业务需求
2. **技术调研**：使用WebSearch MCP调研技术方案和最佳实践
3. **现状分析**：使用SearchCodebase分析现有系统架构和代码
4. **可行性评估**：评估技术可行性、性能要求、安全要求
5. **技术选型**：确定前端框架、后端语言、数据库、中间件
6. **成本估算**：评估开发成本、维护成本、基础设施成本
7. **风险评估**：识别技术风险、性能风险、安全风险

### 技术设计阶段任务
1. **架构设计**：设计逻辑架构、技术架构、数据架构、部署架构
2. **数据库设计**：设计数据模型、表结构、索引、分区策略
3. **API设计**：设计RESTful API或GraphQL，定义接口规范
4. **前端设计**：设计组件架构、状态管理、路由结构
5. **安全设计**：设计认证授权、数据加密、安全防护方案
6. **性能设计**：设计缓存策略、异步处理、性能优化方案
7. **文档编写**：编写架构文档、API文档、数据库设计文档

### 开发交付阶段任务
1. **环境搭建**：搭建开发环境、配置代码规范、初始化项目
2. **前端开发**：开发页面组件、实现业务逻辑、集成API
3. **后端开发**：开发API接口、实现业务逻辑、数据访问层
4. **数据库开发**：编写DDL脚本、DML脚本、存储过程
5. **单元测试**：编写单元测试，确保核心逻辑覆盖率≥80%
6. **集成测试**：进行接口测试、集成测试、E2E测试
7. **Code Review**：进行代码审查，确保代码质量和规范
8. **性能优化**：识别性能瓶颈，进行针对性优化
9. **安全扫描**：进行安全扫描，修复安全漏洞
10. **文档完善**：完善技术文档、API文档、部署文档
11. **CI/CD配置**：配置自动化构建、测试、部署流水线
12. **监控配置**：配置应用监控、日志收集、告警规则

---

## MCP工具使用规则

### Kaiwu Form MCP
- **使用场景**：收集业务需求、整理功能清单、记录技术决策
- **使用前**：必须先登录
- **必须记录**：需求来源、提出人、业务场景、技术约束

### WebSearch MCP
- **使用场景**：技术调研、竞品分析、最佳实践查询
- **必须明确**：搜索目的和关键词
- **必须记录**：搜索结果来源、时间、关键结论

### SearchCodebase
- **使用场景**：分析现有系统架构、代码逻辑、数据库结构
- **必须明确**：搜索范围（前端代码、后端代码、数据库、配置文件）
- **必须记录**：关键发现、架构现状、技术约束、复用机会

### Write工具
- **使用场景**：生成技术文档、API文档、架构设计文档
- **必须确认**：文档路径和格式
- **必须包含**：版本号、编写人、日期、变更记录

### Read工具
- **使用场景**：读取现有文档、参考模板、代码审查
- **必须确认**：文件路径正确
- **必须检查**：文档版本和有效性

---

## 前端开发规范

### 1. 代码规范

#### 命名规范
- **组件命名**：PascalCase（如：UserProfile、OrderList）
- **函数命名**：camelCase（如：getUserInfo、handleSubmit）
- **常量命名**：UPPER_SNAKE_CASE（如：API_BASE_URL、MAX_RETRY_COUNT）
- **文件命名**：
  - 组件：PascalCase.jsx/tsx（如：UserCard.jsx）
  - 工具函数：camelCase.js/ts（如：formatDate.js）
  - 样式文件：camelCase.module.css/scss

#### 目录结构
```
src/
├── components/          # 公共组件
│   ├── common/         # 通用组件（Button、Input、Modal）
│   ├── business/       # 业务组件（UserCard、OrderItem）
│   └── layout/         # 布局组件（Header、Sidebar、Footer）
├── pages/              # 页面组件
│   ├── Home/
│   ├── User/
│   └── Order/
├── hooks/              # 自定义Hooks
├── utils/              # 工具函数
├── services/           # API服务
├── stores/             # 状态管理
├── styles/             # 全局样式
├── types/              # TypeScript类型定义
└── assets/             # 静态资源
```

#### 代码风格
- 使用2个空格缩进
- 单行代码不超过100字符
- 函数长度不超过50行
- 组件文件不超过300行
- 使用单引号（字符串）和双引号（JSX属性）
- 末尾必须有分号
- 对象和数组最后一个元素后不加逗号

### 2. 组件规范

#### 组件结构
```tsx
// 1. 导入（按类型分组，按字母排序）
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Input } from '@/components/common';
import { fetchUserData } from '@/services/user';
import styles from './UserCard.module.scss';

// 2. 类型定义
interface UserCardProps {
  userId: string;
  onEdit?: (user: User) => void;
}

// 3. 组件定义
export const UserCard: React.FC<UserCardProps> = ({ userId, onEdit }) => {
  // 3.1 状态定义
  const [isEditing, setIsEditing] = useState(false);
  
  // 3.2 数据获取
  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUserData(userId),
  });
  
  // 3.3 事件处理
  const handleEdit = () => {
    setIsEditing(true);
    onEdit?.(user);
  };
  
  // 3.4 渲染
  if (isLoading) return <Loading />;
  
  return (
    <div className={styles.card}>
      {/* 组件内容 */}
    </div>
  );
};
```

#### 组件设计原则
- **单一职责**：每个组件只做一件事
- **Props最小化**：只接收必要的Props
- **状态提升**：共享状态提升到最近公共祖先
- **组合优于继承**：使用组件组合而非继承
- **受控组件**：表单元素使用受控组件模式

### 3. 性能规范

#### 渲染优化
- 使用`React.memo`缓存纯展示组件
- 使用`useMemo`缓存计算结果
- 使用`useCallback`缓存回调函数
- 使用`key`属性优化列表渲染
- 避免在渲染中创建新对象/函数

#### 加载优化
- 路由懒加载：`React.lazy` + `Suspense`
- 组件懒加载：动态`import()`
- 图片懒加载：`loading="lazy"`或Intersection Observer
- 代码分割：按路由、按功能模块分割

#### 状态管理
- 局部状态使用`useState`/`useReducer`
- 服务端状态使用React Query/SWR
- 全局状态使用Zustand/Redux（按需选择）
- 避免不必要的全局状态

---

## 后端开发规范

### 1. 代码规范

#### 命名规范（Java示例）
- **类名**：PascalCase（如：UserService、OrderController）
- **方法名**：camelCase（如：getUserById、createOrder）
- **变量名**：camelCase（如：userList、orderStatus）
- **常量名**：UPPER_SNAKE_CASE（如：DEFAULT_PAGE_SIZE、MAX_RETRY_COUNT）
- **包名**：全小写，使用域名反转（如：com.company.project.module）

#### 目录结构（Java/Spring Boot示例）
```
src/main/java/com/company/project/
├── controller/          # 控制器层
├── service/            # 业务逻辑层
│   ├── impl/          # 业务实现
├── repository/         # 数据访问层
├── entity/            # 实体类
├── dto/               # 数据传输对象
├── vo/                # 视图对象
├── mapper/            # 对象映射
├── config/            # 配置类
├── util/              # 工具类
├── exception/         # 异常处理
├── interceptor/       # 拦截器
└── aspect/            # AOP切面

src/main/resources/
├── mapper/            # MyBatis映射文件
├── static/            # 静态资源
├── templates/         # 模板文件
├── application.yml    # 主配置文件
├── application-dev.yml   # 开发环境
├── application-test.yml  # 测试环境
└── application-prod.yml  # 生产环境
```

### 2. API规范

#### RESTful API设计
- **URL设计**：使用名词复数，避免动词
  - ✅ GET /api/users
  - ✅ GET /api/users/{id}
  - ✅ POST /api/users
  - ✅ PUT /api/users/{id}
  - ✅ DELETE /api/users/{id}
  - ❌ GET /api/getUsers
  - ❌ POST /api/createUser

- **HTTP状态码**：
  - 200 OK：请求成功
  - 201 Created：创建成功
  - 204 No Content：删除成功
  - 400 Bad Request：请求参数错误
  - 401 Unauthorized：未认证
  - 403 Forbidden：无权限
  - 404 Not Found：资源不存在
  - 409 Conflict：资源冲突
  - 422 Unprocessable Entity：验证错误
  - 500 Internal Server Error：服务器内部错误

- **响应格式**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "name": "张三"
  },
  "timestamp": 1704067200000
}
```

#### 错误处理
- 统一异常处理机制
- 错误信息清晰明确
- 不包含敏感信息
- 记录错误日志

### 3. 数据库规范

#### 命名规范
- **表名**：小写，下划线分隔，复数形式（如：user_profiles、order_items）
- **字段名**：小写，下划线分隔（如：created_at、updated_by）
- **索引名**：idx_表名_字段名（如：idx_users_email）
- **约束名**：uk_表名_字段名（唯一）、fk_表名_关联表（外键）

#### 字段设计
- **主键**：使用BIGINT自增或雪花算法ID
- **时间字段**：created_at、updated_at必须存在
- **逻辑删除**：使用is_deleted字段（0-未删除，1-已删除）
- **状态字段**：使用TINYINT，配合枚举说明
- **大字段**：TEXT/BLOB类型单独建表

#### 索引设计
- 主键自动创建索引
- 外键必须创建索引
- 频繁查询的字段创建索引
- 组合索引遵循最左前缀原则
- 避免过多索引（影响写入性能）
- 定期检查和优化索引

#### SQL编写
- 使用参数化查询，防止SQL注入
- 避免SELECT *，明确指定字段
- 避免在WHERE条件中使用函数
- 避免隐式类型转换
- 大表查询必须走索引
- 分页查询使用LIMIT/OFFSET或游标

---

## DevOps规范

### 1. CI/CD流水线

#### 流水线阶段
1. **代码检出**：从Git仓库拉取代码
2. **依赖安装**：安装项目依赖
3. **代码检查**：ESLint、SonarQube代码质量检查
4. **单元测试**：运行单元测试，生成覆盖率报告
5. **构建打包**：构建前端资源、后端Jar包/Docker镜像
6. **镜像推送**：推送Docker镜像到镜像仓库
7. **部署发布**：部署到测试环境/生产环境
8. **健康检查**：验证服务健康状态

#### 环境管理
- **开发环境**：本地开发，频繁部署
- **测试环境**：功能测试，自动化部署
- **预发环境**：生产镜像，人工验证
- **生产环境**：正式环境，审批发布

### 2. 容器化规范

#### Dockerfile编写
```dockerfile
# 多阶段构建示例
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

#### 镜像规范
- 使用官方基础镜像
- 使用多阶段构建减小镜像体积
- 镜像标签使用语义化版本（如：v1.2.3）
- 镜像中不包含敏感信息
- 定期更新基础镜像

### 3. 监控告警

#### 监控指标
- **系统指标**：CPU、内存、磁盘、网络
- **应用指标**：QPS、TPS、响应时间、错误率
- **业务指标**：订单量、用户数、转化率
- **JVM指标**（Java）：堆内存、GC次数、线程数

#### 告警规则
- **P0（紧急）**：服务不可用、核心功能故障
- **P1（高）**：性能严重下降、错误率激增
- **P2（中）**：资源使用率过高、非核心功能异常
- **P3（低）**：警告级别、需要关注

---

## 技术选型规则

### 1. 评估维度

| 维度 | 权重 | 说明 |
|------|------|------|
| 功能性 | 20% | 是否满足业务需求 |
| 性能 | 20% | 吞吐量、响应时间、资源占用 |
| 可靠性 | 15% | 稳定性、成熟度、社区活跃度 |
| 可维护性 | 15% | 学习成本、文档完善度、调试工具 |
| 团队能力 | 15% | 团队熟悉程度、学习成本 |
| 生态成熟度 | 10% | 第三方库、工具链、解决方案 |
| 成本 | 5% | 开发成本、运维成本、许可费用 |

### 2. 决策流程
1. **需求分析**：明确功能需求、性能需求、约束条件
2. **候选技术**：列出2-3个候选技术方案
3. **多维度评估**：按照评估维度打分
4. **POC验证**：对关键技术进行概念验证
5. **决策记录**：编写技术选型决策记录（ADR）
6. **团队评审**：技术评审会议讨论确认

### 3. 常用技术栈

#### 前端技术栈
- **框架**：React 18 + TypeScript（推荐）、Vue 3 + TypeScript
- **状态管理**：Zustand（推荐）、Redux Toolkit、Pinia
- **UI库**：Ant Design（推荐）、Element Plus、Material-UI
- **构建工具**：Vite（推荐）、Webpack
- **测试**：Vitest + React Testing Library + Playwright

#### 后端技术栈
- **Java**：Spring Boot + Spring Cloud + MyBatis-Plus
- **Go**：Gin + GORM + Zap
- **Node.js**：NestJS + Prisma + Winston
- **数据库**：PostgreSQL（推荐）、MySQL
- **缓存**：Redis（推荐）
- **消息队列**：Kafka（大数据量）、RabbitMQ（通用）

#### DevOps技术栈
- **容器**：Docker + Kubernetes
- **CI/CD**：GitLab CI（推荐）、GitHub Actions、Jenkins
- **监控**：Prometheus + Grafana + Alertmanager
- **日志**：ELK Stack 或 Loki + Grafana
- **链路追踪**：Jaeger 或 SkyWalking

---

## 输出质量标准

### 1. 代码质量检查清单

#### 基础检查
- [ ] 代码符合团队编码规范
- [ ] 命名清晰、有意义
- [ ] 无冗余代码和注释
- [ ] 无console.log/debugger等调试代码
- [ ] 无敏感信息硬编码

#### 功能检查
- [ ] 功能实现符合需求文档
- [ ] 边界条件处理完善
- [ ] 错误处理机制完善
- [ ] 日志记录完整

#### 性能检查
- [ ] 无明显的性能瓶颈
- [ ] 数据库查询优化（索引、避免N+1）
- [ ] 前端资源优化（代码分割、懒加载）
- [ ] 缓存策略合理

#### 安全检查
- [ ] 输入校验完善
- [ ] 无SQL注入风险
- [ ] 无XSS漏洞
- [ ] 权限控制正确

### 2. 测试质量检查清单

- [ ] 单元测试覆盖率≥80%
- [ ] 核心业务流程有集成测试
- [ ] 关键用户路径有E2E测试
- [ ] 测试用例独立，无相互依赖
- [ ] 测试数据清理完善

### 3. 文档质量检查清单

- [ ] 架构文档包含架构图
- [ ] API文档完整（请求/响应/错误码）
- [ ] 数据库设计文档（ER图、表结构）
- [ ] 部署文档（环境要求、部署步骤）
- [ ] 变更日志记录

### 4. 交付物清单

#### 代码交付
- 源代码（Git仓库）
- 配置文件（不同环境）
- 数据库迁移脚本
- Dockerfile和K8s YAML

#### 文档交付
- 技术设计文档
- API接口文档
- 数据库设计文档
- 部署运维手册
- 测试报告

#### 配置交付
- CI/CD流水线配置
- 监控告警规则
- 日志收集配置
- 环境变量配置

---

## 通用规则

### 版本控制
- 使用Git进行版本控制
- 分支模型：Git Flow 或 GitHub Flow
- 提交信息规范：`<type>(<scope>): <subject>`
  - type: feat, fix, docs, style, refactor, test, chore
  - 示例：`feat(user): 添加用户登录功能`
- 代码合并必须通过Merge Request/Pull Request
- 合并前必须通过CI检查和Code Review

### 代码审查
- 所有代码必须经过至少1人审查
- 审查内容：功能正确性、代码规范、性能、安全
- 审查意见必须在24小时内响应
- 严重问题必须修复后才能合并

### 变更管理
- 所有变更必须关联需求/缺陷单号
- 重大变更需要技术评审
- 生产环境变更需要审批流程
- 变更后需要验证和监控

### 故障处理
- 第一时间恢复服务（回滚/降级）
- 保留现场（日志、监控数据）
- 根因分析（5 Whys）
- 制定改进措施
- 编写故障复盘文档
