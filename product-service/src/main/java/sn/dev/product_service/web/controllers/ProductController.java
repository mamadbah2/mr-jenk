package sn.dev.product_service.web.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.validation.Valid;
import sn.dev.product_service.web.dto.ProductCreateDTO;
import sn.dev.product_service.web.dto.ProductResponseDTO;

@RequestMapping("/api/products")
public interface ProductController {
    @PostMapping
    ResponseEntity<ProductResponseDTO> create(@RequestBody @Valid ProductCreateDTO productCreateDTO);

    @GetMapping
    ResponseEntity<List<ProductResponseDTO>> getAll();

    @GetMapping("/{id}")
    ResponseEntity<ProductResponseDTO> getById(@PathVariable String id);

    @PutMapping("/{id}")
    ResponseEntity<ProductResponseDTO> update(@RequestBody @Valid ProductCreateDTO productCreateDTO,
            @PathVariable String id);

    @DeleteMapping("/{id}")
    ResponseEntity<Void> delete(@PathVariable String id);
}
