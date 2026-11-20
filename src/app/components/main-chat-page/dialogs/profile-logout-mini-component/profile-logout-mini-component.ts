import { Component, Inject } from '@angular/core';
import { UserService } from '../../../../services/user-service/user-service';
import { Router } from '@angular/router';
import { Dialog, DIALOG_DATA } from '@angular/cdk/dialog';
import { OwnProfileOverviewComponent } from '../own-profile-overview-component/own-profile-overview-component';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../../../environment/environment';
import { signal } from '@angular/core';
import { ProfileInfos } from '../../../../interfaces/interfaces';

@Component({
  selector: 'app-profile-logout-mini-component',
  imports: [],
  templateUrl: './profile-logout-mini-component.html',
  styleUrl: './profile-logout-mini-component.scss',
})
export class ProfileLogoutMiniComponent {

  constructor(private userService: UserService, private router: Router, @Inject(Dialog) private dialog: any) {
    // this.userService = userService
  } 

  supabase = createClient(environment.supabaseUrl, environment.supabasePublishKey)
  readonly profileInfos = signal<ProfileInfos[]>([]);
  collectedInfos: any
  ownData: any

  logout(){
   this.userService.logoutService()
   this.router.navigate(['login'])
   this.dialog.closeAll()
   this.updateStatusToLoggedOut()
  }
  async ngOnInit(): Promise<void> {
      await this.getOwnProfileInfos();
    }

    async updateStatusToLoggedOut(){
      const  user = await this.supabase.auth.getUser()
      const thisUser = user.data.user
      const {data, error} = await this.supabase
      .from('profiles')
      .update({activity_status: false})
      .eq('uuid', thisUser?.id)
    }
    async getOwnProfileInfos() {
      const { data, error } = await this.supabase.auth.getUser()
      if (!data || error) return
  
      console.log('this.profileInfos', this.profileInfos)
      const allProfiles: any = await this.userService.getAllUsers()
      this.collectedInfos = allProfiles.filter((profile: any) => profile.uuid === data.user.id)
      this.profileInfos.set(this.collectedInfos)
      console.log('profileInfos', this.profileInfos())
      return this.profileInfos ?? []
    }


  openOwnProfileOverviewBox(){
    this.ownData = this.profileInfos()
  this.dialog.open(OwnProfileOverviewComponent,
    {
      width: '500px',
      height: '600px',
      panelClass: 'OwnprofileOverviewDialog',
      data: {
        title: 'OwnprofileOverviewDialog',
        ownInfos: this.ownData
      },
    }
  )
}



}
