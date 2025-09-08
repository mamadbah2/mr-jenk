/*
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { ProductListingComponent } from './product-listing.component';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { JwtService } from '../../../../shared/services/jwt.service';
import { ProductModels } from '../../models/product.models';

// Mocks de données réutilisables pour les tests
const MOCK_PRODUCTS: ProductModels[] = [
  {
    id: 'prod-123',
    name: 'Super Fauteuil',
    price: '75000',
    quantity: '15',
    description: 'Desc 1',
    userId: 'user-abc-123', // <-- AJOUTÉ
    images: [ // <-- AJOUTÉ
      { id: 'img-1', imageUrl: 'fauteuil-1.jpg', productId: 'prod-123' },
      { id: 'img-2', imageUrl: 'fauteuil-2.jpg', productId: 'prod-123' }
    ]
  },
  {
    id: 'prod-456',
    name: 'Lampe Design',
    price: '25000',
    quantity: '30',
    description: 'Desc 2',
    userId: 'user-def-456', // <-- AJOUTÉ
    images: [ // <-- AJOUTÉ
      { id: 'img-3', imageUrl: 'lampe-1.jpg', productId: 'prod-456' }
    ]
  },
  {
    id: 'prod-789',
    name: 'Table Basse',
    price: '50000',
    quantity: '10',
    description: 'Desc 3',
    userId: 'user-abc-123', // <-- AJOUTÉ
    images: [ // <-- AJOUTÉ
      { id: 'img-4', imageUrl: 'table-1.jpg', productId: 'prod-789' },
      { id: 'img-5', imageUrl: 'table-2.jpg', productId: 'prod-789' }
    ]
  }
];

const MOCK_USER_CLIENT = { id: 'user-1', email: 'client@test.com', role: 'CLIENT' };
const MOCK_USER_SELLER = { id: 'user-2', email: 'seller@test.com', role: 'SELLER' };

describe('ProductListingComponent', () => {
  let component: ProductListingComponent;
  let fixture: ComponentFixture<ProductListingComponent>;

  // Mocks pour les services injectés
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockJwtService: jasmine.SpyObj<JwtService>;

  beforeEach(async () => {
    // Création des mocks avec les méthodes qui seront appelées par le composant
    mockProductService = jasmine.createSpyObj('ProductService', ['getProductList']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'getToken']);
    mockJwtService = jasmine.createSpyObj('JwtService', ['decodeToken']);

    await TestBed.configureTestingModule({
      imports: [ProductListingComponent],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: JwtService, useValue: mockJwtService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListingComponent);
    component = fixture.componentInstance;

    // Espionnage des fonctions globales pour éviter les effets de bord et vérifier les appels
    spyOn(console, 'error');
    spyOn(console, 'log');
    spyOn(window, 'confirm');
    // Pour `window.location.href`, on doit espionner le setter
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ======================================================
  // TESTS D'INITIALISATION ET DE CHARGEMENT DES DONNÉES
  // ======================================================
  describe('Initialization and Data Loading', () => {
    it('should load products successfully on init', fakeAsync(() => {
      // Arrange: Simuler un utilisateur invité et une réponse réussie du service
      mockAuthService.isLoggedIn.and.returnValue(false);
      mockProductService.getProductList.and.returnValue(of(MOCK_PRODUCTS));

      // Act: Déclencher ngOnInit
      fixture.detectChanges();
      tick(); // Simuler le passage du temps pour la résolution de l'Observable

      // Assert
      expect(component.isLoading).toBeFalse();
      expect(component.allProducts).toEqual(MOCK_PRODUCTS);
      expect(component.filteredProducts).toEqual(MOCK_PRODUCTS);
      expect(mockProductService.getProductList).toHaveBeenCalledTimes(1);
    }));

    it('should handle error when loading products', fakeAsync(() => {
      // Arrange: Simuler une erreur du service
      mockAuthService.isLoggedIn.and.returnValue(false);
      mockProductService.getProductList.and.returnValue(throwError(() => new Error('Server Down')));

      // Act
      fixture.detectChanges();
      tick();

      // Assert
      expect(component.isLoading).toBeFalse();
      expect(component.allProducts).toEqual([]); // Le composant doit initialiser un tableau vide en cas d'erreur
      expect(component.filteredProducts).toEqual([]);
      expect(console.error).toHaveBeenCalledWith('Error loading products:', jasmine.any(Error));
    }));
  });

  // ======================================================
  // TESTS SUR LES RÔLES ET L'ÉTAT DE L'UTILISATEUR
  // ======================================================
  describe('User Status and Roles', () => {
    it('should correctly identify a guest user', () => {
      mockAuthService.isLoggedIn.and.returnValue(false);
      fixture.detectChanges(); // Déclenche ngOnInit qui appelle checkUserStatus

      expect(component.isGuest).toBeTrue();
      expect(component.isClient).toBeFalse();
      expect(component.isSeller).toBeFalse();
      expect(component.currentUser).toBeNull();
    });

    it('should correctly identify a logged-in CLIENT', () => {
      mockAuthService.isLoggedIn.and.returnValue(true);
      mockAuthService.getToken.and.returnValue('fake-client-token');
      fixture.detectChanges();

      expect(component.isGuest).toBeFalse();
      expect(component.isClient).toBeTrue();
      expect(component.isSeller).toBeFalse();
      expect(component.currentUser).toEqual(MOCK_USER_CLIENT);
    });

    it('should correctly identify a logged-in SELLER', () => {
      mockAuthService.isLoggedIn.and.returnValue(true);
      mockAuthService.getToken.and.returnValue('fake-seller-token');
      fixture.detectChanges();

      expect(component.isGuest).toBeFalse();
      expect(component.isClient).toBeFalse();
      expect(component.isSeller).toBeTrue();
      expect(component.currentUser).toEqual(MOCK_USER_SELLER);
    });
  });

  // ======================================================
  // TESTS SUR LE FILTRAGE ET LE TRI
  // ======================================================
  describe('Product Filtering and Sorting', () => {
    // Pré-charger les données avant chaque test de ce groupe
    beforeEach(fakeAsync(() => {
      mockProductService.getProductList.and.returnValue(of([...MOCK_PRODUCTS])); // Utilise une copie
      fixture.detectChanges();
      tick();
    }));

    it('should filter products by search term in name', () => {
      component.onSearch('table');
      expect(component.filteredProducts?.length).toBe(1);
      expect(component.filteredProducts?.[0].name).toBe('Table Basse');
    });

    it('should filter products by search term in description', () => {
      component.onSearch('nettoie');
      expect(component.filteredProducts?.length).toBe(1);
      expect(component.filteredProducts?.[0].name).toBe('Aspirateur Puissant');
    });

    it('should return all products when search term is cleared', () => {
      component.onSearch('table'); // Filtre d'abord
      component.onSearch('');   // Puis efface le filtre
      expect(component.filteredProducts?.length).toBe(3);
    });

    it('should sort products by name (A-Z)', () => {
      component.sortProducts('name');
      const names = component.filteredProducts?.map(p => p.name);
      expect(names).toEqual(['Aspirateur Puissant', 'Lampe Design', 'Table Basse']);
    });

    it('should sort products by price (low to high)', () => {
      component.sortProducts('price');
      const prices = component.filteredProducts?.map(p => p.price);
      expect(prices).toEqual(['25000', '50000', '75000']);
    });

    it('should maintain sort order after filtering', () => {
      // 1. D'abord, trier par prix
      component.sortProducts('price');

      // 2. Ensuite, rechercher un terme qui correspond à plusieurs produits
      component.onSearch('a'); // Correspond à 'Table', 'Aspirateur', 'Lampe'

      // 3. Vérifier que les résultats filtrés sont toujours triés par prix
      const prices = component.filteredProducts?.map(p => p.price);
      expect(prices).toEqual(['25000', '50000', '75000']);
    });
  });

  // ======================================================
  // TESTS SUR LES ACTIONS UTILISATEUR
  // ======================================================
  describe('User Actions', () => {
    it('should show login prompt when a guest adds to cart', () => {
      mockAuthService.isLoggedIn.and.returnValue(false);
      fixture.detectChanges();

      component.addToCart(MOCK_PRODUCTS[0]);

      expect(window.confirm).toHaveBeenCalledWith(jasmine.stringMatching(/Please login/));
    });

    it('should redirect if guest confirms the login prompt', () => {
      mockAuthService.isLoggedIn.and.returnValue(false);
      (window.confirm as jasmine.Spy).and.returnValue(true); // Simule le clic sur "OK"
      fixture.detectChanges();

      component.addToCart(MOCK_PRODUCTS[0]);

      expect(window.location.href).toBe('/auth');
    });

    it('should NOT redirect if guest cancels the login prompt', () => {
      mockAuthService.isLoggedIn.and.returnValue(false);
      (window.confirm as jasmine.Spy).and.returnValue(false); // Simule le clic sur "Annuler"
      fixture.detectChanges();

      component.addToCart(MOCK_PRODUCTS[0]);

      expect(window.location.href).not.toBe('/auth');
    });

    it('should show success message when a logged-in user adds to cart', () => {
      spyOn(component as any, 'showSuccessMessage').and.callThrough();
      mockAuthService.isLoggedIn.and.returnValue(true);
      fixture.detectChanges();

      component.addToCart(MOCK_PRODUCTS[0]);

      expect((component as any).showSuccessMessage).toHaveBeenCalledWith(`${MOCK_PRODUCTS[0].name} added to cart!`);
    });
  });

});
*/
