'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAllAIRoles, AIRole } from '@/config/ai-roles'

export default function Home() {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['jarvis']) // 默认选择主持人
  const [roles, setRoles] = useState<AIRole[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const loadedRoles = await getAllAIRoles()
        setRoles(loadedRoles)
      } catch (error) {
        console.error('加载角色失败:', error)
      } finally {
        setLoading(false)
      }
    }
    loadRoles()
  }, [])

  const toggleRole = (roleId: string) => {
    if (roleId === 'jarvis') return // 主持人必须参与
    
    setSelectedRoles(prev => 
      prev.includes(roleId) 
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    )
  }

  const startChat = () => {
    if (selectedRoles.length < 2) {
      alert('请至少选择一个AI角色（除了主持人）')
      return
    }
    
    const params = new URLSearchParams({ roles: selectedRoles.join(',') })
    router.push(`/chat?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* 导航栏 */}
        <div className="flex justify-between items-center mb-8">
          <div></div>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/documents')}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              📁 项目文档管理
            </button>
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI 聊天群组
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            多个AI角色一起讨论 Slot 游戏设计
          </p>
          <p className="text-sm text-gray-500">
            选择您希望参与讨论的AI角色，主持人 Jarvis 将自动参与
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">加载角色中...</p>
            </div>
          ) : (
            roles.map((role) => (
              <div
                key={role.id}
                className={`role-card bg-white ${
                  selectedRoles.includes(role.id) ? 'selected' : ''
                } ${role.id === 'jarvis' ? 'opacity-75' : ''}`}
                onClick={() => toggleRole(role.id)}
              >
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 rounded-full ${role.color} flex items-center justify-center text-white text-2xl mr-4`}>
                    {role.avatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {role.name}
                    </h3>
                    {role.id === 'jarvis' && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        必选
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">{role.description}</p>
                <div className="text-xs text-gray-500">
                  模型: {role.model}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="text-center">
          <div className="mb-4">
            <span className="text-sm text-gray-600">
              已选择 {selectedRoles.length} 个角色
            </span>
          </div>
          <button
            onClick={startChat}
            disabled={selectedRoles.length < 2}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            开始讨论
          </button>
        </div>
      </div>
    </div>
  )
}
