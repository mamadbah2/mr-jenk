import { Component, OnInit, OnDestroy, inject } from "@angular/core";
import { CommonModule, Location } from "@angular/common";
import { RouterModule, ActivatedRoute } from "@angular/router";
import { ProductService } from "../../services/product.service";
import { ProductModels } from "../../models/product.models";
import { AuthService } from "../../../../auth/services/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-product-details",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./product-details.component.html",
  styleUrls: ["./product-details.component.css"],
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  product: ProductModels | null = null;
  selectedImage: string = "";
  selectedQuantity: number = 1;
  relatedProducts: ProductModels[] = [];
  isLoading: boolean = true;
  private routeSubscription: Subscription | null = null;

  private productService = inject(ProductService);
  private activatedRoute = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private location = inject(Location);

  ngOnInit(): void {
    // Subscribe to route parameter changes
    this.routeSubscription = this.activatedRoute.paramMap.subscribe(
      (params) => {
        this.loadProduct();
      },
    );
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private loadProduct(): void {
    // Reset component state
    this.isLoading = true;
    this.product = null;
    this.selectedImage = "";
    this.selectedQuantity = 1;
    this.relatedProducts = [];

    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if (id) {
      this.productService.getOneProduct(id).subscribe({
        next: (product) => {
          this.product = product;
          this.selectedImage = this.getProductImage(product);
          this.isLoading = false;
          this.loadRelatedProducts();
        },
        error: (err) => {
          console.error("Error loading product:", err);
          this.isLoading = false;
        },
      });
    }
  }

  private loadRelatedProducts(): void {
    // Load related products (mock for now)
    this.productService.getProductList().subscribe({
      next: (products) => {
        // Filter out current product and take first 4
        this.relatedProducts = products
          .filter((p) => p.id !== this.product?.id)
          .slice(0, 4);
      },
      error: (err) => {
        console.error("Error loading related products:", err);
      },
    });
  }

  selectImage(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }

  increaseQuantity(): void {
    if (
      this.product &&
      this.selectedQuantity < this.getQuantityAsNumber(this.product.quantity)
    ) {
      this.selectedQuantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.selectedQuantity > 1) {
      this.selectedQuantity--;
    }
  }

  addToCart(): void {
    if (this.isGuest) {
      this.showLoginPrompt();
      return;
    }

    if (this.product && this.getQuantityAsNumber(this.product.quantity) > 0) {
      // TODO: Implement actual cart functionality
      console.log(
        `Adding ${this.selectedQuantity} of product ${this.product.id} to cart`,
      );
      this.showSuccessMessage(
        `Added ${this.selectedQuantity} item(s) to cart!`,
      );
    }
  }

  addToWishlist(): void {
    if (this.isGuest) {
      this.showLoginPrompt();
      return;
    }

    // TODO: Implement wishlist functionality
    console.log("Adding to wishlist:", this.product?.id);
    this.showSuccessMessage("Added to wishlist!");
  }

  shareProduct(): void {
    if (navigator.share && this.product) {
      navigator
        .share({
          title: this.product.name,
          text: this.product.description,
          url: window.location.href,
        })
        .catch((err) => console.log("Error sharing:", err));
    } else {
      // Fallback to clipboard
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          this.showSuccessMessage("Product link copied to clipboard!");
        })
        .catch((err) => {
          console.log("Error copying to clipboard:", err);
        });
    }
  }

  goBack(): void {
    this.location.back();
  }

  // Helper methods
  getQuantityAsNumber(quantity: string): number {
    return Number(quantity) || 0;
  }

  getProductImage(product: ProductModels): string {
    if (product.images && product.images.length > 0) {
      return product.images[0].imageUrl;
    }
    return "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop";
  }

  onImageError(event: any): void {
    event.target.src =
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop";
  }

  formatPrice(price: string | number): string {
    const numericPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("fr-SN", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericPrice);
  }

  getStockClass(quantity: number): string {
    if (quantity === 0) return "out-of-stock";
    if (quantity <= 10) return "low-stock";
    return "in-stock";
  }

  get isGuest(): boolean {
    return !this.authService.isLoggedIn();
  }

  private showLoginPrompt(): void {
    const shouldRedirect = confirm(
      "Please login to add items to your cart. Would you like to go to the login page now?",
    );
    if (shouldRedirect) {
      window.location.href = "/auth";
    }
  }

  private showSuccessMessage(message: string): void {
    // Simple alert for now - you can replace with a toast notification
    alert(message);
  }
}
