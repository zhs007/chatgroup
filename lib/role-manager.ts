import { AIRole } from '@/config/ai-roles';
import * as roles from '@/config/roles';

export class RoleManager {
  private static instance: RoleManager;
  private rolesMap: Map<string, AIRole> = new Map();
  private rolesLoaded = false;

  private constructor() {}

  static getInstance(): RoleManager {
    if (!RoleManager.instance) {
      RoleManager.instance = new RoleManager();
    }
    return RoleManager.instance;
  }

  /**
   * 加载所有角色配置
   */
  async loadRoles(): Promise<void> {
    if (this.rolesLoaded) {
      return;
    }

    try {
      // 从角色索引文件中获取所有角色
      const roleEntries = Object.entries(roles);
      
      for (const [key, role] of roleEntries) {
        if (role && typeof role === 'object' && 'id' in role) {
          this.rolesMap.set(role.id, role as AIRole);
          console.log(`✅ 已加载角色: ${role.name} (${role.id})`);
        } else {
          console.warn(`⚠️  角色 ${key} 配置格式错误`);
        }
      }

      this.rolesLoaded = true;
      console.log(`🎭 角色管理器初始化完成，共加载 ${this.rolesMap.size} 个角色`);
    } catch (error) {
      console.error('❌ 角色配置加载失败:', error);
      throw new Error('角色配置加载失败');
    }
  }

  /**
   * 获取指定ID的角色
   */
  async getRole(id: string): Promise<AIRole | undefined> {
    await this.loadRoles();
    return this.rolesMap.get(id);
  }

  /**
   * 获取所有角色
   */
  async getAllRoles(): Promise<AIRole[]> {
    await this.loadRoles();
    return Array.from(this.rolesMap.values());
  }

  /**
   * 检查角色是否存在
   */
  async hasRole(id: string): Promise<boolean> {
    await this.loadRoles();
    return this.rolesMap.has(id);
  }

  /**
   * 热重载角色配置（开发时使用）
   */
  async reloadRoles(): Promise<void> {
    this.rolesMap.clear();
    this.rolesLoaded = false;
    await this.loadRoles();
  }

  /**
   * 获取角色数量
   */
  async getRoleCount(): Promise<number> {
    await this.loadRoles();
    return this.rolesMap.size;
  }

  /**
   * 获取指定角色类型的角色列表
   */
  async getRolesByDescription(keyword: string): Promise<AIRole[]> {
    await this.loadRoles();
    return Array.from(this.rolesMap.values()).filter(role => 
      role.description.toLowerCase().includes(keyword.toLowerCase())
    );
  }
}

// 导出单例实例
export const roleManager = RoleManager.getInstance();

// 兼容原有的导出方式
export const getAIRole = async (id: string): Promise<AIRole | undefined> => {
  return await roleManager.getRole(id);
};

export const getAllAIRoles = async (): Promise<AIRole[]> => {
  return await roleManager.getAllRoles();
};
