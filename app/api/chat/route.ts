import { NextRequest, NextResponse } from 'next/server'
import { GeminiClient } from '@/lib/gemini-client'
import { getAIRole } from '@/config/ai-roles'
import { Message } from '@/types/chat'
import { MeetingManager } from '@/lib/meeting-manager'
import { FunctionCallExecutor } from '@/lib/function-executor'
import { getFunctionCallPrompt } from '@/lib/function-calls'

export async function POST(request: NextRequest) {
  try {
    const { roleId, messages, selectedRoles } = await request.json()
    
    const role = await getAIRole(roleId)
    if (!role) {
      return NextResponse.json({ error: 'Invalid role ID' }, { status: 400 })
    }

    // 获取或创建会议会话
    const meetingManager = MeetingManager.getInstance()
    const sessionId = `session_${Date.now()}`
    
    let session = meetingManager.getSession(sessionId)
    if (!session) {
      session = await meetingManager.createSession(sessionId, selectedRoles)
    }

    const geminiClient = new GeminiClient()
    const functionExecutor = new FunctionCallExecutor()
    
    // 构建对话历史
    const conversationContext = await Promise.all(
      messages
        .slice(-10) // 只取最近10条消息以控制token数量
        .map(async (msg: Message) => {
          if (msg.role === 'user') {
            return `用户: ${msg.content}`
          } else if (msg.aiRoleId) {
            const senderRole = await getAIRole(msg.aiRoleId)
            return `${senderRole?.name || 'AI'}: ${msg.content}`
          }
          return `AI: ${msg.content}`
        })
    )

    // 构建系统提示词
    let systemPrompt = role.prompt
    
    if (roleId === 'jarvis') {
      const availableRoles = await Promise.all(
        selectedRoles
          .filter((id: string) => id !== 'jarvis')
          .map((id: string) => getAIRole(id))
      )
      
      const rolesDescription = availableRoles
        .filter(Boolean)
        .map((r: any) => `${r.id} (${r.name} - ${r.description})`)
        .join(', ')
      
      systemPrompt += `\n\n当前讨论中的可用专家: ${rolesDescription}\n\n`
      systemPrompt += getFunctionCallPrompt()
    }
    
    systemPrompt += `\n\n对话历史:\n${conversationContext.join('\n\n')}\n\n请根据你的角色设定回复:`

    const lastUserMessage = messages
      .slice()
      .reverse()
      .find((msg: Message) => msg.role === 'user')
    
    if (!lastUserMessage) {
      return NextResponse.json({ error: 'No user message found' }, { status: 400 })
    }

    // 设置当前发言者
    meetingManager.setCurrentSpeaker(sessionId, roleId)

    // 创建流式响应
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let fullContent = ''
          const generator = geminiClient.generateContentStream(
            role.model,
            lastUserMessage.content,
            systemPrompt
          )

          for await (const chunk of generator) {
            fullContent += chunk
            
            const data = {
              content: chunk,
              done: false,
              aiRoleId: roleId
            }
            
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
            )
          }

          // 处理Function Call（仅对Jarvis）
          let nextSpeaker: string | null = null
          if (roleId === 'jarvis') {
            const functionCalls = functionExecutor.parseFunctionCalls(fullContent)
            
            for (const call of functionCalls) {
              const result = await functionExecutor.executeFunctionCall(
                sessionId,
                call.name,
                call.parameters
              )
              
              if (result.success && result.nextSpeaker) {
                nextSpeaker = result.nextSpeaker
              }
              
              console.log('Function call result:', result)
            }
            
            // 清理内容，移除函数调用标签
            fullContent = functionExecutor.cleanContent(fullContent)
          }

          // 更新消息计数
          meetingManager.addMessageCount(sessionId, roleId)

          // 发送完成信号
          const doneData = {
            content: '',
            done: true,
            aiRoleId: roleId,
            nextSpeaker
          }
          
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(doneData)}\n\n`)
          )
          
          controller.close()
        } catch (error) {
          console.error('Streaming error:', error)
          controller.error(error)
        }
      }
    })

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
