import { Injectable } from '@angular/core';

import {
HttpClient
} from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments';

@Injectable({
providedIn: 'root'
})
export class ReservationsService {

private api =
`${environment.apiUrl}/api/v1/reservations`;

constructor(
private http: HttpClient
) {}

findAll(): Observable<any> {
return this.http.get(this.api);
}

create(data: any): Observable<any> {
  return this.http.post(this.api, data);
}

}
