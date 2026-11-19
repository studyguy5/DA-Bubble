import { Component, inject, Inject } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { Router } from '@angular/router';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../../environment/environment';
import { signal } from '@angular/core';
import { Dialog, DialogRef } from '@angular/cdk/dialog';


@Component({
  selector: 'app-select-avatar-component',
  imports: [],
  templateUrl: './select-avatar-component.html',
  styleUrl: './select-avatar-component.scss',
})
export class SelectAvatarComponent {
supabase = createClient(environment.supabaseUrl, environment.supabasePublishKey)
path: string
userFeedback = signal(false)
userFeedbackEdit = signal(false)

  constructor(
    private route: ActivatedRoute,
    private router: Router,

  ) {
    this.path = "./images/avatarDefault.svg";
  }

  private dialog: any = inject(Dialog)

  selectAvatar(path: string) {  
    let bigelement: any = document.querySelector('.choosenAvatarBox img');
    if (bigelement) {
      bigelement.src = path
      this.path = path
    }
    
  }

  async pushAvatarChoiseToSupabase(){
    // debugger; eventuell die URL abfragen, damit das Userfeedback je nach situation richtig ist
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
    if(error) {
      console.log('error', error)
      return
    }
    // if(user){
    //   this.userFeedback = true
    //   setTimeout(() => {
    //     this.userFeedback = false
    //   }, 3000);
    // }

    if(user && this.router.url === '/login') {
      console.log('data', data)
      
      this.router.navigate(['home'])
      this.userFeedback.set(true)
      console.log('this.userFeedback', this.userFeedback())
      setTimeout(() => {
        this.userFeedback.set(false)
        console.log('this.userFeedback', this.userFeedback())
      }, 3000);
    }else if(user && this.router.url === '/home') {
      this.router.navigate(['home'])
      this.userFeedbackEdit.set(true)
      console.log('this.userFeedbackEdit', this.userFeedbackEdit())
      setTimeout(() => {
        this.userFeedbackEdit.set(false)
        console.log('this.userFeedbackEdit', this.userFeedbackEdit())
        this.dialog.closeAll()
      }, 3000);
    }
  }
  
}
