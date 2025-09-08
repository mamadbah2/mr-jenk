/*
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { ProductModels } from '../models/product.models'; // Adaptez le chemin si nécessaire
import { environment } from '../../../../environments/environment';

// Suite de tests pour ProductService
describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  // Configuration exécutée avant chaque test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        // Importer le module de test HTTP
        HttpClientTestingModule
      ],
      providers: [
        // Le service que nous voulons tester
        ProductService
      ]
    });

    // Injection des dépendances pour le test
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Vérification après chaque test pour s'assurer qu'il n'y a pas de requêtes inattendues
  afterEach(() => {
    httpMock.verify();
  });

  // Test de base pour s'assurer que le service est bien créé
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ======================================================
  // Tests pour la méthode getProductList()
  // ======================================================
  describe('getProductList', () => {
    it('should return a list of products on successful GET request', () => {
      // 1. Arrange: Préparer les données de test
      const mockProducts: ProductModels[] = [
        {
          id: '1',
          name: 'Product A',
          description: 'Desc A',
          price: '100', // <-- MODIFIÉ : number -> string
          quantity: '50', // <-- AJOUTÉ
          userId: 'user-xyz-789', // <-- AJOUTÉ
          images: [ // <-- AJOUTÉ
            {
              id: 'img-101',
              imageUrl: 'image_product_a.jpg',
              productId: '1' // Doit correspondre à l'id du produit
            }
          ]
        },
        {
          id: '2',
          name: 'Product B',
          description: 'Desc B',
          price: '200', // <-- MODIFIÉ : number -> string
          quantity: '35', // <-- AJOUTÉ
          userId: 'user-xyz-789', // <-- AJOUTÉ
          images: [ // <-- AJOUTÉ
            {
              id: 'img-102',
              imageUrl: 'image_product_b_1.jpg',
              productId: '2'
            },
            {
              id: 'img-103',
              imageUrl: 'image_product_b_2.jpg',
              productId: '2'
            }
          ]
        }
      ];
      let actualProducts: ProductModels[] | undefined;

      // 2. Act: Appeler la méthode du service
      service.getProductList().subscribe(products => {
        actualProducts = products;
      });

      // 3. Assert (HTTP Level): Vérifier que la requête HTTP a bien été faite
      // On s'attend à une seule requête vers cette URL
      const req = httpMock.expectOne(`${apiUrl}/api/products`);
      // On vérifie que la méthode est bien GET
      expect(req.request.method).toBe('GET');

      // 4. Act (HTTP Level): Simuler la réponse du serveur en "flushant" les données
      req.flush(mockProducts);

      // 5. Assert: Vérifier que les données reçues par le subscribe sont correctes
      expect(actualProducts).toEqual(mockProducts);
    });

    it('should propagate errors on failed GET request', () => {
      // 1. Arrange
      const mockError = { status: 500, statusText: 'Internal Server Error' };
      let actualError: any;

      // 2. Act
      service.getProductList().subscribe({
        next: () => fail('should have failed with an error'), // Le test échoue si on reçoit des données
        error: (err) => {
          actualError = err;
        }
      });

      // 3. Assert (HTTP Level)
      const req = httpMock.expectOne(`${apiUrl}/api/products`);
      expect(req.request.method).toBe('GET');

      // 4. Act (HTTP Level): Simuler une erreur serveur
      req.flush('Something went wrong', mockError);

      // 5. Assert
      expect(actualError).toBeTruthy();
      expect(actualError.status).toBe(500);
    });
  });

  // ======================================================
  // Tests pour la méthode getOneProduct()
  // ======================================================
  describe('getOneProduct', () => {
    it('should return a single product on successful GET request', () => {
      // 1. Arrange
      const mockProduct: ProductModels = {
        id: '1',
        name: 'Product A',
        description: 'Desc A',
        price: '100', // <-- MODIFIÉ : number -> string
        quantity: '50', // <-- AJOUTÉ
        userId: 'user-xyz-789', // <-- AJOUTÉ
        images: [ // <-- AJOUTÉ
          {
            id: 'img-101',
            imageUrl: 'image_product_a.jpg',
            productId: '1' // Doit correspondre à l'id du produit
          }
        ]
      };
      const productId = '123';
      let actualProduct: ProductModels | undefined;

      // 2. Act
      service.getOneProduct(productId).subscribe(product => {
        actualProduct = product;
      });

      // 3. Assert (HTTP Level)
      const req = httpMock.expectOne(`${apiUrl}/api/products/${productId}`);
      expect(req.request.method).toBe('GET');

      // 4. Act (HTTP Level)
      req.flush(mockProduct);

      // 5. Assert
      expect(actualProduct).toEqual(mockProduct);
    });

    it('should handle 404 Not Found error', () => {
      // 1. Arrange
      const mockError = { status: 404, statusText: 'Not Found' };
      const productId = '999'; // Un ID qui n'existe pas
      let actualError: any;

      // 2. Act
      service.getOneProduct(productId).subscribe({
        next: () => fail('should have failed with a 404 error'),
        error: (err) => {
          actualError = err;
        }
      });

      // 3. Assert (HTTP Level)
      const req = httpMock.expectOne(`${apiUrl}/api/products/${productId}`);
      expect(req.request.method).toBe('GET');

      // 4. Act (HTTP Level)
      req.flush('Product not found', mockError);

      // 5. Assert
      expect(actualError).toBeTruthy();
      expect(actualError.status).toBe(404);
    });
  });
});
*/
