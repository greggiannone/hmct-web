import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'hmct-fire-image',
  templateUrl: './fire-image.component.html',
  styleUrls: ['./fire-image.component.scss']
})
export class FireImageComponent implements OnInit, OnChanges {

  @Input() path = '';

  private imageUrlSubject = new BehaviorSubject<string>('');

  get imageUrl$(): Observable<string> {
    return this.imageUrlSubject.asObservable();
  }

  constructor(private fbStorage: AngularFireStorage) { }

  ngOnInit() {
    this.refresh();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.path) {
      this.refresh();
    }
  }

  refresh(): void {
    if (this.path) {
      const ref = this.fbStorage.ref(this.path);
      ref.getDownloadURL().subscribe(url => {
        this.imageUrlSubject.next(url);
      });
    }
  }

}
