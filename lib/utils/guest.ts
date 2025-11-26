// Guest session management for favorites
const GUEST_SESSION_KEY = "andalora_guest_session";

export function getGuestSessionId(): string {
  if (typeof window === "undefined") return "";

  let sessionId = localStorage.getItem(GUEST_SESSION_KEY);

  if (!sessionId) {
    sessionId = `guest-${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}`;
    localStorage.setItem(GUEST_SESSION_KEY, sessionId);
  }

  return sessionId;
}

export function clearGuestSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(GUEST_SESSION_KEY);
}
