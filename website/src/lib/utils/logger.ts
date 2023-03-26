export const logger = {
  info: (message: string) => {
    console.info(`[${new Date().toISOString()}] ${message}`)
  },
  log: (message: string) => {
    console.log(`[${new Date().toISOString()}] ${message}`)
  },
  error: (error: unknown) => {
    console.error(error)
  }
}
