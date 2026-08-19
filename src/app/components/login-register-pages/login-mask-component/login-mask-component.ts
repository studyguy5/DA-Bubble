import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../../environment/environment';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login-mask-component',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-mask-component.html',
  styleUrl: './login-mask-component.scss',
})
export class LoginMaskComponent {
supabase = createClient(environment.supabaseUrl, environment.supabasePublishKey)
  loginGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  // private router = Inject(Router)
  

  constructor(private readonly router: Router) { 

  }

  async submitRegisterData() {
    const email = this.loginGroup.getRawValue().email || '';
    const password = this.loginGroup.getRawValue().password || '';
    console.log('ausgeloggte UserDaten',email, password);
    // const payload = {
    //   email: email,
    //   password: password
    // }
    const { data, error } = await this.supabase.auth.signUp(
      {
        email: email,
        password: password,
        options: {
          emailRedirectTo: 'http://localhost:4200/verify-email',
        },
      }
      
    );
    if (error || !data) {
      console.log(error);
      throw error
    }
    if(data) {
      console.log('successfully created account', data);
      await this.router.navigate(['home'])
    }
    
  }

  preFillData() {
    this.loginGroup.get('email')?.setValue('example45@example.com');
    this.loginGroup.get('password')?.setValue('123456');
  }
}


