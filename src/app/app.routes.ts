import { Routes } from '@angular/router';
import { authGuard, rolleGuard } from './core/auth/auth.guards';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login.page').then((m) => m.LoginPage),
  },

  // ---------------- Coach ----------------
  {
    path: 'coach',
    canActivate: [authGuard, rolleGuard('coach')],
    loadComponent: () =>
      import('./layout/app-shell/app-shell').then((m) => m.AppShell),
    children: [
      { path: '', loadComponent: () => import('./features/coach/coach-dashboard.page').then((m) => m.CoachDashboardPage) },
      { path: 'termine', loadComponent: () => import('./features/coach/coach-termine.page').then((m) => m.CoachTerminePage) },
      { path: 'termine/neu', loadComponent: () => import('./features/coach/coach-termin-neu.page').then((m) => m.CoachTerminNeuPage) },
      { path: 'termine/:id', loadComponent: () => import('./features/shared-pages/termin-detail.page').then((m) => m.TerminDetailPage) },
      { path: 'programm', loadComponent: () => import('./features/shared-pages/programm.page').then((m) => m.ProgrammPage) },
      { path: 'zertifikat', loadComponent: () => import('./features/coach/coach-zertifikat.page').then((m) => m.CoachZertifikatPage) },
      { path: 'materialien', loadComponent: () => import('./features/shared-pages/materialien.page').then((m) => m.MaterialienPage) },
      { path: 'lernpfade', loadComponent: () => import('./features/shared-pages/lernpfade.page').then((m) => m.LernpfadePage) },
      { path: 'lernpfade/:id', loadComponent: () => import('./features/shared-pages/lernpfad-detail.page').then((m) => m.LernpfadDetailPage) },
      { path: 'nachrichten', loadComponent: () => import('./features/coach/coach-nachrichten.page').then((m) => m.CoachNachrichtenPage) },
      { path: 'reflexion', loadComponent: () => import('./features/coach/coach-reflexion.page').then((m) => m.CoachReflexionPage) },
      { path: 'chat', loadComponent: () => import('./features/shared-pages/chat-liste.page').then((m) => m.ChatListePage) },
      { path: 'chat/:id', loadComponent: () => import('./features/shared-pages/chat-thread.page').then((m) => m.ChatThreadPage) },
    ],
  },

  // ---------------- Lehrer ----------------
  {
    path: 'lehrer',
    canActivate: [authGuard, rolleGuard('lehrer')],
    loadComponent: () =>
      import('./layout/app-shell/app-shell').then((m) => m.AppShell),
    children: [
      { path: '', loadComponent: () => import('./features/teacher/teacher-dashboard.page').then((m) => m.TeacherDashboardPage) },
      { path: 'schueler', loadComponent: () => import('./features/teacher/teacher-schueler.page').then((m) => m.TeacherSchuelerPage) },
      { path: 'schueler/neu', loadComponent: () => import('./features/teacher/teacher-schueler-neu.page').then((m) => m.TeacherSchuelerNeuPage) },
      { path: 'termine', loadComponent: () => import('./features/teacher/teacher-termine.page').then((m) => m.TeacherTerminePage) },
      { path: 'termine/:id', loadComponent: () => import('./features/shared-pages/termin-detail.page').then((m) => m.TerminDetailPage) },
      { path: 'programm', loadComponent: () => import('./features/shared-pages/programm.page').then((m) => m.ProgrammPage) },
      { path: 'nachricht', loadComponent: () => import('./features/teacher/teacher-nachricht.page').then((m) => m.TeacherNachrichtPage) },
      { path: 'lernstrecken', loadComponent: () => import('./features/shared-pages/lernpfade.page').then((m) => m.LernpfadePage) },
      { path: 'lernstrecken/:id', loadComponent: () => import('./features/shared-pages/lernpfad-detail.page').then((m) => m.LernpfadDetailPage) },
      { path: 'material', loadComponent: () => import('./features/shared-pages/materialien.page').then((m) => m.MaterialienPage) },
      { path: 'reflexionen', loadComponent: () => import('./features/teacher/teacher-reflexionen.page').then((m) => m.TeacherReflexionenPage) },
      { path: 'chat', loadComponent: () => import('./features/shared-pages/chat-liste.page').then((m) => m.ChatListePage) },
      { path: 'chat/neu', loadComponent: () => import('./features/shared-pages/chat-neu.page').then((m) => m.ChatNeuPage) },
      { path: 'chat/:id', loadComponent: () => import('./features/shared-pages/chat-thread.page').then((m) => m.ChatThreadPage) },
    ],
  },

  // ---------------- Admin ----------------
  {
    path: 'admin',
    canActivate: [authGuard, rolleGuard('admin')],
    loadComponent: () =>
      import('./layout/app-shell/app-shell').then((m) => m.AppShell),
    children: [
      { path: '', loadComponent: () => import('./features/admin/admin-dashboard.page').then((m) => m.AdminDashboardPage) },
      { path: 'schulen', loadComponent: () => import('./features/admin/admin-schulen.page').then((m) => m.AdminSchulenPage) },
      { path: 'termine', loadComponent: () => import('./features/admin/admin-termine.page').then((m) => m.AdminTerminePage) },
      { path: 'tandems', loadComponent: () => import('./features/admin/admin-tandems.page').then((m) => m.AdminTandemsPage) },
      { path: 'programm', loadComponent: () => import('./features/shared-pages/programm.page').then((m) => m.ProgrammPage) },
      { path: 'chat', loadComponent: () => import('./features/shared-pages/chat-liste.page').then((m) => m.ChatListePage) },
      { path: 'chat/neu', loadComponent: () => import('./features/shared-pages/chat-neu.page').then((m) => m.ChatNeuPage) },
      { path: 'chat/:id', loadComponent: () => import('./features/shared-pages/chat-thread.page').then((m) => m.ChatThreadPage) },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
