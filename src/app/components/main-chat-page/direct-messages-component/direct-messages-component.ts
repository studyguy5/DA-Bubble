import { Component, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { input, effect, signal, Input } from '@angular/core';
import { User, Channel, ChannelMember, Message, ChatRoomMember } from '../../../interfaces/interfaces';
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
  userChat = signal<Message[]>([])
  selectedChannel = input<Channel | null>(null)

  constructor(
    @Inject(Dialog) private dialog: Dialog,
    private overlay: Overlay
  ) {
    effect(() => {
      this.channel = this.selectedChannel();
      this.uuid = this.channel?.uuid;

      this.getSelectedMembers(this.uuid)
      setTimeout(() => {
        // this.checkIfChannelOrUserSelected()

      }, 500)
    })
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

  async getSelectedMembers(uuid: any | null) {
    if (!uuid) return
    // debugger;
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

  checkIfChannelOrUserSelected() {
    // debugger;
    if (this.selectedUser()) {
      this.sendMessageToSelectedUser()
      console.log('send message to user', this.selectedUser())
    } else if (this.selectedChannel()) {
      this.sendMessageToSelectedChannel()
      console.log('send message to channel', this.selectedChannel())
    } else {
      console.warn('No user or channel selected')
    }

  }

  async sendMessageToSelectedChannel() {
    const channel = this.selectedChannel();
    const user = await this.supabase.auth.getUser();
    if (channel) {
      let input = document.getElementById('messageInput') as HTMLTextAreaElement;
      if (!input) return
      let message = input.value
      console.log('send message', message)
      if (!message) return
      const { data, error } = await this.supabase
        .from('messages')
        .insert({
          chat_room_id: channel.uuid,
          author_id: user.data.user?.id,
          content: message.trim(),

        })
      input.value = ''
      console.log('uuid', user.data.user?.id)
      if (!data || error) return
    }
  }

  async sendMessageToSelectedUser() {
    let input = document.getElementById('messageInput') as HTMLTextAreaElement;
    if (!input) return
    let message = input.value
    debugger;
    const privateRoom = await this.checkIfUserRoomExists()
    if (!privateRoom) {
      await this.createPrivateRoomAndSendMessage(message)
    } else {
      await this.selectPrivateRoomAndSendMessage(privateRoom, message)
    }
  }

  async selectPrivateRoomAndSendMessage(privateRoomId: string, messageText: string) {
    const user = this.selectedUser();
    const {data: currentUser, error: userError} = await this.supabase.auth.getUser();
    if (userError) {
      console.error('Fehler beim Abrufen des aktuellen Benutzers:', userError);
      return;
    }
    
    const { data: newMessage, error: messageError } = await this.supabase
      .from('messages')
      .insert({
        chat_room_id: privateRoomId,
        author_id: currentUser.user?.id,
        content: messageText.trim(),
      })
      .select('uuid, chat_room_id, author_id, content, created_at')
      .single();

    if (messageError) {
      console.error('Message konnte nicht erstellt werden:', messageError);
      return;
    }
    console.log('Neue Nachricht:', newMessage);

  }



  async checkIfUserRoomExists() {
    const participant: any = this.selectedUser();
    const currentUser = await this.supabase.auth.getUser();
    const myChatRooms = await this.supabase
      .from('chat_room_members')
      .select('chat_room_id')
      .eq('user_id', currentUser.data.user?.id)

    if (myChatRooms.error) console.log('error', myChatRooms.error)
    if (myChatRooms.data && myChatRooms.data.length > 0) {
      const Rooms = myChatRooms.data.map((item: any) => item.chat_room_id)
      const { data: existingRoom, error: existingRoomError } = await this.supabase
        .from('chat_room_members')
        .select('chat_room_id, user_id')
        .in('chat_room_id', Rooms)
        .in('user_id', [participant?.uuid, currentUser.data.user?.id])

      if (existingRoomError){ 
        console.log('error', existingRoomError)
        return false
      }
      if (existingRoom) {
        const sharedRoomIds = existingRoom.map(member => member.chat_room_id);
        const privateRoom = await this.supabase
          .from('chat_rooms')
          .select('uuid')
          .eq('message_type', 'private')
          .in('uuid', sharedRoomIds);
        if (privateRoom.error) console.log('error', privateRoom.error)
        if (privateRoom.data) {
          debugger;
          const thisPrivateRoom = privateRoom.data[0].uuid ?? null;
          return thisPrivateRoom;
        }
      }
      //Problem beseitingen wenn es mehrere private rooms gibt zwischen zwei usern, dann wird die erste genommen. aus supabase löschen oder im code entscheiden ===================================


    }

  }

  async createPrivateRoomAndSendMessage(messageText: string) {
    // Implement the logic to create a private room and send a message
    // This function should handle the creation of a new private chat room
    // and then send the message to that room.
    const currentUser = await this.supabase.auth.getUser()
    const { data: newRoom, error: createRoomError } = await this.supabase
      .from('chat_rooms')
      .insert({
        message_type: 'private',
        created_by: currentUser.data.user?.id
      })
      .select('uuid')
      .single();
    if (!newRoom || createRoomError) throw new Error('Failed to create a new private room');
    const privateRoomId = newRoom.uuid;
    const user = this.selectedUser() as any;
    if (!user) throw new Error('No user selected for private message');

    // Add both users to the new private room
   const { error: memberError } = await this.supabase.from('chat_room_members').insert([
      { chat_room_id: privateRoomId, user_id: currentUser.data.user?.id, role: 'owner' },
      { chat_room_id: privateRoomId, user_id: user?.uuid, role: 'member' }
    ]);
    if (memberError) {
      throw new Error('Failed to add members to the private room: ' + memberError.message);
    }
    const { error: messageError } = await this.supabase
      .from('messages')
      .insert({
        chat_room_id: newRoom.uuid,
        author_id: currentUser.data.user?.id,
        content: messageText.trim(),
      });

    if (messageError) {
      throw new Error('Failed to send message: ' + messageError.message);
    }
  }

}
