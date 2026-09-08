import { Injectable, computed, signal } from '@angular/core';

const STORAGE_KEY = 'konverge-edge-bookmarks';

@Injectable({ providedIn: 'root' })
export class BookmarkService {
  private readonly idsSignal = signal<Set<string>>(this.read());

  readonly ids = this.idsSignal.asReadonly();
  readonly count = computed(() => this.idsSignal().size);

  isBookmarked(sessionId: string): boolean {
    return this.idsSignal().has(sessionId);
  }

  toggle(sessionId: string): void {
    const next = new Set(this.idsSignal());
    if (next.has(sessionId)) {
      next.delete(sessionId);
    } else {
      next.add(sessionId);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    this.idsSignal.set(next);
  }

  private read(): Set<string> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return new Set();
      }
      const parsed = JSON.parse(raw) as string[];
      return new Set(Array.isArray(parsed) ? parsed : []);
    } catch {
      return new Set();
    }
  }
}
