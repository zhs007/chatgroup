'use client'

import { useState, useEffect } from 'react'
import { getAIRole } from '@/config/ai-roles'

interface MeetingStatusProps {
  selectedRoleIds: string[]
  sessionId?: string
}

interface SpeakingStats {
  [roleId: string]: number
}

export default function MeetingStatus({ selectedRoleIds, sessionId }: MeetingStatusProps) {
  const [stats, setStats] = useState<SpeakingStats>({})
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!sessionId) return

    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/meeting?sessionId=${sessionId}`)
        if (response.ok) {
          const data = await response.json()
          setStats(data.stats || {})
        }
      } catch (error) {
        console.error('Failed to fetch meeting stats:', error)
      }
    }

    // 初始获取
    fetchStats()

    // 定期更新
    const interval = setInterval(fetchStats, 10000) // 每10秒更新一次

    return () => clearInterval(interval)
  }, [sessionId])

  if (!sessionId) return null

  return (
    <div className="relative">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
      >
        📊 会议统计
      </button>
      
      {isVisible && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border p-4 min-w-48 z-10">
          <h3 className="text-sm font-medium text-gray-900 mb-3">发言统计</h3>
          <div className="space-y-2">
            {selectedRoleIds.map(roleId => {
              const role = getAIRole(roleId)
              const count = stats[roleId] || 0
              
              return role ? (
                <div key={roleId} className="flex items-center justify-between text-xs">
                  <div className="flex items-center">
                    <span className={`w-3 h-3 rounded-full ${role.color} mr-2`}></span>
                    <span className="text-gray-700">{role.name}</span>
                  </div>
                  <span className="text-gray-500">{count}次</span>
                </div>
              ) : null
            })}
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              总发言: {Object.values(stats).reduce((sum, count) => sum + count, 0)}次
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
