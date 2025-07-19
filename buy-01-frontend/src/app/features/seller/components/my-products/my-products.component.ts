import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import {
  LucideAngularModule,
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Copy,
  Play,
  Pause,
  Trash2,
} from "lucide-angular";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
  status: "active" | "inactive" | "out_of_stock";
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: "app-my-products",
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: "./my-products.component.html",
  styleUrls: ["./my-products.component.css"],
})
export class MyProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = true;
  searchTerm = "";
  selectedCategory = "all";
  selectedStatus = "all";
  sortBy = "name";
  sortOrder: "asc" | "desc" = "asc";

  // Lucide icons
  readonly Package = Package;
  readonly Plus = Plus;
  readonly Search = Search;
  readonly Filter = Filter;
  readonly Edit = Edit;
  readonly Copy = Copy;
  readonly Play = Play;
  readonly Pause = Pause;
  readonly Trash2 = Trash2;

  categories = [
    { value: "all", label: "All Categories" },
    { value: "electronics", label: "Electronics" },
    { value: "clothing", label: "Clothing" },
    { value: "home", label: "Home & Garden" },
    { value: "books", label: "Books" },
    { value: "sports", label: "Sports" },
    { value: "toys", label: "Toys" },
  ];

  statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "out_of_stock", label: "Out of Stock" },
  ];

  sortOptions = [
    { value: "name", label: "Name" },
    { value: "price", label: "Price" },
    { value: "stock", label: "Stock" },
    { value: "createdAt", label: "Date Created" },
    { value: "updatedAt", label: "Last Updated" },
  ];

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    // TODO: Replace with actual API call to get seller's products
    setTimeout(() => {
      // For now, just show empty state - no mock data
      this.products = [];
      this.filteredProducts = [];
      this.isLoading = false;
    }, 500);
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.applyFilters();
  }

  onCategoryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedCategory = target.value;
    this.applyFilters();
  }

  onStatusChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedStatus = target.value;
    this.applyFilters();
  }

  onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.sortBy = target.value;
    this.applySort();
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
    this.applySort();
  }

  private applyFilters(): void {
    let filtered = [...this.products];

    // Apply search filter
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower),
      );
    }

    // Apply category filter
    if (this.selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === this.selectedCategory,
      );
    }

    // Apply status filter
    if (this.selectedStatus !== "all") {
      filtered = filtered.filter(
        (product) => product.status === this.selectedStatus,
      );
    }

    this.filteredProducts = filtered;
    this.applySort();
  }

  private applySort(): void {
    this.filteredProducts.sort((a, b) => {
      let valueA: any = a[this.sortBy as keyof Product];
      let valueB: any = b[this.sortBy as keyof Product];

      if (this.sortBy === "createdAt" || this.sortBy === "updatedAt") {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      } else if (typeof valueA === "string") {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) {
        return this.sortOrder === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case "active":
        return "status-active";
      case "inactive":
        return "status-inactive";
      case "out_of_stock":
        return "status-out-of-stock";
      default:
        return "";
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case "active":
        return "✅";
      case "inactive":
        return "⏸️";
      case "out_of_stock":
        return "❌";
      default:
        return "❓";
    }
  }

  formatCurrency(amount: number | string): string {
    const numericAmount =
      typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("fr-SN", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericAmount);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  }

  editProduct(productId: string): void {
    // TODO: Navigate to edit product page
    console.log("Edit product:", productId);
  }

  deleteProduct(productId: string): void {
    // TODO: Implement delete confirmation and API call
    if (confirm("Are you sure you want to delete this product?")) {
      this.products = this.products.filter((p) => p.id !== productId);
      this.applyFilters();
    }
  }

  toggleProductStatus(productId: string): void {
    // TODO: Implement API call to toggle status
    const product = this.products.find((p) => p.id === productId);
    if (product) {
      product.status = product.status === "active" ? "inactive" : "active";
      product.updatedAt = new Date();
      this.applyFilters();
    }
  }

  duplicateProduct(productId: string): void {
    // TODO: Implement product duplication
    const product = this.products.find((p) => p.id === productId);
    if (product) {
      const duplicated = {
        ...product,
        id: Date.now().toString(),
        name: `${product.name} (Copy)`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.products.unshift(duplicated);
      this.applyFilters();
    }
  }

  get totalProducts(): number {
    return this.products.length;
  }

  get activeProducts(): number {
    return this.products.filter((p) => p.status === "active").length;
  }

  get outOfStockProducts(): number {
    return this.products.filter((p) => p.status === "out_of_stock").length;
  }
}
