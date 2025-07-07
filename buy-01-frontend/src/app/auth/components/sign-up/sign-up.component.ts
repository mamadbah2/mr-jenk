import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-sign-up',
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css', '../sign/sign.component.css'],
})
export class SignUpComponent {
  selectedFileName : string = "Aucun fichier choisi"
  selectedFile:any

  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    isSeller: new FormControl('')
  });

  constructor(private authService: AuthService) {
  }

  handleFileSelection($event: Event) {
    const inputFile = $event.target as HTMLInputElement
    if (inputFile.files && inputFile.files.length > 0) {
      this.selectedFileName = inputFile.files[0].name
      this.selectedFile = inputFile.files[0]
    } else {
      this.selectedFileName = "Aucun fichier choisi"
      this.selectedFile = null
    }
  }

  handleSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value, this.selectedFile).subscribe({
        next : value => {
          console.log(value)
          console.log("User cree avec succes")
        },
        error: err => {
          console.log(err)
          console.log("Erreur lors de la creation du user")
        }
      })
    }
  }
}
