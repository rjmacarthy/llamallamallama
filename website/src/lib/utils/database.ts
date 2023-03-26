import sqlite3 from 'sqlite3'
import type { Chat, ChatMessage, ChatMessageRequest } from './types'

const db = new sqlite3.Database('db.sqlite')

export const createTables = () => {
  return new Promise((resolve) => {
    db.run(`
      CREATE TABLE IF NOT EXISTS chats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        name TEXT
      );
    `)

    db.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chat_id INTEGER,
        sender TEXT,
        message TEXT,
        timestamp INTEGER
      );
    `)
    resolve(true)
  })
}

export const getChats = async () => {
  const selectChatsQuery = `
    SELECT * FROM chats ORDER BY id DESC
  `
  try {
    return await new Promise((resolve) => {
      db.all(selectChatsQuery, (err, chats) => {
        if (err) {
          console.error('Get chats error:', err)
          return
        }

        resolve(chats as Chat[])
      })
    })
  } catch (err) {
    console.error('Get chats error:', err)
    return new Promise((resolve) => resolve([] as Chat[]))
  }
}

export const getChat = async (id: string): Promise<ChatMessage[]> => {
  const selectChatQuery = `
    SELECT messages.*, chats.*
    FROM messages
    JOIN chats ON messages.chat_id = chats.id
    WHERE chats.id = ?
    ORDER BY messages.id ASC
`
  try {
    return await new Promise((resolve, reject) => {
      db.all(selectChatQuery, [id], (err, messages: ChatMessage[]) => {
        if (err) {
          console.error('Get chat error:', err)
          reject(err)
          return
        }

        return resolve(messages)
      })
    })
  } catch (err) {
    console.error('Get chats error:', err)
    return new Promise((resolve) => resolve([] as ChatMessage[]))
  }
}

export const addChat = async (input: string): Promise<Chat> => {
  const statement = db.prepare('INSERT INTO chats (name) VALUES (?)') as sqlite3.RunResult;
  const name = input.substring(0, 20);

  return new Promise((resolve, reject) => {
    statement.run(name, (err) => {
      if (err) {
        console.error('Add chat error:', err);
        reject(err);
        return;
      }

      const newChatId = statement.lastID;

      db.get('SELECT * FROM chats WHERE id = ?', [newChatId], (err, chat) => {
        if (err) {
          console.error('Get chat error:', err);
          reject(err);
          return;
        }

        resolve(chat as Chat);
      });
    });
  });
}

export const addMessage = async (mesasge: ChatMessageRequest): Promise<ChatMessage> => {
  const timestamp = Date.now();
  const statement = db.prepare(
    'INSERT INTO messages (chat_id, message, sender, timestamp) VALUES (?, ?, ?, ?)'
  ) as sqlite3.RunResult;

  return new Promise((resolve, reject) => {
    statement.run(mesasge.chatId, mesasge.message, mesasge.sender, timestamp, (err: Error) => {
      if (err) {
        console.error('Add message error:', err);
        reject(err);
        return;
      }

      const newMessageId = statement.lastID;

      db.get('SELECT * FROM messages WHERE id = ?', [newMessageId], (err, message) => {
        if (err) {
          console.error('Get message error:', err);
          reject(err);
          return;
        }

        resolve(message as ChatMessage);
      });
    });
  });
};
