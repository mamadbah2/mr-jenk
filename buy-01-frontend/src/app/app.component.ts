import { Component } from '@angular/core';
import { SignComponent } from "./auth/components/sign/sign.component";

@Component({
  selector: 'app-root',
  imports: [SignComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'buy-01-frontend';
}
