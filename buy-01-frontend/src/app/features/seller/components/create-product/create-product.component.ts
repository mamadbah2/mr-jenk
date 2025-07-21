import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import {
  SellerService,
  CreateProductRequest,
} from "../../services/seller.service";
import { LucideAngularModule, Upload, X, Plus, Save } from "lucide-angular";

@Component({
  selector: "app-create-product",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: "./create-product.component.html",
  styleUrls: ["./create-product.component.css"],
})
export class CreateProductComponent implements OnInit {
  productForm!: FormGroup;
  selectedImages: File[] = [];
  imagePreviewUrls: string[] = [];
  isSubmitting = false;
  submitError: string | null = null;

  // Lucide icons
  readonly Upload = Upload;
  readonly X = X;
  readonly Plus = Plus;
  readonly Save = Save;

  constructor(
    private fb: FormBuilder,
    private sellerService: SellerService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.productForm = this.fb.group({
      name: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],
      description: [
        "",
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(1000),
        ],
      ],
      price: [
        "",
        [Validators.required, Validators.min(1), Validators.max(10000000)],
      ],
      quantity: [
        "",
        [Validators.required, Validators.min(1), Validators.max(10000)],
      ],
    });
  }

  onImageSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const files = Array.from(target.files);

      // Validate file types
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      const validFiles = files.filter((file) => validTypes.includes(file.type));

      if (validFiles.length !== files.length) {
        alert("Please select only JPEG, PNG, or WebP images.");
        return;
      }

      // Validate file sizes (max 5MB per file)
      const maxSize = 5 * 1024 * 1024; // 5MB
      const validSizeFiles = validFiles.filter((file) => file.size <= maxSize);

      if (validSizeFiles.length !== validFiles.length) {
        alert("Each image must be less than 5MB.");
        return;
      }

      // Add new images to existing ones
      this.selectedImages = [...this.selectedImages, ...validSizeFiles];

      // Create preview URLs for new images
      validSizeFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            this.imagePreviewUrls.push(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      });

      // Reset the input
      target.value = "";
    }
  }

  removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
    this.imagePreviewUrls.splice(index, 1);
  }

  onSubmit(): void {
    if (this.productForm.valid && this.selectedImages.length > 0) {
      this.isSubmitting = true;
      this.submitError = null;

      const formValue = this.productForm.value;
      const productData: CreateProductRequest = {
        name: formValue.name.trim(),
        description: formValue.description.trim(),
        price: parseFloat(formValue.price),
        quantity: parseInt(formValue.quantity),
        images: this.selectedImages,
      };

      console.log("Submitting product data:", productData);
      console.log("JWT Token present:", !!this.sellerService.getToken());

      this.sellerService.createProduct(productData).subscribe({
        next: (response) => {
          console.log("Product created successfully:", response);
          this.router.navigate(["/seller/my-products"]);
        },
        error: (error) => {
          console.error("Error creating product:", error);
          console.error("Error status:", error.status);
          console.error("Error details:", error.error);

          if (error.status === 401) {
            this.submitError =
              "You are not authorized to create products. Please log in again.";
          } else if (error.status === 400) {
            this.submitError =
              error.error?.message ||
              "Invalid product data. Please check your inputs.";
          } else if (error.status === 413) {
            this.submitError =
              "Files are too large. Please use smaller images.";
          } else {
            this.submitError =
              error.error?.message ||
              "An error occurred while creating the product. Please try again.";
          }
          this.isSubmitting = false;
        },
      });
    } else {
      this.markFormGroupTouched();
      if (this.selectedImages.length === 0) {
        this.submitError = "Please select at least one image for your product.";
      }
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.productForm.controls).forEach((key) => {
      const control = this.productForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors["required"])
        return `${this.getFieldLabel(fieldName)} is required.`;
      if (field.errors["minlength"])
        return `${this.getFieldLabel(fieldName)} must be at least ${field.errors["minlength"].requiredLength} characters.`;
      if (field.errors["maxlength"])
        return `${this.getFieldLabel(fieldName)} must not exceed ${field.errors["maxlength"].requiredLength} characters.`;
      if (field.errors["min"])
        return `${this.getFieldLabel(fieldName)} must be at least ${field.errors["min"].min}.`;
      if (field.errors["max"])
        return `${this.getFieldLabel(fieldName)} must not exceed ${field.errors["max"].max}.`;
    }
    return "";
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: "Product name",
      description: "Description",
      price: "Price",
      quantity: "Quantity",
    };
    return labels[fieldName] || fieldName;
  }

  goBack(): void {
    this.router.navigate(["/seller/my-products"]);
  }
}
