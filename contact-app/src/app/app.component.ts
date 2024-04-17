import {ChangeDetectionStrategy, Component, OnInit, inject} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {RouterOutlet} from '@angular/router';
import {AppStore} from './_store';
import {MatIconModule} from '@angular/material/icon';

@Component({
  imports: [MatToolbarModule, MatButtonModule, MatSidenavModule, RouterOutlet, MatIconModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'org-root',
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <h1>{{ store.appTitle() }}</h1>
          @if (store.isLoading()) {
            <mat-icon>hourglass_top</mat-icon>
          }
          <form>
            <label>
              <input
                #ipt
                type="text"
                [value]="store.query()"
                (input)="search(ipt.value)"
                placeholder="Search..." />
            </label>
          </form>
        </mat-toolbar>
        <router-outlet />
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: `
    .sidenav-container {
      height: 100%;
    }

    .sidenav .mat-toolbar {
      background: inherit;
    }

    .mat-toolbar.mat-primary {
      position: sticky;
      top: 0;
      z-index: 1;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      padding: -213px 16px;
      justify-content: space-between;
    }
  `,
})
export class AppComponent implements OnInit {
  readonly store = inject(AppStore);

  ngOnInit() {
    this.search('');
  }

  search(query: string) {
    this.store.loadContacts(query);
  }
}
