import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'kb-design-system-theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly themeSubject: BehaviorSubject<ThemeMode>;
  private readonly isBrowser: boolean;
  private mediaQuery: MediaQueryList | null = null;

  readonly theme$: Observable<ThemeMode>;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    const initial = this.getStoredTheme() || this.getSystemPreference();
    this.themeSubject = new BehaviorSubject<ThemeMode>(initial);
    this.theme$ = this.themeSubject.asObservable();

    if (this.isBrowser) {
      this.applyTheme(initial);
      this.listenToSystemChanges();
    }
  }

  get currentTheme(): ThemeMode {
    return this.themeSubject.value;
  }

  get isDark(): boolean {
    return this.currentTheme === 'dark';
  }

  setTheme(mode: ThemeMode): void {
    this.themeSubject.next(mode);
    this.applyTheme(mode);
    this.storeTheme(mode);
  }

  toggleTheme(): void {
    const next = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }

  applyTheme(mode: ThemeMode): void {
    if (!this.isBrowser) return;
    const root = document.documentElement;
    root.setAttribute('data-theme', mode);
    root.classList.add('theme-igot');
    // Legacy classes for existing portal pages
    root.classList.remove('day-mode', 'night-mode');
    root.classList.add(mode === 'light' ? 'day-mode' : 'night-mode');
  }

  private getStoredTheme(): ThemeMode | null {
    if (!this.isBrowser) return null;
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return null;
  }

  private storeTheme(mode: ThemeMode): void {
    if (!this.isBrowser) return;
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  }

  private getSystemPreference(): ThemeMode {
    if (!this.isBrowser) return 'light';
    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  private listenToSystemChanges(): void {
    if (!this.isBrowser) return;
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.mediaQuery.addEventListener('change', (e) => {
      // Only react to system changes if user hasn't explicitly set a preference
      if (!this.getStoredTheme()) {
        const mode: ThemeMode = e.matches ? 'dark' : 'light';
        this.themeSubject.next(mode);
        this.applyTheme(mode);
      }
    });
  }
}
