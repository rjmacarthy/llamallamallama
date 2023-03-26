export const getGenerationEventSource = (prompt: string) =>
  new EventSource(`/api/generate?prompt=${encodeURIComponent(prompt)}`)

export const getErrorResponse = (error: unknown) =>
  new Response(JSON.stringify({ error }), {
    headers: {
      'content-type': 'application/json'
    }
  })

export const getResponse = (data: unknown) =>
  new Response(JSON.stringify(data), {
    headers: {
      'content-type': 'application/json'
    }
  })
