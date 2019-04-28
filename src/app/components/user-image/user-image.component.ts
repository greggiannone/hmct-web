import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'hmct-user-image',
  templateUrl: './user-image.component.html',
  styleUrls: ['./user-image.component.scss']
})
export class UserImageComponent implements OnInit, OnChanges {
  private readonly defaultImageUrl =
    'https://firebasestorage.googleapis.com/v0/b/hmct-1f8e5.appspot.com/o/profile_images%2Fuser.png?alt=media&token=76bce663-a328-4df0-8dbe-97a428cac8ce';

  @Input() imageUrl = this.defaultImageUrl;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.imageUrl) {
      if (!this.imageUrl || this.imageUrl.length === 0) {
        this.imageUrl = this.defaultImageUrl;
      }
    }
  }

}
