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

  async getAllUsers(){

let { data: Userprofile, error } = await this.supabase
  .from('profiles')
  .select('*')
  if(!Userprofile || error) return
  // debugger;
  this.userTable.set(Userprofile as any)
  console.log('Data from supabase:', Userprofile)
  console.log('Data from Signal', this.userTable)
  }

  async getAllChannels(){

    let { data: channel, error } = await this.supabase
      .from('chat_rooms')
      .select('*')
      if(!channel || error) return
      // debugger;
      this.channelTable.set(channel as any)
      console.log('Data from supabase:', channel)
      console.log('Data from Signal', this.channelTable)
  }

  async getCurrentSignedInUser(){
    const { data: { user }, error: userError } = await this.supabase.auth.getUser();
    console.log('user and userError', user, userError)
    if(!user || userError) return


    const { data: profiles, error } = await this.supabase
    .from('profiles')
    .select('username')
    .eq('uuid', user?.id);
    console.log('profiles', profiles)
    if(!profiles || error) return
    return profiles[0].username
  }
}
