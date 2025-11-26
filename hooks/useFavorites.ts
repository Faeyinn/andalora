import { useState, useEffect } from "react";
import type { Favorite } from "@/types";
import { apiRequest } from "@/lib/utils/api";
import { getGuestSessionId } from "@/lib/utils/guest";
import { useAuth } from "@/contexts/AuthContext";

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    setLoading(true);
    setError(null);

    const sessionId = user ? undefined : getGuestSessionId();
    const params = sessionId ? `?session_id=${sessionId}` : "";

    const result = await apiRequest<Favorite[]>(`/favorites${params}`);

    if (result.success && result.data) {
      setFavorites(result.data);
    } else {
      setError(result.error || "Gagal mengambil data favorit");
    }

    setLoading(false);
  };

  const addFavorite = async (productId: string) => {
    const sessionId = user ? undefined : getGuestSessionId();

    const result = await apiRequest("/favorites", {
      method: "POST",
      body: JSON.stringify({
        product_id: productId,
        session_id: sessionId,
      }),
    });

    if (result.success) {
      await fetchFavorites();
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  };

  const removeFavorite = async (productId: string) => {
    const sessionId = user ? undefined : getGuestSessionId();
    const params = sessionId ? `?session_id=${sessionId}` : "";

    const result = await apiRequest(`/favorites/${productId}${params}`, {
      method: "DELETE",
    });

    if (result.success) {
      await fetchFavorites();
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.some((fav) => fav.product_id === productId);
  };

  useEffect(() => {
    fetchFavorites();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
    isFavorite,
    refetch: fetchFavorites,
  };
}
