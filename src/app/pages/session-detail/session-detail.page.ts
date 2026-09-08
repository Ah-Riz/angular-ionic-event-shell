import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { bookmark, bookmarkOutline } from 'ionicons/icons';
import { map, startWith } from 'rxjs';
import { BookmarkService } from '../../core/bookmark.service';
import { ConferenceDataService } from '../../core/conference-data.service';
import { Attendee, Session } from '../../models/conference';
import { LogoutButtonComponent } from '../../shared/logout-button.component';

addIcons({ bookmark, bookmarkOutline });

@Component({
  selector: 'app-session-detail',
  templateUrl: './session-detail.page.html',
  styleUrls: ['./session-detail.page.scss'],
  imports: [
    DatePipe,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonContent,
    LogoutButtonComponent,
  ],
})
export class SessionDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly data = inject(ConferenceDataService);
  private readonly bookmarks = inject(BookmarkService);
  private readonly router = inject(Router);

  private readonly sessionId = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('id') ?? '')),
    { initialValue: '' }
  );

  private readonly allSessions = toSignal(
    this.data.getSessions().pipe(startWith(null as Session[] | null)),
    { initialValue: null as Session[] | null }
  );
  private readonly allAttendees = toSignal(
    this.data.getAttendees().pipe(startWith(null as Attendee[] | null)),
    { initialValue: null as Attendee[] | null }
  );

  readonly session = computed(() => {
    const list = this.allSessions();
    if (!list) {
      return undefined;
    }
    return list.find((s) => s.id === this.sessionId()) ?? null;
  });

  readonly speakers = computed(() => {
    const s = this.session();
    const people = this.allAttendees();
    if (!s || !people) {
      return [] as Attendee[];
    }
    return s.speakerIds
      .map((id) => people.find((a) => a.id === id))
      .filter(Boolean) as Attendee[];
  });

  readonly related = computed(() => {
    const s = this.session();
    const list = this.allSessions();
    if (!s || !list) {
      return [] as Session[];
    }
    return list.filter((x) => x.id !== s.id && x.track === s.track).slice(0, 3);
  });

  readonly bookmarkIds = this.bookmarks.ids;

  isBookmarked(id: string): boolean {
    return this.bookmarkIds().has(id);
  }

  toggleBookmark(id: string): void {
    this.bookmarks.toggle(id);
  }

  openAttendee(id: string): void {
    void this.router.navigate(['/attendee', id]);
  }

  openSession(id: string): void {
    void this.router.navigate(['/session', id]);
  }
}
