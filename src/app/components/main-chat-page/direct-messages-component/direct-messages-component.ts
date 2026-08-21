import { Component } from '@angular/core';
import { input, effect } from '@angular/core';
import { User, Channel } from '../../../interfaces/interfaces';

@Component({
  selector: 'app-direct-messages-component',
  imports: [],
  templateUrl: './direct-messages-component.html',
  styleUrl: './direct-messages-component.scss',
})
export class DirectMessagesComponent {

  selectedUser = input< User | null>(null)
  selectedChannel = input<Channel | null>(null)
  constructor() {
    effect(() => {
    console.log('DirectMessages bekommt:',this.selectedUser());
    console.log('channel on direktMessages', this.selectedChannel());
    
    
  });
  }
  
  
}
