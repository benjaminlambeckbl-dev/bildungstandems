import { Component, computed, inject } from '@angular/core';
import { DataService } from '../../core/data/data.service';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { CardComponent } from '../../shared/ui/card';
import { AvatarComponent } from '../../shared/ui/avatar';

@Component({
  selector: 'bt-admin-tandems',
  standalone: true,
  imports: [PageHeaderComponent, CardComponent, AvatarComponent],
  template: `
    <bt-page-header titel="Tandems" untertitel="Alle aktiven Tandems" />

    <div class="bt-stack">
      @for (t of tandems(); track t.id) {
        <bt-card>
          <div class="kopf">
            <bt-avatar [vorname]="t.coachVorname" [nachname]="t.coachNachname" [farbe]="t.farbe" />
            <div class="info">
              <strong>{{ t.name }}</strong>
              <span class="bt-soft klein">{{ t.schule }}</span>
            </div>
            <span class="anzahl">{{ t.coachees.length }} 🧒</span>
          </div>
          <p class="coach klein">Coach: {{ t.coachVorname }} {{ t.coachNachname }}</p>
          @if (t.coachees.length) {
            <div class="kinder">
              @for (k of t.coachees; track k) {
                <span class="kind">{{ k }}</span>
              }
            </div>
          }
          <p class="klein bt-soft">↔ {{ t.partnerGrundschule }}</p>
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
      .info {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      .info strong {
        font-size: var(--bt-fs-md);
      }
      .info span {
        font-size: var(--bt-fs-xs);
      }
      .anzahl {
        font-weight: 800;
        font-size: var(--bt-fs-sm);
        color: var(--bt-text-muted);
      }
      .coach {
        margin: var(--bt-sp-3) 0 var(--bt-sp-2);
        font-weight: 700;
      }
      .klein {
        font-size: var(--bt-fs-sm);
      }
      .kinder {
        display: flex;
        flex-wrap: wrap;
        gap: var(--bt-sp-2);
        margin-bottom: var(--bt-sp-2);
      }
      .kind {
        background: var(--bt-primary-100);
        color: var(--bt-primary);
        font-size: var(--bt-fs-xs);
        font-weight: 700;
        padding: 2px 10px;
        border-radius: var(--bt-radius-pill);
      }
    `,
  ],
})
export class AdminTandemsPage {
  private readonly data = inject(DataService);

  readonly tandems = computed(() =>
    this.data.tandems().map((t) => {
      const coach = this.data.nutzer().find((n) => n.id === t.coachId);
      const schule = this.data.schulen().find((s) => s.id === t.schuleId);
      return {
        ...t,
        coachVorname: coach?.vorname ?? '',
        coachNachname: coach?.nachname ?? '',
        farbe: coach?.avatarFarbe ?? 'var(--bt-primary)',
        schule: schule?.name ?? '',
      };
    }),
  );
}
