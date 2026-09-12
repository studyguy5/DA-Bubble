import { Component, Inject } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../../environment/environment';
import { Dialog } from '@angular/cdk/dialog';
import { UserService } from '../../../services/user-service';
import { ProfileInfos } from '../../../interfaces/interfaces';
import { signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-own-profile-overview-component',
  imports: [ReactiveFormsModule],
  templateUrl: './own-profile-overview-component.html',
  styleUrl: './own-profile-overview-component.scss',
})
export class OwnProfileOverviewComponent {
  supabase = createClient(environment.supabaseUrl, environment.supabasePublishKey)
  readonly profileInfos = signal<ProfileInfos[]>([]);
  collectedInfos: any
  readonly DEFAULT_MALE_AVATAR = '/images/male_Avatar1.svg';
  constructor(@Inject(Dialog) private dialog: Dialog, private userService: UserService) {

    // this.getOwnProfileInfos()

  }

  async ngOnInit(): Promise<void> {
    await this.getOwnProfileInfos();
  }

  async getOwnProfileInfos() {
    const { data, error } = await this.supabase.auth.getUser()
    if (!data || error) return

    console.log('this.profileInfos', this.profileInfos)
    const allProfiles: any = await this.userService.getAllUsers()
    this.collectedInfos = allProfiles.filter((profile: any) => profile.uuid === data.user.id)
    console.log('profileInfos', this.profileInfos)
    this.profileInfos.set(this.collectedInfos)
    return this.profileInfos ?? []
  }

  closeDialog() {
    this.dialog.closeAll()
  }
  
  fullName = new FormControl('')
  editMode = false
  showEditModeForUserName() {
    this.editMode = !this.editMode
    if(this.editMode){

      const username = this.profileInfos()[0]?.username ?? '';
      console.log('username', username)
      this.fullName.setValue(username === null || 'null' ? 'User' : username)
    }

  }

}