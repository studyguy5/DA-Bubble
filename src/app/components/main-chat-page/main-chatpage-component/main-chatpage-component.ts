import { Component, inject, signal } from '@angular/core';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ChannelUserSelectionComponent } from '../channel-user-selection-component/channel-user-selection-component';
import { DirectMessagesComponent } from '../direct-messages-component/direct-messages-component';
import { UserThreadsComponent } from '../user-threads-component/user-threads-component';
import { User } from '@supabase/supabase-js';
import { Channel } from '../../../interfaces/interfaces';
import { UserService } from '../../../services/user-service';
import { ChangeDetectorRef } from '@angular/core';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-main-chatpage-component',
  imports: [ChannelUserSelectionComponent, UserThreadsComponent, DirectMessagesComponent],
  templateUrl: './main-chatpage-component.html',
  styleUrl: './main-chatpage-component.scss',
})
export class MainChatpageComponent {
  
  @ViewChild(ChannelUserSelectionComponent) channelUserSelection!: ChannelUserSelectionComponent;
  currentUser: string | null = null;

  userService = inject(UserService);
  selectedUser = signal<User | null>(null);
  selectedChannel = signal<Channel | null>(null);
  constructor(@Inject(DOCUMENT) private document: Document, private changeDetectorRef: ChangeDetectorRef) {
    
    this.document = document;
    this.addBodyClassForMain();
  }
  
  addBodyClassForMain(){
    this.document.body.classList.add('mainUserPage');
    
  }

  async ngOnInit() {
    // debugger;
    this.currentUser =
      await this.userService.getCurrentSignedInUser();
      this.changeDetectorRef.detectChanges();
      console.log('current user', this.currentUser)
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
    this.selectedChannel.set(selectedChannel);
    this.selectedUser.set(null);
    // console.log('input on mainChatpage', this.selectedUser());
  }


selectUserFromDialog(user: any) {
  if(!this.channelUserSelection as any) return
  this.channelUserSelection.selectUserAndEmitToParentComponent(user);
}
}
