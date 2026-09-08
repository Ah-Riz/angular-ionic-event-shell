import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'tabs',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/tabs/tabs.page').then((m) => m.TabsPage),
    children: [
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
      { path: '', redirectTo: 'agenda', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'tabs/agenda', pathMatch: 'full' },
  { path: '**', redirectTo: 'tabs/agenda' },
];
