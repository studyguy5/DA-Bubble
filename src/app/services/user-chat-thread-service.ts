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
      .select('uuid, chat_room_id, author_id, content, created_at')
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
      .select('uuid, chat_room_id, author_id, content, created_at')
      .eq('parent_message_id', this.selectedThreadId())
      .order('created_at', { ascending: true });
    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      this.replies.set(data)
      console.log('Messages fetched successfully:', data);
    }
  }
}
