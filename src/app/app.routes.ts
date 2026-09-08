import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'session/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/session-detail/session-detail.page').then(
        (m) => m.SessionDetailPage
      ),
  },
  {
    path: 'attendee/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/attendee-detail/attendee-detail.page').then(
        (m) => m.AttendeeDetailPage
      ),
  },
  {
    path: 'tabs',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'agenda',
        loadComponent: () =>
          import('./pages/agenda/agenda.page').then((m) => m.AgendaPage),
      },
      {
        path: 'attendees',
        loadComponent: () =>
          import('./pages/attendees/attendees.page').then(
            (m) => m.AttendeesPage
          ),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'tabs/home', pathMatch: 'full' },
  { path: '**', redirectTo: 'tabs/home' },
];
