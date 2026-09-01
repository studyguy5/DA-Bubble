import { Component, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { input, effect, signal, Input } from '@angular/core';
import { User, Channel, ChannelMember } from '../../../interfaces/interfaces';
import { Dialog, DialogConfig } from '@angular/cdk/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { ChannelInfoComponent } from '../channel-info-component/channel-info-component';
import { AddMemberToChannelComponent } from '../add-member-to-channel-component/add-member-to-channel-component';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../../environment/environment';
import { MemberOverviewComponent } from '../member-overview-component/member-overview-component';
import { ProfileOverviewComponent } from '../profile-overview-component/profile-overview-component';
import { V } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-direct-messages-component',
  imports: [],
  templateUrl: './direct-messages-component.html',
  styleUrl: './direct-messages-component.scss',
})
export class DirectMessagesComponent {
  readonly DEFAULT_MALE_AVATAR = '/images/male_Avatar1.svg';
  
  @Input() selectUserFromDialog: (user: any) => void = () => { };
  @ViewChild('addMemberDiv', { static: false }) anchorDiv!: ElementRef;
  @ViewChild(MemberOverviewComponent) memberOverviewComponent!: MemberOverviewComponent;
  
  
  supabase = createClient(environment.supabaseUrl, environment.supabasePublishKey)
  selectedUser = input<User | null>(null)
  selectedChannel = input<Channel | null>(null)
  
  constructor(
    @Inject(Dialog) private dialog: Dialog,
    private overlay: Overlay
  ) {
    effect(() => {
      this.channel = this.selectedChannel();
      this.uuid = this.channel?.uuid;

      this.getSelectedMembers(this.uuid)
    });



  }
  uuid: any
  channel: any
  openInfoDialog() {
    const channel = this.selectedChannel();
    console.log('channel in open Dialog', channel)
    if (!channel) {
      console.warn('Kein Channel ausgewählt – Dialog wird nicht geöffnet.');
      return;
    }

    this.dialog.open(ChannelInfoComponent,
      {
        width: '872px',
        height: '616px',
        panelClass: 'createChannelDialog',
        data: {
          title: 'Create Channel',
          channel: channel
        },

      }
    )
  }

  openAddMemberToChannelDialog() {
    const channel = this.selectedChannel();
    if (!channel) {
      console.warn('Kein Channel ausgewählt – Dialog wird nicht geöffnet.');
      return;
    }
    this.dialog.open(AddMemberToChannelComponent,

      {
        positionStrategy: this.overlay.position()
          .flexibleConnectedTo(this.anchorDiv)
          .withPositions([{
            originX: 'center',
            originY: 'center',
            overlayX: 'end',
            overlayY: 'bottom',
            offsetY: 0,
            offsetX: 20
          }])
          // .withFlexibleDimensions(true)
          // .withViewportMargin(0)
          .withPush(true),
        width: '514px',
        height: '294px',
        panelClass: 'addMemberToChannelDialog',
        data: {
          title: 'add member to channel',
          channel: channel
        },

      }
    )
  }





  members = signal<ChannelMember[]>([])

  async getSelectedMembers(uuid: any) {

    console.log('requested UUID,', this.uuid);
    const { data: members, error } = await this.supabase
      .from('chat_room_members')
      .select('user_id, chat_room_id')
      .eq('chat_room_id', uuid);
    let memberIds = members?.map((item: any) => item.user_id)
    
    if (!members || error) console.log('error', error)

    const { data: avatarUrl, error: avatarError } = await this.supabase
      .from('profiles')
      .select('avatar_url, uuid')
      .in('uuid', memberIds as any);
    let membersWithAvatar = members?.map((item: any) => {
      return {
        ...item,
        avatar_url: avatarUrl?.find((avatar: any) => avatar.uuid == item.user_id)?.avatar_url
      }
    })
    console.table('membersWithAvatar', membersWithAvatar)
    this.members.set(membersWithAvatar as any)

    if (!avatarUrl || avatarError) return
    return membersWithAvatar
  }

  openMemberOverviewDialog() {
    const membersWithAvatar = this.getSelectedMembers(this.uuid)
    const channel = this.selectedChannel();
    console.log('anchorDiv', this.anchorDiv)
    this.dialog.open(MemberOverviewComponent,
      {
        positionStrategy: this.overlay.position()
          .flexibleConnectedTo(this.anchorDiv)
          .withPositions([{
            originX: 'center',
            originY: 'center',
            overlayX: 'end',
            overlayY: 'bottom',
            offsetY: 0,
            offsetX: -35
          }])
          // .withFlexibleDimensions(true)
          // .withViewportMargin(0)
          .withPush(true),
        width: '415px',
        height: '411px',
        panelClass: 'memberOverviewDialog',
        data: {
          title: 'View Members',
          channel: channel,
          onSelectUser: (user: any) =>
            this.selectUserFromDialog?.(user)
        },
      }
    )
  }


}
