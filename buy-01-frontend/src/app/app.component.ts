import { Component } from '@angular/core';
import { SignComponent } from "./auth/components/sign/sign.component";
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'buy-01-frontend';
}
