import { Component, Inject, signal } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../../../environment/environment';
import { UserService } from '../../../../services/user-service';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'app-invite-member-component',
  imports: [],
  templateUrl: './invite-member-component.html',
  styleUrl: './invite-member-component.scss',
})
export class InviteMemberComponent {
supabase = createClient(environment.supabaseUrl, environment.supabasePublishKey)
data: any;
active = false;
inputActive = true;
isSelected = false
  constructor(
    private dialogRef: DialogRef<any>,
    private dialog: Dialog,
    @Inject(DIALOG_DATA) private DIALOG_DATA: any,
    @Inject(UserService) private userService: UserService
  ) {
    this.data = DIALOG_DATA;
  }

  open = signal(false)
  selected = false
  searchInput: HTMLInputElement | null = null;
  filteredUsers: any[] = [];
  closeDialog() {
    this.dialogRef.close();
  }

  selectOption(event: Event) {
    if ((event.target as HTMLInputElement).value === 'specificMembers') {
      this.active = true;
      this.open.set(true);
      this.selected = true
      this.inputActive = true;
    } else {
      this.inputActive = false;
      this.active = false;
      this.open.set(false);
      this.selected = true
    }
  }

  createChannelAndInviteMembers() {
    let options = document.querySelectorAll('inviteMemberOptions > input[type="radio"]:checked') as NodeListOf<HTMLInputElement>;
    if(options.length === 0) {
      console.log('No option selected');
      return;
    }
    if(options[0].value === 'welcomeChannel') {
      this.pushDataIntoSupabase();
    }else if(options[0].value === 'specificMembers') {
      // Handle specific members invitation
    }
  }
  user = signal<any>(null);
  async searchUser() {
    this.isSelected = false;
    this.searchInput = document.getElementById('searchInput') as HTMLInputElement;
    if(this.searchInput.value.length < 3) {
      this.open.set(false);
    }else {
      this.searchInput.value = this.searchInput.value.trim();
      if(this.user() === null) {
        this.user.set(await this.userService.getAllUsers());
      }
        this.filteredUsers = this.user()?.filter((user: any) => user.username.toLowerCase().includes(this.searchInput!.value.toLowerCase()));
        
        console.log('filteredUsers', this.filteredUsers)
      this.open.set(true);
      }
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
    if(!channel.data || channel.error) {
      console.log('channel.data', channel.data, 'channel.error', channel.error)
      return
    }

    //holt alle Mitglieder der Welcome-Channel, um sie dann unten zu benutzen
    const { data: memberData, error: memberError } = await this.supabase
    .from('chat_rooms')
    .select('name, uuid, chat_room_members!inner(chat_room_id, user_id, role)')
    .eq('name', 'Welcome-Channel')
    .single()
    if (!memberData || memberError) {
      console.log('memberData', memberData, 'memberError', memberError)
      return
    }

    // überführt alle einträge in ein neues Objekt und ersetzt die chat_room_id mit der id des neuen Channels
    let dataOfMembers: any = memberData; // Änderung der typisierung zu any, um die Typfehler zu vermeiden
    let members = dataOfMembers.chat_room_members.filter((member: any) => member.user_id !== this.data.userId).map((member: any) => ({
      ...member,
      chat_room_id: channel.data.uuid,
      
    }))
    console.log('members', members)
    const { data, error } = await this.supabase
    .from('chat_room_members')
    .insert(members) // hier werden die mitlgieder in die neue Tabelle eingefügt, damit sie mitlgied des neuen Channels werden
    .select()
    
    console.log('data', data, 'error', error)
    if(!data || error) {
      console.log('data', data, 'error', error)
      return
    }
    if(!error)this.dialog.closeAll();
  }
  
  selectedUsers: any[] = [];
  selectUser(user: any) {
    debugger;
    console.log('user ausgewählt', user)
    
    this.searchInput!.value = '';
    this.isSelected = true;
    let searchBar = document.querySelector('.selectMembers') as HTMLInputElement;
    this.selectedUsers.push(user);
    this.inputActive = false;

  }

  removeUser(user: any) {
    let index = this.selectedUsers.indexOf(user);
    this.selectedUsers.splice(index, 1);
    //schauen ob mehere ausgewählt werden können ===================
  }
}
