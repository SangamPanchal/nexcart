    package com.nexcart.service;

    import com.nexcart.model.Product;
    import com.nexcart.repository.ProductRepository;
    import org.springframework.stereotype.Service;

    import java.util.List;
    @Service
    public class ProductService {
        private final ProductRepository productRepository;

        public ProductService(ProductRepository productRepository){
            this.productRepository = productRepository;
        }

        public Product addProduct(Product product){
            return productRepository.save(product);
        }

        public List<Product> getAllProducts(){
            return productRepository.findAll();
        }

        public String deleteProduct(Long productId){
            if (productRepository.existsById(productId)){
                productRepository.deleteById(productId);
                return "Product Deleted Successfully";
            }else{
                return "Product Not Found";
            }

        }

        public Product getProductById(Long id) {
            return productRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
        }

        public Product updateProduct(Long id, Product updatedProductDetails){
            Product existingProduct = productRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));

            existingProduct.setProductName(updatedProductDetails.getProductName());
            existingProduct.setProductDescription(updatedProductDetails.getProductDescription());
            existingProduct.setProductPrice(updatedProductDetails.getProductPrice());
            existingProduct.setStockQuantity(updatedProductDetails.getStockQuantity());
            existingProduct.setProductCategory(updatedProductDetails.getProductCategory());

            return productRepository.save(existingProduct);
        }


    }
