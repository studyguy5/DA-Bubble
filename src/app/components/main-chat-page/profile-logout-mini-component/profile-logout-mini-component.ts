import { Component, Inject } from '@angular/core';
import { UserService } from '../../../services/user-service';
import { Router } from '@angular/router';
import { Dialog, DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
  selector: 'app-profile-logout-mini-component',
  imports: [],
  templateUrl: './profile-logout-mini-component.html',
  styleUrl: './profile-logout-mini-component.scss',
})
export class ProfileLogoutMiniComponent {

  constructor(private userService: UserService, private router: Router, @Inject(Dialog) private dialog: any) {
    // this.userService = userService
  } 

  

  logout(){
   this.userService.logoutService()
   this.router.navigate(['login'])
   this.dialog.closeAll()
  }

}
