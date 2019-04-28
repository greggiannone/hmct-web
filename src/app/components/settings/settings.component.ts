import { Component, ViewChild } from '@angular/core';
import { ThemeService, HMCTTheme } from 'src/app/services/theme.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl } from '@angular/forms';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';


@Component({
  selector: 'hmct-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  private ref: AngularFireStorageReference;
  private task: AngularFireUploadTask;

  @ViewChild('settingsForm') correctionForm!: FormControl;
  themes$: Observable<HMCTTheme[]>;

  uploadProgress$: Observable<number>;

  themeClass: string;
  displayName: string;
  status: string;
  imageUrl: string;
  uid: string;

  constructor(private theme: ThemeService, private auth: AuthService, private storage: AngularFireStorage) {
    this.themes$ = theme.themes$;
    this.auth.currentUser$.subscribe(user => {
      if (user) {
        this.uid = user.uid;
        this.themeClass = user.themeClass;
        this.displayName = user.displayName;
        this.status = user.status;
        this.imageUrl = user.imageUrl;
      }
    });
  }

  applyChanges(): void {
    this.auth.setUserSettings(this.themeClass, this.displayName, this.status);
    this.correctionForm.reset();
  }

  upload(file: File) {
    const path = `profile_images/${this.uid}`;
    this.ref = this.storage.ref(path);
    this.task = this.ref.put(file);
    this.ref.getDownloadURL().subscribe(url => {
      this.auth.setUserImage(url);
    });
    this.uploadProgress$ = this.task.percentageChanges();
  }
}
