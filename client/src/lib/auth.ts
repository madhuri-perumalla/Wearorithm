export function getAuthToken(): string | null {
  return localStorage.getItem("auth_token");
}

export function setAuthHeader(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
