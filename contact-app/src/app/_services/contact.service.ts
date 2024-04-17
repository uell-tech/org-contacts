import {isPlatformBrowser} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {Injectable, PLATFORM_ID, inject, signal} from '@angular/core';
import {Contact} from '@contact-app/_models/contact.model';
import {map, switchMap, tap, timer} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  readonly #isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly #http = inject(HttpClient);
  readonly #apiUrl = `https://jsonplaceholder.typicode.com`;
  readonly #timer = signal(0);

  getAll(query: string) {
    const params = {
      query,
    };
    const contacts$ = this.#http.get<Contact[]>(`${this.#apiUrl}/users`, {params}).pipe(
      map(contacts => {
        //current api not offer search query
        const filtered = contacts.filter(c => {
          const search = `${c.email}${c.name}${c.phone}${c.username}}`;
          return search?.toUpperCase().includes(query.toUpperCase());
        });
        return filtered;
      })
    );
    if (!this.#isBrowser) return contacts$;
    const msWait = this.#timer();
    return timer(msWait).pipe(
      switchMap(() => contacts$),
      tap(() => this.#timer.set(msWait + 100)) //tests ssr
    );
  }
}
