import { Component, Inject } from '@angular/core';
import { input, effect } from '@angular/core';
import { User, Channel } from '../../../interfaces/interfaces';
import { Dialog, DialogConfig } from '@angular/cdk/dialog';
import { ChannelInfoComponent } from '../channel-info-component/channel-info-component';

@Component({
  selector: 'app-direct-messages-component',
  imports: [],
  templateUrl: './direct-messages-component.html',
  styleUrl: './direct-messages-component.scss',
})
export class DirectMessagesComponent {

  selectedUser = input<User | null>(null)
  selectedChannel = input<Channel | null>(null)
  constructor(@Inject(Dialog) private dialog: Dialog) {
    effect(() => {
      console.log('DirectMessages bekommt:', this.selectedUser());
      console.log('channel on direktMessages', this.selectedChannel());


    });
  }
  

  openInfoDialog() {
    const channel = this.selectedChannel();

    if (!channel) {
      console.warn('Kein Channel ausgewählt – Dialog wird nicht geöffnet.');
      return;
    }
    // debugger;
  
    this.dialog.open(ChannelInfoComponent,
      {
        width: '872px',
        height: '616px',
        panelClass: 'createChannelDialog',
        data: {
          title: 'Create Channel',
          channel: channel
        },

      }
    )
  }



}
