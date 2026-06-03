import { Injectable } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments'; 

@Injectable({
  providedIn: 'root'
})
export class LibrariesService {

  private api =
    `${environment.apiUrl}/api/v1/libraries`;

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

    return this.http.put(
      `${this.api}/${id}`,
      data
    );

  }

  delete(id: string): Observable<any> {

    return this.http.delete(
      `${this.api}/${id}`
    );

  }

  findLibraries() {
  return this.http.get<any>(
    `${environment.apiUrl}/api/v1/libraries`
  );
}

}