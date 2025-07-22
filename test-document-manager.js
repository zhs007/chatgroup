// 测试项目文档管理器的功能
import { documentManager } from '../lib/document-manager';

async function testDocumentManager() {
  console.log('🧪 开始测试文档管理器...');

  try {
    // 测试1: 创建文档
    console.log('\n📝 测试1: 创建文档');
    const doc1 = await documentManager.createDocument({
      title: '测试游戏设计方案',
      content: `# 海洋主题老虎机设计

## 游戏概念
- 主题：海洋探险
- 卷轴：5x3布局
- 支付线：25条

## 特色功能
1. 海洋生物图标
2. 海豚跳跃Wild功能
3. 深海探宝免费游戏`,
      format: 'markdown',
      tags: ['游戏设计', '海洋主题', '老虎机'],
      metadata: { type: 'design', priority: 'high', stage: 'concept' },
      createdBy: 'tom'
    });
    console.log('✅ 创建文档成功:', doc1.title, `(ID: ${doc1.id})`);

    // 测试2: 创建数学验证文档
    console.log('\n🧮 测试2: 创建数学验证文档');
    const doc2 = await documentManager.createDocument({
      title: '海洋主题数学验证报告',
      content: JSON.stringify({
        rtp: 96.5,
        volatility: 'medium',
        hit_frequency: 28.5,
        max_win: '1000x',
        math_model: {
          base_game_rtp: 94.0,
          bonus_game_rtp: 2.5
        }
      }, null, 2),
      format: 'json',
      tags: ['数学验证', 'RTP计算', '海洋主题'],
      metadata: { type: 'math_verification', related_design: doc1.id },
      createdBy: 'ash'
    });
    console.log('✅ 创建数学验证成功:', doc2.title, `(ID: ${doc2.id})`);

    // 测试3: 搜索文档
    console.log('\n🔍 测试3: 搜索文档');
    const searchResults = await documentManager.searchDocuments({
      query: '海洋',
      tags: ['游戏设计']
    });
    console.log('✅ 搜索结果:', searchResults.length, '个文档');
    searchResults.forEach(doc => {
      console.log(`  - ${doc.title} (${doc.format})`);
    });

    // 测试4: 更新文档
    console.log('\n✏️  测试4: 更新文档');
    const updatedDoc = await documentManager.updateDocument(doc1.id, {
      content: doc1.content + '\n\n## 美术风格\n- 卡通风格海洋生物\n- 明亮的蓝绿色调\n- 动态海浪背景',
      changeDescription: '添加美术风格描述',
      lastModifiedBy: 'ani'
    });
    console.log('✅ 更新文档成功，版本:', updatedDoc?.version);

    // 测试5: 获取文档版本历史
    console.log('\n📚 测试5: 文档版本历史');
    const versions = await documentManager.getDocumentVersions(doc1.id);
    console.log('✅ 版本历史:', versions.length, '个版本');
    versions.forEach(version => {
      console.log(`  版本 ${version.version}: ${version.changeDescription || '初始创建'} (${version.createdBy})`);
    });

    // 测试6: 列出所有文档
    console.log('\n📋 测试6: 列出所有文档');
    const allDocs = await documentManager.listDocuments();
    console.log('✅ 总共有', allDocs.length, '个文档');
    allDocs.forEach(doc => {
      console.log(`  - ${doc.title} v${doc.version} by ${doc.createdBy}`);
    });

    // 测试7: 获取统计信息
    console.log('\n📊 测试7: 获取统计信息');
    const stats = await documentManager.getStats();
    console.log('✅ 统计信息:', {
      总文档数: stats.totalDocuments,
      已归档: stats.archivedDocuments,
      总版本数: stats.totalVersions,
      最后修改: stats.lastModified.toLocaleString()
    });

    console.log('\n🎉 文档管理器测试完成！所有功能正常工作。');

  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

// 如果直接运行此文件，执行测试
if (require.main === module) {
  testDocumentManager();
}

export { testDocumentManager };
