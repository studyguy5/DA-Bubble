import { Component, DOCUMENT, Inject, signal } from '@angular/core';
import { OnInit, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Router, RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { LoginMaskComponent } from '../login-mask-component/login-mask-component';
import { RegisterMaskComponent } from '../register-mask-component/register-mask-component';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

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
  showAvatar = false
  readonly activeMask = signal('loginMask');
  constructor(@Inject(DOCUMENT) private document: Document, private router: Router, private route: ActivatedRoute) {

    this.document = document;
    this.router.navigate(['login']);
    this.addBodyClass()
    this.checkUrl();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(
      () => {
        this.checkUrl();
      }
    )
  }




  checkUrl() {
    let url = this.router.url
    let pfad = url.split('/')[1]
    console.log(pfad)
    if (pfad?.includes('selectAvatar') || pfad?.includes('register')) {
      this.showAvatar = true
    }else {
      this.showAvatar = false
    }
  }

  addBodyClass() {
    this.document.body.classList.add('loginRegisterPage');
  }

  ngOnInit() {
    this.document.body.classList.add('loginRegisterPage');
  }

  ngOnDestroy(){
    this.document.body.classList.remove('loginRegisterPage');


  }

}


