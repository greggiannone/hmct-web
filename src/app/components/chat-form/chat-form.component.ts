import { Component, OnInit, Output, EventEmitter, AfterViewInit, ViewChild,
  ElementRef, ChangeDetectorRef, HostListener } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { MatDialog } from '@angular/material';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { Observable } from 'rxjs';
import { AngularFireStorageReference, AngularFireUploadTask, AngularFireStorage } from 'angularfire2/storage';
import { AuthService } from '../../services/auth.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'hmct-chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.scss']
})
export class ChatFormComponent implements OnInit, AfterViewInit {

  @ViewChild('messageTextArea') messageTextArea?: ElementRef;
  @ViewChild('messageForm') messageForm?: FormControl;
  @Output() messageSent = new EventEmitter<void>();

  message = '';

  private ref: AngularFireStorageReference;
  private task: AngularFireUploadTask;
  uploadProgress$: Observable<number>;
  private updateActivityTimer: any;

  constructor(
    private chat: ChatService,
    private auth: AuthService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private storage: AngularFireStorage) { }

  ngOnInit() {
    // On initial load update typing in case they were previously typing / re-loaded
    this.updateTyping();
  }

  @HostListener('document:paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    const items = (event.clipboardData).items;
    if (items && items.length > 0) {
      const item = items[0];
      if (item.kind === 'file') {
        this.upload(item.getAsFile());
      }
    }
  }

  private updateTyping(): void {
    // Debounce the keyboard timer / only update once a second maximum
    if (this.updateActivityTimer) {
      clearTimeout(this.updateActivityTimer);
    }
    this.updateActivityTimer = setTimeout(() => {
      this.auth.setUserTyping(!!this.message);
    }, 250);
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

    if (this.messageForm) {
      this.messageForm.valueChanges.subscribe(val => {
        this.updateTyping();
      });
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
