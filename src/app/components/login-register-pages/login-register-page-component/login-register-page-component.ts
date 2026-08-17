import { Component, DOCUMENT, Inject, signal } from '@angular/core';
import { OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { LoginMaskComponent } from '../login-mask-component/login-mask-component';
import { RegisterMaskComponent } from '../register-mask-component/register-mask-component';

type maskType = {
  loginMask: string;
  registerMask: string;
  forgotPasswordMask: string;
  avatarMask: string;
}
@Component({
  selector: 'app-login-register-page-component',
  imports: [RouterOutlet, RouterLinkWithHref],
  standalone: true,
  templateUrl: './login-register-page-component.html',
  styleUrl: './login-register-page-component.scss',
})
export class LoginRegisterPageComponent {

  readonly activeMask = signal('loginMask');
  constructor(@Inject(DOCUMENT) private document: Document, private router: Router) {
    
      this.document = document;
      this.router.navigate(['login']);
      this.addBodyClass()
    }



    // showLoginMask(){
    //   this.activeMask.set('loginMask');
    // }

    // showRegisterMask(){
    //   this.activeMask.set('registerMask');
    // }

    addBodyClass(){
      this.document.body.classList.add('loginRegisterPage');
    }

    ngOnInit(){
      this.document.body.classList.add('loginRegisterPage');
    }

    ngOnDestroy(){
      this.document.body.classList.remove('loginRegisterPage');


    }

  }
