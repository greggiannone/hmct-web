import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'hmct-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'HMCT Web';

  constructor(private auth: AuthService, private theme: ThemeService) {
    this.auth.currentUser$.subscribe(user => {
      if (user) {
        if (user.themeClass) {
          theme.setTheme(user.themeClass);
        } else {
          auth.setUserTheme('light-indigo-pink');
        }
      } else {
        theme.setTheme('light-indigo-pink');
      }
    });
  }
}
