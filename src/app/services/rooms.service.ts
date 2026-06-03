import { Injectable } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {

  private api =
    `${environment.apiUrl}/api/v1/rooms`;

  constructor(
    private http: HttpClient
  ) {}

  findAll(): Observable<any> {
    return this.http.get(this.api);
  }

  create(data: any): Observable<any> {
    return this.http.post(this.api, data);
  }

  update(
    id: string,
    data: any
  ): Observable<any> {

    return this.http.patch(
      `${this.api}/${id}`,
      data
    );

  }

  delete(id: string): Observable<any> {

    return this.http.delete(
      `${this.api}/${id}`
    );

  }

}