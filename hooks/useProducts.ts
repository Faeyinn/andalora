import { useState, useEffect, useCallback } from "react";
import type { Product, ProductsQuery, PaginatedResponse } from "@/types";
import { apiRequest } from "@/lib/utils/api";

export function useProducts(query?: ProductsQuery) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    total_pages: 0,
  });

  const {
    page,
    limit,
    category,
    search,
    condition,
    min_price,
    max_price,
    sort,
  } = query || {};

  const fetchProducts = useCallback(
    async (customQuery?: ProductsQuery) => {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      const baseQuery = {
        page,
        limit,
        category,
        search,
        condition,
        min_price,
        max_price,
        sort,
      };
      const finalQuery = { ...baseQuery, ...customQuery };

      if (finalQuery.page) params.append("page", finalQuery.page.toString());
      if (finalQuery.limit) params.append("limit", finalQuery.limit.toString());
      if (finalQuery.category) params.append("category", finalQuery.category);
      if (finalQuery.search) params.append("search", finalQuery.search);
      if (finalQuery.condition)
        params.append("condition", finalQuery.condition);
      if (finalQuery.min_price)
        params.append("min_price", finalQuery.min_price.toString());
      if (finalQuery.max_price)
        params.append("max_price", finalQuery.max_price.toString());
      if (finalQuery.sort) params.append("sort", finalQuery.sort);

      const result = await apiRequest<PaginatedResponse<Product>>(
        `/products?${params.toString()}`
      );

      if (result.success && result.data) {
        setProducts(result.data.data);
        setPagination(result.data.pagination);
      } else {
        setError(result.error || "Gagal mengambil data produk");
      }

      setLoading(false);
    },
    [page, limit, category, search, condition, min_price, max_price, sort]
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    pagination,
    refetch: fetchProducts,
  };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await apiRequest<Product>(`/products/${id}`);

    if (result.success && result.data) {
      setProduct(result.data);
    } else {
      setError(result.error || "Produk tidak ditemukan");
    }

    setLoading(false);
  }, [id]);

  useEffect(() => {
    if (id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchProduct();
    }
  }, [id, fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
}

export function useMyProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await apiRequest<Product[]>("/products/my-products");

    if (result.success && result.data) {
      setProducts(result.data);
    } else {
      setError(result.error || "Gagal mengambil data produk");
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMyProducts();
  }, [fetchMyProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchMyProducts,
  };
}
