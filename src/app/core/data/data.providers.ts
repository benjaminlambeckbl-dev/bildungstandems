// =============================================================
// BildungsTandems – Provider-Verdrahtung der Datenschicht
// Hier wird entschieden, welche Implementierung den DataService-Vertrag
// erfüllt. Heute: MockDataService. Für Supabase später nur diese eine
// Zeile auf SupabaseDataService ändern – die gesamte UI bleibt gleich.
// =============================================================

import { Provider } from '@angular/core';
import { DataService } from './data.service';
import { MockDataService } from './mock-data.service';

export function provideMockData(): Provider[] {
  return [{ provide: DataService, useClass: MockDataService }];
}
