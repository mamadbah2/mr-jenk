import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import {
  LucideAngularModule,
  BarChart3,
  Package,
  Plus,
  TrendingUp,
  ShoppingBag,
  Clock,
} from "lucide-angular";

interface DashboardStats {
  totalProducts: number;
  totalSales: number;
  totalRevenue: number;
  pendingOrders: number;
}

interface RecentOrder {
  id: string;
  productName: string;
  customerName: string;
  amount: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  date: Date;
}

@Component({
  selector: "app-seller-dashboard",
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: "./seller-dashboard.component.html",
  styleUrls: ["./seller-dashboard.component.css"],
})
export class SellerDashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  };

  recentOrders: RecentOrder[] = [];
  isLoading = true;

  // Lucide icons
  readonly BarChart3 = BarChart3;
  readonly Package = Package;
  readonly Plus = Plus;
  readonly TrendingUp = TrendingUp;
  readonly ShoppingBag = ShoppingBag;
  readonly Clock = Clock;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // TODO: Replace with actual API calls to get real data
    setTimeout(() => {
      // For now, just stop loading - in real app, fetch from API
      this.isLoading = false;
    }, 500);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case "pending":
        return "status-pending";
      case "processing":
        return "status-processing";
      case "shipped":
        return "status-shipped";
      case "delivered":
        return "status-delivered";
      default:
        return "";
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

  get hasData(): boolean {
    return this.stats.totalProducts > 0 || this.recentOrders.length > 0;
  }
}
