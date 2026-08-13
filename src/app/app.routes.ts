import { Routes } from '@angular/router';
import { LoginRegisterPageComponent } from './components/login-register-page-component/login-register-page-component';
import { MainChatpageComponent } from './components/main-chat-page/main-chatpage-component/main-chatpage-component';

export const routes: Routes = [

    {
        path: '',
        component: LoginRegisterPageComponent
    },
    {
        path: 'home',
        component: MainChatpageComponent
    }
];
