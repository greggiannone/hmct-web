import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'hmct-user-image',
  templateUrl: './user-image.component.html',
  styleUrls: ['./user-image.component.scss']
})
export class UserImageComponent implements OnInit, OnChanges {

  private defaultImage = 'assets/default-user.jpg';

  @Input() uid = '';

  private imageUrlSubject = new BehaviorSubject<string>(this.defaultImage);

  get imageUrl$(): Observable<string> {
    return this.imageUrlSubject.asObservable();
  }

  constructor(private fbStorage: AngularFireStorage, private chat: ChatService) { }

  ngOnInit() {
    this.refresh();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.uid) {
      this.refresh();
    }
  }

  refresh(): void {
    if (this.uid) {
      const path = `profile_images/${this.uid}`;
      const ref = this.fbStorage.ref(path);
      ref.getDownloadURL().pipe(catchError(error => of(this.defaultImage))).subscribe(url => {
        this.imageUrlSubject.next(url);
      });
    }
  }

}
