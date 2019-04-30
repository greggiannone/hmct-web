import { Component, OnInit, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { MatDialog } from '@angular/material';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { Observable } from 'rxjs';
import { AngularFireStorageReference, AngularFireUploadTask, AngularFireStorage } from 'angularfire2/storage';

@Component({
  selector: 'hmct-chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.scss']
})
export class ChatFormComponent implements OnInit, AfterViewInit {

  @ViewChild('messageTextArea') messageTextArea?: ElementRef;
  @Output() messageSent = new EventEmitter<void>();

  message = '';

  private ref: AngularFireStorageReference;
  private task: AngularFireUploadTask;
  uploadProgress$: Observable<number>;

  constructor(
    private chat: ChatService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private storage: AngularFireStorage) { }

  ngOnInit() {
  }

  send(): void {
    this.chat.sendMessage(this.message)
      .then(() => {
        this.message = '';
        this.messageSent.emit();
      })
      .catch(error => {
        this.dialog.open(ErrorDialogComponent, {
          data: {
            message: error,
          }
        });
      });
  }

  handleSubmit(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      this.send();
      event.preventDefault();
    }
  }

  ngAfterViewInit(): void {
    if (this.messageTextArea) {
      this.messageTextArea.nativeElement.focus();
      this.cdr.detectChanges();
    }
  }

  onSendImageClick(): void {
    document.getElementById('fileToUpload').click();
  }

  upload(file: File): void {
    const id = Math.random().toString(36).substring(2, 9);
    const path = `uploaded_images/${id}`;
    this.ref = this.storage.ref(path);
    this.task = this.ref.put(file);
    this.uploadProgress$ = this.task.percentageChanges();
    this.task.then(() => {
      this.ref.getDownloadURL().subscribe(url => {
        this.chat.sendMessage(url);
        this.messageSent.emit();
      });
    });
  }
}
