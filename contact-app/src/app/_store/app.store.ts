import {patchState, signalStore, type, withComputed, withMethods, withState} from '@ngrx/signals';
import {tapResponse} from '@ngrx/operators';
import {setAllEntities, withEntities} from '@ngrx/signals/entities';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {computed, inject} from '@angular/core';
import {pipe, debounceTime, distinctUntilChanged, tap, switchMap, map} from 'rxjs';
import {Contact} from '@contact-app/_models';
import {ContactService} from '@contact-app/_services';

type AppState = {
  appTitle: string;
  isLoading: boolean;
  query: string;
};
const initialAppState: AppState = {
  appTitle: 'Contacts',
  isLoading: false,
  query: '',
};

export const AppStore = signalStore(
  {providedIn: 'root'},
  withState(initialAppState),
  withEntities({entity: type<Contact>(), collection: 'contact'}),
  withComputed(({contactEntities}) => ({
    contactsCount: computed(() => contactEntities().length),
  })),
  withMethods((store, contactService = inject(ContactService)) => ({
    loadContacts: rxMethod<string>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, {isLoading: true})),
        switchMap(query => {
          return contactService.getAll(query).pipe(
            tapResponse({
              next: contacts =>
                patchState(store, setAllEntities(contacts, {collection: 'contact'})),
              error: console.error,
              finalize: () => patchState(store, {isLoading: false}),
            })
          );
        })
      )
    ),
  }))
);
