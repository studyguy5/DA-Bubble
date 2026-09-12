import { Component } from '@angular/core';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Inject } from '@angular/core';
import { signal } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../../environment/environment';

import { I } from '@angular/cdk/keycodes';

interface ProfileMember {
  username: string;
  avatar_url: string | null;
  uuid: string;
}

interface MemberOverviewDialogData {
  title: string;
  channel: any;
  onSelectUser?: any;
}
@Component({
  selector: 'app-tag-members-component',
  imports: [],
  templateUrl: './tag-members-component.html',
  styleUrl: './tag-members-component.scss',
})
export class TagMembersComponent {
supabase = createClient(environment.supabaseUrl, environment.supabasePublishKey)
  constructor(@Inject(DIALOG_DATA) public channelData: MemberOverviewDialogData, @Inject(DialogRef) public dialogRef: DialogRef<TagMembersComponent>) {
    this.searchingForMembers()
  } 
   

  memberWithAvatar = signal<ProfileMember[]>([])
  async memberListHelperFunction() {
    let uuid = this.channelData.channel.uuid
    const { data, error } = await this.supabase
      .from('chat_room_members')
      .select('user_id, chat_room_id')
      .eq('chat_room_id', uuid)
    if (!data || error) return

    return data ?? []
  }
  filterResult: any
  async searchingForMembers() {
      // this.cd.detectChanges();
    const data = await this.memberListHelperFunction()
    console.log('memberList Data', data)
    let memberIds = data?.map((item: any) => item.user_id)
    const { data: avatarUrl, error: avatarError } = await this.supabase
    .from('profiles')
    .select('avatar_url, username, uuid, email')
    .in('uuid', memberIds as any)
    .order('username', { ascending: true });
    this.memberWithAvatar.set(avatarUrl as any)
    console.log('incoming Data', this.memberWithAvatar())

    if(!avatarUrl || avatarError) return
  }

  closeDialog() {
    this.dialogRef.close();
  }

  // showData() {
  // }
}
