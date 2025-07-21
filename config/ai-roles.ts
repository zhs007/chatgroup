export interface AIRole {
  id: string;
  name: string;
  description: string;
  model: string;
  prompt: string;
  avatar: string;
  color: string;
}

// 注意：角色配置已迁移到 /config/roles/ 目录下的独立文件
// 请使用 RoleManager 或从 /lib/role-manager 导入的函数来获取角色

// 兼容性导出 - 将重定向到角色管理器
export { getAIRole, getAllAIRoles } from '@/lib/role-manager';
