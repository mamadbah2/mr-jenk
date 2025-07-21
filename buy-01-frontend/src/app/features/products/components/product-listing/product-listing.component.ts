import { Component, inject, OnInit } from "@angular/core";
import { ProductService } from "../../services/product.service";
import { ProductModels } from "../../models/product.models";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../../../auth/services/auth.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-product-listing",
  imports: [RouterLink, CommonModule],
  templateUrl: "./product-listing.component.html",
  styleUrl: "./product-listing.component.css",
})
export class ProductListingComponent implements OnInit {
  allProducts: ProductModels[] | null = null;
  currentUser: any = null;
  isLoading = false;

  private productService = inject(ProductService);
  private authService = inject(AuthService);

  ngOnInit() {
    this.checkUserStatus();
    this.loadProducts();
  }

  private checkUserStatus() {
    if (this.authService.isLoggedIn()) {
      const userData = localStorage.getItem("access_token");
      if (userData) {
        try {
          const payload = userData.split(".")[1]; // Extract the payload part
          const decodedPayload = atob(payload); // Decode Base64
          this.currentUser = JSON.parse(decodedPayload); // Parse JSON
        } catch (error) {
          console.error("Error parsing user data:", error);
          this.currentUser = null;
        }
      }
    }
  }

  private loadProducts() {
    this.isLoading = true;
    this.productService.getProductList().subscribe({
      next: (value) => {
        console.log("Products loaded successfully:");
        this.allProducts = value;
        this.isLoading = false;
        console.log(value);
      },
      error: (err) => {
        console.error("Error loading products:", err);
        this.isLoading = false;
        // You might want to show a user-friendly error message here
        this.allProducts = [];
      },
    });
  }

  get isGuest(): boolean {
    return !this.authService.isLoggedIn();
  }

  get isClient(): boolean {
    return this.currentUser?.role === "CLIENT";
  }

  get isSeller(): boolean {
    return this.currentUser?.role === "SELLER";
  }

  addToCart(product: ProductModels) {
    if (this.isGuest) {
      // Enhanced guest experience
      this.showLoginPrompt();
      return;
    }

    // Enhanced cart logic
    console.log("Adding to cart:", product);
    this.showSuccessMessage(`${product.name} added to cart!`);

    // Here you would typically call a cart service
    // this.cartService.addToCart(product);
  }

  formatPrice(price: number | string): string {
    const numericPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("fr-SN", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericPrice);
  }

  // Enhanced user interaction methods
  private showLoginPrompt() {
    // You can replace this with a more sophisticated modal or toast
    const shouldRedirect = confirm(
      "Please login to add items to your cart. Would you like to go to the login page now?",
    );
    if (shouldRedirect) {
      // Navigate to auth page
      window.location.href = "/auth";
    }
  }

  private showSuccessMessage(message: string) {
    // You can replace this with a toast notification service
    console.log(message);
    // Example: this.toastr.success(message);
  }

  // Enhanced product filtering methods (you can add these features)
  filterByCategory(category: string) {
    // Implementation for category filtering
    console.log(`Filtering by category: ${category}`);
  }

  sortProducts(sortBy: "name" | "price" | "date") {
    if (!this.allProducts) return;

    this.allProducts.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return Number(a.price) - Number(b.price);

        default:
          return 0;
      }
    });
  }

  // Method to refresh products
  refreshProducts() {
    this.allProducts = null;
    this.loadProducts();
  }
}
