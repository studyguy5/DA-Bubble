import { Component, Inject } from '@angular/core';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../../environment/environment'; 

interface CreateChannelDialogData {
  title: string;
}
@Component({
  selector: 'app-create-channel-component',
  imports: [ReactiveFormsModule],
  templateUrl: './create-channel-component.html',
  styleUrl: './create-channel-component.scss',
})
export class CreateChannelComponent {
  supabase = createClient(environment.supabaseUrl, environment.supabasePublishKey)
  constructor(@Inject(DIALOG_DATA) public data: CreateChannelDialogData,@Inject(DialogRef) private readonly dialogRef: DialogRef<CreateChannelComponent>) {
    
  } 

  channelGroup = new FormGroup({
    channelName: new FormControl(),
    channelDescription: new FormControl(),
  });

  async pushDataIntoSupabase() {
    console.log('this.channelGroup.value',this.channelGroup.getRawValue())
    if(!this.channelGroup) return
    const channelName = this.channelGroup.getRawValue().channelName || '';
    const channelDescription = this.channelGroup.getRawValue().channelDescription || '';
    console.log('channelName', channelName, 'channelDescription', channelDescription)
    const channel = await this.supabase
    .from('chat_rooms')
    .insert({
      message_type: 'channel',
      name: channelName,
      description: channelDescription,
      created_at: new Date().toISOString(),
      
    })
    .select()
    .single()
    console.log('channel', channel)
    this.dialogRef.close()
  }

  
}
