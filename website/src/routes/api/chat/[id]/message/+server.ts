import { getResponse } from '$lib/utils'
import { addMessage } from '$lib/utils/database'
import type { ChatMessageRequest } from '$lib/utils/types'
import type { RequestHandler } from './$types'


export const POST = (async ({ request }) : Promise<Response> => {
  const body = await request.json()
  const message = await addMessage(body as ChatMessageRequest)
  return getResponse(message)
}) satisfies RequestHandler
