package com.exe.super_rice.service.product;

import com.exe.super_rice.database.entity.Product;
import com.exe.super_rice.database.repository.ProductRepository;
import com.exe.super_rice.dto.request.ProductRequest;
import com.exe.super_rice.dto.response.ProductResponse;
import com.exe.super_rice.enums.ErrorCode;
import com.exe.super_rice.enums.RiceType;
import com.exe.super_rice.exception.AppException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ProductServiceImpl implements ProductService {

    ProductRepository productRepository;

    @Override
    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        try {
            Product product = Product.builder()
                    .name(request.getName())
                    .description(request.getDescription())
                    .price(request.getPrice())
                    .stockQuantity(request.getStockQuantity())
                    .unit(request.getUnit() != null ? request.getUnit() : "kg")
                    .riceType(request.getRiceType())
                    .createdAt(LocalDateTime.now())
                    .build();

            Product savedProduct = productRepository.save(product);
            return mapToResponse(savedProduct);
        } catch (Exception e) {
            log.error("Error creating product: {}", e.getMessage());
            throw new AppException(ErrorCode.PRODUCT_CREATION_FAILED);
        }
    }

    @Override
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        return mapToResponse(product);
    }

    @Override
    public List<ProductResponse> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        try {
            product.setName(request.getName());
            product.setDescription(request.getDescription());
            product.setPrice(request.getPrice());
            product.setStockQuantity(request.getStockQuantity());
            product.setUnit(request.getUnit() != null ? request.getUnit() : product.getUnit());
            product.setRiceType(request.getRiceType());

            Product updatedProduct = productRepository.save(product);
            return mapToResponse(updatedProduct);
        } catch (Exception e) {
            log.error("Error updating product: {}", e.getMessage());
            throw new AppException(ErrorCode.PRODUCT_UPDATE_FAILED);
        }
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        try {
            productRepository.delete(product);
        } catch (Exception e) {
            log.error("Error deleting product: {}", e.getMessage());
            throw new AppException(ErrorCode.PRODUCT_DELETE_FAILED);
        }
    }

    @Override
    public List<ProductResponse> getProductsByRiceType(RiceType riceType) {
        List<Product> products = productRepository.findByRiceType(riceType);
        return products.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> searchProducts(String keyword) {
        List<Product> products = productRepository.searchProducts(keyword);
        return products.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        List<Product> products = productRepository.findByPriceBetween(minPrice, maxPrice);
        return products.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getAvailableProducts() {
        List<Product> products = productRepository.findAvailableProducts();
        return products.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getProductsWithStockGreaterThan(Integer quantity) {
        List<Product> products = productRepository.findByStockQuantityGreaterThan(quantity);
        return products.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> getProductsSortedByPrice(String sortDirection) {
        List<Product> products;

        if ("desc".equalsIgnoreCase(sortDirection)) {
            products = productRepository.findAllByOrderByPriceDesc();
        } else {
            products = productRepository.findAllByOrderByPriceAsc();
        }

        return products.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ProductResponse mapToResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .unit(product.getUnit())
                .createdAt(product.getCreatedAt())
                .riceType(product.getRiceType())
                .build();
    }
}
