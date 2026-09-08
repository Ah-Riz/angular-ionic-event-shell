import { Injectable, computed, signal } from '@angular/core';

export interface FakeSession {
  email: string;
}

const STORAGE_KEY = 'konverge-edge-session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly sessionSignal = signal<FakeSession | null>(this.read());

  readonly session = this.sessionSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.sessionSignal() !== null);

  login(email: string): void {
    const session: FakeSession = { email: email.trim() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    this.sessionSignal.set(session);
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.sessionSignal.set(null);
  }

  private read(): FakeSession | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw) as FakeSession;
      return parsed?.email ? parsed : null;
    } catch {
      return null;
    }
  }
}
