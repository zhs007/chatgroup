import { ProxyAgent, setGlobalDispatcher } from 'undici';

export class GeminiClient {
  private apiKey: string;
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta';

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is required');
    }

    // 设置代理
    if (process.env.PROXY_URL) {
      const proxyAgent = new ProxyAgent(process.env.PROXY_URL);
      setGlobalDispatcher(proxyAgent);
    }
  }

  async generateContent(
    model: string,
    prompt: string,
    systemPrompt?: string
  ): Promise<string> {
    const url = `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`;
    
    const messages = [];
    if (systemPrompt) {
      messages.push({
        role: 'user',
        parts: [{ text: systemPrompt }]
      });
    }
    messages.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: messages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || '';
  }

  async *generateContentStream(
    model: string,
    prompt: string,
    systemPrompt?: string
  ): AsyncGenerator<string, void, unknown> {
    const url = `${this.baseUrl}/models/${model}:streamGenerateContent?key=${this.apiKey}`;
    
    const messages = [];
    if (systemPrompt) {
      messages.push({
        role: 'user',
        parts: [{ text: systemPrompt }]
      });
    }
    messages.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: messages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${error}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Unable to read response stream');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            try {
              const jsonStr = trimmed.slice(6);
              if (jsonStr === '[DONE]') {
                return;
              }
              
              const data = JSON.parse(jsonStr);
              const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                yield text;
              }
            } catch (e) {
              // 忽略解析错误，继续处理下一行
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}
