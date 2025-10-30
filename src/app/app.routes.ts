import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Register } from './pages/register/register';
import { Admin } from './pages/admin/admin';
import { authGuard } from './core/auth-guard';

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
        path: 'admin', component: Admin
    },
    { path: '**', redirectTo: '' }
];
