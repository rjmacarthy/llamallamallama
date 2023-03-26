import { BACKEND_URL } from '$lib/utils/contants'

export const generate = async (prompt: string) => {
  const response = await fetch(`${BACKEND_URL}/generate?prompt=${encodeURIComponent(prompt)}`)
  return response
}
