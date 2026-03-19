---
name: fullstack_engineer_skills
description: 20+年前&后端工程师全技术栈专家，精通前端工程化、后端服务设计、数据库优化、系统架构、DevOps、性能优化，能够独立完成从需求分析到部署运维的全链路技术实现。
---

# 全栈工程师专业技能文档

## 技能1：前端工程化与架构

### 技能描述
构建高性能、可维护、可扩展的前端应用，掌握现代前端技术栈和工程化实践。

### 具体能力

#### 1.1 前端框架与库
- **React生态**
  - 组件设计：函数组件、Hooks、自定义Hooks
  - 状态管理：Redux、Zustand、Jotai、React Query
  - 路由管理：React Router、TanStack Router
  - 服务端渲染：Next.js、Remix
  - 性能优化：React.memo、useMemo、useCallback、虚拟列表

- **Vue生态**
  - 组件设计：组合式API、Options API
  - 状态管理：Pinia、Vuex
  - 路由管理：Vue Router
  - 服务端渲染：Nuxt.js
  - 性能优化：v-once、keep-alive、异步组件

- **TypeScript**
  - 类型系统：接口、泛型、类型推断、类型守卫
  - 工程实践：严格模式、路径别名、类型声明文件
  - 高级特性：条件类型、映射类型、模板字面量类型

#### 1.2 前端工程化
- **构建工具**
  - Vite：快速开发、按需编译、插件生态
  - Webpack：Loader、Plugin、代码分割、Tree Shaking
  - Rollup：库打包、Tree Shaking、ESM输出
  - esbuild/SWC：极速编译、JavaScript/TypeScript转换

- **代码规范**
  - ESLint：代码质量检查、自定义规则
  - Prettier：代码格式化、团队协作
  - Stylelint：CSS/SCSS/Less规范
  - Husky + lint-staged：Git钩子、提交前检查

- **测试体系**
  - 单元测试：Jest、Vitest、Testing Library
  - E2E测试：Cypress、Playwright、Selenium
  - 视觉回归：Storybook、Chromatic、Loki
  - 测试覆盖率：Istanbul、Codecov

#### 1.3 前端架构设计
- **组件架构**
  - 原子设计：Atoms、Molecules、Organisms、Templates、Pages
  - 容器/展示组件：业务逻辑与UI分离
  - 复合组件：灵活组合的组件模式
  - 渲染模式：CSR、SSR、SSG、ISR

- **状态管理架构**
  - 局部状态：useState、useReducer
  - 全局状态：Redux、Zustand、Pinia
  - 服务端状态：React Query、SWR、Apollo Client
  - 表单状态：React Hook Form、Formik、VeeValidate

- **微前端架构**
  - 实现方案：Module Federation、qiankun、single-spa
  - 通信机制：Props、Event Bus、Shared State
  - 样式隔离：Shadow DOM、CSS Modules、CSS-in-JS
  - 路由整合：主应用路由、子应用路由协调

### 使用工具
- React/Vue/Angular：前端框架
- TypeScript：类型系统
- Vite/Webpack：构建工具
- Jest/Cypress：测试框架
- Storybook：组件开发环境

### 工作流程
1. **需求分析**：理解业务需求，确定技术方案
2. **技术选型**：选择前端框架、状态管理、UI库
3. **架构设计**：组件架构、目录结构、代码规范
4. **开发实现**：组件开发、页面实现、逻辑编写
5. **测试验证**：单元测试、集成测试、E2E测试
6. **性能优化**：代码分割、懒加载、缓存策略
7. **构建部署**：CI/CD流水线、自动化部署

### 输出标准
- 前端项目代码
  - 清晰的目录结构和组件组织
  - 完整的TypeScript类型定义
  - 统一的代码风格和规范
  - 高单元测试覆盖率（≥80%）
- 前端架构文档
  - 技术栈选择和理由
  - 组件架构设计说明
  - 状态管理方案
  - 性能优化策略

---

## 技能2：后端服务设计与开发

### 技能描述
设计并实现高性能、高可用、可扩展的后端服务，掌握多种后端技术栈和架构模式。

### 具体能力

#### 2.1 后端技术栈
- **Java生态**
  - Spring Boot：自动配置、起步依赖、Actuator
  - Spring Cloud：服务注册、配置中心、网关、熔断
  - Spring Data JPA/MyBatis：数据访问、ORM
  - Spring Security：认证授权、OAuth2、JWT
  - 响应式编程：WebFlux、Project Reactor

- **Go生态**
  - 标准库：net/http、database/sql、encoding/json
  - Web框架：Gin、Echo、Fiber、Beego
  - ORM：GORM、Ent、SQLx
  - 微服务：Go Micro、Go Kit、Dubbo-go
  - 并发模式：Goroutine、Channel、Context、Sync

- **Node.js生态**
  - 框架：Express、Koa、Fastify、NestJS
  - 数据库：Prisma、TypeORM、Sequelize、Mongoose
  - 异步处理：Async/Await、EventEmitter、Stream
  - 性能优化：Cluster、Worker Threads、Libuv

#### 2.2 API设计与开发
- **RESTful API**
  - 设计规范：资源命名、HTTP方法、状态码
  - 版本管理：URL版本、Header版本、内容协商
  - 文档生成：OpenAPI/Swagger、Postman
  - 认证授权：JWT、OAuth2、API Key

- **GraphQL**
  - Schema设计：类型系统、查询、变更、订阅
  - 解析器：Resolver、DataLoader、N+1问题
  - 网关：Apollo Gateway、Schema Stitching
  - 客户端：Apollo Client、Relay、Urql

- **gRPC**
  - Protocol Buffers：消息定义、版本兼容
  - 服务定义：Unary、Server Streaming、Client Streaming、Bidirectional
  - 拦截器：认证、日志、监控、熔断
  - 服务发现：Consul、etcd、Kubernetes

#### 2.3 后端架构模式
- **分层架构**
  - 表现层：Controller、DTO、Validator
  - 业务层：Service、Domain Model、Business Logic
  - 数据层：Repository、DAO、Entity
  - 基础设施层：Config、Util、Exception Handler

- **领域驱动设计（DDD）**
  - 战略设计：限界上下文、上下文映射、领域事件
  - 战术设计：实体、值对象、聚合、领域服务
  - 架构模式：分层架构、六边形架构、CQRS

- **微服务架构**
  - 服务拆分：按业务领域、按功能、按数据
  - 服务通信：同步（REST/gRPC）、异步（消息队列）
  - 服务治理：注册发现、负载均衡、熔断降级
  - 分布式事务：Saga、TCC、本地消息表

### 使用工具
- Java/Go/Node.js：后端语言
- Spring Boot/Gin/NestJS：后端框架
- PostgreSQL/MySQL/MongoDB：数据库
- Redis：缓存
- RabbitMQ/Kafka：消息队列

### 工作流程
1. **需求分析**：理解业务需求，识别核心领域
2. **架构设计**：选择架构模式（单体/微服务/Serverless）
3. **数据库设计**：数据模型、表结构、索引设计
4. **API设计**：接口定义、协议选择、文档编写
5. **服务开发**：业务逻辑实现、数据访问、单元测试
6. **集成测试**：接口测试、性能测试、安全测试
7. **部署上线**：CI/CD、容器化、监控告警

### 输出标准
- 后端项目代码
  - 清晰的分层架构和模块组织
  - 完整的API文档（Swagger/OpenAPI）
  - 高单元测试覆盖率（≥80%）
  - 完善的日志和监控埋点
- 后端架构文档
  - 技术栈选择和理由
  - 架构设计说明（分层/DDD/微服务）
  - API设计规范
  - 数据库设计文档

---

## 技能3：数据库设计与优化

### 技能描述
设计高效的数据库结构，优化查询性能，掌握关系型数据库和NoSQL数据库的最佳实践。

### 具体能力

#### 3.1 关系型数据库
- **MySQL**
  - 存储引擎：InnoDB、MyISAM、Memory
  - 索引优化：B+树索引、覆盖索引、最左前缀、索引下推
  - 查询优化：执行计划、慢查询分析、SQL改写
  - 事务与锁：ACID、隔离级别、MVCC、死锁检测
  - 高可用架构：主从复制、读写分离、MHA、MGR
  - 分库分表：Sharding-JDBC、MyCat、Vitess

- **PostgreSQL**
  - 高级特性：JSON/JSONB、数组、全文检索、GIS
  - 索引类型：B-tree、Hash、GiST、SP-GiST、GIN
  - 并发控制：MVCC、锁机制、 advisory lock
  - 扩展生态：PostGIS、TimescaleDB、Citus
  - 性能调优：配置参数、连接池、VACUUM

#### 3.2 NoSQL数据库
- **Redis**
  - 数据类型：String、Hash、List、Set、Sorted Set
  - 持久化：RDB、AOF、混合持久化
  - 高可用：主从复制、Sentinel、Cluster
  - 应用场景：缓存、会话、排行榜、限流、分布式锁
  - 性能优化：Pipeline、Lua脚本、内存优化

- **MongoDB**
  - 文档模型：BSON、嵌套文档、数组
  - 查询优化：索引、聚合管道、Explain
  - 复制集：Primary、Secondary、Arbiter
  - 分片集群：Shard、Config Server、Mongos
  - 事务支持：多文档ACID事务

- **Elasticsearch**
  - 核心概念：Index、Type、Document、Mapping
  - 搜索语法：Query DSL、Filter、Aggregation
  - 分词器：IK、jieba、自定义分词
  - 集群架构：Node、Shard、Replica、Cluster
  - 性能优化：索引优化、查询优化、硬件优化

#### 3.3 数据库设计
- **数据建模**
  - 概念模型：ER图、实体关系、业务对象
  - 逻辑模型：表结构、字段类型、约束条件
  - 物理模型：索引设计、分区策略、存储引擎

- **设计原则**
  - 范式与反范式：三范式、冗余设计、读写分离
  - 主键设计：自增ID、UUID、雪花算法
  - 字段设计：数据类型、长度、默认值、注释
  - 索引设计：单列索引、复合索引、覆盖索引

### 使用工具
- MySQL/PostgreSQL：关系型数据库
- Redis：内存数据库
- MongoDB：文档数据库
- Elasticsearch：搜索引擎
- Flyway/Liquibase：数据库迁移

### 工作流程
1. **需求分析**：识别数据实体、关系、访问模式
2. **概念设计**：绘制ER图，确定实体关系
3. **逻辑设计**：设计表结构、字段、约束
4. **物理设计**：索引设计、分区策略、存储引擎
5. **SQL开发**：编写DDL、DML、存储过程
6. **性能优化**：慢查询分析、索引优化、SQL改写
7. **运维监控**：备份恢复、监控告警、容量规划

### 输出标准
- 数据库设计文档
  - ER图和表结构说明
  - 索引设计文档
  - 数据库迁移脚本
  - 性能优化方案
- SQL规范
  - 命名规范
  - 编写规范
  - 优化规范

---

## 技能4：系统架构与高并发

### 技能描述
设计高并发、高可用、可扩展的分布式系统架构，掌握分布式系统核心技术和最佳实践。

### 具体能力

#### 4.1 高并发架构
- **负载均衡**
  - 硬件负载：F5、A10、NetScaler
  - 软件负载：Nginx、HAProxy、LVS
  - 负载算法：轮询、加权轮询、IP Hash、Least Connections
  - 健康检查：主动检查、被动检查、故障转移

- **缓存架构**
  - 本地缓存：Caffeine、Guava Cache、LRU Cache
  - 分布式缓存：Redis Cluster、Memcached
  - 缓存策略：Cache Aside、Read/Write Through、Write Behind
  - 缓存问题：穿透、击穿、雪崩、一致性

- **异步处理**
  - 消息队列：RabbitMQ、Kafka、RocketMQ、Pulsar
  - 消息模式：点对点、发布订阅、消息过滤
  - 可靠性：消息确认、持久化、重试机制、死信队列
  - 顺序性：分区顺序、全局顺序、局部顺序

- **限流降级**
  - 限流算法：计数器、滑动窗口、令牌桶、漏桶
  - 限流实现：Redis、Guava、Sentinel、Hystrix
  - 降级策略：自动降级、手动降级、熔断机制
  - 兜底方案：默认值、缓存数据、静态页面

#### 4.2 分布式系统
- **服务注册与发现**
  - 注册中心：Consul、etcd、ZooKeeper、Nacos
  - 服务发现：客户端发现、服务端发现
  - 健康检查：心跳机制、主动探测
  - 配置管理：配置中心、动态配置、灰度发布

- **分布式一致性**
  - CAP理论：一致性、可用性、分区容错
  - BASE理论：基本可用、软状态、最终一致
  - 一致性协议：Paxos、Raft、ZAB
  - 分布式事务：2PC、3PC、TCC、Saga、本地消息表

- **分布式ID**
  - 雪花算法：时间戳、机器ID、序列号
  - 号段模式：Leaf、TinyID
  - 数据库自增：多主模式、步长设置

#### 4.3 高可用架构
- **多活架构**
  - 同城双活：数据同步、流量切换、故障转移
  - 异地多活：单元化、数据分片、流量调度
  - 数据同步：MySQL主从、Canal、Otter

- **容灾备份**
  - 备份策略：全量备份、增量备份、差异备份
  - 恢复策略：RPO、RTO、恢复演练
  - 灾备架构：冷备、温备、热备

### 使用工具
- Nginx/HAProxy：负载均衡
- Redis/Memcached：缓存
- Kafka/RabbitMQ：消息队列
- Consul/etcd：服务注册
- Sentinel/Hystrix：限流熔断

### 工作流程
1. **容量规划**：评估QPS、TPS、数据量、并发数
2. **架构设计**：选择架构模式（单体/微服务/Serverless）
3. **高并发设计**：负载均衡、缓存、异步、限流
4. **高可用设计**：多活架构、容灾备份、故障转移
5. **性能测试**：压测、瓶颈分析、优化迭代
6. **监控告警**：指标采集、告警规则、故障处理

### 输出标准
- 架构设计文档
  - 系统架构图（逻辑架构、物理架构）
  - 高并发设计方案
  - 高可用设计方案
  - 容量规划和扩展方案
- 性能测试报告
  - 压测场景和结果
  - 瓶颈分析
  - 优化建议

---

## 技能5：DevOps与云原生

### 技能描述
掌握DevOps实践和云原生技术，实现持续集成、持续部署、容器化、自动化运维。

### 具体能力

#### 5.1 容器化技术
- **Docker**
  - 镜像构建：Dockerfile、多阶段构建、镜像优化
  - 容器管理：生命周期、资源限制、网络模式
  - 镜像仓库：Docker Hub、Harbor、私有仓库
  - 最佳实践：镜像分层、安全扫描、镜像签名

- **Kubernetes**
  - 核心概念：Pod、Deployment、Service、Ingress
  - 配置管理：ConfigMap、Secret、环境变量
  - 存储管理：PV、PVC、StorageClass
  - 调度策略：亲和性、反亲和性、污点容忍
  - 自动伸缩：HPA、VPA、Cluster Autoscaler

#### 5.2 CI/CD
- **持续集成**
  - 代码提交：Git Flow、GitHub Flow、Trunk Based
  - 自动构建：Jenkins、GitLab CI、GitHub Actions
  - 代码检查：SonarQube、CodeClimate、ESLint
  - 单元测试：自动化测试、覆盖率检查

- **持续部署**
  - 部署策略：蓝绿部署、金丝雀发布、滚动更新
  - 自动化脚本：Shell、Python、Ansible、Terraform
  - 环境管理：开发、测试、预发、生产
  - 回滚机制：快速回滚、数据回滚、配置回滚

#### 5.3 监控与日志
- **监控体系**
  - 指标监控：Prometheus、Grafana、Zabbix
  - 链路追踪：Jaeger、Zipkin、SkyWalking
  - APM：New Relic、Datadog、Dynatrace
  - 告警管理：Alertmanager、PagerDuty、OpsGenie

- **日志管理**
  - 日志收集：ELK Stack、Fluentd、Loki
  - 日志分析：Kibana、Grafana、自定义Dashboard
  - 日志规范：结构化日志、日志级别、日志轮转

#### 5.4 云服务
- **IaaS**
  - 计算：EC2、ECS、CVM、虚拟机
  - 存储：对象存储、块存储、文件存储
  - 网络：VPC、子网、安全组、负载均衡

- **PaaS**
  - 容器服务：EKS、ACK、TKE、GKE
  - 函数计算：Lambda、Function Compute、Cloud Functions
  - 数据库服务：RDS、Cloud SQL、MongoDB Atlas

- **SaaS**
  - 监控服务：CloudWatch、云监控
  - 消息服务：SNS、SQS、消息队列服务
  - 认证服务：Cognito、Auth0、Keycloak

### 使用工具
- Docker/Kubernetes：容器化
- Jenkins/GitLab CI：CI/CD
- Prometheus/Grafana：监控
- ELK/Loki：日志
- Terraform/Ansible：基础设施即代码

### 工作流程
1. **环境搭建**：开发环境、测试环境、生产环境
2. **容器化**：应用容器化、镜像构建、镜像优化
3. **CI/CD流水线**：代码提交、自动构建、自动测试、自动部署
4. **监控告警**：指标采集、告警规则、故障处理
5. **日志管理**：日志收集、日志分析、日志告警
6. **自动化运维**：配置管理、自动化脚本、基础设施即代码

### 输出标准
- DevOps文档
  - CI/CD流水线配置
  - Dockerfile和K8s YAML
  - 监控告警规则
  - 自动化脚本
- 运维手册
  - 部署手册
  - 故障处理手册
  - 回滚手册

---

## 技能6：性能优化与监控

### 技能描述
识别系统性能瓶颈，进行针对性优化，建立完善的监控体系，确保系统稳定运行。

### 具体能力

#### 6.1 前端性能优化
- **加载优化**
  - 代码分割：Route-based、Component-based
  - 懒加载：图片懒加载、组件懒加载、路由懒加载
  - 预加载：DNS预解析、资源预加载、预渲染
  - 缓存策略：Service Worker、LocalStorage、IndexedDB

- **渲染优化**
  - 关键渲染路径：优化CSS、JavaScript加载顺序
  - 重排重绘：避免频繁DOM操作、使用transform
  - 虚拟列表：长列表优化、无限滚动
  - Web Worker：复杂计算 offload

- **资源优化**
  - 图片优化：WebP、响应式图片、懒加载
  - 代码压缩：Gzip、Brotli、Minification
  - 资源合并：CSS/JS合并、雪碧图、Icon Font

#### 6.2 后端性能优化
- **代码优化**
  - 算法优化：时间复杂度、空间复杂度
  - 并发优化：连接池、线程池、协程
  - 缓存优化：本地缓存、分布式缓存、缓存策略
  - IO优化：异步IO、批量操作、零拷贝

- **数据库优化**
  - SQL优化：索引优化、查询改写、执行计划
  - 连接池：Druid、HikariCP、连接池配置
  - 分库分表：Sharding、分区表、读写分离
  - 缓存策略：Redis缓存、本地缓存、多级缓存

- **JVM优化（Java）**
  - 内存模型：堆内存、栈内存、元空间
  - 垃圾回收：G1、ZGC、Shenandoah、GC调优
  - 性能分析：JProfiler、Arthas、JVisualVM

#### 6.3 系统监控
- **指标监控**
  - 系统指标：CPU、内存、磁盘、网络
  - 应用指标：QPS、TPS、响应时间、错误率
  - 业务指标：订单量、用户数、转化率
  - 自定义指标：业务特定指标

- **链路追踪**
  - 分布式追踪：Trace、Span、Baggage
  - 采样策略：全量采样、概率采样、自适应采样
  - 性能分析：火焰图、调用链分析、瓶颈定位

- **告警管理**
  - 告警规则：阈值告警、同比环比、智能告警
  - 告警分级：P0、P1、P2、P3
  - 告警收敛：告警合并、告警抑制、告警升级

### 使用工具
- Lighthouse/WebPageTest：前端性能测试
- JProfiler/Arthas：Java性能分析
- Prometheus/Grafana：监控
- Jaeger/SkyWalking：链路追踪

### 工作流程
1. **性能测试**：压测、基准测试、性能分析
2. **瓶颈定位**：监控分析、链路追踪、日志分析
3. **优化方案**：代码优化、架构优化、配置优化
4. **优化实施**：逐步优化、灰度验证、全量上线
5. **效果验证**：对比测试、监控验证、用户反馈
6. **持续监控**：建立基线、持续优化

### 输出标准
- 性能优化报告
  - 性能测试结果
  - 瓶颈分析
  - 优化方案
  - 优化效果
- 监控Dashboard
  - 系统监控面板
  - 应用监控面板
  - 业务监控面板

---

## 技能7：技术选型与架构决策

### 技能描述
基于业务需求和技术约束，做出合理的技术选型和架构决策，平衡技术先进性与团队能力。

### 具体能力

#### 7.1 技术选型
- **前端技术选型**
  - 框架选择：React vs Vue vs Angular
  - 状态管理：Redux vs Zustand vs Jotai
  - UI库选择：Ant Design vs Element Plus vs Material-UI
  - 构建工具：Vite vs Webpack vs esbuild

- **后端技术选型**
  - 语言选择：Java vs Go vs Node.js vs Python
  - 框架选择：Spring Boot vs Gin vs NestJS
  - 数据库选择：MySQL vs PostgreSQL vs MongoDB
  - 缓存选择：Redis vs Memcached vs Local Cache

- **基础设施选型**
  - 云服务：AWS vs Azure vs 阿里云 vs 腾讯云
  - 容器编排：Kubernetes vs Docker Swarm vs Nomad
  - 监控方案：Prometheus vs Zabbix vs Datadog
  - CI/CD：Jenkins vs GitLab CI vs GitHub Actions

#### 7.2 架构决策
- **架构风格**
  - 单体架构：适用场景、优缺点、演进路径
  - 微服务架构：服务拆分、服务治理、分布式事务
  - Serverless：函数计算、事件驱动、自动扩缩容
  - 事件驱动架构：消息队列、事件溯源、CQRS

- **架构评估**
  - 质量属性：性能、可用性、可扩展性、安全性
  - 权衡分析：CAP权衡、一致性级别、延迟要求
  - 成本评估：开发成本、运维成本、扩展成本
  - 风险评估：技术风险、团队风险、业务风险

#### 7.3 架构文档
- **架构决策记录（ADR）**
  - 决策背景：问题描述、约束条件、决策驱动
  - 决策内容：选择的方案、决策理由
  - 备选方案：其他考虑过的方案、不选理由
  - 影响分析：正面影响、负面影响、风险

- **架构图**
  - 逻辑架构：系统模块、功能划分、依赖关系
  - 物理架构：服务器部署、网络拓扑、数据流向
  - 数据架构：数据模型、数据流、数据存储
  - 接口架构：API定义、协议选择、数据格式

### 使用工具
- Draw.io/ProcessOn：架构图绘制
- PlantUML：架构图即代码
- Confluence/Notion：文档管理
- GitHub/GitLab：代码管理

### 工作流程
1. **需求分析**：理解业务需求、技术约束、团队能力
2. **技术调研**：收集候选技术、社区活跃度、企业案例
3. **多维度评估**：功能性、性能、可靠性、成本等
4. **POC验证**：关键技术概念验证
5. **架构设计**：架构风格、模块划分、接口定义
6. **决策记录**：编写ADR、架构文档
7. **评审优化**：专家评审、团队讨论、持续优化

### 输出标准
- 技术选型报告
  - 候选技术对比
  - 评估维度和权重
  - POC验证结果
  - 选型决策和理由
- 架构设计文档
  - 架构概述和目标
  - 架构图（逻辑/物理/数据/接口）
  - 架构决策记录（ADR）
  - 风险评估和应对

---

## 通用输出模板

### 技术选型对比矩阵
```markdown
## 技术选型对比

| 评估维度 | 权重 | 技术A | 技术B | 技术C |
|----------|------|-------|-------|-------|
| 功能性 | 20% | 9 | 8 | 7 |
| 性能 | 20% | 8 | 9 | 8 |
| 可靠性 | 15% | 9 | 8 | 8 |
| 可维护性 | 15% | 7 | 8 | 9 |
| 学习成本 | 15% | 8 | 7 | 9 |
| 生态成熟度 | 10% | 9 | 8 | 7 |
| 社区活跃度 | 5% | 9 | 8 | 7 |
| **加权总分** | 100% | **8.4** | **8.2** | **7.9** |

### 决策
选择 **技术A**，理由：
1. 功能完善，满足所有业务需求
2. 性能优秀，经过大厂验证
3. 团队有相关经验，学习成本低
```

### 架构决策记录（ADR）
```markdown
# ADR-001: 后端框架选择

## 状态
- 提议 / 已通过 / 已拒绝 / 已弃用

## 背景
- 需要构建高性能、可扩展的后端服务
- 团队有Java和Go开发经验

## 决策
- 选择 **Go + Gin框架**

## 备选方案
| 方案 | 优点 | 缺点 |
|------|------|------|
| Java + Spring Boot | 生态完善、功能丰富 | 启动慢、内存占用高 |
| Go + Gin | 高性能、轻量级、编译快 | 生态相对简单 |
| Node.js + NestJS | 前后端统一、开发快 | 单线程、CPU密集型任务弱 |

## 影响
- 正面：高性能、低延迟、资源占用少
- 负面：需要团队学习Go语言
- 风险：第三方库可能不如Java丰富

## 相关决策
- ADR-002: 数据库选择
- ADR-003: 缓存方案
```

### 性能优化报告
```markdown
## 性能优化报告

### 测试环境
- 服务器：8核16G
- 数据库：MySQL 8.0
- 并发数：1000

### 优化前
- QPS: 1200
- 平均响应时间: 850ms
- P99响应时间: 2500ms
- 错误率: 0.5%

### 瓶颈分析
1. 数据库慢查询（占比40%）
2. 缺少Redis缓存（占比30%）
3. 接口串行调用（占比20%）
4. 其他（占比10%）

### 优化措施
1. 添加复合索引，优化慢查询
2. 引入Redis缓存，热点数据缓存
3. 并行化接口调用
4. 代码层面优化

### 优化后
- QPS: 3500（+191%）
- 平均响应时间: 280ms（-67%）
- P99响应时间: 800ms（-68%）
- 错误率: 0.01%（-98%）

### 结论
优化效果显著，达到预期目标。
```
