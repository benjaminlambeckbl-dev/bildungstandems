import { Component, computed, inject } from '@angular/core';
import { DataService } from '../../core/data/data.service';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { CardComponent } from '../../shared/ui/card';

@Component({
  selector: 'bt-admin-schulen',
  standalone: true,
  imports: [PageHeaderComponent, CardComponent],
  template: `
    <bt-page-header titel="Schulen" untertitel="Teilnehmende weiterführende Schulen" />

    <div class="bt-stack">
      @for (s of schulen(); track s.id) {
        <bt-card accent>
          <div class="kopf">
            <span class="icon">🏫</span>
            <div>
              <strong>{{ s.name }}</strong>
              <p class="bt-soft klein">{{ s.ort }}</p>
            </div>
          </div>
          <hr class="bt-divider" />
          <div class="stats">
            <div><span class="z">{{ s.tandems }}</span><span class="l">Tandems</span></div>
            <div><span class="z">{{ s.coachs }}</span><span class="l">Coachs</span></div>
            <div><span class="z">{{ s.kinder }}</span><span class="l">Kinder</span></div>
          </div>
          @if (s.koordination) {
            <p class="klein bt-muted">👩‍🏫 Koordination: {{ s.koordination }}</p>
          }
        </bt-card>
      }
    </div>
  `,
  styles: [
    `
      .kopf {
        display: flex;
        align-items: center;
        gap: var(--bt-sp-3);
      }
      .icon {
        font-size: 1.8rem;
      }
      .kopf strong {
        font-size: var(--bt-fs-md);
      }
      .klein {
        font-size: var(--bt-fs-sm);
        margin: 2px 0 0;
      }
      .stats {
        display: flex;
        justify-content: space-around;
        text-align: center;
      }
      .z {
        display: block;
        font-size: var(--bt-fs-xl);
        font-weight: 900;
        color: var(--bt-primary);
      }
      .l {
        font-size: var(--bt-fs-xs);
        color: var(--bt-text-muted);
        font-weight: 700;
      }
    `,
  ],
})
export class AdminSchulenPage {
  private readonly data = inject(DataService);

  readonly schulen = computed(() =>
    this.data
      .schulen()
      .filter((s) => s.typ === 'weiterführend')
      .map((s) => {
        const tandems = this.data.tandems().filter((t) => t.schuleId === s.id);
        const coachs = this.data.nutzer().filter((n) => n.rolle === 'coach' && n.schuleId === s.id);
        const koord = this.data.nutzer().find((n) => n.rolle === 'lehrer' && n.schuleId === s.id);
        return {
          ...s,
          tandems: tandems.length,
          coachs: coachs.length,
          kinder: tandems.reduce((sum, t) => sum + t.coachees.length, 0),
          koordination: koord ? `${koord.vorname} ${koord.nachname}` : '',
        };
      }),
  );
}
