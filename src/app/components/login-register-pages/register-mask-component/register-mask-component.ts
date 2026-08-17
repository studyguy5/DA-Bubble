import { Component } from '@angular/core';
import { Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../../environment/environment';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register-mask-component',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register-mask-component.html',
  styleUrl: './register-mask-component.scss',
})
export class RegisterMaskComponent {

  supabase = createClient(environment.supabaseUrl, environment.supabasePublishKey)
  loginGroup = new FormGroup({
    fullName: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
  });
  // private router = Inject(Router)
  

  constructor(private readonly router: Router) { 

  }
}
