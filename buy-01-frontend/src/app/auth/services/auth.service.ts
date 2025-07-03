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
    let avatarPath= "path/to/image"
    if (file) {
      console.log("We have file")
      const formData = new FormData()
      formData.set("file", file, file.name)
      this.httpClient.post(`${this.apiUrl}/api/media`, formData).subscribe({
        next: (value:any)=> {
          console.log(value)
          avatarPath = value.imageUrl
          console.log("avatarPath : ", avatarPath)
        },
        error: err => {
          console.log(err)
        }
      })
    }

    const user: User = {
      name : `${dataForm.firstName} ${dataForm.lastName}`,
      email: dataForm.email,
      password: dataForm.password,
      role: dataForm.isSeller ? "SELLER" : "CLIENT",
      avatar: avatarPath
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
