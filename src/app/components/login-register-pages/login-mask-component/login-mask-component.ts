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
    console.log('ausgeloggte UserDaten', email, password);

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
    if (data) {
      console.log('successfully created account', data);
      await this.router.navigate(['home'])
    }

  }

  preFillData() {
    this.loginGroup.get('email')?.setValue('example45@example.com');
    this.loginGroup.get('password')?.setValue('123456');
  }

  async signInAsGuest() {
    debugger
    const { data: session, error: sessionError } = await this.supabase.auth.getSession() // bereits anonyme session holen, ließt eine bereits vorhandene session aus dem localen storage

    if (sessionError) {
      console.log('getSession-Fehler:', sessionError);
      throw sessionError
    }
    if (session.session === null) {
      const { data: { user }, error: userError } = await this.supabase.auth.signInAnonymously(); // als anonym einloggen und anonyme session erzeugen
      console.log('signInAnonymously erfolgreich', user)
      if (userError) { //fehler beim anonym einloggen
        console.log('signInAnonymously-Fehler:', userError);
        throw userError
      }
      if (!user || !user.id) {
        throw new Error('Supabase hat keinen anonymen User erzeugt.'); // common fehler meldung an User
      }

      console.log('Anonymer Benutzer erstellt:', user.id); // erfolgreich anonym einloggen
      return;
    }


    // const { data, error } = await this.supabase.auth.getUser(); // getUser prüft local im speicher nach einem access token/session und in supabase nach einem user, dem der token/session zugeordnet ist
    // if (error) {
    //   console.warn('getUser-Fehler (kann bei anonym vorkommen):', error);
    // } else {
    //   console.log('Bestehender User:', data.user.id);
    // }

    // console.log('Anonymer Benutzer erstellt:', data.user?.id);

  }

  async continueAsGuest() {
    // debugger;
    try {
      this.signInAsGuest()
      const { data: session, error: sessionError } = await this.supabase.auth.getSession()
      if (sessionError || !session) {
        console.log(sessionError);
        throw sessionError
      }
      await this.router.navigate(['/home']);
    } catch (error) {
      console.log(error);
    }

  }
}


