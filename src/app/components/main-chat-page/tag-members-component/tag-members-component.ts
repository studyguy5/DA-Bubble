import { Component } from '@angular/core';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Inject } from '@angular/core';
import { signal } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../../environment/environment';
import { computed } from '@angular/core';
import { UserService } from '../../../services/user-service';

import { I } from '@angular/cdk/keycodes';
import { Channel } from '../../../interfaces/interfaces';

interface ProfileMember {
  username: string;
  avatar_url: string | null;
  uuid: string;
}

interface MemberOverviewDialogData {
  title: string;
  channel: any;
  inputValue: string
  members: ProfileMember[]
  allchannel: any
  symbol: string
}



@Component({
  selector: 'app-tag-members-component',
  imports: [],
  templateUrl: './tag-members-component.html',
  styleUrl: './tag-members-component.scss',
})
export class TagMembersComponent {
supabase = createClient(environment.supabaseUrl, environment.supabasePublishKey)
memberWithAvatar = signal<ProfileMember[]>([])
allchannels = signal<Channel[]>([])
inputValue = signal('');
// filteredMembers = signal<ProfileMember[]>([])
  constructor(@Inject(DIALOG_DATA) public channelData: MemberOverviewDialogData, @Inject(DialogRef) public dialogRef: DialogRef<TagMembersComponent>) {
    this.memberWithAvatar.set(channelData.members)
    console.log('Data from direct message', this.channelData.symbol)
    this.checkSymbol()
  } 
  filterResult: any

  checkSymbol() {
    // debugger
    if(this.channelData.symbol === '#') {
      this.setChannels()
      console.log('channels are setted')
    }
  }

    filteredChannels: any = computed(() => {
      const search = this.inputValue().toLowerCase().trim();
      console.log('channel for Filtering', search);
      const channels = this.allchannels();
      
      if (!search) {
        return channels;
      }
  
      return channels.filter((channel: any) =>
        channel.name.toLowerCase().includes(search)
      )
    })

    filteredMembers: any = computed(() => {
      const search = this.inputValue().toLowerCase().trim();
      if(search !== null){
        console.log('search is not null', search)
      }
    const members = this.memberWithAvatar();
    // console.log('filteredMembers WOOOO', this.filteredMembers());

    if (!search) {
      return members;
    }

    return members.filter(member =>
      member.username.toLowerCase().includes(search)
    )
  });

  setChannels() {
    if(!this.channelData.allchannel) return
    this.allchannels.set(this.channelData.allchannel)
    console.log('channels are setted 445')
  }

  closeDialog() {
    this.dialogRef.close();
  }
  
  updateInputValue(value: string): void {
    this.inputValue.set(value);
  }

}
