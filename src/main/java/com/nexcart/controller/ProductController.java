package com.nexcart.controller;

import com.nexcart.model.Product;
import com.nexcart.repository.ProductRepository;
import com.nexcart.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public Product createProduct(@RequestBody Product product){
        System.out.println("CURRENT USER ROLES: " + org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getAuthorities());
        return productService.addProduct(product);
    }

    @GetMapping
    public List<Product> getAllProducts(){
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<String> deleteProduct(@PathVariable("id") Long productId){
        System.out.println("CURRENT USER ROLES: " + org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getAuthorities());
        String response = productService.deleteProduct(productId);
        if(response.equals("Product Deleted Successfully")){
            return ResponseEntity.ok(response);
        }else{
            return ResponseEntity.status(404).body(response);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity updateProduct(@PathVariable("id") Long id, @RequestBody Product product) {

        System.out.println("CURRENT USER ROLES: " + org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getAuthorities());

        Product updatedProduct = productService.updateProduct(id, product);
        return ResponseEntity.ok(updatedProduct);
    }


}
