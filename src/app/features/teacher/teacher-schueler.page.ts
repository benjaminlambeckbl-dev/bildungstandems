import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/data/data.service';
import { SelectorsService } from '../../core/services/selectors.service';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { AvatarComponent } from '../../shared/ui/avatar';
import { EmptyStateComponent } from '../../shared/ui/empty-state';

@Component({
  selector: 'bt-teacher-schueler',
  standalone: true,
  imports: [RouterLink, PageHeaderComponent, AvatarComponent, EmptyStateComponent],
  template: `
    <bt-page-header titel="Meine Coachs" untertitel="Schüler:innen mit Tandem-Zugang">
      <a aktion routerLink="/lehrer/schueler/neu" class="bt-btn bt-btn--primary">+ Zugang</a>
    </bt-page-header>

    @if (coachs().length) {
      <div class="bt-stack">
        @for (c of coachs(); track c.id) {
          <div class="row">
            <bt-avatar [vorname]="c.vorname" [nachname]="c.nachname" [farbe]="c.avatarFarbe ?? ''" />
            <div class="info">
              <strong>{{ c.vorname }} {{ c.nachname }}</strong>
              <span class="bt-soft">{{ tandem(c.tandemId) }}</span>
            </div>
            <a class="info-btn" [routerLink]="['/lehrer/nachricht']" [queryParams]="{ an: c.id }">
              ✉️
            </a>
          </div>
        }
      </div>
    } @else {
      <bt-empty symbol="🧑‍🤝‍🧑" titel="Noch keine Coachs" text="Gewähre deiner ersten Schüler:in Zugang.">
        <a routerLink="/lehrer/schueler/neu" class="bt-btn bt-btn--primary">Zugang gewähren</a>
      </bt-empty>
    }
  `,
  styles: [
    `
      .row {
        display: flex;
        align-items: center;
        gap: var(--bt-sp-3);
        padding: var(--bt-sp-3);
        background: var(--bt-surface);
        border: 1px solid var(--bt-border);
        border-radius: var(--bt-radius);
        box-shadow: var(--bt-shadow-sm);
      }
      .info {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      .info strong {
        font-size: var(--bt-fs-sm);
      }
      .info span {
        font-size: var(--bt-fs-xs);
      }
      .info-btn {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: var(--bt-primary-100);
        display: grid;
        place-items: center;
        text-decoration: none;
      }
    `,
  ],
})
export class TeacherSchuelerPage {
  private readonly sel = inject(SelectorsService);
  private readonly data = inject(DataService);

  readonly coachs = this.sel.meineCoachs;

  tandem(id?: string): string {
    if (!id) return 'Ohne Tandem';
    const t = this.data.tandems().find((x) => x.id === id);
    return t ? `${t.name} · ${t.coachees.length} Kinder` : 'Ohne Tandem';
  }
}
