<script lang="ts">
  import _ from 'lodash'
  import { onMount, afterUpdate } from 'svelte'
  import type { PageData } from '../../routes/$types'

  import { getGenerationEventSource } from '$lib/utils'
  import { getPrompt } from '$lib/utils/prompt'
  import type { ChatMessage, Sender } from '$lib/utils/types'
  import { addChat, addMessage, getChat } from '$lib/utils/api'
  import { messageStore, chatIdStore, chatsStore } from '$lib/store'

  let generating = false
  let messages: ChatMessage[] = []
  let id = ''
  let input = ''
  let message = ''
  let chatRef: HTMLDivElement

  chatIdStore.subscribe((value) => {
    id = value
  })

  messageStore.subscribe((value) => {
    messages = value || []
  })

  afterUpdate(() => {
    chatRef.scrollTop = chatRef.scrollHeight
  })

  onMount(() => {
    chatRef.scrollTop = chatRef.scrollHeight

    const fetchChat = async () => {
      const { data: chatMessages } = await getChat(id)
      messages = chatMessages
    }

    if (id) {
      fetchChat()
    }
  })

  const resetChat = () => {
    input = ''
    message = ''
    generating = false
  }

  const updateChatHistory = (name: string) => {
    chatsStore.update((chats) => {
      chats.unshift({
        id: _.toNumber(id),
        messages: [],
        name,
        timestamp: new Date().getTime()
      })
      return chats
    })
  }

  const updateMessages = async (message: string, sender: Sender) => {
    messages = [
      ...messages,
      {
        chat_id: id,
        sender,
        message,
        timestamp: new Date().getTime()
      }
    ]
  }

  const handleStream = () => {
    const prompt = getPrompt(input)
    const eventSource = getGenerationEventSource(prompt)
    let finalMessage = ''
    input = ''
    eventSource.onerror = async (event: Event) => {
      eventSource.close()

      updateMessages(finalMessage, 'assistant')

      if (messages.length === 2) {
        updateChatHistory(_.trim(finalMessage).substring(0, 20))
      }

      resetChat()

      await addMessage({
        sender: 'assistant',
        message: finalMessage,
        chatId: _.toNumber(id)
      })
    }

    eventSource.onmessage = (event: MessageEvent) => {
      finalMessage = message
      message = event.data
    }
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    if (!input) return

    generating = true

    if (!id) {
      const { data } = await addChat(input)
      id = data.id
    }

    await addMessage({
      sender: 'you',
      message: input,
      chatId: _.toNumber(id)
    })

    updateMessages(input, 'you')

    handleStream()
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }
</script>

<template lang="pug">
    div(
      class=`
        flex flex-col
        overflow-y-scroll
        {generating ? 'pointer-events-none' : ''}
      `
      style=`
        max-height: calc(100vh - 18rem);
        min-height: calc(100vh - 18rem);
      `
      bind:this!="{chatRef}"
    )
      div
        +if('messages && messages.length')
          +each('messages as message')
            div.flex.mb-4
              div(
                class=`
                  w-10 h-10 mr-2 flex items-center justify-center rounded-full
                  {message.sender === 'you' ? 'bg-gray-400' : 'bg-gray-500'}
                `
              )
                span.text-white.font-bold.capitalize {message.sender === 'you' ? 'Me' : 'AI'}
              div(
                class=`
                  p-2
                  rounded-lg
                  shadow-sm
                  mb-4
                  {message.sender === 'you' ? 'bg-gray-200' : 'bg-yellow-100'}
                `
              )
                span.text-left.text-sm.font-normal {message.message}
      div
        +if('message && message.length')
            div.flex.mb-4
              div(
                class=`
                  w-10 h-10 mr-2 flex items-center justify-center rounded-full
                  {message.sender === 'you' ? 'bg-gray-400' : 'bg-gray-500'}
                `
              )
                span.text-white.font-bold.capitalize {message.sender === 'you' ? 'Me' : 'AI'}
              div(class="bg-yellow-100 p-2 rounded-lg shadow-sm mb-4")
                span.text-left.text-sm.font-normal {message}
    form.prompt-form(on:submit!="{(e) => handleSubmit(e)}").mt-4
      textarea(
        class=`
          w-full h-24 border
          border-gray-300
          rounded-lg
          shadow-sm focus:border-blue-400 focus:outline-none
          focus:shadow-outline-blue p-2`
        bind:value="{input}"
        on:keydown="{handleKeyDown}"
        placeholder="Type your message here..."
      )
      input(
        disabled="{generating}"
        type="submit"
        value="Submit"
        class="bg-blue-500 mt-3 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
      )
</template>
