import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';

export interface HMCTTheme {
  title: string;
  path: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  themes$: Observable<HMCTTheme[]>;

  private currentThemeClass = 'light-indigo-pink';

  constructor(private auth: AuthService) {
    
    this.setTheme(this.currentThemeClass);

    this.themes$ = of([
      {
        path: 'light-indigo-pink',
        title: 'Indigo Pink',
      },
      {
        path: 'light-deeppurple-amber',
        title: 'Deep Purple Amber',
      },
      {
        path: 'dark-pink-bluegrey',
        title: 'Pink Blue Grey',
      },
      {
        path: 'dark-purple-green',
        title: 'Purple Green',
      },
    ]);
  }


  /**
   * Set the theme of the application
   * @param theme The class name of the theme to change to
   */
  setTheme(theme: string) {
    // Note that the class MUST be set on the 'body' element.
    // If we were to just set the class on the obmdb-root element, the global overlay
    // would be left out of the look and we'd have to set that class separately
    const body = document.getElementsByTagName('body')[0];
    if (body.classList.contains(this.currentThemeClass)) {
      body.classList.remove(this.currentThemeClass);
    }
    body.classList.add(theme);
    this.currentThemeClass = theme;
  }
}
