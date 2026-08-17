import { Injectable, signal, OnInit } from '@angular/core';
import { User } from '../interfaces/interfaces';
import { createClient, RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { environment } from '../../environment/environment'


@Injectable({
  providedIn: 'root',
})
export class UserService {
  
  supabase = createClient(environment.supabaseUrl, environment.supabasePublishKey)
  userTable = signal<User[]>([])
  constructor() {
    this.getAllUsers()
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
}
