import { Component } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-animated-menu',
  standalone: true,
  imports: [],
  templateUrl: './animated-menu.component.html',
  styleUrl: './animated-menu.component.scss',
  animations: [
    trigger('dialogAnimation', [
      state('enter', style({ transform: 'translateY(0)', opacity: 1 })), // Final state at the normal position
      state('leave', style({ transform: 'translateY(100%)', opacity: 0 })), // State when leaving, move down out of view

      // Transition from void (initial state) to enter (final state)
      transition('void => enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }), // Start from above the view with 0 opacity
        animate('300ms ease-out') // Animation duration and easing function
      ]),

      // Transition from enter (final state) to leave (initial state)
      transition('enter => leave', [
        animate('300ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 })) // Move down out of view
      ])
    ])
  ]
})
export class AnimatedMenuComponent {
  animationState= 'enter';
}
