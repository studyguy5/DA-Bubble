import { Injectable, signal, OnInit } from '@angular/core';
import { User, Channel } from '../interfaces/interfaces';
import { createClient, RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { environment } from '../../environment/environment'


@Injectable({
  providedIn: 'root',
})
export class UserService {

  supabase = createClient(environment.supabaseUrl, environment.supabasePublishKey)
  userTable = signal<User[]>([])
  channelTable = signal<Channel[]>([])
  constructor() {
    this.getAllUsers()
    this.getAllChannels()
    this.getCurrentSignedInUser()
  }

  async getAllUsers() {

    let { data: Userprofile, error } = await this.supabase
      .from('profiles')
      .select('*')
    if (!Userprofile || error) return
    // debugger;
    this.userTable.set(Userprofile as any)
    console.log('Data from supabase:', Userprofile)
    // console.log('Data from Signal', this.userTable)
  }

  async getAllChannels() {

    let { data: channel, error } = await this.supabase
      .from('chat_rooms')
      .select('message_type, name, description, created_by, uuid, created_at')
      .eq('message_type', 'channel')
    if (!channel || error) return
    // debugger;
    this.channelTable.set(channel as any)
    console.log('Data from supabase:', channel)
    // console.log('Data from Signal', this.channelTable)
  }

  async getCurrentSignedInUser() {
    const { data: { user }, error: userError } = await this.supabase.auth.getUser();
    console.log('user and userError', user)
    if (!user || userError) return


    const { data: profiles, error } = await this.supabase
      .from('profiles')
      .select('username')
      .eq('uuid', user?.id);
    // console.log('profiles', profiles)
    if (!profiles || error) return
    return profiles[0].username
  }

  selectUserInProfileOverview(user: User) {
    console.log('selected user in profile overview', user)
    this.userTable.set([user])
  }

  async getProfileNames() {
    // debugger
    const uuid = await this.supabase.auth.getUser();
    const { data: ProfileNames, error } = await this.supabase
      .from('profiles')
      .select('username, uuid')

    if (!ProfileNames || error) console.log('error from ProfileNames', error)
    console.log('ProfileNames for Messages', ProfileNames)
    // this.allMembers.set(ProfileNames as any)
    return ProfileNames
  }

  async getMessagesFromSelectedChannel(uuid: string) {
    // debugger;
    const { data, error }: any = await this.supabase
      .from('messages')
      .select('*')
      .eq('chat_room_id', uuid)
      .order('created_at', { ascending: true })
    if (!data || error) {
      console.error('Fehler beim Abrufen der Channel Nachrichten:', error);
      return;
    }
    console.log('Nachrichten für den ausgewählten Channel:', data);
    return data
  }
  chat_room_id: any
  messages: any
  async getMessagesFromSelectedUser(author_id: string, participant_uuid: string | null) {
    // debugger;
    const { data: roomA, error: error } = await this.supabase
      .from('chat_room_members')
      .select('*')
      .eq('user_id', author_id)

      .order('created_at', { ascending: true })
    if (!roomA || error) {
      console.error('Fehler beim Laden der Private Chat-Rooms:', error);
    }
    
    const { data: roomB, error: roomsBError } = await this.supabase
    .from('chat_room_members')
      .select('chat_room_id')
      .eq('user_id', participant_uuid);
      if (!roomB || roomsBError) console.log('roomsBError', roomB)

    
    
    const roomId = roomA
      ?.map(room => room.chat_room_id)
      .filter(id => roomB?.some(room => room.chat_room_id === id));
      if(!roomId || roomId.length === 0){
        return
      }
     
      this.chat_room_id = roomId
      const { data: chatRoom, error: roomIdError } = await this.supabase
      .from('chat_rooms')
      .select('*')
      .in('uuid', this.chat_room_id)
      .eq('message_type', 'private')
      if(chatRoom !== null){
        return this.messages = null
      }
    

    const { data: messages, error: messagesError } = await this.supabase
      .from('messages')
      .select('*')
      .in('chat_room_id', this.chat_room_id)
      .order('created_at', { ascending: true })
    if (!messages || messagesError) {
      console.error('Fehler beim Laden der Nachrichten:', messagesError);
    }
    console.log('Nachrichten:', messages);
    this.messages = messages
    // this.userChat.set(messages as Message[]);
    return this.messages
  }

  async getSelectedMembers(uuid: any | null) {
    // let member = this.members()

    if (!uuid) {
      return
    }
    // debugger;
    // console.log('requested UUID,', this.uuid);
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
    // this.members.set(membersWithAvatar as any)

    if (!avatarUrl || avatarError) return
    return membersWithAvatar
  }

  async sendMessageToSelectedChannel(channel: any | null) {
    // const channel = this.selectedChannel();
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


  async checkIfUserRoomExists(participant: any | null) {
    // const participant: any = this.selectedUser();
    // debugger;
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

      if (existingRoomError) {
        console.log('error', existingRoomError)
        return false
      }
      if (existingRoom) {
        const sharedRoomIds = existingRoom.map(member => member.chat_room_id);
        if(sharedRoomIds.length === 0) return
        const {data: privateRoom, error: privateRoomError} = await this.supabase
          .from('chat_rooms')
          .select('uuid')
          .eq('message_type', 'private')
          .in('uuid', sharedRoomIds);
        if (privateRoomError) {
          console.log('error', privateRoomError)
          return
        }
        if (privateRoom && privateRoom.length > 0) {
          const thisPrivateRoom = privateRoom[0].uuid ?? null;
          return thisPrivateRoom;
        }else {
          return false
        }
      }
      //Problem beseitingen wenn es mehrere private rooms gibt zwischen zwei usern, dann wird die erste genommen. aus supabase löschen oder im code entscheiden ===================================


    }

  }


  async selectPrivateRoomAndSendMessage(privateRoomId: string, messageText: string) {
    // const user = this.selectedUser();
    const { data: currentUser, error: userError } = await this.supabase.auth.getUser();
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


  async createPrivateRoomAndSendMessage(messageText: string, user: any) {

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
    // const user = this.selectedUser() as any;
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
