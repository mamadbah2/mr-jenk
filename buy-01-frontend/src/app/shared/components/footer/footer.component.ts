import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { LucideAngularModule, ShoppingCart } from "lucide-angular";

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.css"],
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  readonly ShoppingCart = ShoppingCart;
}
