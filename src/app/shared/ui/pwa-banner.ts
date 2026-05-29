import { Component, inject, signal } from '@angular/core';
import { NotificationService } from '../../core/services/notification.service';

/**
 * Kleiner Hinweisstreifen:
 *  - „App installieren" (sobald der Browser das anbietet, beforeinstallprompt)
 *  - „Benachrichtigungen erlauben" (Demo für späteres echtes Push)
 */
@Component({
  selector: 'bt-pwa-banner',
  standalone: true,
  template: `
    @if (installierbar() && !versteckt()) {
      <div class="banner">
        <span>📲 BildungsTandems als App installieren?</span>
        <div class="btns">
          <button class="bt-btn bt-btn--primary" (click)="installieren()">Installieren</button>
          <button class="schliessen" (click)="versteckt.set(true)" aria-label="Schließen">✕</button>
        </div>
      </div>
    } @else if (notify.erlaubnis() === 'default' && !pushVersteckt()) {
      <div class="banner">
        <span>🔔 Erinnerungen & Infos als Benachrichtigung erhalten?</span>
        <div class="btns">
          <button class="bt-btn bt-btn--primary" (click)="erlauben()">Erlauben</button>
          <button class="schliessen" (click)="pushVersteckt.set(true)" aria-label="Schließen">✕</button>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .banner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--bt-sp-3);
        background: var(--bt-accent-100);
        border: 1px solid var(--bt-accent);
        border-radius: var(--bt-radius);
        padding: var(--bt-sp-3) var(--bt-sp-4);
        margin-bottom: var(--bt-sp-4);
        font-size: var(--bt-fs-sm);
        font-weight: 700;
      }
      .btns {
        display: flex;
        align-items: center;
        gap: var(--bt-sp-2);
      }
      .btns .bt-btn {
        padding: 0.4rem 0.8rem;
        font-size: var(--bt-fs-sm);
      }
      .schliessen {
        border: none;
        background: transparent;
        font-size: 1rem;
        color: var(--bt-text-muted);
      }
    `,
  ],
})
export class PwaBannerComponent {
  protected readonly notify = inject(NotificationService);

  private deferredPrompt: any = null;
  readonly installierbar = signal(false);
  readonly versteckt = signal(false);
  readonly pushVersteckt = signal(false);

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', (e: Event) => {
        e.preventDefault();
        this.deferredPrompt = e;
        this.installierbar.set(true);
      });
      window.addEventListener('appinstalled', () => {
        this.installierbar.set(false);
        this.deferredPrompt = null;
      });
    }
  }

  async installieren(): Promise<void> {
    if (!this.deferredPrompt) return;
    this.deferredPrompt.prompt();
    await this.deferredPrompt.userChoice;
    this.deferredPrompt = null;
    this.installierbar.set(false);
  }

  async erlauben(): Promise<void> {
    await this.notify.erlaubnisAnfragen();
  }
}
