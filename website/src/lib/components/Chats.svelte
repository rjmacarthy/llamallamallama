<script lang="ts">
  import _ from 'lodash'
  import type { PageData } from '../../routes/$types'
  import type { Readable } from 'svelte/store'
  import { goto } from '$app/navigation'

  import type { Chat } from '$lib/utils/types'
  import { chatsStore, messageStore, chatIdStore } from '$lib/store'
  import { getChat } from '$lib/utils/api'
  export let data: PageData & { chatId: string }

  let chats: Chat[] = []
  let id = _.toNumber(data)

  chatsStore.subscribe((value) => {
    chats = value
  })

  chatIdStore.subscribe((value) => {
    id = _.toNumber(value)
  })

  const handleClick = async (id: number) => {
    const chat = await getChat(id)
    messageStore.set(chat.data)
    chatIdStore.set(_.toString(id))
    goto(`/?chatId=${id}`)
  }
</script>

<template lang="pug">
    div.cursor-pointer
      +if('chats && chats.length')
        +each('chats as chat')
          div(
            class=`
              {chat.id === id ? 'bg-gray-200' : ''}
              p-4 border-b border-gray-200 cursor-pointer.hover
              hover:bg-gray-200
            `
            on:click!="{(e) => handleClick(chat.id)}"
            on:keydown!="{(e) => handleClick(chat.id)}"
          )
            div {chat.name}...
            div.text-xs {new Date(chat.timestamp).toLocaleString()}
</template>
