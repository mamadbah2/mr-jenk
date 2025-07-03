package sn.dev.product_service.web.controllers.impl;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import sn.dev.product_service.data.entities.Media;
import sn.dev.product_service.data.entities.Product;
import sn.dev.product_service.services.MediaServiceClient;
import sn.dev.product_service.services.ProductService;
import sn.dev.product_service.web.controllers.ProductController;
import sn.dev.product_service.web.dto.ProductCreateDTO;
import sn.dev.product_service.web.dto.ProductResponseDTO;

@RequiredArgsConstructor
@RestController
public class ProductControllerImpl implements ProductController {
    private final ProductService productService;
    private MediaServiceClient mediaServiceClient;
    private final String maxAge = "300";

    @Override
    public ResponseEntity<ProductResponseDTO> create(@Valid ProductCreateDTO productCreateDTO) {
        System.out.println("CREATE product : " + productCreateDTO);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = (String) auth.getPrincipal();

        Product product = productService.create(productCreateDTO.toProduct(userId));
        List<Media> medias = productCreateDTO.getImages().stream()
                .map(file -> mediaServiceClient.upload(file, product.getId()))
                .toList();

        return ResponseEntity.status(HttpStatus.CREATED)
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=" + maxAge)
                .body(new ProductResponseDTO(product, medias));
    }

    @Override
    public ResponseEntity<List<ProductResponseDTO>> getAll() {
        System.out.println("GET(getAll) products");

        // List<ProductResponseDTO> allDtos = productService.getAll().stream()
        // .map(ProductResponseDTO::new)
        // .toList();
        // return ResponseEntity.ok()
        // .header(HttpHeaders.CACHE_CONTROL, "public, max-age=" + maxAge)
        // .body(allDtos);

        return null;
    }

    @Override
    public ResponseEntity<ProductResponseDTO> getById(String id) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public ResponseEntity<ProductResponseDTO> update(@Valid ProductCreateDTO productCreateDTO, String id) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public ResponseEntity<Void> delete(String id) {
        // TODO Auto-generated method stub
        return null;
    }
}
