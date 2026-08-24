import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../../environment/environment';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login-mask-component',
  imports: [ReactiveFormsModule],
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

  async signInAsGuest() {
    const { data: session, error: sessionError } = await this.supabase.auth.getSession()
    if(sessionError || !session){  
      console.log(sessionError);
      throw sessionError
    }
    if(session) {
      const { data: { user }, error: userError } = await this.supabase.auth.getUser();
      console.log('user and userError', user, userError)
      return
    // if (!userError && user) {
    //   console.log('Session ist gültig:', user.id);
    //   console.warn('Lokale Session existiert, aber der User ist nicht mehr gültig.');
    //   this.supabase.auth.signOut(); // diese Zeile löscht die lokale Session, also den token aus dem local storage, überlegen ob richtig!!
    //   return;
    // }
    }

    const { data, error } = await this.supabase.auth.signInAnonymously();
    if (error) {
      console.log(error);
      throw error
    }
    if (!data.user || !data.session) {
    throw new Error('Supabase hat keinen anonymen User erzeugt.');
  }

  console.log('Anonymer Benutzer erstellt:', data.user.id);
    
  }

  async continueAsGuest() {
    debugger;
    try {
      this.signInAsGuest()
      await this.router.navigate(['/home']);
    } catch (error) {
      console.log(error);
    }
    
  }
}


