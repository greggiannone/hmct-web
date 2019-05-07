import { trigger, transition, style, stagger, animate, keyframes, query } from '@angular/animations';

export const listAnimation = trigger('listAnimation', [

  transition(':enter', [

    query('.chat-room__typing-user', style({ opacity: 0 }), { optional: true }),

    query('.chat-room__typing-user', stagger('50ms', [
      animate('500ms cubic-bezier(0.4,0.0,0.2,1)', keyframes([
        style({ opacity: 1, transform: 'translateX(0px)', offset: 1 }),
      ]))
    ]), { optional: false })

  ]),

  transition(':leave', [

    query('.chat-room__typing-user', style({ opacity: 1 }), { optional: true }),

    query('.chat-room__typing-user', stagger('50ms', [
      animate('500ms cubic-bezier(0.4,0.0,0.2,1)', keyframes([
        style({ opacity: 0, transform: 'translateX(0px)', offset: 1 }),
      ]))
    ]), { optional: false })

  ])

]);
