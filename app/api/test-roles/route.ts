import { NextResponse } from 'next/server';
import { roleManager } from '@/lib/role-manager';

export async function GET() {
  try {
    const roles = await roleManager.getAllRoles();
    const roleCount = await roleManager.getRoleCount();
    
    return NextResponse.json({
      success: true,
      message: `角色管理器测试成功`,
      data: {
        totalRoles: roleCount,
        roles: roles.map(role => ({
          id: role.id,
          name: role.name,
          description: role.description,
          avatar: role.avatar,
          color: role.color
        }))
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: '角色管理器测试失败',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
