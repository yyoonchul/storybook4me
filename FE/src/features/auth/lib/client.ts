import { useClerk, useSession, useUser } from "@clerk/clerk-react";

export function useAuthedFetch() {
  const { session } = useSession();
  return async (url: string, init: RequestInit = {}) => {
    const token = await session?.getToken();
    const headers = new Headers(init.headers || {});
    if (token) headers.set("Authorization", `Bearer ${token}`);
    if (!headers.has("Content-Type") && !(init.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }
    return fetch(url, { ...init, headers });
  };
}

export function useIsSignedIn() {
  const { isSignedIn } = useUser();
  return isSignedIn;
}

export function useOpenSignIn() {
  const { openSignIn } = useClerk();
  return openSignIn;
}

export function useOpenUserProfile() {
  const { openUserProfile } = useClerk();
  return openUserProfile;
}


