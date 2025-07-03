package sn.dev.product_service.services;

import java.util.List;

import sn.dev.product_service.data.entities.Product;

public interface ProductService {
    Product create(Product product);

    Product update(Product product, String id);

    Product getById(String id);

    List<Product> getByUserId(String userId);

    List<Product> getAll();

    void delete(String id);

    void deleteByUserId(String userId);
}
