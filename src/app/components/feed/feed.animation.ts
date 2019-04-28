import { trigger, transition, style, stagger, animate, keyframes, query } from '@angular/animations';

export const listAnimation = trigger('listAnimation', [

  transition(':enter', [

    query('.feed-message', style({ opacity: 0 }), { optional: true }),

    query('.feed-message', stagger('50ms', [
      animate('500ms cubic-bezier(0.4,0.0,0.2,1)', keyframes([
        style({ opacity: 0, transform: 'translateY(-75px)', offset: 0 }),
        style({ opacity: 1, transform: 'translateX(0px)', offset: 1 }),
      ]))
    ]), { optional: true })

  ])

]);
