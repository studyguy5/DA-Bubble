import { Component } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../../environment/environment';

@Component({
  selector: 'app-create-new-password-component',
  imports: [],
  templateUrl: './create-new-password-component.html',
  styleUrl: './create-new-password-component.scss',
})
export class CreateNewPasswordComponent {
supabase = createClient(environment.supabaseUrl, environment.supabasePublishKey)
  constructor() {

  }

  startPasswordRecovery() {
    
    const data = this.supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'PASSWORD_RECOVERY') {
        const { error } = await this.supabase.auth.updateUser({ password: 'new-password' });
      }
    });
  }
}
