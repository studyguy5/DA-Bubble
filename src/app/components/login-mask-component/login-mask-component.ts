import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login-mask-component',
  imports: [],
  templateUrl: './login-mask-component.html',
  styleUrl: './login-mask-component.scss',
})
export class LoginMaskComponent {

  loginGroup = new FormGroup({
    email: new FormControl('I` am back'),
    password: new FormControl(''),
  });
}
