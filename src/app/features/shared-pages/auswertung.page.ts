import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { DataService } from '../../core/data/data.service';
import { SelectorsService } from '../../core/services/selectors.service';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { CardComponent } from '../../shared/ui/card';
import { BalkenChartComponent, BalkenDaten } from '../../shared/ui/balken-chart';
import { DatumPipe } from '../../shared/pipes/datum.pipe';

const SMILEYS = ['😟', '🙁', '😐', '🙂', '😄'];

@Component({
  selector: 'bt-auswertung',
  standalone: true,
  imports: [PageHeaderComponent, CardComponent, BalkenChartComponent, DatumPipe],
  template: `
    <bt-page-header titel="Auswertung" [untertitel]="untertitel()" />

    <div class="zeitraum">
      @for (z of zeitraeume; track z.tage) {
        <button class="zr" [class.an]="zeitraum() === z.tage" (click)="zeitraum.set(z.tage)">{{ z.label }}</button>
      }
    </div>

    <div class="bt-stack">
      <!-- Kennzahlen -->
      <div class="kpis">
        <div class="kpi"><span class="z">{{ reflexionen().length }}</span><span class="l">Reflexionen</span></div>
        <div class="kpi"><span class="z">{{ schnitt() }}</span><span class="l">Ø Stimmung /5</span></div>
        <div class="kpi"><span class="z">{{ checks().length }}</span><span class="l">Tages-Checks</span></div>
        <div class="kpi" [class.warn]="bedarf().length > 0"><span class="z">{{ bedarf().length }}</span><span class="l">Hilfe-Anfragen</span></div>
      </div>

      <bt-card>
        <h3 class="t">Stimmungs-Verteilung (Reflexionen)</h3>
        <bt-balken-chart [daten]="verteilung()" />
      </bt-card>

      <bt-card>
        <h3 class="t">Tagesstimmung im Verlauf</h3>
        <bt-balken-chart [daten]="verlauf()" [max]="3" />
        <p class="hint">Skala: 1 schwierig · 2 okay · 3 gut</p>
      </bt-card>

      @if (istAdmin()) {
        <bt-card>
          <h3 class="t">Ø Stimmung je Schule</h3>
          <bt-balken-chart [daten]="jeSchule()" [max]="5" />
        </bt-card>
      }

      <bt-card>
        <h3 class="t">Offene Hilfe-Anfragen</h3>
        @if (bedarf().length) {
          @for (b of bedarf(); track b.id) {
            <div class="bedarf">
              <strong>{{ b.titel }}</strong>
              <p>{{ b.text }}</p>
              <span class="zeit">{{ b.zeit | datum: 'relativ' }}</span>
            </div>
          }
        } @else {
          <p class="hint">Keine offenen Anfragen – alles im grünen Bereich. 🌱</p>
        }
      </bt-card>
    </div>
  `,
  styles: [
    `
      .zeitraum { display: flex; gap: var(--bt-sp-2); margin-bottom: var(--bt-sp-4); }
      .zr { flex: 1; border: 1.5px solid var(--bt-border); background: var(--bt-surface);
        color: var(--bt-text-muted); border-radius: var(--bt-radius-pill); padding: 0.4rem; font-weight: 800; }
      .zr.an { background: var(--bt-primary); color: #fff; border-color: var(--bt-primary); }
      .kpis { display: grid; grid-template-columns: 1fr 1fr; gap: var(--bt-sp-2); }
      .kpi { background: var(--bt-surface); border: 1px solid var(--bt-border); border-radius: var(--bt-radius);
        box-shadow: var(--bt-shadow-sm); padding: var(--bt-sp-3); text-align: center; }
      .kpi.warn { border-color: var(--bt-warning); background: var(--bt-warning-100); }
      .z { display: block; font-size: var(--bt-fs-xl); font-weight: 900; color: var(--bt-primary); }
      .kpi.warn .z { color: var(--bt-warning); }
      .l { font-size: var(--bt-fs-xs); color: var(--bt-text-muted); font-weight: 700; }
      .t { font-size: var(--bt-fs-md); margin: 0 0 var(--bt-sp-3); }
      .hint { font-size: var(--bt-fs-xs); color: var(--bt-text-soft); margin: var(--bt-sp-2) 0 0; }
      .bedarf { padding: var(--bt-sp-2) 0; border-bottom: 1px solid var(--bt-border); }
      .bedarf:last-child { border-bottom: none; }
      .bedarf strong { font-size: var(--bt-fs-sm); }
      .bedarf p { margin: 2px 0; font-size: var(--bt-fs-sm); color: var(--bt-text-muted); }
      .bedarf .zeit { font-size: var(--bt-fs-xs); color: var(--bt-text-soft); }
    `,
  ],
})
export class AuswertungPage {
  private readonly auth = inject(AuthService);
  private readonly data = inject(DataService);
  private readonly sel = inject(SelectorsService);

  /** Einmalige Pipe-Instanz (statt new() pro Neuberechnung). */
  private readonly datum = new DatumPipe();

  readonly zeitraeume = [
    { tage: 7, label: '7 Tage' },
    { tage: 30, label: '30 Tage' },
    { tage: 0, label: 'Alles' },
  ];
  readonly zeitraum = signal(30);

  readonly istAdmin = computed(() => this.auth.rolle() === 'admin');
  readonly untertitel = computed(() =>
    this.istAdmin() ? 'Alle Schulen' : 'Deine Schule',
  );

  /** Coach-IDs im Auswertungs-Scope (Lehrer: eigene Schule; Admin: alle). */
  private readonly coachIds = computed(() => {
    if (this.istAdmin()) {
      return new Set(this.data.nutzer().filter((n) => n.rolle === 'coach').map((n) => n.id));
    }
    return new Set(this.sel.meineCoachs().map((c) => c.id));
  });

  private imZeitraum(iso: string): boolean {
    const tage = this.zeitraum();
    if (!tage) return true;
    return +new Date(iso) >= Date.now() - tage * 86_400_000;
  }

  readonly reflexionen = computed(() =>
    this.data.reflexionen().filter((r) => this.coachIds().has(r.nutzerId) && this.imZeitraum(r.datum)),
  );

  readonly checks = computed(() => {
    const adm = this.istAdmin();
    const schuleId = this.auth.currentUser()?.schuleId;
    if (!adm && !schuleId) return [];
    return this.data
      .tagesChecks()
      .filter((c) => (adm || c.schuleId === schuleId) && this.imZeitraum(c.datum));
  });

  readonly bedarf = computed(() => {
    const u = this.auth.currentUser();
    return this.data
      .nachrichten()
      .filter((n) => n.typ === 'bedarf' && (this.istAdmin() || n.anNutzerId === u?.id))
      .sort((a, b) => +new Date(b.zeit) - +new Date(a.zeit));
  });

  readonly schnitt = computed(() => {
    const r = this.reflexionen();
    if (!r.length) return '–';
    return (r.reduce((s, x) => s + x.stimmung, 0) / r.length).toFixed(1);
  });

  readonly verteilung = computed<BalkenDaten[]>(() => {
    const r = this.reflexionen();
    return [5, 4, 3, 2, 1].map((stufe) => ({
      label: `${SMILEYS[stufe - 1]} ${stufe}`,
      wert: r.filter((x) => x.stimmung === stufe).length,
    }));
  });

  readonly verlauf = computed<BalkenDaten[]>(() => {
    // Ø Tages-Check je Kalendertag (ISO YYYY-MM-DD, keine Zeitzonen-Konvertierung), neueste 7.
    const proTag = new Map<string, number[]>();
    for (const c of this.checks()) {
      const tag = c.datum.split('T')[0];
      (proTag.get(tag) ?? proTag.set(tag, []).get(tag)!).push(c.wert);
    }
    const eintraege = [...proTag.entries()]
      .map(([tag, werte]) => ({ tag, avg: werte.reduce((s, w) => s + w, 0) / werte.length }))
      .sort((a, b) => a.tag.localeCompare(b.tag))
      .slice(-7);
    return eintraege.map((e) => ({
      label: this.datum.transform(e.tag + 'T12:00:00', 'kurz'),
      wert: Math.round(e.avg * 10) / 10,
      anzeige: e.avg.toFixed(1),
      farbe: e.avg >= 2.5 ? 'var(--bt-success)' : e.avg >= 1.7 ? 'var(--bt-accent)' : 'var(--bt-danger)',
    }));
  });

  readonly jeSchule = computed<BalkenDaten[]>(() => {
    return this.data
      .schulen()
      .filter((s) => s.typ === 'weiterführend')
      .map((s) => {
        const ids = new Set(
          this.data.nutzer().filter((n) => n.rolle === 'coach' && n.schuleId === s.id).map((n) => n.id),
        );
        const r = this.data.reflexionen().filter((x) => ids.has(x.nutzerId) && this.imZeitraum(x.datum));
        const avg = r.length ? r.reduce((sum, x) => sum + x.stimmung, 0) / r.length : 0;
        return { label: s.name, wert: Math.round(avg * 10) / 10, anzeige: r.length ? avg.toFixed(1) : '–' };
      });
  });
}
