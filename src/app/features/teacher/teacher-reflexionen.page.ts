import { Component, computed, inject } from '@angular/core';
import { DataService } from '../../core/data/data.service';
import { SelectorsService } from '../../core/services/selectors.service';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { CardComponent } from '../../shared/ui/card';
import { EmptyStateComponent } from '../../shared/ui/empty-state';
import { DatumPipe } from '../../shared/pipes/datum.pipe';

const SMILEYS = ['😟', '🙁', '😐', '🙂', '😄'];

@Component({
  selector: 'bt-teacher-reflexionen',
  standalone: true,
  imports: [PageHeaderComponent, CardComponent, EmptyStateComponent, DatumPipe],
  template: `
    <bt-page-header titel="Reflexionen" untertitel="Rückmeldungen deiner Coachs" />

    @if (eintraege().length) {
      <div class="bt-stack">
        @for (r of eintraege(); track r.id) {
          <bt-card>
            <div class="kopf">
              <span class="smiley">{{ smiley(r.stimmung) }}</span>
              <div class="who">
                <strong>{{ r.coachName }}</strong>
                <span class="bt-soft">{{ r.tandem }} · {{ r.datum | datum: 'tag' }}</span>
              </div>
            </div>
            @if (r.gelungen) { <p><strong>Gut:</strong> {{ r.gelungen }}</p> }
            @if (r.herausforderung) { <p><strong>Schwierig:</strong> {{ r.herausforderung }}</p> }
          </bt-card>
        }
      </div>
    } @else {
      <bt-empty symbol="📝" titel="Noch keine Reflexionen" text="Sobald deine Coachs reflektieren, siehst du es hier." />
    }
  `,
  styles: [
    `
      .kopf {
        display: flex;
        align-items: center;
        gap: var(--bt-sp-3);
        margin-bottom: var(--bt-sp-2);
      }
      .smiley {
        font-size: 1.7rem;
      }
      .who {
        display: flex;
        flex-direction: column;
      }
      .who strong {
        font-size: var(--bt-fs-sm);
      }
      .who span {
        font-size: var(--bt-fs-xs);
      }
      p {
        margin: 0 0 var(--bt-sp-2);
        font-size: var(--bt-fs-sm);
      }
    `,
  ],
})
export class TeacherReflexionenPage {
  private readonly data = inject(DataService);
  private readonly sel = inject(SelectorsService);

  readonly eintraege = computed(() => {
    const coachs = this.sel.meineCoachs();
    const coachIds = new Set(coachs.map((c) => c.id));
    return this.data
      .reflexionen()
      .filter((r) => coachIds.has(r.nutzerId))
      .map((r) => {
        const coach = coachs.find((c) => c.id === r.nutzerId);
        return {
          ...r,
          coachName: coach ? `${coach.vorname} ${coach.nachname}` : 'Coach',
          tandem: this.sel.tandemName(r.tandemId),
        };
      });
  });

  smiley(n: number): string {
    return SMILEYS[n - 1] ?? '🙂';
  }
}
