import { Component } from '@angular/core';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-main-chatpage-component',
  imports: [],
  templateUrl: './main-chatpage-component.html',
  styleUrl: './main-chatpage-component.scss',
})
export class MainChatpageComponent {

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.addBodyClass();
  }

  addBodyClass(){
    this.document.body.classList.add('mainUserPage');
  }  
}
