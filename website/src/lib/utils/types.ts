export interface Chat {
  id: number
  messages?: ChatMessage[]
  name: string
  timestamp: number
}

export type ChatMessage = {
  id?: number
  chat_id?: string | number
  sender: string
  message: string
  timestamp: number
}

export type ChatMessageRequest = {
  message: string
  sender: string
  chatId: number
}

export type Sender = 'you' | 'assistant'
