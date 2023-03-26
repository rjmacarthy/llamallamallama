import type { RequestHandler } from './$types'

import { getErrorResponse, getResponse } from '$lib/utils'
import { addChat, getChats } from '$lib/utils/database'
import { logger } from '$lib/utils/logger'

export const GET = (async () => {
  try {
    const chats = await getChats()
    return getResponse(chats)
  } catch (e) {
    logger.error(e)
    return getErrorResponse(e)
  }
}) satisfies RequestHandler

export const POST = (async ({ request }) => {
  const { input } = await request.json()
  const chat = await addChat(input)
  return getResponse(chat)
}) satisfies RequestHandler
