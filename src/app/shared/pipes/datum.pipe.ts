import { Pipe, PipeTransform } from '@angular/core';

const WOCHENTAGE = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const MONATE = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
];

export type DatumFormat = 'lang' | 'kurz' | 'zeit' | 'tag' | 'relativ';

/** Formatiert ISO-Datumsstrings auf Deutsch (ohne Locale-Setup). */
@Pipe({ name: 'datum', standalone: true })
export class DatumPipe implements PipeTransform {
  transform(iso: string | undefined | null, format: DatumFormat = 'lang'): string {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(+d)) return '';

    const wt = WOCHENTAGE[d.getDay()];
    const tag = d.getDate();
    const monat = MONATE[d.getMonth()];
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');

    switch (format) {
      case 'zeit':
        return `${hh}:${mm} Uhr`;
      case 'tag':
        return `${wt}, ${tag}. ${monat}`;
      case 'kurz':
        return `${tag}. ${monat.slice(0, 3)}.`;
      case 'relativ':
        return this.relativ(d);
      case 'lang':
      default:
        return `${wt}, ${tag}. ${monat} · ${hh}:${mm} Uhr`;
    }
  }

  private relativ(d: Date): string {
    const jetzt = new Date();
    const diffMs = d.getTime() - jetzt.getTime();
    const diffMin = Math.round(diffMs / 60000);
    const diffStd = Math.round(diffMin / 60);
    const diffTage = Math.round(diffStd / 24);

    if (Math.abs(diffMin) < 60) {
      if (diffMin === 0) return 'gerade eben';
      return diffMin > 0 ? `in ${diffMin} Min.` : `vor ${-diffMin} Min.`;
    }
    if (Math.abs(diffStd) < 24) {
      return diffStd > 0 ? `in ${diffStd} Std.` : `vor ${-diffStd} Std.`;
    }
    if (diffTage === 0) return 'heute';
    if (diffTage === 1) return 'morgen';
    if (diffTage === -1) return 'gestern';
    return diffTage > 0 ? `in ${diffTage} Tagen` : `vor ${-diffTage} Tagen`;
  }
}
