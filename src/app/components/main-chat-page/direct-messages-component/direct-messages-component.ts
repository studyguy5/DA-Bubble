import { Component, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { input, effect, signal, Input } from '@angular/core';
import { User, Channel, ChannelMember, Message, ChatRoomMember, Members } from '../../../interfaces/interfaces';
import { Dialog, DialogConfig } from '@angular/cdk/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { ChannelInfoComponent } from '../channel-info-component/channel-info-component';
import { AddMemberToChannelComponent } from '../add-member-to-channel-component/add-member-to-channel-component';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../../environment/environment';
import { MemberOverviewComponent } from '../member-overview-component/member-overview-component';
import { ProfileOverviewComponent } from '../profile-overview-component/profile-overview-component';
import { V } from '@angular/cdk/keycodes';
import { DatePipe } from '@angular/common';
import { UserService } from '../../../services/user-service';

@Component({
  selector: 'app-direct-messages-component',
  imports: [DatePipe],
  templateUrl: './direct-messages-component.html',
  styleUrl: './direct-messages-component.scss',
})
export class DirectMessagesComponent {
  readonly DEFAULT_MALE_AVATAR = '/images/male_Avatar1.svg';

  @Input() selectUserFromDialog: (user: any) => void = () => { };
  @ViewChild('addMemberDiv', { static: false }) anchorDiv!: ElementRef;
  @ViewChild(MemberOverviewComponent) memberOverviewComponent!: MemberOverviewComponent;
  uuid: any
  channel: any

  members = signal<ChannelMember[] | null>([])

  supabase = createClient(environment.supabaseUrl, environment.supabasePublishKey)
  selectedUser = input<User | null>(null)
  allMembers = signal<Members[]>([])
  userChat = signal<Message[]>([])
  selectedChannel = input<Channel | null>(null)

  constructor(
    @Inject(Dialog) private dialog: Dialog,
    private overlay: Overlay, private userService: UserService
  ) {
    effect(() => {
      this.channel = this.selectedChannel();
      this.uuid = this.channel?.uuid;
      setTimeout(() => {

        this.showMessagesFromSelectedChannelOrUser()


      }, 200)
    })

    this.getProfiles()
  }

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
  openMemberOverviewDialog() {
    const membersWithAvatar = this.getSelectedMEMBERS(this.uuid)
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


  async getProfiles() {
    // debugger
    const profile = await this.userService.getProfileNames()
    this.allMembers.set(profile as any)
  }
  


  async showMessagesFromSelectedChannelOrUser() {
    // debugger;
    const channel = this.selectedChannel();
    let user: any = await this.supabase.auth.getUser();
    const participant: any = this.selectedUser();
    if (!channel) {
      console.warn('Kein Channel ausgewählt – Nachrichten werden nicht angezeigt.');
    } else {
      user = null
      this.getSelectedMEMBERS(channel.uuid)
      this.getMessagesFromSelectedCHANNEL(channel.uuid)
      return
    }

    if (!user) {
      console.warn('Kein Benutzer ausgewählt – Nachrichten werden nicht angezeigt.');
    } else {
      this.members.set(null);
      this.getMessagesFromSelectedUSER(user.data.user?.id, participant?.uuid)
    }
  }

  async getMessagesFromSelectedCHANNEL(uuid: string) {
    // debugger;
    const messages = await this.userService.getMessagesFromSelectedChannel(uuid)
    this.userChat.set(messages as Message[]);
    console.log('Nachrichten für den ausgewählten Channel:', messages);

  }

  async getMessagesFromSelectedUSER(author_id: string, participant_uuid: string | null) {


    const messages: any = await this.userService.getMessagesFromSelectedUser(author_id, participant_uuid)
    this.userChat.set([] as Message[]);

    console.log('Nachrichten:', messages);
    

    this.userChat.set(messages ?? [] as Message[]);

  }



  async getSelectedMEMBERS(uuid: any | null) {
    // let member = this.members()
    const membersWithAvatar = await this.userService.getSelectedMembers(uuid)
    
    this.members.set(membersWithAvatar as any)


    return membersWithAvatar
  }


  checkIfChannelOrUserSelected() {
    // debugger;
    if (this.selectedUser()) {
      this.sendMessageToSelectedUser()
      console.log('send message to user', this.selectedUser())
    } else if (this.selectedChannel()) {
      this.sendMessageToSelectedCHANNEL()
      console.log('send message to channel', this.selectedChannel())
    } else {
      console.warn('No user or channel selected')
    }

  }

  async sendMessageToSelectedCHANNEL() {
    const channel = this.selectedChannel();
    const data = this.userService.sendMessageToSelectedChannel(channel);
    
  }



  async sendMessageToSelectedUser() {
    let input = document.getElementById('messageInput') as HTMLTextAreaElement;
    if (!input) return
    let message = input.value
    debugger;
    const privateRoom = await this.checkIfUserRoomEXISTS()
    if (!privateRoom) {
      await this.createPrivateRoomAndSendMessage(message)
    } else {
      await this.selectPrivateRoomAndSendMESSAGE(privateRoom, message)
    }
  }




  async checkIfUserRoomEXISTS() {
    const participant: any = this.selectedUser();
    // const currentUser = await this.supabase.auth.getUser();
    const privateRooms = await this.userService.checkIfUserRoomExists(participant)
    
    return privateRooms
  }
  




  async selectPrivateRoomAndSendMESSAGE(privateRoomId: string, messageText: string) {
    // const user = this.selectedUser();
    this.userService.selectPrivateRoomAndSendMessage(privateRoomId, messageText)
    

  }

  async createPrivateRoomAndSendMessage(messageText: string) {
    
    const currentUser = await this.supabase.auth.getUser()
    const user = this.selectedUser()
    this.userService.createPrivateRoomAndSendMessage(messageText, user)
    
  }



}
