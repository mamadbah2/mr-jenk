import { Injectable } from "@angular/core";
import { catchError, Observable, of, switchMap, throwError } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { LoginResponse } from "../models/login.response";
import { User } from "../models/user";
import { MediaResponse } from "../models/media.response";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = "http://localhost:8080";
  private isAuthenticate: boolean = false;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
  ) {
    this.isAuthenticate = !!this.getToken();
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.httpClient
      .post(`${this.apiUrl}/api/users/login`, credentials, {
        headers: new HttpHeaders({
          Accept: "application/json",
        }),
      })
      .pipe(catchError((err) => throwError(() => err)));
  }

  register(dataForm: any, file: any): Observable<any> {
    const user: User = {
      name: `${dataForm.firstName} ${dataForm.lastName}`,
      email: dataForm.email,
      password: dataForm.password,
      role: dataForm.isSeller ? "SELLER" : "CLIENT",
      avatar: "path/to/image",
    };

    if (file) {
      console.log("We have file");
      const formData = new FormData();
      formData.set("file", file, file.name);

      let xender: Observable<any> = this.httpClient.post(
        `${this.apiUrl}/api/media`,
        formData,
      );

      return xender.pipe(
        switchMap((rep) => {
          console.log("$@$@@@");
          console.log(rep);
          user.avatar = rep?.imageUrl;
          return this.httpClient
            .post(`${this.apiUrl}/api/users`, user)
            .pipe(catchError((err) => throwError(() => err)));
        }),
        catchError((err) => throwError(() => err)),
      );
    }

    return this.httpClient
      .post(`${this.apiUrl}/api/users`, user)
      .pipe(catchError((err) => throwError(() => err)));
  }

  setToken(token: string) {
    localStorage.setItem("access_token", token);
    this.isAuthenticate = true;
  }

  logout(): void {
    localStorage.removeItem("access_token"); // <-- Supprime le token ici
    localStorage.removeItem("currentUser"); // Clear user data
    this.isAuthenticate = false;

    // Dispatch custom event to notify of logout
    window.dispatchEvent(
      new CustomEvent("authStateChanged", {
        detail: { loggedIn: false, user: null },
      }),
    );

    this.router.navigate(["/auth"]);
  }

  isLoggedIn() {
    const token = localStorage.getItem("access_token");
    this.isAuthenticate = !!token;
    return this.isAuthenticate;
  }

  getToken(): string | null {
    return localStorage.getItem("access_token");
  }

  getCurrentUser(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error("No token found"));
    }

    try {
      // Decode JWT token to get user data - no API call needed
      const payload = this.decodeJwtToken(token);
      if (!payload) {
        return throwError(() => new Error("Invalid token"));
      }

      const userData = {
        id: payload.userID,
        email: payload.email,
        role: payload.role,
        name: payload.name || payload.email.split("@")[0],
      };

      return of(userData);
    } catch (error) {
      return throwError(() => new Error("Failed to decode token"));
    }
  }

  private decodeJwtToken(token: string): any {
    try {
      const payload = token.split(".")[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error("Error decoding JWT token:", error);
      return null;
    }
  }

  triggerAuthStateRefresh(): void {
    // Trigger a custom event to refresh auth state in components
    window.dispatchEvent(
      new CustomEvent("authStateChanged", {
        detail: { refresh: true },
      }),
    );
  }
}
