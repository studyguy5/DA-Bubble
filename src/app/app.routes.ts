import { Routes } from '@angular/router';
import { LoginRegisterPageComponent } from './components/login-register-pages/login-register-page-component/login-register-page-component';
import { MainChatpageComponent } from './components/main-chat-page/main-chatpage-component/main-chatpage-component';
import { LoginMaskComponent } from './components/login-register-pages/login-mask-component/login-mask-component';
import { RegisterMaskComponent } from './components/login-register-pages/register-mask-component/register-mask-component';
import { SelectAvatarComponent } from './components/login-register-pages/select-avatar-component/select-avatar-component';

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
            }
        ]
    },
    {
        path: 'home',
        component: MainChatpageComponent
    }
];
