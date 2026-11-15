import { Routes } from '@angular/router';
import { LoginRegisterPageComponent } from './components/login-register-pages/login-register-page-component/login-register-page-component';
import { MainChatpageComponent } from './components/main-chat-page/main-chatpage-component/main-chatpage-component';
import { LoginMaskComponent } from './components/login-register-pages/login-mask-component/login-mask-component';
import { RegisterMaskComponent } from './components/login-register-pages/register-mask-component/register-mask-component';
import { SelectAvatarComponent } from './components/login-register-pages/select-avatar-component/select-avatar-component';
import { ResetPasswordWithEmailComponent } from './components/login-register-pages/reset-password-with-email-component/reset-password-with-email-component';
import { CreateNewPasswordComponent } from './components/login-register-pages/create-new-password-component/create-new-password-component';

export const routes: Routes = [

    {
        path: '',
        component: LoginRegisterPageComponent,
        children: [
            {
                path: 'login',
                component: LoginMaskComponent
            },
            {
                path: 'register',
                component: RegisterMaskComponent,
            },
            {
                path: 'selectAvatar',
                component: SelectAvatarComponent
            },
            {
                path: 'reset-password-with-email',
                component: ResetPasswordWithEmailComponent 

            },
            {
                path: 'create-new-password',
                component: CreateNewPasswordComponent 

            }
        ]
    },
    {
        path: 'home',
        component: MainChatpageComponent
    }
];
