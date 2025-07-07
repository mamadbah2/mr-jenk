import { Injectable } from '@angular/core';
import {catchError, Observable, of, switchMap, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {LoginResponse} from '../models/login.response';
import {User} from '../models/user';
import {MediaResponse} from '../models/media.response';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = "http://localhost:8080"
  private isAuthenticate : boolean = false

  constructor(private httpClient: HttpClient, private router: Router) {
    this.isAuthenticate = !!this.getToken()
  }

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

    if (file) {
      console.log("We have file")
      const formData = new FormData()
      formData.set("file", file, file.name)

      let xender:Observable<any> = this.httpClient.post(`${this.apiUrl}/api/media`, formData)

      return xender.pipe(switchMap(
          rep => {
            console.log("$@$@@@")
            console.log(rep)
            user.avatar = rep?.imageUrl
            return this.httpClient.post(`${this.apiUrl}/api/users`, user).pipe(
              catchError(err => throwError(()=>err))
            );
          }),
        catchError(err => throwError(()=>err))
      )
    }

    return this.httpClient.post(`${this.apiUrl}/api/users`, user).pipe(
            catchError(err => throwError(()=>err))
          )
  }

  setToken(token:string) {
    localStorage.setItem("access_token", token)
  }

  logout(): void {
    localStorage.removeItem("access_token"); // <-- Supprime le token ici
    this.isAuthenticate = false;
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    return this.isAuthenticate && !!this.getToken()
  }

  getToken():string|null {
    return localStorage.getItem("access_token");
  }

}
