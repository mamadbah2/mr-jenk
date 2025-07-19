import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Router } from "@angular/router";
import { AuthService } from "../../../auth/services/auth.service";
import {
  LucideAngularModule,
  ShoppingCart,
  Package,
  BarChart3,
  Plus,
  User,
  LogOut,
  Menu,
  Home,
} from "lucide-angular";

export interface User {
  id: string;
  email: string;
  role: "CLIENT" | "SELLER";
  name?: string;
}

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isMenuOpen = false;
  isDropdownOpen = false;
  private storageListener: ((event: StorageEvent) => void) | null = null;

  // Lucide icons
  readonly ShoppingCart = ShoppingCart;
  readonly Package = Package;
  readonly BarChart3 = BarChart3;
  readonly Plus = Plus;
  readonly User = User;
  readonly LogOut = LogOut;
  readonly Menu = Menu;
  readonly Home = Home;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.checkAuthStatus();

    // Listen for storage changes (when user logs in/out)
    this.storageListener = (event: StorageEvent) => {
      if (event.key === "access_token" || event.key === "currentUser") {
        this.checkAuthStatus();
      }
    };
    window.addEventListener("storage", this.storageListener);
  }

  ngOnDestroy(): void {
    if (this.storageListener) {
      window.removeEventListener("storage", this.storageListener);
    }
  }

  private checkAuthStatus(): void {
    if (this.authService.isLoggedIn()) {
      // Try to get user data from localStorage
      const userData = localStorage.getItem("currentUser");
      if (userData) {
        try {
          this.currentUser = JSON.parse(userData);
        } catch (error) {
          // Invalid user data, try to fetch from backend
          this.fetchUserFromBackend();
        }
      } else {
        // No user data in localStorage, try to fetch from backend
        this.fetchUserFromBackend();
      }
    } else {
      this.currentUser = null;
    }
  }

  private fetchUserFromBackend(): void {
    this.authService.getCurrentUser().subscribe({
      next: (userResponse) => {
        const userData: User = {
          id: userResponse.id || userResponse.email,
          email: userResponse.email,
          role:
            userResponse.role === "SELLER" ||
            userResponse.role?.includes("SELLER")
              ? ("SELLER" as const)
              : ("CLIENT" as const),
          name: userResponse.name,
        };
        localStorage.setItem("currentUser", JSON.stringify(userData));
        this.currentUser = userData;
      },
      error: (err) => {
        // Failed to get user data, but don't logout - just clear current user
        console.warn("Failed to fetch user data:", err);
        this.currentUser = null;
      },
    });
  }

  toggleMobileMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMenuOpen = false;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  navigateToProducts(): void {
    this.router.navigate(["/products"]);
    this.closeMobileMenu();
  }

  navigateToSellerDashboard(): void {
    this.router.navigate(["/seller/dashboard"]);
    this.closeMobileMenu();
  }

  navigateToMyProducts(): void {
    this.router.navigate(["/seller/my-products"]);
    this.closeMobileMenu();
  }

  navigateToCreateProduct(): void {
    this.router.navigate(["/seller/create-product"]);
    this.closeMobileMenu();
  }

  navigateToCart(): void {
    this.router.navigate(["/cart"]);
    this.closeMobileMenu();
  }

  navigateToOrders(): void {
    this.router.navigate(["/orders"]);
    this.closeMobileMenu();
  }

  navigateToProfile(): void {
    this.router.navigate(["/profile"]);
    this.closeMobileMenu();
  }

  logout(): void {
    // Use auth service logout
    this.authService.logout();
    this.currentUser = null;
    this.closeMobileMenu();
    this.closeDropdown();
    // Refresh auth status after logout
    this.checkAuthStatus();
  }

  login(): void {
    this.router.navigate(["/auth"]);
    this.closeMobileMenu();
  }

  get isClient(): boolean {
    return this.currentUser?.role === "CLIENT";
  }

  get isSeller(): boolean {
    return this.currentUser?.role === "SELLER";
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
