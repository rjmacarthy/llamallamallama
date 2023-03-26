import type { Chat, ChatMessage } from '$lib/utils/types';
import { writable } from 'svelte/store';

export const chatIdStore = writable<string>('');
export const chatsStore = writable<Chat[]>([]);
export const messageStore = writable<ChatMessage[]>([]);
