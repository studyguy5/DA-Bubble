import { Component } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../../environment/environment';
import { FormControl, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-new-password-component',
  imports: [ReactiveFormsModule],
  templateUrl: './create-new-password-component.html',
  styleUrl: './create-new-password-component.scss',
})
export class CreateNewPasswordComponent {
supabase = createClient(environment.supabaseUrl, environment.supabasePublishKey)
passwordfilled = false
  constructor() {

  }

  resetPasswordGroup = new FormGroup({
    password: new FormControl(''),
    passwordConfirm: new FormControl(''),
  })
  startPasswordRecovery() {
    
    const data = this.supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'PASSWORD_RECOVERY') {
        const { error } = await this.supabase.auth.updateUser({ password: 'new-password' });
      }
    });
  }

  checkPasswordMetrics() {
    if(!this.resetPasswordGroup.value.password || !this.resetPasswordGroup.value.passwordConfirm) {
      return false
    }
    return (this.resetPasswordGroup.value.password?.length && this.resetPasswordGroup.value.passwordConfirm?.length) > 3 
  }

  checkNewPasswort() {
    let lengthTest = this.checkPasswordMetrics()
    if (this.resetPasswordGroup.value.password === this.resetPasswordGroup.value.passwordConfirm && lengthTest) {
      this.passwordfilled = true
    } else {
      this.passwordfilled = false
    }
  }
}
