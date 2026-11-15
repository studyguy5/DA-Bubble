import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../../environment/environment';
import { ReactiveFormsModule } from '@angular/forms';
import { signal } from '@angular/core';


@Component({
  selector: 'app-reset-password-with-email-component',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password-with-email-component.html',
  styleUrl: './reset-password-with-email-component.scss',
})
export class ResetPasswordWithEmailComponent {
disableButton = true
input:any
supabase = createClient(environment.supabaseUrl, environment.supabasePublishKey)
userFeedback = signal(false)
  constructor() {

  }

  validateEmail() {
    this.input = document.getElementById('email') as HTMLInputElement;
    if (!this.input) return
    let value = this.input.value
    const regex = /^[^\s@]+@[^\s@]{3,}\.[^\s@]{2,}$/;
    return regex.test(value.trim()) && this.input.value.length > 5 ? this.disableButton = false : this.disableButton = true;
}

  


  resetPasswordGroup = new FormGroup({
    email: new FormControl(''),
  })

  async catchEmailAndSendResetLink(email: { value: string }) {
  //   const { data, error } = await this.supabase.auth.resetPasswordForEmail(email.value, {
  //   redirectTo: 'http://localhost:4200/create-new-password',
  // })
    this.userFeedback.set(true)
    console.log('this.userFeedback', this.userFeedback())
    setTimeout(() => {
      this.userFeedback.set(false)
      console.log('this.userFeedback', this.userFeedback())
    }, 3000);
  }

  
  // Schritt 2 (auf der update-password-Seite)
}
