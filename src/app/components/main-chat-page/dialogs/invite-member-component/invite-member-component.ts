import { Component, Inject } from '@angular/core';
import { Dialog, DIALOG_DATA } from '@angular/cdk/dialog';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../../../environment/environment';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-invite-member-component',
  imports: [],
  templateUrl: './invite-member-component.html',
  styleUrl: './invite-member-component.scss',
})
export class InviteMemberComponent {
supabase = createClient(environment.supabaseUrl, environment.supabasePublishKey)
data: any;
  constructor(private dialog: Dialog, @Inject(DIALOG_DATA) private DIALOG_DATA: any) { 
    this.data = DIALOG_DATA
  }

  
  closeDialog() {
    this.dialog.closeAll();
  }

  async pushDataIntoSupabase() {
    console.log('channelName', this.data.channelName, 'channelDescription', this.data.channelDescription)
    const channel = await this.supabase
    .from('chat_rooms')
    .insert({
      message_type: 'channel',
      name: this.data.channelName,
      description: this.data.channelDescription,
      created_at: new Date().toISOString(),
      
    })
    .select()
    .single()
    console.log('channel', channel)

    const { data, error } = await this.supabase
    .from('chat_room_members')
    .insert({
      chat_room_id: channel.data.id,
      user_id: this.data.userId,
      role: 'member',
      created_at: new Date().toISOString(),
    })
    .select()
    .single()
    console.log('data', data, 'error', error)
    this.dialog.closeAll();
  }
}
