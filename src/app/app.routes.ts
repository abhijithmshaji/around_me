import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashbord/dashboard/dashboard';
import { Register } from './pages/register/register';
import { Admin } from './pages/admin/admin';
import { authGuard } from './core/auth-guard';
import { AddEvent } from './events/add-event/add-event';
import { EventsFilter } from './events/events-filter/events-filter/events-filter';
import { UserProfile } from './pages/user/user-profile/user-profile';
import { EventDetails } from './events/event-details/event-details';
import { EventBooking } from './events/event-booking/event-booking';

export const routes: Routes = [
    {
        path: '', component: Dashboard, 
    },
    {
        path: 'login', component: Login,
    },
    {
        path: 'register', component: Register
    },
    {
        path: 'add-event', component: AddEvent
    },
    // {
    //     path: 'book-event', component: EventBooking
    // },
    {
        path: 'event-details/:id', component: EventDetails
    },
    {
        path: 'filter-event', component: EventsFilter, canActivate:[authGuard]
    },
    {
        path: 'profile', component: UserProfile, canActivate:[authGuard]
    },
    {
        path: 'admin', component: Admin
    },
    { path: '**', redirectTo: '' }
];
