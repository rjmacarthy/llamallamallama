import type { RequestHandler } from './$types'

import { getErrorResponse, getResponse } from '$lib/utils'
import { getChat } from '$lib/utils/database'
import { logger } from '$lib/utils/logger'

export const GET = (async ({ params }) => {
  try {
    const chatId = params.id
    const chat = await getChat(chatId)
    return getResponse(chat)
  } catch (e) {
    logger.error(e)
    return getErrorResponse(e)
  }
}) satisfies RequestHandler
