import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashbord/dashboard/dashboard';
import { Register } from './pages/register/register';
import { Admin } from './pages/admin/admin';
import { authGuard } from './core/auth-guard';
import { AddEvent } from './events/add-event/add-event';

export const routes: Routes = [
    {
        path: '', component: Login,
    },
    {
        path: 'home', component: Dashboard, canActivate: [authGuard]
    },
    {
        path: 'register', component: Register
    },
    {
        path: 'add-event', component: AddEvent
    },
    {
        path: 'admin', component: Admin
    },
    { path: '**', redirectTo: '' }
];
