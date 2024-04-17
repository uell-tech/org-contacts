import {ChangeDetectionStrategy, Component, OnInit, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';

import {AppStore} from './_store';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatMenuModule, MatButtonModule, MatCardModule],
  template: `
    @for (contact of store.contactEntities(); track $index) {
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{ contact.name }}
            <button
              mat-icon-button
              class="more-button"
              [matMenuTriggerFor]="menu"
              aria-label="Toggle menu">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #menu="matMenu" xPosition="before">
              <button mat-menu-item>View</button>
              <button mat-menu-item>Share</button>
            </mat-menu>
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          {{ contact.username }}
        </mat-card-content>
        <mat-card-actions>
          <a mat-button [href]="'mailto:' + contact.email" title="Send email">
            {{ contact.email }}
          </a>
          <a mat-button [href]="'tel:' + contact.phone" title="Call">{{ contact.phone }}</a>
        </mat-card-actions>
      </mat-card>
    }
  `,
  styles: `
    :host {
      display: grid;
      gap: 1rem;
      margin: 1rem;
    }

    .more-button {
      position: absolute;
      top: 5px;
      right: 10px;
    }

    @media (min-width: 800px) {
      :host {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (min-width: 1200px) {
      :host {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  `,
})
export default class ContactsComponent implements OnInit {
  readonly store = inject(AppStore);

  ngOnInit() {
    this.search('');
  }

  search(query: string) {
    this.store.loadContacts(query);
  }
}
