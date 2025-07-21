# 角色管理器系统

## 概述

角色管理器 (RoleManager) 是一个全新的角色配置管理系统，支持动态加载和热重载角色配置。

## 架构特点

### 1. 模块化角色配置
- 每个 AI 角色配置独立为一个文件
- 位于 `/config/roles/` 目录下
- 支持 TypeScript 类型检查

### 2. 自动发现机制
```typescript
// 角色管理器会自动扫描 /config/roles/ 目录
// 加载所有 .ts 和 .js 文件中的角色配置
const roles = await roleManager.getAllRoles();
```

### 3. 单例模式
```typescript
import { roleManager } from '@/lib/role-manager';

// 全局单例，确保配置一致性
const role = await roleManager.getRole('jarvis');
```

## 文件结构

```
config/
├── ai-roles.ts          // 角色接口定义和兼容性导出
└── roles/               // 角色配置目录
    ├── jarvis.ts        // 主持人 Jarvis
    ├── tom.ts           // 游戏制作人 Tom
    ├── ash.ts           // 数学制作人 Ash
    ├── peter.ts         // 游戏玩家 Peter
    ├── ani.ts           // 美术设计师 Ani
    └── jerry.ts         // 制图师 Jerry
```

## 角色配置格式

每个角色文件都遵循相同的格式：

```typescript
// config/roles/example.ts
import { AIRole } from '../ai-roles';

const exampleRole: AIRole = {
  id: 'example',
  name: 'Example',
  description: '示例角色',
  model: 'gemini-2.0-flash-exp',
  prompt: '你是一个示例角色...',
  avatar: '🤖',
  color: 'bg-blue-500'
};

export default exampleRole;
```

## API 接口

### 基础方法
```typescript
// 获取单个角色
const role = await roleManager.getRole('jarvis');

// 获取所有角色
const allRoles = await roleManager.getAllRoles();

// 检查角色是否存在
const exists = await roleManager.hasRole('tom');

// 获取角色数量
const count = await roleManager.getRoleCount();
```

### 高级查询
```typescript
// 按描述关键词搜索角色
const designers = await roleManager.getRolesByDescription('设计');

// 热重载配置（开发环境）
await roleManager.reloadRoles();
```

### 兼容性接口
```typescript
// 向后兼容的导出
import { getAIRole, getAllAIRoles } from '@/config/ai-roles';

const role = await getAIRole('jarvis');
const roles = await getAllAIRoles();
```

## 使用场景

### 1. 组件中使用
```typescript
// React 组件中异步加载角色
useEffect(() => {
  const loadRoles = async () => {
    const roles = await getAllAIRoles();
    setRoles(roles);
  };
  loadRoles();
}, []);
```

### 2. API 路由中使用
```typescript
// API 中获取角色信息
export async function POST(request: NextRequest) {
  const { roleId } = await request.json();
  const role = await getAIRole(roleId);
  
  if (!role) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }
  // ...
}
```

### 3. 服务端逻辑
```typescript
// 会议管理器中使用
async createSession(sessionId: string, roleIds: string[]) {
  const participants = await Promise.all(
    roleIds.map(async id => {
      const role = await getAIRole(id);
      return { id, name: role?.name || id };
    })
  );
  // ...
}
```

## 扩展新角色

### 1. 创建角色文件
在 `/config/roles/` 目录下创建新的 `.ts` 文件：

```typescript
// config/roles/new-expert.ts
import { AIRole } from '../ai-roles';

const newExpertRole: AIRole = {
  id: 'new_expert',
  name: 'New Expert',
  description: '新的专家角色',
  model: 'gemini-2.0-flash-exp',
  prompt: '你是一个新的专家...',
  avatar: '👨‍💼',
  color: 'bg-teal-500'
};

export default newExpertRole;
```

### 2. 自动加载
角色管理器会自动检测并加载新文件，无需修改其他代码。

### 3. 验证加载
```typescript
// 检查新角色是否成功加载
const newExpert = await roleManager.getRole('new_expert');
console.log(newExpert ? '✅ 加载成功' : '❌ 加载失败');
```

## 开发调试

### 1. 角色加载日志
服务器启动时会显示角色加载日志：
```
✅ 已加载角色: Jarvis (jarvis)
✅ 已加载角色: Tom (tom)
✅ 已加载角色: Ash (ash)
...
🎭 角色管理器初始化完成，共加载 6 个角色
```

### 2. 错误处理
- 文件格式错误会显示警告
- 加载失败会记录错误日志
- 不影响其他角色正常加载

### 3. 热重载
开发环境支持角色配置热重载：
```typescript
// 重新加载所有角色配置
await roleManager.reloadRoles();
```

## 性能优化

### 1. 懒加载
- 角色配置首次访问时加载
- 后续访问直接从内存获取

### 2. 缓存机制
- 单例模式确保配置只加载一次
- 支持手动重载更新缓存

### 3. 异步设计
- 所有角色操作都是异步的
- 不阻塞主线程执行

## 迁移指南

原有代码已自动兼容，但建议逐步迁移到新的异步 API：

### 旧版本（同步）
```typescript
import { AI_ROLES, getAIRole } from '@/config/ai-roles';

const role = getAIRole('jarvis'); // 同步
const roles = AI_ROLES; // 静态数组
```

### 新版本（异步）
```typescript
import { getAIRole, getAllAIRoles } from '@/config/ai-roles';

const role = await getAIRole('jarvis'); // 异步
const roles = await getAllAIRoles(); // 动态加载
```

## 故障排除

### 常见问题

1. **角色未加载**
   - 检查文件名和导出格式
   - 确保文件在 `/config/roles/` 目录下
   - 查看服务器日志中的错误信息

2. **类型错误**
   - 确保角色对象符合 `AIRole` 接口
   - 检查必填字段是否完整

3. **异步调用错误**
   - 确保使用 `await` 调用角色相关方法
   - 在 React 组件中使用 `useEffect` 处理异步加载
