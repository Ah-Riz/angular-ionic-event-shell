import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToggle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { bookmark, bookmarkOutline, logOutOutline } from 'ionicons/icons';
import { AuthService } from '../../core/auth.service';
import { BookmarkService } from '../../core/bookmark.service';
import { ConferenceDataService } from '../../core/conference-data.service';
import { Session } from '../../models/session';

addIcons({ bookmark, bookmarkOutline, logOutOutline });

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
  imports: [
    DatePipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonToggle,
  ],
})
export class AgendaPage {
  private readonly data = inject(ConferenceDataService);
  private readonly bookmarks = inject(BookmarkService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly sessions = toSignal(this.data.getSessions(), { initialValue: [] as Session[] });
  readonly selectedDay = signal<string>('');
  readonly bookmarksOnly = signal(false);
  readonly bookmarkIds = this.bookmarks.ids;

  readonly days = computed(() => {
    const unique = [...new Set(this.sessions().map((s) => s.day))];
    return unique.sort();
  });

  readonly activeDay = computed(() => {
    const selected = this.selectedDay();
    const days = this.days();
    if (selected && days.includes(selected)) {
      return selected;
    }
    return days[0] ?? '';
  });

  readonly visibleSessions = computed(() => {
    const day = this.activeDay();
    const onlyBookmarks = this.bookmarksOnly();
    const ids = this.bookmarkIds();

    return this.sessions()
      .filter((s) => s.day === day)
      .filter((s) => (onlyBookmarks ? ids.has(s.id) : true))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  });

  onDayChange(value: string | number | undefined): void {
    if (typeof value === 'string') {
      this.selectedDay.set(value);
    }
  }

  onBookmarksOnly(checked: boolean): void {
    this.bookmarksOnly.set(checked);
  }

  isBookmarked(id: string): boolean {
    return this.bookmarkIds().has(id);
  }

  toggleBookmark(id: string): void {
    this.bookmarks.toggle(id);
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }
}
