// Format currency to Indonesian Rupiah
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date to Indonesian format
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

// Format relative time (e.g., "2 jam yang lalu")
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Baru saja";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} menit yang lalu`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} jam yang lalu`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} hari yang lalu`;
  } else {
    return formatDate(d);
  }
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

// Generate WhatsApp link
export function getWhatsAppLink(phone: string, message?: string): string {
  // Remove all non-numeric characters
  const cleanPhone = phone.replace(/\D/g, "");

  // Add country code if not present (assume Indonesia +62)
  const phoneWithCountryCode = cleanPhone.startsWith("62")
    ? cleanPhone
    : cleanPhone.startsWith("0")
    ? "62" + cleanPhone.substring(1)
    : "62" + cleanPhone;

  const encodedMessage = message ? encodeURIComponent(message) : "";
  return `https://wa.me/${phoneWithCountryCode}${
    encodedMessage ? `?text=${encodedMessage}` : ""
  }`;
}
