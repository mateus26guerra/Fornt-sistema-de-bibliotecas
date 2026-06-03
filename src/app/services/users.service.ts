import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private api = `${environment.apiUrl}/api/v1/users`;

  constructor(
    private http: HttpClient
  ) {}

  findAll() {
    return this.http.get<any>(this.api, {
      params: {
        size: '1000'
      }
    });
  }

  findById(id: string) {
    return this.http.get<any>(`${this.api}/${id}`);
  }

  create(data: any) {
    return this.http.post(this.api, data);
  }

  update(id: string, data: any) {
    return this.http.put(
      `${this.api}/${id}`,
      data
    );
  }

  delete(id: string) {
    return this.http.delete(
      `${this.api}/${id}`
    );
  }

}
