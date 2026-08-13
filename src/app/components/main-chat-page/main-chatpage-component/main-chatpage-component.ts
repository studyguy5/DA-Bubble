import { Component } from '@angular/core';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ChannelUserSelectionComponent } from '../channel-user-selection-component/channel-user-selection-component';
import { DirectMessagesComponent } from '../direct-messages-component/direct-messages-component';
import { UserThreadsComponent } from '../user-threads-component/user-threads-component';

@Component({
  selector: 'app-main-chatpage-component',
  imports: [ChannelUserSelectionComponent, UserThreadsComponent, DirectMessagesComponent],
  templateUrl: './main-chatpage-component.html',
  styleUrl: './main-chatpage-component.scss',
})
export class MainChatpageComponent {

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.document = document;
    this.addBodyClassForMain();
  }

  addBodyClassForMain(){
    this.document.body.classList.add('mainUserPage');
  }
  
  ngOnDestroy(){
    this.document.body.classList.remove('mainUserPage');
  }
}
