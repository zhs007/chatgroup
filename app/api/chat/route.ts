import { NextRequest, NextResponse } from 'next/server'
import { GeminiClient } from '@/lib/gemini-client'
import { getAIRole } from '@/config/ai-roles'
import { Message } from '@/types/chat'

export async function POST(request: NextRequest) {
  try {
    const { roleId, messages, selectedRoles } = await request.json()
    
    const role = getAIRole(roleId)
    if (!role) {
      return NextResponse.json({ error: 'Invalid role ID' }, { status: 400 })
    }

    const geminiClient = new GeminiClient()
    
    // 构建对话历史
    const conversationContext = messages
      .slice(-10) // 只取最近10条消息以控制token数量
      .map((msg: Message) => {
        if (msg.role === 'user') {
          return `用户: ${msg.content}`
        } else if (msg.aiRoleId) {
          const senderRole = getAIRole(msg.aiRoleId)
          return `${senderRole?.name || 'AI'}: ${msg.content}`
        }
        return `AI: ${msg.content}`
      })
      .join('\n\n')

    // 构建系统提示词
    let systemPrompt = role.prompt
    
    if (roleId === 'jarvis') {
      const availableRoles = selectedRoles
        .filter((id: string) => id !== 'jarvis')
        .map((id: string) => getAIRole(id))
        .filter(Boolean)
        .map((r: any) => `@${r.id} (${r.name} - ${r.description})`)
        .join(', ')
      
      systemPrompt += `\n\n当前讨论中的可用专家: ${availableRoles}\n\n`
      systemPrompt += '在你的回复中，如果需要特定专家参与，请在回复末尾用 @roleId 的格式指定下一个发言者。例如：@tom 或 @ash。\n\n'
    }
    
    systemPrompt += `\n\n对话历史:\n${conversationContext}\n\n请根据你的角色设定回复:`

    const lastUserMessage = messages
      .slice()
      .reverse()
      .find((msg: Message) => msg.role === 'user')
    
    if (!lastUserMessage) {
      return NextResponse.json({ error: 'No user message found' }, { status: 400 })
    }

    // 创建流式响应
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const generator = geminiClient.generateContentStream(
            role.model,
            lastUserMessage.content,
            systemPrompt
          )

          for await (const chunk of generator) {
            const data = {
              content: chunk,
              done: false,
              aiRoleId: roleId
            }
            
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
            )
          }

          // 发送完成信号
          const doneData = {
            content: '',
            done: true,
            aiRoleId: roleId
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
