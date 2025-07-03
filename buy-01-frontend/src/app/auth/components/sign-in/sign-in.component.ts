import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {LoginResponse} from '../../models/login.response';

@Component({
  selector: 'app-sign-in',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css', '../sign/sign.component.css'],
})
export class SignInComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(3)])
  })

  error_message = null

  constructor(private authService: AuthService, private router : Router) {
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log("Bonjour Mr")

      this.authService.login(this.loginForm.value as {email:string, password:string}).subscribe({
        next: (loginResponse: LoginResponse) => {
          console.log("reponse login api : ", loginResponse)
          this.authService.setToken(JSON.stringify(loginResponse))
          if (loginResponse?.role.includes("SELLER")) {
            console.log("Redirection vers page SELLER")
          } else {
            console.log("Redirection vers page CLIENT")
          }
          /* this.router.navigate(["/product"]) */
        },
        error: err => {
          this.error_message = err
          console.log("The error is : ", err)
          setTimeout(()=> this.error_message = null, 2000)
        }
      })
    }
  }
}
