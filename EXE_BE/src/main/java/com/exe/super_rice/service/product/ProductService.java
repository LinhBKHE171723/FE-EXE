package com.exe.super_rice.service.product;

import com.exe.super_rice.dto.request.ProductRequest;
import com.exe.super_rice.dto.response.ProductResponse;
import com.exe.super_rice.enums.RiceType;

import java.math.BigDecimal;
import java.util.List;

public interface ProductService {
    ProductResponse createProduct(ProductRequest request);

    ProductResponse getProductById(Long id);

    List<ProductResponse> getAllProducts();

    ProductResponse updateProduct(Long id, ProductRequest request);

    void deleteProduct(Long id);

    List<ProductResponse> getProductsByRiceType(RiceType riceType);

    List<ProductResponse> searchProducts(String keyword);

    List<ProductResponse> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice);

    List<ProductResponse> getAvailableProducts();

    List<ProductResponse> getProductsWithStockGreaterThan(Integer quantity);

    List<ProductResponse> getProductsSortedByPrice(String sortDirection);
}
