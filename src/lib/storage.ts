// Local storage utilities for ReWire

const ONBOARDING_KEY = "rewire_onboarding_complete";
const STORACHA_EMAIL_KEY = "rewire_storacha_email";

export function isBrowser(): boolean {
  try {
    return (
      typeof window !== "undefined" &&
      typeof window.localStorage?.getItem === "function"
    );
  } catch {
    return false;
  }
}

export function isOnboardingComplete(): boolean {
  if (!isBrowser()) return false;
  return localStorage.getItem(ONBOARDING_KEY) === "true";
}

export function setOnboardingComplete() {
  if (!isBrowser()) return;
  localStorage.setItem(ONBOARDING_KEY, "true");
}

export function getStorachaEmail(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(STORACHA_EMAIL_KEY);
}

export function setStorachaEmail(email: string) {
  if (!isBrowser()) return;
  localStorage.setItem(STORACHA_EMAIL_KEY, email);
}

export function clearAllData() {
  if (!isBrowser()) return;
  localStorage.clear();
}
