'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { AI_ROLES, getAIRole } from '@/config/ai-roles'
import { Message } from '@/types/chat'
import MeetingStatus from '@/components/MeetingStatus'

export default function ChatPage() {
  const searchParams = useSearchParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [typingRoles, setTypingRoles] = useState<Set<string>>(new Set())
  const [sessionId] = useState(`session_${Date.now()}`)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const selectedRoleIds = searchParams.get('roles')?.split(',') || ['jarvis']
  const selectedRoles = selectedRoleIds.map(id => getAIRole(id)).filter((role): role is NonNullable<typeof role> => role !== undefined)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, typingRoles])

  useEffect(() => {
    // 初始欢迎消息
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: '🎉 欢迎来到 AI 聊天群组！\n\n我是主持人 Jarvis，将负责主持这次关于 slot 游戏设计的讨论。我会根据讨论内容智能地邀请合适的专家参与对话。\n\n✨ 新功能：\n• 智能角色管理 - 我会自动选择最合适的专家来回应\n• 发言平衡控制 - 确保每个专家都有发言机会\n• 实时统计 - 可查看各角色的参与情况\n\n请描述一下您对 slot 游戏的想法，我会邀请合适的专家来参与讨论！',
      timestamp: new Date(),
      aiRoleId: 'jarvis'
    }
    setMessages([welcomeMessage])
  }, [])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // 首先让 Jarvis 决定下一个发言者
      await getAIResponse('jarvis', [...messages, userMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      alert('发送消息失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const getAIResponse = async (roleId: string, conversationHistory: Message[]) => {
    const role = getAIRole(roleId)
    if (!role) return

    setTypingRoles(prev => new Set([...prev, roleId]))

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roleId,
          messages: conversationHistory,
          selectedRoles: selectedRoleIds
        }),
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('Unable to read response stream')
      }

      const decoder = new TextDecoder()
      let content = ''

      const messageId = Date.now().toString() + '-' + roleId
      
      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break
        
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.content) {
                content += data.content
                
                setMessages(prev => {
                  const newMessages = [...prev]
                  const existingIndex = newMessages.findIndex(m => m.id === messageId)
                  
                  if (existingIndex >= 0) {
                    newMessages[existingIndex] = {
                      ...newMessages[existingIndex],
                      content
                    }
                  } else {
                    newMessages.push({
                      id: messageId,
                      role: 'assistant',
                      content,
                      timestamp: new Date(),
                      aiRoleId: roleId
                    })
                  }
                  
                  return newMessages
                })
              }
              
              if (data.done) {
                setTypingRoles(prev => {
                  const newSet = new Set(prev)
                  newSet.delete(roleId)
                  return newSet
                })
                
                // 如果有指定的下一个发言者，自动触发
                if (data.nextSpeaker && selectedRoleIds.includes(data.nextSpeaker)) {
                  setTimeout(() => {
                    getAIResponse(data.nextSpeaker, [...conversationHistory, {
                      id: messageId,
                      role: 'assistant',
                      content,
                      timestamp: new Date(),
                      aiRoleId: roleId
                    }])
                  }, 1500) // 稍微延长间隔以便用户阅读
                }
                
                return
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
    } catch (error) {
      console.error('Error getting AI response:', error)
      setTypingRoles(prev => {
        const newSet = new Set(prev)
        newSet.delete(roleId)
        return newSet
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Slot 游戏设计讨论
            </h1>
            <div className="flex items-center space-x-2 mt-1">
              {selectedRoles.map((role) => (
                <div key={role.id} className="flex items-center">
                  <span className={`w-3 h-3 rounded-full ${role.color} mr-1`}></span>
                  <span className="text-sm text-gray-600">{role.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <MeetingStatus selectedRoleIds={selectedRoleIds} sessionId={sessionId} />
            <a 
              href="/" 
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              重新选择角色
            </a>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-message ${message.role}`}
            >
              {message.role === 'assistant' && message.aiRoleId && (
                <div className="flex items-center mb-2">
                  {(() => {
                    const role = getAIRole(message.aiRoleId)
                    return role ? (
                      <>
                        <span className={`w-6 h-6 rounded-full ${role.color} flex items-center justify-center text-white text-sm mr-2`}>
                          {role.avatar}
                        </span>
                        <span className="font-medium text-gray-900">{role.name}</span>
                      </>
                    ) : null
                  })()}
                </div>
              )}
              <div className="whitespace-pre-wrap">{message.content}</div>
              <div className="text-xs text-gray-500 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))}
          
          {/* Typing indicators */}
          {Array.from(typingRoles).map(roleId => {
            const role = getAIRole(roleId)
            return role ? (
              <div key={`typing-${roleId}`} className="chat-message assistant">
                <div className="flex items-center mb-2">
                  <span className={`w-6 h-6 rounded-full ${role.color} flex items-center justify-center text-white text-sm mr-2`}>
                    {role.avatar}
                  </span>
                  <span className="font-medium text-gray-900">{role.name}</span>
                </div>
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot" style={{ animationDelay: '0.2s' }}></div>
                  <div className="typing-dot" style={{ animationDelay: '0.4s' }}></div>
                  <span className="ml-2 text-gray-500 text-sm">正在输入...</span>
                </div>
              </div>
            ) : null
          })}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入您的想法..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
