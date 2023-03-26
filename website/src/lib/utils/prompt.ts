export const getPrompt = (prompt: string) => `
Below is an prompt that describes an instruction, you are an AI assistant answer the prompt as best as possible after the #Response: tag.

#Instruction
${prompt}

### Response:

`
