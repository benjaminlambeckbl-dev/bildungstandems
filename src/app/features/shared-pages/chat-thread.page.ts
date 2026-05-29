import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../core/services/chat.service';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { DatumPipe } from '../../shared/pipes/datum.pipe';

@Component({
  selector: 'bt-chat-thread',
  standalone: true,
  imports: [FormsModule, PageHeaderComponent, DatumPipe],
  template: `
    @if (kanal(); as k) {
      <bt-page-header [titel]="titel()" [untertitel]="untertitel()" [zurueck]="true" />

      <div class="verlauf">
        @for (n of nachrichten(); track n.id) {
          <div class="msg" [class.eigen]="chat.istEigene(n.vonId)">
            @if (!chat.istEigene(n.vonId) && gruppe()) {
              <span class="sender">{{ chat.nutzerName(n.vonId) }}</span>
            }
            <div class="bubble">{{ n.text }}</div>
            <span class="zeit">{{ n.zeit | datum: 'zeit' }}</span>
          </div>
        } @empty {
          <p class="leer">Noch keine Nachrichten – schreib die erste! ✍️</p>
        }
      </div>

      @if (chat.darfSenden(k)) {
        <form class="eingabe" (ngSubmit)="senden()">
          <input [(ngModel)]="text" name="text" placeholder="Nachricht schreiben …" autocomplete="off" />
          <button type="submit" class="senden" [disabled]="!text.trim()" aria-label="Senden">➤</button>
        </form>
      } @else {
        <div class="hinweis">👁️ Nur-Lese-Ansicht (Koordinations-Einsicht)</div>
      }
    } @else {
      <bt-page-header titel="Chat" [zurueck]="true" />
      <p class="bt-muted">Unterhaltung nicht gefunden.</p>
    }
  `,
  styles: [
    `
      :host { display: block; padding-bottom: 70px; }
      .verlauf { display: flex; flex-direction: column; gap: var(--bt-sp-3); padding-bottom: var(--bt-sp-4); }
      .msg { display: flex; flex-direction: column; align-items: flex-start; max-width: 80%; }
      .msg.eigen { align-self: flex-end; align-items: flex-end; }
      .sender { font-size: var(--bt-fs-xs); font-weight: 800; color: var(--bt-primary); margin-bottom: 2px; }
      .bubble {
        background: var(--bt-surface); border: 1px solid var(--bt-border);
        padding: 0.6rem 0.85rem; border-radius: 16px; border-bottom-left-radius: 4px;
        font-size: var(--bt-fs-sm); box-shadow: var(--bt-shadow-sm);
      }
      .msg.eigen .bubble {
        background: var(--bt-primary); color: #fff; border-color: var(--bt-primary);
        border-radius: 16px; border-bottom-right-radius: 4px;
      }
      .zeit { font-size: 0.65rem; color: var(--bt-text-soft); margin-top: 2px; }
      .leer { text-align: center; color: var(--bt-text-muted); padding: var(--bt-sp-5) 0; }
      .eingabe {
        position: fixed; bottom: calc(var(--bt-nav-h) + var(--bt-safe-bottom)); left: 50%;
        transform: translateX(-50%); width: 100%; max-width: var(--bt-app-max);
        display: flex; gap: var(--bt-sp-2); padding: var(--bt-sp-3);
        background: var(--bt-surface); border-top: 1px solid var(--bt-border);
      }
      .eingabe input {
        flex: 1; padding: 0.7rem 1rem; border: 1.5px solid var(--bt-border);
        border-radius: var(--bt-radius-pill); background: var(--bt-surface-alt);
      }
      .senden {
        width: 44px; height: 44px; flex-shrink: 0; border: none; border-radius: 50%;
        background: var(--bt-primary); color: #fff; font-size: 1.1rem;
      }
      .senden:disabled { opacity: 0.5; }
      .hinweis {
        position: fixed; bottom: calc(var(--bt-nav-h) + var(--bt-safe-bottom)); left: 50%;
        transform: translateX(-50%); width: 100%; max-width: var(--bt-app-max);
        padding: var(--bt-sp-3); text-align: center; background: var(--bt-surface-alt);
        border-top: 1px solid var(--bt-border); font-size: var(--bt-fs-sm);
        font-weight: 700; color: var(--bt-text-muted);
      }
    `,
  ],
})
export class ChatThreadPage {
  protected readonly chat = inject(ChatService);

  id = input.required<string>();
  text = '';

  readonly kanal = computed(() => this.chat.kanal(this.id())());
  readonly nachrichten = computed(() => this.chat.nachrichtenFuer(this.id())());
  readonly titel = computed(() => {
    const k = this.kanal();
    return k ? this.chat.titel(k) : 'Chat';
  });
  readonly gruppe = computed(() => {
    const k = this.kanal();
    return k?.typ === 'kohorte' || k?.typ === 'kollegium';
  });
  readonly untertitel = computed(() => {
    const k = this.kanal();
    if (!k) return '';
    if (k.typ === 'kohorte') return 'Coach-Kohorte';
    if (k.typ === 'kollegium') return 'Lehrkräfte';
    return '';
  });

  constructor() {
    // Beim Öffnen als gelesen markieren.
    effect(() => {
      const id = this.id();
      if (id) this.chat.markGelesen(id);
    });
  }

  senden(): void {
    if (!this.text.trim()) return;
    this.chat.senden(this.id(), this.text);
    this.text = '';
  }
}
