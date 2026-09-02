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

  async selectFirstChannelAtStart() {
    // debugger;
    for (const channel of this.userService.channelTable()) {
      if (channel) {
        console.log('automatische Selection',channel)
        this.selectChannelAndEmitToParentComponent(channel)
      }
    }
  }

  selectUserAndEmitToParentComponent(user: User) {
    // debugger;
    console.log(user)
    this.selectedUser.emit(user)
  }

  selectChannelAndEmitToParentComponent(selectedChannel: Channel) {

    console.log(selectedChannel)
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
