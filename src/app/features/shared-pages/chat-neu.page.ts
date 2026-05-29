import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ChatService } from '../../core/services/chat.service';
import { DataService } from '../../core/data/data.service';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { AvatarComponent } from '../../shared/ui/avatar';
import { EmptyStateComponent } from '../../shared/ui/empty-state';
import { Nutzer } from '../../core/models/models';

const ROLLE_LABEL: Record<string, string> = {
  coach: 'Coach',
  lehrer: 'Lehrkraft',
  admin: 'Organisation',
};

@Component({
  selector: 'bt-chat-neu',
  standalone: true,
  imports: [PageHeaderComponent, AvatarComponent, EmptyStateComponent],
  template: `
    <bt-page-header titel="Neuer Chat" untertitel="Wen möchtest du anschreiben?" [zurueck]="true" />

    @if (empfaenger().length) {
      <div class="liste">
        @for (n of empfaenger(); track n.id) {
          <button class="person" type="button" (click)="starten(n)">
            <bt-avatar [vorname]="n.vorname" [nachname]="n.nachname" [farbe]="n.avatarFarbe ?? ''" />
            <div class="info">
              <strong>{{ n.vorname }} {{ n.nachname }}</strong>
              <span class="bt-soft">{{ rolle(n) }} · {{ schule(n.schuleId) }}</span>
            </div>
            <span class="pfeil">→</span>
          </button>
        }
      </div>
    } @else {
      <bt-empty symbol="💬" titel="Keine Empfänger" text="Für deine Rolle sind keine neuen Direkt-Chats vorgesehen." />
    }
  `,
  styles: [
    `
      .liste { display: flex; flex-direction: column; gap: var(--bt-sp-2); }
      .person {
        display: flex; align-items: center; gap: var(--bt-sp-3);
        padding: var(--bt-sp-3); text-align: left;
        background: var(--bt-surface); border: 1px solid var(--bt-border);
        border-radius: var(--bt-radius); box-shadow: var(--bt-shadow-sm);
      }
      .info { flex: 1; display: flex; flex-direction: column; }
      .info strong { font-size: var(--bt-fs-sm); }
      .info span { font-size: var(--bt-fs-xs); }
      .pfeil { color: var(--bt-primary); font-weight: 900; }
    `,
  ],
})
export class ChatNeuPage {
  private readonly auth = inject(AuthService);
  private readonly chat = inject(ChatService);
  private readonly data = inject(DataService);
  private readonly router = inject(Router);

  readonly empfaenger = this.chat.moeglicheEmpfaenger;

  rolle(n: Nutzer): string {
    return ROLLE_LABEL[n.rolle] ?? n.rolle;
  }
  schule(id: string): string {
    return this.data.schulen().find((s) => s.id === id)?.name ?? '';
  }

  starten(n: Nutzer): void {
    const kanalId = this.chat.direktStarten(n.id);
    if (kanalId) this.router.navigate([`/${this.auth.rolle()}/chat`, kanalId]);
  }
}
