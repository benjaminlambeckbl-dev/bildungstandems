import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { ReminderService } from '../../core/services/reminder.service';
import { ChatService } from '../../core/services/chat.service';
import { Rolle } from '../../core/models/models';
import { PwaBannerComponent } from '../../shared/ui/pwa-banner';

interface NavItem {
  label: string;
  icon: string;
  pfad: string;
  /** exakt aktiv (für Start-Route) */
  exakt?: boolean;
}

const NAV: Record<Rolle, NavItem[]> = {
  coach: [
    { label: 'Start', icon: '🏠', pfad: '/coach', exakt: true },
    { label: 'Termine', icon: '📅', pfad: '/coach/termine' },
    { label: 'Lernen', icon: '🎓', pfad: '/coach/lernpfade' },
    { label: 'Material', icon: '📚', pfad: '/coach/materialien' },
    { label: 'Infos', icon: '🔔', pfad: '/coach/nachrichten' },
  ],
  lehrer: [
    { label: 'Start', icon: '🏠', pfad: '/lehrer', exakt: true },
    { label: 'Coachs', icon: '🧑‍🤝‍🧑', pfad: '/lehrer/schueler' },
    { label: 'Termine', icon: '📅', pfad: '/lehrer/termine' },
    { label: 'Lernen', icon: '🎓', pfad: '/lehrer/lernstrecken' },
    { label: 'Material', icon: '📚', pfad: '/lehrer/material' },
  ],
  admin: [
    { label: 'Start', icon: '🏠', pfad: '/admin', exakt: true },
    { label: 'Schulen', icon: '🏫', pfad: '/admin/schulen' },
    { label: 'Termine', icon: '📅', pfad: '/admin/termine' },
    { label: 'Tandems', icon: '🤝', pfad: '/admin/tandems' },
    { label: 'Programm', icon: '🗺️', pfad: '/admin/programm' },
  ],
};

const ROLLEN_LABEL: Record<Rolle, string> = {
  coach: 'Coach',
  lehrer: 'Koordination',
  admin: 'Organisation',
};

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, PwaBannerComponent],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
})
export class AppShell {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly notify = inject(NotificationService);
  protected readonly chat = inject(ChatService);
  private readonly reminder = inject(ReminderService);

  readonly user = this.auth.currentUser;
  readonly rolle = computed<Rolle>(() => this.auth.rolle() ?? 'coach');
  readonly rollenLabel = computed(() => ROLLEN_LABEL[this.rolle()]);
  readonly navItems = computed(() => NAV[this.rolle()]);
  readonly ungelesen = this.notify.ungelesen;
  readonly ungelesenChat = this.chat.ungelesenGesamt;
  readonly chatLink = computed(() => `/${this.rolle()}/chat`);

  constructor() {
    // Automatische Termin-Erinnerungen aktivieren, sobald jemand angemeldet ist.
    this.reminder.start();
  }

  abmelden(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
