import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Router, NavigationEnd } from "@angular/router";
import { AuthService } from "../../../auth/services/auth.service";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import {
  LucideAngularModule,
  ShoppingCart,
  Package,
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
  private routerSubscription: Subscription | null = null;
  private authStateListener: ((event: CustomEvent) => void) | null = null;

  // Lucide icons
  readonly ShoppingCart = ShoppingCart;
  readonly Package = Package;
  readonly Plus = Plus;
  readonly User = User;
  readonly LogOut = LogOut;
  readonly Menu = Menu;
  readonly Home = Home;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // Initial auth check
    this.checkAuthStatus();

    // Force immediate detection of changes
    setTimeout(() => {
      this.checkAuthStatus();
      this.cdr.detectChanges();
    }, 100);

    // Listen for storage changes (when user logs in/out)
    this.storageListener = (event: StorageEvent) => {
      if (event.key === "access_token" || event.key === "currentUser") {
        this.checkAuthStatus();
        this.cdr.detectChanges();
      }
    };
    window.addEventListener("storage", this.storageListener);

    // Listen for custom auth state changes
    this.authStateListener = (event: CustomEvent) => {
      console.log("Auth state changed:", event.detail);
      this.checkAuthStatus();
      this.cdr.detectChanges();
    };
    window.addEventListener(
      "authStateChanged",
      this.authStateListener as EventListener,
    );

    // Listen for route changes to update auth status
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkAuthStatus();
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    if (this.storageListener) {
      window.removeEventListener("storage", this.storageListener);
    }
    if (this.authStateListener) {
      window.removeEventListener(
        "authStateChanged",
        this.authStateListener as EventListener,
      );
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private checkAuthStatus(): void {
    if (this.authService.isLoggedIn()) {
      // Try to get user data from localStorage
      const userData = localStorage.getItem("currentUser");
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          // Only update if user data has actually changed
          if (
            !this.currentUser ||
            this.currentUser.id !== parsedUser.id ||
            this.currentUser.role !== parsedUser.role
          ) {
            this.currentUser = parsedUser;
            console.log("Navbar: User data updated", this.currentUser);
          }
        } catch (error) {
          console.error("Failed to parse user data:", error);
          // Invalid user data, try to fetch from backend
          this.fetchUserFromBackend();
        }
      } else {
        // No user data in localStorage, try to fetch from backend
        this.fetchUserFromBackend();
      }
    } else {
      if (this.currentUser !== null) {
        this.currentUser = null;
        console.log("Navbar: User logged out");
      }
    }
  }

  private fetchUserFromBackend(): void {
    // Get user data from JWT token instead of API call
    const token = this.authService.getToken();
    if (!token) {
      this.currentUser = null;
      return;
    }

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
        this.cdr.detectChanges();
      },
      error: (err) => {
        // Failed to get user data from JWT, try to decode token directly
        try {
          const payload = this.decodeJwtToken(token);
          if (payload) {
            const userData: User = {
              id: payload.userID || payload.email,
              email: payload.email,
              role: payload.role === "SELLER" ? "SELLER" : "CLIENT",
              name: payload.name || payload.email.split("@")[0],
            };
            localStorage.setItem("currentUser", JSON.stringify(userData));
            this.currentUser = userData;
            this.cdr.detectChanges();
          } else {
            this.currentUser = null;
          }
        } catch (decodeError) {
          console.warn("Failed to decode JWT token:", decodeError);
          this.currentUser = null;
        }
      },
    });
  }

  private decodeJwtToken(token: string): any {
    try {
      const payload = token.split(".")[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      return null;
    }
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

    // Dispatch custom event to notify of logout
    window.dispatchEvent(
      new CustomEvent("authStateChanged", {
        detail: { loggedIn: false, user: null },
      }),
    );

    // Refresh auth status after logout
    this.checkAuthStatus();
    this.cdr.detectChanges();
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
