import { Component } from '@angular/core';
import { UserService } from '../../../services/user-service';
import { output } from '@angular/core';
import { User } from '../../../interfaces/interfaces';

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


  readonly DEFAULT_MALE_AVATAR = '/images/male_Avatar1.svg';
  readonly DEFAULT_FEMALE_AVATAR = '/images/female_Avatar1.svg';
  
  
  selectedUser = output<User>()
  constructor(public userService: UserService) {
    // this.avatars = [
    //   './images/male_Avatar1.svg',
    //   './images/male_Avatar2.svg',
    //   './images/female_Avatar1.svg',
    //   './images/female_Avatar2.svg',
    //   './images/male_Avatar3.svg',
    //   './images/male_Avatar4.svg'
    // ]
    setTimeout(() => {
      this.changeOpenDelay()
    }, 200)
  }
  selectUserAndEmitToParentComponent(user: User) {
    // debugger;
    console.log(user)
    this.selectedUser.emit(user)
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

  collapseSelectBox(){
    this.selectBoxIsOpen = !this.selectBoxIsOpen
    this.isMinimized = !this.isMinimized
  }

}
