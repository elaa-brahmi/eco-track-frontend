"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function RequireRole({
  roles,
  children,
}: {
  roles: string[];
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const userRoles = useMemo(() => {
    if (!session?.user?.roles) return [];
    return Array.isArray(session.user.roles) ? session.user.roles : [];
  }, [session]);

  const hasRequiredRole = useMemo(() => {
    return roles.some((r) => userRoles.includes(r));
  }, [roles, userRoles]);

  const isAllowedAnonymous =
    !session && (pathname === "/report" || pathname=== "/auth") ; // public page for anonymous

  useEffect(() => {
    if (status === "loading") return; // wait first login load

    // No session → anonymous allowed ONLY for /report
    if (!session) {
      if (!isAllowedAnonymous) router.replace("/unauthorized");
      return;
    }

    // Authenticated but missing role
    if (!hasRequiredRole) {
      router.replace("/unauthorized");
    }
  }, [session, status, router, hasRequiredRole, isAllowedAnonymous]);

  //  Block rendering during session loading
  if (status === "loading") return null;

  //  Anonymous users can see /report
  if (isAllowedAnonymous) return <>{children}</>;

  //  No session → blocked
  if (!session) return null;

  //  Missing required role → block render until redirected
  if (!hasRequiredRole) return null;

  //  Authorized — allow children
  return <>{children}</>;
}
