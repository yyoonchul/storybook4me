// Re-export Clerk primitives to centralize imports
export { SignedIn, SignedOut, SignInButton, SignUpButton, SignOutButton, UserButton, useClerk, useSession, useUser } from "@clerk/clerk-react";

// Custom light wrappers/hooks for app-wide usage
export * from "./lib/client";


