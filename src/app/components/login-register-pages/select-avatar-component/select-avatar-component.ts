import { Component } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { Router } from '@angular/router';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../../environment/environment';

@Component({
  selector: 'app-select-avatar-component',
  imports: [],
  templateUrl: './select-avatar-component.html',
  styleUrl: './select-avatar-component.scss',
})
export class SelectAvatarComponent {
supabase = createClient(environment.supabaseUrl, environment.supabasePublishKey)
path: string

  constructor(private route: ActivatedRoute, private router: Router) {
    this.path = "./images/avatarDefault.svg"
  
  }

  

  selectAvatar(path: string) {  
    let bigelement: any = document.querySelector('.choosenAvatarBox img');
    if (bigelement) {
      bigelement.src = path
      this.path = path
    }
    
  }

  async pushAvatarChoiseToSupabase(){
    // debugger;
    if(!this.path) return
    console.log('this.path', this.path)
    const { data: { user }, error: userError } = await this.supabase.auth.getUser()
    if(!user || userError) return
    const { data, error } = await this.supabase
    .from('profiles')
    .update({
      avatar_url: this.path
    })
    .eq('uuid', user.id)
    console.log('data', data)
    // this.router.navigate(['home'])
  }
  
}
