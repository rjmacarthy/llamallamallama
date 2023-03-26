<script lang="ts">
  import type { PageData } from './$types'
  import _ from 'lodash'

  import Chat from '$lib/components/Chat.svelte'
  import Chats from '$lib/components/Chats.svelte'
  import type { Chat as ChatType, ChatMessage } from '$lib/utils/types'
  import { chatsStore, messageStore, chatIdStore } from '$lib/store'

  export let data: PageData & { chats: ChatType[]; chatId: string; messages: ChatMessage[] }
  chatsStore.set(data.chats)
  messageStore.set(data.messages)
  chatIdStore.set(data.chatId)
</script>

<svelte:head>
  <title>llamallamallama</title>
  <meta name="description" content="Svelte Chat" />
</svelte:head>

<template lang="pug">
  div.flex.h-screen
    div(class="flex flex-col flex-shrink-0 flex-grow-0 w-64")
      div.p-4.bg-gray-300
        h1.text-2xl.text-gray-700
      div.flex-grow.overflow-y-scroll
        Chats(data="{data.chatId}")
    div(class="flex flex-col flex-grow mr-auto")
      div.p-4.bg-gray-300
        h1.text-2xl.text-gray-700
      div.p-4.flex-grow.overflow-y-scroll.flex.flex-col
        Chat(data="{data}")
</template>
