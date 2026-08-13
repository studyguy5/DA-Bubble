import { Component, DOCUMENT, Inject, signal } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginMaskComponent } from '../login-mask-component/login-mask-component';

type maskType = {
  loginMask: string;
  registerMask: string;
  forgotPasswordMask: string;
  avatarMask: string;
}
@Component({
  selector: 'app-login-register-page-component',
  imports: [LoginMaskComponent],
  standalone: true,
  templateUrl: './login-register-page-component.html',
  styleUrl: './login-register-page-component.scss',
})
export class LoginRegisterPageComponent {

  

  readonly activeMask = signal('loginMask');
  constructor(@Inject(DOCUMENT) private document: Document) {
    this.addBodyClass();
  }

  OnInit(){
    this.activeMask.set('loginMask');
  }

  addBodyClass(){
    this.document.body.classList.add('loginRegisterPage');
  }  
}
