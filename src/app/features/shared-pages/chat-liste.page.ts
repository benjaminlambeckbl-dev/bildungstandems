import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ChatService } from '../../core/services/chat.service';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { EmptyStateComponent } from '../../shared/ui/empty-state';
import { DatumPipe } from '../../shared/pipes/datum.pipe';

@Component({
  selector: 'bt-chat-liste',
  standalone: true,
  imports: [RouterLink, PageHeaderComponent, EmptyStateComponent, DatumPipe],
  template: `
    <bt-page-header titel="Chat" untertitel="Austausch im Programm">
      @if (chat.darfNeuStarten()) {
        <a aktion [routerLink]="[basis(), 'neu']" class="bt-btn bt-btn--primary">+ Neu</a>
      }
    </bt-page-header>

    @if (kanaele().length) {
      <div class="liste">
        @for (k of kanaele(); track k.kanal.id) {
          <a class="kanal" [routerLink]="[basis(), k.kanal.id]">
            <span class="icon">{{ k.icon }}</span>
            <div class="mitte">
              <div class="zeile1">
                <strong>{{ k.titel }}</strong>
                @if (k.letzteNachricht) {
                  <span class="zeit">{{ k.letzteNachricht.zeit | datum: 'relativ' }}</span>
                }
              </div>
              <div class="zeile2">
                <span class="vorschau">
                  @if (k.letzteNachricht) {
                    {{ chat.nutzerName(k.letzteNachricht.vonId).split(' ')[0] }}: {{ k.letzteNachricht.text }}
                  } @else {
                    {{ k.untertitel }}
                  }
                </span>
                @if (k.ungelesen > 0) {
                  <span class="badge">{{ k.ungelesen }}</span>
                }
              </div>
              @if (k.nurLesend) {
                <span class="tag">👁️ {{ k.untertitel }}</span>
              }
            </div>
          </a>
        }
      </div>
    } @else {
      <bt-empty symbol="💬" titel="Noch keine Chats" text="Hier erscheinen deine Unterhaltungen." />
    }
  `,
  styles: [
    `
      .liste { display: flex; flex-direction: column; gap: var(--bt-sp-2); }
      .kanal {
        display: flex; align-items: center; gap: var(--bt-sp-3);
        padding: var(--bt-sp-3);
        background: var(--bt-surface); border: 1px solid var(--bt-border);
        border-radius: var(--bt-radius); box-shadow: var(--bt-shadow-sm);
        text-decoration: none; color: var(--bt-text);
      }
      .icon {
        width: 44px; height: 44px; flex-shrink: 0;
        border-radius: 50%; background: var(--bt-primary-100);
        display: grid; place-items: center; font-size: 1.3rem;
      }
      .mitte { flex: 1; min-width: 0; }
      .zeile1 { display: flex; justify-content: space-between; gap: var(--bt-sp-2); }
      .zeile1 strong { font-size: var(--bt-fs-sm); }
      .zeit { font-size: var(--bt-fs-xs); color: var(--bt-text-soft); flex-shrink: 0; }
      .zeile2 { display: flex; align-items: center; gap: var(--bt-sp-2); }
      .vorschau {
        flex: 1; font-size: var(--bt-fs-xs); color: var(--bt-text-muted);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .badge {
        background: var(--bt-accent); color: #3a2a05;
        font-size: 0.65rem; font-weight: 900;
        min-width: 18px; height: 18px; padding: 0 5px;
        border-radius: 9px; display: grid; place-items: center;
      }
      .tag {
        display: inline-block; margin-top: 2px;
        font-size: 0.65rem; font-weight: 800; color: var(--bt-text-soft);
      }
    `,
  ],
})
export class ChatListePage {
  private readonly auth = inject(AuthService);
  protected readonly chat = inject(ChatService);

  readonly basis = computed(() => `/${this.auth.rolle()}/chat`);
  readonly kanaele = this.chat.sichtbareKanaele;
}
