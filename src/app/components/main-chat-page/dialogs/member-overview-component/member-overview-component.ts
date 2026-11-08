import { Component, Inject, signal } from '@angular/core';
import { DIALOG_DATA, Dialog } from '@angular/cdk/dialog';
import { DialogRef } from '@angular/cdk/dialog';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../../../environment/environment';
import { input, effect } from '@angular/core';
import { Channel } from '../../../../interfaces/interfaces';
import { ProfileOverviewComponent } from '../../dialogs/profile-overview-component/profile-overview-component';
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
  members: ProfileMember[]
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
  memberWithAvatar = signal<ProfileMember[]>([])
  // @ViewChild(ChannelUserSelectionComponent) channelUserSelection!: ChannelUserSelectionComponent;
  constructor(@Inject(DIALOG_DATA) public channelData: MemberOverviewDialogData, 
  @Inject(DialogRef) public dialogRef: DialogRef<MemberOverviewComponent>, @Inject(Dialog) private dialog: Dialog) {
  this.memberWithAvatar.set(this.channelData.members)
  this.getOwner()
  effect(() => {
    console.log('members =====??????', this.channelData.members)
    
  })
  }

  owner: any = signal(null)
  getOwner() {
    let currentUser = this.supabase.auth.getSession()
    currentUser.then((data) => {
      console.log('currentUser', data.data?.session?.user?.id)
      this.owner.set(this.channelData.members.find((member: any) => member.uuid == data.data?.session?.user?.id))
      console.log('owner', this.owner)
    })
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
