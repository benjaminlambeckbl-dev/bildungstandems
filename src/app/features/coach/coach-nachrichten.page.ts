import { Component, inject } from '@angular/core';
import { DataService } from '../../core/data/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { EmptyStateComponent } from '../../shared/ui/empty-state';
import { DatumPipe } from '../../shared/pipes/datum.pipe';
import { NachrichtTyp } from '../../core/models/models';

const ICON: Record<NachrichtTyp, string> = {
  info: 'ℹ️',
  absage: '⚠️',
  erinnerung: '🔔',
  lob: '🌟',
  bedarf: '🆘',
};

@Component({
  selector: 'bt-coach-nachrichten',
  standalone: true,
  imports: [PageHeaderComponent, EmptyStateComponent, DatumPipe],
  template: `
    <bt-page-header titel="Infos" untertitel="Nachrichten von deiner Lehrkraft" />

    @if (nachrichten().length) {
      <div class="bt-stack">
        @for (n of nachrichten(); track n.id) {
          <article
            class="msg"
            [class.msg--neu]="!n.gelesen"
            [attr.data-typ]="n.typ"
            (click)="lesen(n.id)"
          >
            <span class="icon">{{ icon(n.typ) }}</span>
            <div class="body">
              <div class="kopf">
                <strong>{{ n.titel }}</strong>
                @if (!n.gelesen) {
                  <span class="neu">neu</span>
                }
              </div>
              <p class="text">{{ n.text }}</p>
              <p class="meta">{{ n.vonName }} · {{ n.zeit | datum: 'relativ' }}</p>
            </div>
          </article>
        }
      </div>
    } @else {
      <bt-empty symbol="📭" titel="Keine Infos" text="Hier erscheinen Nachrichten deiner Lehrkraft." />
    }
  `,
  styles: [
    `
      .msg {
        display: flex;
        gap: var(--bt-sp-3);
        padding: var(--bt-sp-4);
        background: var(--bt-surface);
        border: 1px solid var(--bt-border);
        border-radius: var(--bt-radius);
        box-shadow: var(--bt-shadow-sm);
        cursor: pointer;
      }
      .msg--neu {
        border-left: 4px solid var(--bt-accent);
        background: var(--bt-accent-100);
      }
      .msg[data-typ='absage'] {
        border-left: 4px solid var(--bt-danger);
      }
      .icon {
        font-size: 1.4rem;
      }
      .body {
        flex: 1;
      }
      .kopf {
        display: flex;
        align-items: center;
        gap: var(--bt-sp-2);
      }
      .kopf strong {
        font-size: var(--bt-fs-md);
      }
      .neu {
        background: var(--bt-accent);
        color: #3a2a05;
        font-size: 0.65rem;
        font-weight: 900;
        padding: 1px 7px;
        border-radius: var(--bt-radius-pill);
      }
      .text {
        margin: 4px 0;
        font-size: var(--bt-fs-sm);
      }
      .meta {
        margin: 0;
        font-size: var(--bt-fs-xs);
        color: var(--bt-text-soft);
        font-weight: 600;
      }
    `,
  ],
})
export class CoachNachrichtenPage {
  private readonly data = inject(DataService);
  private readonly notify = inject(NotificationService);

  readonly nachrichten = this.notify.meineNachrichten;

  icon(typ: NachrichtTyp): string {
    return ICON[typ];
  }

  lesen(id: string): void {
    this.data.nachrichtAlsGelesen(id);
  }
}
