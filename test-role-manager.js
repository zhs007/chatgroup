// 角色管理器测试脚本
import { roleManager } from './lib/role-manager';

async function testRoleManager() {
  console.log('🧪 开始测试角色管理器...\n');

  try {
    // 测试获取所有角色
    console.log('📋 获取所有角色:');
    const allRoles = await roleManager.getAllRoles();
    console.log(`✅ 成功加载 ${allRoles.length} 个角色:`);
    allRoles.forEach(role => {
      console.log(`   - ${role.name} (${role.id}): ${role.description}`);
    });

    console.log('\n🔍 测试单个角色获取:');
    
    // 测试获取特定角色
    const jarvis = await roleManager.getRole('jarvis');
    if (jarvis) {
      console.log(`✅ Jarvis: ${jarvis.name} - ${jarvis.description}`);
    } else {
      console.log('❌ 未找到 Jarvis 角色');
    }

    const tom = await roleManager.getRole('tom');
    if (tom) {
      console.log(`✅ Tom: ${tom.name} - ${tom.description}`);
    } else {
      console.log('❌ 未找到 Tom 角色');
    }

    // 测试不存在的角色
    const nonExistent = await roleManager.getRole('nonexistent');
    if (nonExistent) {
      console.log('❌ 不应该找到不存在的角色');
    } else {
      console.log('✅ 正确处理不存在的角色');
    }

    console.log('\n📊 角色管理器统计:');
    console.log(`总角色数: ${await roleManager.getRoleCount()}`);
    console.log(`是否有 Jarvis: ${await roleManager.hasRole('jarvis')}`);
    console.log(`是否有不存在的角色: ${await roleManager.hasRole('nonexistent')}`);

    console.log('\n🎯 按类型查找角色:');
    const designers = await roleManager.getRolesByDescription('设计');
    console.log(`设计相关角色 (${designers.length}):`, designers.map(r => r.name));

    console.log('\n✅ 角色管理器测试完成！');

  } catch (error) {
    console.error('❌ 角色管理器测试失败:', error);
  }
}

// 如果直接运行此文件，执行测试
if (require.main === module) {
  testRoleManager();
}

export { testRoleManager };
