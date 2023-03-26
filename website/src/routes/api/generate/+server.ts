import { generate } from '$lib/utils/server-api'
import _ from 'lodash'

export async function GET({ url }): Promise<Response> {
  const prompt = url.searchParams.get('prompt') || ''
  const response = await generate(prompt)
  const reader = response.body?.getReader()
  const decoder = new TextDecoder()
  let done = false

  const stream = new ReadableStream({
    async start(controller) {
      try {
        while (!done) {
          if (!reader) {
            break
          }

          const { done: isDone, value } = await reader.read()
          const response = decoder.decode(value)
          done = isDone

          if (!done) {
            controller.enqueue(response)
          }
        }
        controller.close()
      } catch (error) {
        controller.error(error)
      } finally {
        if (reader) {
          reader.releaseLock()
        }
      }
    }
  })

  return new Response(stream, {
    headers: {
      'content-type': 'text/event-stream'
    }
  })
}
