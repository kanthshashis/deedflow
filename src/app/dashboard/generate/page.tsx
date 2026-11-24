import { redirect } from "next/navigation";

/**
 * Legacy Generate Route Forwarder
 * Unifies all Document Studio requests to the canonical /dashboard/draft/new workspace.
 */
export default function GeneratePage() {
  redirect("/dashboard/draft/new");
}
