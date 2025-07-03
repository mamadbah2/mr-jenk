import { Injectable } from '@angular/core';
import {catchError, Observable, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {LoginResponse} from '../models/login.response';
import {User} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = "http://localhost:8080"

  constructor(private httpClient: HttpClient) { }



  login(credentials: {email:string, password:string}):Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/api/users/login`, credentials).pipe(
      catchError(err => throwError(()=>err))
    );
  }

  register(dataForm:any, file:any):Observable<any> {

    const user: User = {
      name : `${dataForm.firstName} ${dataForm.lastName}`,
      email: dataForm.email,
      password: dataForm.password,
      role: dataForm.isSeller ? "SELLER" : "CLIENT",
      avatar: "path/to/image"
    }

    

    return this.httpClient.post(`${this.apiUrl}/api/users`, user).pipe(
      catchError(err => throwError(()=>err))
    );
  }

  setToken(token:string) {
    localStorage.setItem("access_token", token)
  }

  getToken() {
    return localStorage.getItem("access_token");
  }

}
