// API helper functions
export async function apiRequest<T = unknown>(
  endpoint: string,
  options?: RequestInit
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("API request error:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat menghubungi server",
    };
  }
}

export async function uploadImage(file: File): Promise<{
  success: boolean;
  data?: { url: string };
  error?: string;
}> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      return { success: true, data: { url: result.data.url } };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "Gagal mengupload gambar" };
  }
}

export async function deleteImage(
  path: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch("/api/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Delete error:", error);
    return { success: false, error: "Gagal menghapus gambar" };
  }
}
