
import { Injectable, signal, OnInit } from '@angular/core';
import { User, Channel } from '../interfaces/interfaces';
import { createClient, RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { environment } from '../../environment/environment'
import { EmojiPickerComponent } from '../components/main-chat-page/emoji-picker-component/emoji-picker-component';

@Injectable({
  providedIn: 'root',
})
export class UserReactionService {

  subabase = createClient(environment.supabaseUrl, environment.supabasePublishKey)
  constructor() { 

  }

  async getReactions(){
    const { data, error } = await this.subabase
    .from('message_reactions')
    .select('*')
    .order('created_at', { ascending: true })
    if(!data || error) return
    return data
  }


  async pushReactions(emoji: string, message_uuid: string){
    const { data, error } = await this.subabase
    .from('message_reactions')
    .insert({
      message_id: message_uuid,
       emoji
    })
    if(!data || error) return
  }
}

