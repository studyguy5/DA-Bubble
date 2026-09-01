import { Component, Inject, signal } from '@angular/core';
import { DIALOG_DATA, Dialog } from '@angular/cdk/dialog';
import { DialogRef } from '@angular/cdk/dialog';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../../environment/environment';
import { input, effect } from '@angular/core';
import { Channel } from '../../../interfaces/interfaces';
import { ProfileOverviewComponent } from '../profile-overview-component/profile-overview-component';
import { ViewChild } from '@angular/core';
// import { ChannelUserSelectionComponent } from '../channel-user-selection-component/channel-user-selection-component';


// export interface MemberOverviewDialogData {
//   user_id: string;
//   chat_room_id: string;
//   avatar_url: string;
// }

interface MemberOverviewDialogData {
  title: string;
  channel: any;
  onSelectUser?: any;
}
interface ProfileMember {
  username: string;
  avatar_url: string | null;
  uuid: string;
}

@Component({
  selector: 'app-member-overview-component',
  imports: [],
  templateUrl: './member-overview-component.html',
  styleUrl: './member-overview-component.scss',
})
export class MemberOverviewComponent {
  supabase = createClient(environment.supabaseUrl, environment.supabasePublishKey)
  // channels = input<Channel | null>(null)
  members = signal<ProfileMember[]>([])
  // @ViewChild(ChannelUserSelectionComponent) channelUserSelection!: ChannelUserSelectionComponent;
  constructor(@Inject(DIALOG_DATA) public channelData: MemberOverviewDialogData, 
  @Inject(DialogRef) public dialogRef: DialogRef<MemberOverviewComponent>, @Inject(Dialog) private dialog: Dialog) {
  this.channelData = channelData
  
  effect(() => {
    this.searchingForMembers()
    console.log('Data from direct message', this.channelData)
  })
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
    if(!avatarUrl || avatarError) return
  }

  closeDialog() {
    this.dialogRef.close();
  }
  rightProfile: any
  async openProfileOverviewDialog(member_uuid: any) {
      // const channel = this.selectedChannel();
      // if (!channel) {
      //   console.warn('Kein Channel ausgewählt – Dialog wird nicht geöffnet.');
      //   return;
      // }
      // debugger;
      let memberData = this.memberWithAvatar()
      this.rightProfile = memberData.find((item) => 
      item.uuid == member_uuid
      )
      console.log('memberData', memberData)
      this.dialog.open(ProfileOverviewComponent,
        // {
        //   positionStrategy: this.overlay.position()
        //     .flexibleConnectedTo(this.anchorDiv)
        //     .withPositions([{
        //       originX: 'center',
        //       originY: 'center',
        //       overlayX: 'end',
        //       overlayY: 'bottom',
        //       offsetY: 0,
        //       offsetX: 20
        //     }])
        //     // .withFlexibleDimensions(true)
        //     // .withViewportMargin(0)
        //     .withPush(true),
        {
          width: '500px',
          height: '705px',
          panelClass: 'ProfileOverviewDialog',
          data: {
            title: 'add member to channel',
            channel: this.rightProfile,
            onSelectUser: this.channelData.onSelectUser
          },
  
        }
      )
    }

}
