import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowForwardOutline,
  bookmarkOutline,
  calendarOutline,
  peopleOutline,
} from 'ionicons/icons';
import { startWith } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { BookmarkService } from '../../core/bookmark.service';
import { ConferenceDataService } from '../../core/conference-data.service';
import { ConferenceEvent, Session } from '../../models/conference';
import { LogoutButtonComponent } from '../../shared/logout-button.component';

addIcons({
  arrowForwardOutline,
  bookmarkOutline,
  calendarOutline,
  peopleOutline,
});

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    DatePipe,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonIcon,
    IonContent,
    LogoutButtonComponent,
  ],
})
export class HomePage {
  private readonly data = inject(ConferenceDataService);
  private readonly bookmarks = inject(BookmarkService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly event = toSignal(
    this.data.getEvent().pipe(startWith(null as ConferenceEvent | null)),
    { initialValue: null as ConferenceEvent | null }
  );
  readonly sessions = toSignal(
    this.data.getSessions().pipe(startWith(null as Session[] | null)),
    { initialValue: null as Session[] | null }
  );
  readonly bookmarkCount = this.bookmarks.count;
  readonly email = computed(() => this.auth.session()?.email ?? '');

  readonly ready = computed(() => !!this.event() && !!this.sessions());

  readonly firstDay = computed(() => {
    const list = this.sessions() ?? [];
    if (!list.length) {
      return '';
    }
    return [...new Set(list.map((s) => s.day))].sort()[0];
  });

  readonly upNext = computed(() => {
    const day = this.firstDay();
    const list = (this.sessions() ?? [])
      .filter((s) => s.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
    return list[0] ?? null;
  });

  readonly todayStrip = computed(() => {
    const day = this.firstDay();
    return (this.sessions() ?? [])
      .filter((s) => s.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
      .slice(0, 3);
  });

  openSession(id: string): void {
    void this.router.navigate(['/session', id]);
  }
}
