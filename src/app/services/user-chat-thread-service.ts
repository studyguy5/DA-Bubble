import { Injectable } from '@angular/core';
import { computed, signal } from '@angular/core';
import { Message } from '../interfaces/interfaces';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environment/environment';
@Injectable({
  providedIn: 'root',
})
export class UserChatThreadService {

  supabase = createClient(environment.supabaseUrl, environment.supabasePublishKey)
  selectedThreadId = signal<string>('')
  userChat = signal<Message[]>([])

  replies = signal<Message[]>([])
  allReplies = signal<Message[]>([])

  selectedThreadMessage = computed(() => {
    return this.userChat().find((message) => message.uuid === this.selectedThreadId())
  })
  constructor() {

  }

  async pushThreadMessageToSupabase(message: Message) {
    const { data: { user }, error: userError } = await this.supabase.auth.getUser();
    const ownId = user?.id
    const { data, error } = await this.supabase
      .from('messages')
      .insert({
        chat_room_id: this.userChat().find((message) => message.uuid === this.selectedThreadId())?.chat_room_id,
        author_id: ownId,
        content: message,
        parent_message_id: this.userChat().find((message) => message.uuid === this.selectedThreadId())?.uuid
      })
      .select('uuid, chat_room_id, author_id, content, created_at, parent_message_id')
      .single();
    if (error) {
      console.error('Error inserting message:', error);
    } else {
      console.log('Message inserted successfully:', data);
    }
  }

  async pullThreadMessagesForReplies() {
    const { data, error } = await this.supabase
      .from('messages')
      .select('uuid, chat_room_id, author_id, content, created_at, parent_message_id')
      .eq('parent_message_id', this.selectedThreadId())
      // .is('parent_message_id', null)
      .order('created_at', { ascending: true });
    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      this.replies.set(data)
      console.log('Messages fetched successfully:', data);
    }
  }

  async pullAllThreadMessages(chat_room_id?: string) {
    const { data, error } = await this.supabase
      .from('messages')
      .select('uuid, chat_room_id, author_id, content, created_at, parent_message_id')
      .eq('chat_room_id', chat_room_id)
      // .not('parent_message_id', 'is', null)
      // .is('parent_message_id', null)
      .order('created_at', { ascending: true });
    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      this.allReplies.set(data)
      console.log('allReplies fetched successfully:', data);
    }
  }

  async getAllMessagesForSearchingPuropose() {
    const sel = 'uuid, chat_room_id, author_id, content, created_at, parent_message_id, chat_rooms!inner ( message_type )'
    const { data: { user }, error: userError } = await this.supabase.auth.getUser();
    const { data, error } = await this.supabase
      .from('messages')
      .select(sel)
      .eq('chat_rooms.message_type', 'channel')
      .order('created_at', { ascending: true });

    const { data: data2, error: error2 } = await this.supabase
      .from('messages')
      .select(sel)
      .eq('chat_rooms.message_type', 'private')
      .eq('author_id', user?.id)
      .order('created_at', { ascending: true });

    if (error || error2) {
      console.error('Error fetching messages:', error ?? error2);
      return [];
    }

    console.log('Messages fetched successfully:', data, data2);
    return [...(data ?? []), ...(data2 ?? [])];
  }
}
