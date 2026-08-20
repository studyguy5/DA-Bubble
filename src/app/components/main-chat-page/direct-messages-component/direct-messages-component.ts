import { Component } from '@angular/core';
import { input, effect } from '@angular/core';
import { User } from '../../../interfaces/interfaces';

@Component({
  selector: 'app-direct-messages-component',
  imports: [],
  templateUrl: './direct-messages-component.html',
  styleUrl: './direct-messages-component.scss',
})
export class DirectMessagesComponent {

  selectedUser = input< User | null>(null)
  constructor() {
    effect(() => {
    console.log(
      'DirectMessages bekommt:',
      this.selectedUser()
    );
  });
  }
  
  loggaOut() {
    console.log('input on direktMessages', this.selectedUser());
  }
}
