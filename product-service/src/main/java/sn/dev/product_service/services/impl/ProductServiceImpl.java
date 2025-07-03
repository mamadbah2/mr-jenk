package sn.dev.product_service.services.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import sn.dev.product_service.data.entities.Product;
import sn.dev.product_service.data.repo.ProductRepo;
import sn.dev.product_service.services.ProductService;

@Service
public class ProductServiceImpl implements ProductService {
    private final ProductRepo productRepo;

    public ProductServiceImpl(ProductRepo productRepo) {
        this.productRepo = productRepo;
    }

    @Override
    public Product create(Product product) {
        return productRepo.save(product);
    }

    @Override
    public List<Product> getAll() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Product getById(String id) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public List<Product> getByUserId(String userId) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Product update(Product productCreateDTO, String id) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void delete(String id) {
        // TODO Auto-generated method stub

    }

    @Override
    public void deleteByUserId(String userId) {
        // TODO Auto-generated method stub

    }
}
