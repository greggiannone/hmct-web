import { trigger, transition, style, stagger, animate, keyframes, query } from '@angular/animations';

export const listAnimation = trigger('listStagger', [
  transition('* <=> *', [
    query(
      ':enter',
      [
        style({ opacity: 0, transform: 'translateY(-15px)' }),
        stagger(
          '100ms',
          animate(
            '500ms cubic-bezier(0.4,0.0,0.2,1)',
            style({ opacity: 1, transform: 'translateY(0px)' })
          )
        )
      ],
      { optional: true }
    ),
    query(':leave', animate('50ms', style({ opacity: 0 })), {
      optional: true
    })
  ])
]);
