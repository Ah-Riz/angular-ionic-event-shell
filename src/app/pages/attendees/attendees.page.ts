import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { startWith } from 'rxjs';
import { ConferenceDataService } from '../../core/conference-data.service';
import { Attendee } from '../../models/conference';

@Component({
  selector: 'app-attendees',
  templateUrl: './attendees.page.html',
  styleUrls: ['./attendees.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar],
})
export class AttendeesPage {
  private readonly data = inject(ConferenceDataService);
  private readonly router = inject(Router);

  readonly attendees = toSignal(
    this.data.getAttendees().pipe(startWith(null as Attendee[] | null)),
    { initialValue: null as Attendee[] | null }
  );

  readonly query = signal('');
  readonly industry = signal('all');

  readonly ready = computed(() => this.attendees() !== null);

  readonly industries = computed(() => {
    const values = [...new Set((this.attendees() ?? []).map((a) => a.industry))];
    return values.sort();
  });

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const industry = this.industry();

    return (this.attendees() ?? []).filter((a) => {
      const matchesIndustry = industry === 'all' || a.industry === industry;
      const matchesQuery =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.company.toLowerCase().includes(q) ||
        a.title.toLowerCase().includes(q) ||
        a.industry.toLowerCase().includes(q);
      return matchesIndustry && matchesQuery;
    });
  });

  onSearch(value: string | null | undefined): void {
    this.query.set(value ?? '');
  }

  onIndustry(value: string): void {
    this.industry.set(value);
  }

  clearFilters(): void {
    this.query.set('');
    this.industry.set('all');
  }

  openAttendee(id: string): void {
    void this.router.navigate(['/attendee', id]);
  }

  initials(name: string): string {
    return name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }
}
