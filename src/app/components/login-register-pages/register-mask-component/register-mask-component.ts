import { Component } from '@angular/core';
import { Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../../environment/environment';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register-mask-component',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register-mask-component.html',
  styleUrl: './register-mask-component.scss',
})
export class RegisterMaskComponent {

  supabase = createClient(environment.supabaseUrl, environment.supabasePublishKey)
  registerGroup = new FormGroup({
    fullName: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
  });
  // private router = Inject(Router)


  constructor(private readonly router: Router) {

  }

  async submitRegisterData() {
    const fullName = this.registerGroup.getRawValue().fullName || '';
    const email = this.registerGroup.getRawValue().email || '';
    const password = this.registerGroup.getRawValue().password || '';
    console.log('ausgeloggte UserDaten', fullName, email, password);
    // const payload = {
    //   email: email,
    //   password: password
    // }
    const { data, error } = await this.supabase.auth.signUp(
      {
        email: email,
        password: password,
        // options: {
        //   emailRedirectTo: 'http://localhost:4200/verify-email',
        // },
      }

    );
    
    if (error || !data) {
      console.log(error);
      throw error
    }
    let user = data.user;
    if(!user) return
    const { error: profilError } = await this.supabase
      .from('profiles')
      .update(
          {
            username: fullName,
          }
        
      )
      .eq('uuid', user.id)

    if (profilError) {
      console.log(profilError);
      throw profilError
    }


    if (data) {
      console.log('successfully created account', data);
      await this.router.navigateByUrl('selectAvatar');
    }

  }
}
