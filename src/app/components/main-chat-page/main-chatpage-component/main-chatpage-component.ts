import { Component, inject, signal } from '@angular/core';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ChannelUserSelectionComponent } from '../channel-user-selection-component/channel-user-selection-component';
import { DirectMessagesComponent } from '../direct-messages-component/direct-messages-component';

import { ProfileLogoutMiniComponent } from '../dialogs/profile-logout-mini-component/profile-logout-mini-component';
import { User } from '@supabase/supabase-js';
import { Channel } from '../../../interfaces/interfaces';
import { UserService } from '../../../services/user-service';
import { UserChatThreadService } from '../../../services/user-chat-thread-service';
import { ChangeDetectorRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { viewChild } from '@angular/core';
import { effect } from '@angular/core';

@Component({
  selector: 'app-main-chatpage-component',
  imports: [ChannelUserSelectionComponent,  DirectMessagesComponent],
  templateUrl: './main-chatpage-component.html',
  styleUrl: './main-chatpage-component.scss',
})
export class MainChatpageComponent {
  dm = viewChild(DirectMessagesComponent)
  @ViewChild(ChannelUserSelectionComponent) channelUserSelection!: ChannelUserSelectionComponent;
  @ViewChild('profileLogoutMiniMenu', { static: false }) profileLogoutMiniMenu!: Element;
  currentUser: string | null = null;
  public directChat = inject(UserChatThreadService)
  userService = inject(UserService);
  selectedUser = signal<User | null>(null);
  selectedChannel = signal<Channel | null>(null);
  threadsComponent = signal< string| null>(null);
  openthreadsComponent = signal<boolean>(false);
  messagesForSearching = signal<any[]>([]);
  devSpaceChannel = signal<boolean>(false);
  constructor(@Inject(DOCUMENT) private document: Document, private changeDetectorRef: ChangeDetectorRef, @Inject(Dialog) private dialog: Dialog, private overlay: Overlay,
   private userChatThreadService: UserChatThreadService) {
    
    this.document = document;
    this.addBodyClassForMain();
    this.fillTreadsSignal();
    effect(() => {
      console.log('threadsComponent signal value from parent', this.openthreadsComponent())
      
    })
  }

  fillTreadsSignal(){
    this.threadsComponent.set('threadsComponent');
    console.log('threadsComponent signal value from parent', this.threadsComponent())
  }
  
  addBodyClassForMain(){
    this.document.body.classList.add('mainUserPage');
    
  }

  async ngOnInit() {
    // debugger;
    
    this.currentUser = await this.userService.getCurrentSignedInUser();
      this.changeDetectorRef.detectChanges();
      console.log('current user', this.currentUser)
  }

  openOrCloseDevSpace(choise: boolean){ 
    if(choise === true){
      this.unselectMemberAndChannel();
      this.devSpaceChannel.set(choise);
      this.selectedChannel.set(null);
      this.selectedUser.set(null);
      this.directChat.userChat.set([]);
    }else{
      this.devSpaceChannel.set(choise);
      console.log('choise', choise)
    }
  }
  unselectMemberAndChannel(){
    
    let allMembers = document.querySelectorAll('.member') as NodeListOf<HTMLDivElement>;
    let allChannels = document.querySelectorAll('.channel') as NodeListOf<HTMLDivElement>;
    if (allChannels) {
      allChannels.forEach(member => {
        member.classList.remove('active')
      })
    }
    allMembers.forEach(member => {
      member.classList.remove('active')
    })
  }

  
  ngOnDestroy(){
    this.document.body.classList.remove('mainUserPage');
  }

  getChoiceFromSelectionComponent(selectedUser: User) {
    this.selectedUser.set(selectedUser);
    this.selectedChannel.set(null);
    // console.log('input on mainChatpage', this.selectedUser());
  }
  getChoiceFromChannelSelectionComponent(selectedChannel: Channel) {
    // console.log('input on mainChatpage', selectedChannel);
    this.selectedChannel.set(selectedChannel);
    // console.log('PARENT SIGNAL', this.selectedChannel()?.uuid);
    this.selectedUser.set(null);
    // console.log('PARENT SIGNAL DANACH', this.selectedChannel()?.uuid);
  }


selectUserFromDialog(user: any) {
  if(!this.channelUserSelection as any) return
  this.channelUserSelection.selectUserAndEmitToParentComponent(user, event);
}


openProfileLogoutMiniMenu(){

  this.dialog.open(ProfileLogoutMiniComponent,
    
    {
      positionStrategy: this.overlay.position()
      .flexibleConnectedTo(this.profileLogoutMiniMenu)
      .withPositions([{
        originX: 'center',
        originY: 'center',
        overlayX: 'start',
        overlayY: 'top',
        offsetY: 50,
        offsetX: -10
      }])
      .withPush(true),
      width: '282px',
      height: '181px',
      panelClass: 'profileLogoutMiniDialog',
      data: {
        title: 'profileLogoutMiniDialog'
      },
    }
  )
}

async searchForTextMessagesInChannelsAndPrivateMessages() {
  let input: any = document.querySelector('#devSearch')
  if(input.value.trim() === '' || input.value === undefined || input.value === null || input.value === ' ') return
  if(input.value.trim().length > 2){
    console.log('input.value', input.value)
    const allMessages = await this.userChatThreadService.getAllMessagesForSearchingPuropose();
    allMessages?.forEach((message: any) => {
      if(message.content.toLowerCase().includes(input.value.trim().toLowerCase())) {
        this.directChat.userChat.set([...this.messagesForSearching(), message])
      }
    })
    
  }else if (input.value.trim().length < 3){
    this.dm()?.showMessagesFromSelectedChannelOrUser()

    
  }
  
}
}
