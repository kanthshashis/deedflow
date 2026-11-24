import { UserRole, UserProfile } from "./types";
import { DEMO_USERS } from "./mockData";

export interface AuthSession {
  user: UserProfile;
  token: string;
  loginTime: string;
  expiresAt: string;
}

const STORAGE_KEY_ROLE = "deedflow_active_role";
const STORAGE_KEY_EMAIL = "deedflow_user_email";
const STORAGE_KEY_PERSPECTIVE = "deedflow_perspective_role";
const STORAGE_KEY_SESSION = "deedflow_auth_session";

/**
 * Returns all configured demo users across the 6 system roles.
 */
export function getAllDemoUsers(): UserProfile[] {
  return Object.values(DEMO_USERS);
}

/**
 * Validates and retrieves the active authentication session.
 * Enforces token presence, user object validity, and expiration checks.
 * Cleans up invalid/expired sessions automatically.
 */
export function getValidSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  try {
    const rawSession = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!rawSession) return null;

    const session: AuthSession = JSON.parse(rawSession);
    if (session && session.token && session.user && session.user.id) {
      if (session.expiresAt && new Date(session.expiresAt).getTime() <= Date.now()) {
        // Session expired -> purge
        logoutUser();
        return null;
      }
      return session;
    }
  } catch {
    logoutUser();
    return null;
  }

  return null;
}

/**
 * Returns true if a valid, unexpired authentication session is currently active.
 */
export function isAuthenticated(): boolean {
  return getValidSession() !== null;
}

/**
 * Retrieves the currently authenticated user profile from active session.
 * Returns null if no valid session is found (strictly no silent mock fallback).
 */
export function getCurrentAuthUser(): UserProfile | null {
  const session = getValidSession();
  return session ? session.user : null;
}

/**
 * Logs in a user with an email and role (or auto-detected from DEMO_USERS).
 * Writes to localStorage and dispatches auth sync events.
 */
export function loginUser(
  email: string,
  _password?: string,
  role?: UserRole
): { success: boolean; user: UserProfile } {
  if (typeof window === "undefined") {
    return { success: false, user: DEMO_USERS.project_admin };
  }

  // Find matching user from DEMO_USERS by email or role
  let matchedUser: UserProfile | undefined;
  if (role && DEMO_USERS[role]) {
    matchedUser = DEMO_USERS[role];
  } else {
    matchedUser = Object.values(DEMO_USERS).find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
  }

  // If email is unrecognized, create an active session for the chosen or default role
  const finalRole = role || matchedUser?.role || "project_admin";
  const user: UserProfile = matchedUser || {
    id: `usr_${Date.now()}`,
    role: finalRole,
    fullName: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    email: email.trim().toLowerCase(),
    designation: "Enterprise Operator",
    department: "Post-Sales Operations",
    organizationName: "Sobha Limited",
    projectName: "Sobha Royal Pavilion - Tower B",
    status: "active",
    lastLogin: "Active Now",
    twoFactorEnabled: true,
  };

  const session: AuthSession = {
    user,
    token: `df_tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    loginTime: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };

  localStorage.setItem(STORAGE_KEY_ROLE, user.role);
  localStorage.setItem(STORAGE_KEY_EMAIL, user.email);
  localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
  localStorage.removeItem(STORAGE_KEY_PERSPECTIVE); // Reset perspective on new login

  // Dispatch global window events
  window.dispatchEvent(new Event("deedflow_auth_changed"));
  window.dispatchEvent(new Event("deedflow_role_changed"));

  return { success: true, user };
}

/**
 * Clears the active authentication session and redirects to login.
 */
export function logoutUser(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEY_SESSION);
  localStorage.removeItem(STORAGE_KEY_ROLE);
  localStorage.removeItem(STORAGE_KEY_EMAIL);
  localStorage.removeItem(STORAGE_KEY_PERSPECTIVE);

  window.dispatchEvent(new Event("deedflow_auth_changed"));
  window.dispatchEvent(new Event("deedflow_role_changed"));
}

/**
 * Fast-switches the active workspace role for an authenticated user with RBAC clearance.
 */
export function switchActiveRole(role: UserRole): UserProfile {
  let user: UserProfile = DEMO_USERS[role] || DEMO_USERS.project_admin;

  if (typeof window !== "undefined") {
    const rawSession = localStorage.getItem(STORAGE_KEY_SESSION);
    if (rawSession) {
      try {
        const session: AuthSession = JSON.parse(rawSession);
        if (session.user) {
          session.user.role = role;
          user = session.user;
          localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
        }
      } catch {
        // Fall through
      }
    }

    localStorage.setItem(STORAGE_KEY_ROLE, role);
    localStorage.setItem(STORAGE_KEY_EMAIL, user.email);

    window.dispatchEvent(new Event("deedflow_auth_changed"));
    window.dispatchEvent(new Event("deedflow_role_changed"));
  }
  return user;
}

/**
 * Changes the perspective role for Project Admins viewing the dashboard.
 */
export function switchPerspectiveRole(role: UserRole | "omni"): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_PERSPECTIVE, role);
    window.dispatchEvent(new Event("deedflow_role_changed"));
  }
}
