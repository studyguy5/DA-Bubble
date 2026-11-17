import { Component, Inject } from '@angular/core';
import { Dialog, DIALOG_DATA } from '@angular/cdk/dialog';
import { UserService } from '../../../../services/user-service/user-service';
import { ChannelUserSelectionComponent } from '../../channel-user-selection-component/channel-user-selection-component';

@Component({
  selector: 'app-profile-overview-component',
  imports: [],
  templateUrl: './profile-overview-component.html',
  styleUrl: './profile-overview-component.scss',
})
export class ProfileOverviewComponent {

  constructor(@Inject(Dialog) private dialog: Dialog, @Inject(DIALOG_DATA) public data: any,
   private userService: UserService) {
  
    this.data = data
    this.showData()
  }

  readonly status_online = '/icons/status_online.svg';
  readonly status_offline = '/icons/status_offline.svg';
showData() {
  console.log('incoming Data Dialog ===================', this.data)
}

closeDialog(){
  this.dialog.closeAll()
}

openDirektMessageWithThisUser(data: any) {
  // debugger;
this.data.onSelectUser?.(this.data.channel);
this.closeDialog()
}

}

