import { Component, OnInit, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { MatDialog } from '@angular/material';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Component({
  selector: 'hmct-chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.scss']
})
export class ChatFormComponent implements OnInit, AfterViewInit {

  @ViewChild('messageTextArea') messageTextArea?: ElementRef;
  @Output() messageSent = new EventEmitter<void>();

  message = '';

  constructor(private chat: ChatService, private dialog: MatDialog, private cdr: ChangeDetectorRef) { }

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
}
