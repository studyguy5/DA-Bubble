import { Component, Inject, effect } from '@angular/core';
import { UserService } from '../../../services/user-service';
import { output } from '@angular/core';
import { User, Channel } from '../../../interfaces/interfaces';
import { CreateChannelComponent } from '../create-channel-component/create-channel-component';
import { Dialog, DialogConfig } from '@angular/cdk/dialog';


@Component({
  selector: 'app-channel-user-selection-component',
  imports: [],
  templateUrl: './channel-user-selection-component.html',
  styleUrl: './channel-user-selection-component.scss',
})
export class ChannelUserSelectionComponent {
  channelIsOpen = true
  collapsingListIsOpen = true
  memberListIsOpen = false
  memberListVisible = true
  wasOpenBefore = false
  selectBoxIsOpen = true
  isMinimized = false
  // avatars: string[]
  initChannel: Channel | null = null

  readonly DEFAULT_MALE_AVATAR = '/images/male_Avatar1.svg';
  readonly DEFAULT_FEMALE_AVATAR = '/images/female_Avatar1.svg';


  selectedUser = output<User>()
  selectedChannel = output<Channel>()
  constructor(public userService: UserService, @Inject(Dialog) private dialog: Dialog) {
    effect(() => {

      this.selectFirstChannelAtStart()
    })
    setTimeout(() => {
      this.changeOpenDelay()

    }, 200)

  }
  active = false
  async selectFirstChannelAtStart() {
    const channel = this.userService.channelTable()[0]
  
      
        console.log('automatische Selection',channel)
      this.selectChannelFirstTime(channel)
      
    
  }

  selectUserAndEmitToParentComponent(user: User, event: any) {
    let allMembers = document.querySelectorAll('.member') as NodeListOf<HTMLDivElement>;
    allMembers.forEach(member => {
      member.classList.remove('active')
    })
    let target = event.target as HTMLElement;
    target.classList.add('active')
    console.log(user)
    this.selectedUser.emit(user)
  }


  selectChannelFirstTime(channel: Channel) {
    this.selectedChannel.emit(channel)
  }
  selectChannelAndEmitToParentComponent(selectedChannel: Channel, event: any) {
    let allChannels = document.querySelectorAll('.channel') as NodeListOf<HTMLDivElement>;
    if(allChannels){
      allChannels.forEach(member => {
        member.classList.remove('active')
      })
      let target = event.target as HTMLElement;
      target.classList.add('active')
    }
    
    this.selectedChannel.emit(selectedChannel)
  }

  showChannels() {
    this.channelIsOpen = !this.channelIsOpen
    this.collapsingListIsOpen = !this.collapsingListIsOpen
  }

  showMemberList() {
    this.memberListIsOpen = !this.memberListIsOpen
    this.memberListVisible = !this.memberListVisible
  }

  changeOpenDelay() {
    this.wasOpenBefore = !this.wasOpenBefore
  }

  collapseSelectBox() {
    this.selectBoxIsOpen = !this.selectBoxIsOpen
    this.isMinimized = !this.isMinimized
  }

  openDialog() {

    // debugger;
    console.log('openDialog')
    this.dialog.open(CreateChannelComponent,
      {
        width: '872px',
        height: '539px',
        panelClass: 'createChannelDialog',
        data: {
          title: 'Create Channel'
        },

      }
    )
  }

}
