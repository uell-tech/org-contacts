import {Route} from '@angular/router';

const appRoutes: Route[] = [
  {path: '', loadComponent: () => import('./contacts.component')},
  {path: '**', redirectTo: ''},
];

export default appRoutes;
