import type { PageServerLoad } from './$types';
import { getChat, getChats }from '$lib/utils/database';

export const load = (async ({ url }) => {
  const chats = await getChats();
  const chatId = url.searchParams.get('chatId');
  if (chatId) {
    const messages = await getChat(chatId);
    return {
      chats,
      chatId,
      messages,
    };
  }
  return {
    chats,
  };
}) satisfies PageServerLoad;
