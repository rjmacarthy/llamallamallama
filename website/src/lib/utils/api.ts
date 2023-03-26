import axios from 'axios';
import type { ChatMessageRequest } from './types';

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getChats = async () => {
  const response = await api.get('/chat');
  return response;
}

export const getChat = async (chatId: string | number) => {
  const response = await api.get(`/chat/${chatId}`);
  return response
}

export const addChat = async (input: string) => {
  const response = await api.post('/chat', { input });
  return response;
}

export const addMessage = async (message: ChatMessageRequest) => {
  const response = await api.post(`/chat/${message.chatId}/message`, message);
  return response;
}
