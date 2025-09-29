package com.exe.super_rice.controller;

import com.exe.super_rice.dto.request.ProductRequest;
import com.exe.super_rice.dto.response.ApiResponse;
import com.exe.super_rice.dto.response.ProductResponse;
import com.exe.super_rice.enums.RiceType;
import com.exe.super_rice.service.product.ProductService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductController {

    ProductService productService;

    @PostMapping
    public ApiResponse<ProductResponse> createProduct(@RequestBody ProductRequest request) {
        ProductResponse response = productService.createProduct(request);
        return ApiResponse.<ProductResponse>builder()
                .message("Product created successfully")
                .data(response)
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<ProductResponse> getProductById(@PathVariable Long id) {
        ProductResponse response = productService.getProductById(id);
        return ApiResponse.<ProductResponse>builder()
                .message("Product retrieved successfully")
                .data(response)
                .build();
    }

    @GetMapping
    public ApiResponse<List<ProductResponse>> getAllProducts() {
        List<ProductResponse> response = productService.getAllProducts();
        return ApiResponse.<List<ProductResponse>>builder()
                .message("Products retrieved successfully")
                .data(response)
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<ProductResponse> updateProduct(@PathVariable Long id, @RequestBody ProductRequest request) {
        ProductResponse response = productService.updateProduct(id, request);
        return ApiResponse.<ProductResponse>builder()
                .message("Product updated successfully")
                .data(response)
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ApiResponse.<Void>builder()
                .message("Product deleted successfully")
                .build();
    }

    @GetMapping("/rice-type/{riceType}")
    public ApiResponse<List<ProductResponse>> getProductsByRiceType(@PathVariable RiceType riceType) {
        List<ProductResponse> response = productService.getProductsByRiceType(riceType);
        return ApiResponse.<List<ProductResponse>>builder()
                .message("Products retrieved by rice type successfully")
                .data(response)
                .build();
    }

    @GetMapping("/search")
    public ApiResponse<List<ProductResponse>> searchProducts(@RequestParam String keyword) {
        List<ProductResponse> response = productService.searchProducts(keyword);
        return ApiResponse.<List<ProductResponse>>builder()
                .message("Products search completed successfully")
                .data(response)
                .build();
    }

    @GetMapping("/price-range")
    public ApiResponse<List<ProductResponse>> getProductsByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice) {
        List<ProductResponse> response = productService.getProductsByPriceRange(minPrice, maxPrice);
        return ApiResponse.<List<ProductResponse>>builder()
                .message("Products retrieved by price range successfully")
                .data(response)
                .build();
    }

    @GetMapping("/available")
    public ApiResponse<List<ProductResponse>> getAvailableProducts() {
        List<ProductResponse> response = productService.getAvailableProducts();
        return ApiResponse.<List<ProductResponse>>builder()
                .message("Available products retrieved successfully")
                .data(response)
                .build();
    }

    @GetMapping("/stock-greater-than")
    public ApiResponse<List<ProductResponse>> getProductsWithStockGreaterThan(@RequestParam Integer quantity) {
        List<ProductResponse> response = productService.getProductsWithStockGreaterThan(quantity);
        return ApiResponse.<List<ProductResponse>>builder()
                .message("Products with stock greater than " + quantity + " retrieved successfully")
                .data(response)
                .build();
    }

    @GetMapping("/sorted-by-price")
    public ApiResponse<List<ProductResponse>> getProductsSortedByPrice(
            @RequestParam(defaultValue = "asc") String sortDirection) {
        List<ProductResponse> response = productService.getProductsSortedByPrice(sortDirection);
        return ApiResponse.<List<ProductResponse>>builder()
                .message("Products sorted by price " + sortDirection + " retrieved successfully")
                .data(response)
                .build();
    }
}